// src/candidatures/candidatures.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Candidature, CandidatureStatus } from './entities/candidature.entity';
import { User } from 'src/users/entities/user.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import * as pdfParse from 'pdf-parse';
import axios from 'axios';

import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CandidaturesService {
  constructor(
    @InjectRepository(Candidature)
    private candidatureRepository: Repository<Candidature>,
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async analyzeCV(cvPath: string, jobDescription: string, retries = 3): Promise<number> {
    try {
      const fs = require('fs');
      const pdfBuffer = fs.readFileSync(cvPath);
      const pdfData = await pdfParse(pdfBuffer);
      let cvText = pdfData.text;

      if (!cvText) {
        throw new Error('Impossible d\'extraire le texte du CV');
      }

      cvText = cvText.substring(0, 5000);

      const apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY');
      if (!apiKey) {
        throw new Error('Clé API Hugging Face manquante');
      }

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
        {
          inputs: {
            source_sentence: jobDescription,
            sentences: [cvText],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      throw new Error('Réponse invalide de l\'API Hugging Face');
    } catch (error) {
      if (error.response?.status === 429 && retries > 0) {
        console.warn(`Limite atteinte, attente 1h (tentatives: ${retries})`);
        await new Promise((resolve) => setTimeout(resolve, 3600000));
        return this.analyzeCV(cvPath, jobDescription, retries - 1);
      }
      console.error('Erreur analyse CV:', error.message);
      return 0;
    }
  }

  async applyToJob(
    userId: number,
    jobOfferId: number,
    cvFile?: Express.Multer.File,
    coverLetterFile?: Express.Multer.File,
  ): Promise<Candidature> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const jobOffer = await this.jobOfferRepository.findOneBy({ id: jobOfferId });

    if (!user || !jobOffer) {
      throw new NotFoundException('Utilisateur ou offre introuvable');
    }

    if (!cvFile) {
      throw new BadRequestException('Le CV est requis');
    }

    let aiScore: number | null = null;
    try {
      aiScore = await this.analyzeCV(cvFile.path, jobOffer.description);
    } catch (error) {
      console.error('Analyse IA échouée:', error.message);
    }

    const candidature = this.candidatureRepository.create({
      status: CandidatureStatus.PENDING,
      cvPath: cvFile.path,
      coverLetterPath: coverLetterFile ? coverLetterFile.path : null,
      aiScore,
      candidate: user,
      jobOffer,
    });

    return this.candidatureRepository.save(candidature);
  }


  async validateCandidature(
    rhId: number,
    candidatureId: number,
    status: CandidatureStatus.ACCEPTED | CandidatureStatus.REJECTED,
  ): Promise<Candidature> {
    const candidature = await this.candidatureRepository.findOne({
      where: { id: candidatureId },
      relations: ['jobOffer', 'jobOffer.createdBy', 'candidate'],
    });

    if (!candidature) {
      throw new NotFoundException('Candidature introuvable');
    }

    if (candidature.jobOffer.createdBy.id !== rhId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à valider cette candidature');
    }

    if (candidature.status !== CandidatureStatus.PENDING) {
      throw new BadRequestException('Cette candidature a déjà été validée');
    }

    candidature.status = status;
    await this.candidatureRepository.save(candidature);

    // send mail 
    await this.mailService.sendCandidatureStatusEmail(
      candidature.candidate.email,
      candidature.candidate.name || 'Candidat',
      candidature.jobOffer.title,
      status,
    );

    return candidature;
  }


  
  async getUserCandidatures(userId: number): Promise<Candidature[]> {
    return this.candidatureRepository.find({
      where: { candidate: { id: userId } },
      relations: ['jobOffer'],
    });
  }

  async getRHCandidatures(rhId: number, minScore?: number): Promise<Candidature[]> {
    const jobOffers = await this.jobOfferRepository.find({
      where: { createdBy: { id: rhId } },
    });

    if (!jobOffers.length) {
      return [];
    }

    const query: any = {
      jobOffer: {
        id: In(jobOffers.map((offer) => offer.id)),
      },
    };

    if (minScore !== undefined) {
      query.aiScore = MoreThanOrEqual(minScore);
    }

    return this.candidatureRepository.find({
      where: query,
      relations: ['candidate', 'jobOffer'],
      order: { aiScore: 'DESC' },
    });
  }

  //List de candidats d'un ofre
  async getCandidaturesByOffer(rhId: number, jobOfferId: number, minScore?: number): Promise<Candidature[]> {
    // Vérifier que l'offre 
    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id: jobOfferId, createdBy: { id: rhId } },
      relations: ['createdBy'],
    });

    if (!jobOffer) {
      throw new NotFoundException('Offre introuvable ou non autorisée');
    }

    const query: any = {
      jobOffer: { id: jobOfferId },
    };

    if (minScore !== undefined) {
      query.aiScore = MoreThanOrEqual(minScore);
    }

    return this.candidatureRepository.find({
      where: query,
      relations: ['candidate', 'jobOffer'],
      order: { aiScore: 'DESC' },
    });
  }

  //  Lister les candidatures pertinentes pour une offre
  async getRelevantCandidaturesByOffer(rhId: number, jobOfferId: number, minScore: number = 0.4): Promise<Candidature[]> {
    return this.getCandidaturesByOffer(rhId, jobOfferId, minScore);
  }

  // candidature.service.ts
async countByStatus() {
  return this.candidatureRepository
    .createQueryBuilder('candidature')
    .select('candidature.status', 'status')
    .addSelect('COUNT(*)', 'count')
    .groupBy('candidature.status')
    .getRawMany();
}

async averageScorePerOffer() {
  return this.candidatureRepository
    .createQueryBuilder('candidature')
    .leftJoin('candidature.jobOffer', 'jobOffer')
    .select('jobOffer.id', 'jobOfferId')
    .addSelect('jobOffer.title', 'title')
    .addSelect('AVG(candidature.aiScore)', 'averageScore')
    .groupBy('jobOffer.id')
    .addGroupBy('jobOffer.title')
    .getRawMany();
}

async candidaturesPerMonth() {
  return this.candidatureRepository
    .createQueryBuilder('candidature')
    .select("TO_CHAR(candidature.createdAt, 'YYYY-MM')", 'month')
    .addSelect('COUNT(*)', 'count')
    .groupBy("TO_CHAR(candidature.createdAt, 'YYYY-MM')")
    .orderBy('month', 'ASC')
    .getRawMany();
}

}