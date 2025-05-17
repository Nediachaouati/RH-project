import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobOffer } from './entities/job-offer.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/role.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JobOfferService {

  constructor(
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
  ) {}

  // add offre
  async create(createJobOfferDto: CreateJobOfferDto, user: User): Promise<JobOffer> {
    if (user.role !== Role.RH) {
      throw new ForbiddenException('Seul un RH peut créer une offre d’emploi');
    }

    const jobOffer = this.jobOfferRepository.create({
      ...createJobOfferDto,
      postedDate: createJobOfferDto.postedDate || new Date().toISOString().split('T')[0], 
      createdBy: user, 
    });

    return this.jobOfferRepository.save(jobOffer);
  }

  // update offre
  async update(id: number, updateJobOfferDto: UpdateJobOfferDto, user: User): Promise<JobOffer> {
    const jobOffer = await this.jobOfferRepository.findOne({ where: { id } });
    if (!jobOffer) {
      throw new NotFoundException(`Offre d’emploi avec l’ID ${id} non trouvée`);
    }

    if (user.role !== Role.RH) {
      throw new ForbiddenException('Seul un RH peut modifier une offre d’emploi');
    }

    if (jobOffer.createdBy.id !== user.id) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres offres');
    }

    Object.assign(jobOffer, updateJobOfferDto);
    return this.jobOfferRepository.save(jobOffer);
  }

  // delete offre
  async remove(id: number, user: User): Promise<void> {
    const jobOffer = await this.jobOfferRepository.findOne({ where: { id } });
    if (!jobOffer) {
      throw new NotFoundException(`Offre d’emploi avec l’ID ${id} non trouvée`);
    }

    if (user.role !== Role.RH) {
      throw new ForbiddenException('Seul un RH peut supprimer une offre d’emploi');
    }

    if (jobOffer.createdBy.id !== user.id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres offres');
    }

    await this.jobOfferRepository.delete(id);
  }

  //get all active offer with role 
 async findAll(search?: string, user?: User): Promise<JobOffer[]> {
  const currentDate = new Date().toISOString().split('T')[0];
  let query = {};

  // role rh voir juste vos propres offre
  if (user && user.role === Role.RH) {
    query = { where: { createdBy: { id: user.id } }, relations: ['createdBy'] };
  } 
  // Sinon (admin ou candidat ou public), récupérer toutes les offres
  else {
    query = { relations: ['createdBy'] };
  }

  const offers = await this.jobOfferRepository.find(query);

  for (const offer of offers) {
    if (offer.expirationDate && offer.expirationDate < currentDate && offer.isActive) {
      offer.isActive = false;
      await this.jobOfferRepository.save(offer);
    }
  }

  let activeOffers = offers.filter(offer => offer.isActive);

  if (search) {
    const searchLower = search.toLowerCase();
    activeOffers = activeOffers.filter(offer =>
      offer.title.toLowerCase().includes(searchLower) ||
      offer.description.toLowerCase().includes(searchLower) ||
      offer.jobType.toLowerCase().includes(searchLower) ||
      offer.requirements.toLowerCase().includes(searchLower) ||
      String(offer.numberOfPositions).includes(searchLower) ||
      offer.experience.toLowerCase().includes(searchLower) ||
      offer.educationLevel.toLowerCase().includes(searchLower) ||
      offer.salaryRange.toLowerCase().includes(searchLower) ||
      (offer.gender?.toLowerCase().includes(searchLower) || false) ||
      offer.language.toLowerCase().includes(searchLower)
    );
  }

  return activeOffers;
}


  //pour récupérer une offre par ID
  async findOne(id: number, user: User): Promise<JobOffer> {
    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
  
    if (!jobOffer) {
      throw new NotFoundException(`Offre d’emploi avec l’ID ${id} non trouvée`);
    }
  
    if (user.role !== Role.RH || jobOffer.createdBy.id !== user.id) {
      throw new ForbiddenException('Vous ne pouvez voir que vos propres offres');
    }
  
    const currentDate = new Date().toISOString().split('T')[0];
    if (jobOffer.expirationDate && jobOffer.expirationDate < currentDate && jobOffer.isActive) {
      jobOffer.isActive = false;
      await this.jobOfferRepository.save(jobOffer);
    }
  
    return jobOffer;
  }
  async findOneForCandidat(id: number): Promise<JobOffer> {
    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id },
    });
  
    if (!jobOffer) {
      throw new NotFoundException(`Offre d’emploi avec l’ID ${id} non trouvée`);
    }
  
    return jobOffer;
  }
  async getJobOffersPerUser(): Promise<{ userId: number; userName: string; offerCount: number }[]> {
    const result = await this.jobOfferRepository
      .createQueryBuilder('jobOffer')
      .select('jobOffer.createdById', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('COUNT(jobOffer.id)', 'offerCount')
      .leftJoin('jobOffer.createdBy', 'user')
      .groupBy('jobOffer.createdById')
      .addGroupBy('user.name')
      .getRawMany();
  
    return result.map(row => ({
      userId: Number(row.userId),
      userName: row.userName,
      offerCount: Number(row.offerCount),
    }));
  }
  async countOffersByUser() {
    return this.jobOfferRepository
      .createQueryBuilder('jobOffer')
      .select('jobOffer.createdById', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('COUNT(jobOffer.id)', 'offerCount')
      .leftJoin('jobOffer.createdBy', 'user')
      .groupBy('jobOffer.createdById')
      .addGroupBy('user.name')
      .getRawMany();
  }

  async countCandidaturesPerJobOffer() {
    return this.jobOfferRepository
      .createQueryBuilder('jobOffer')
      .leftJoin('jobOffer.candidatures', 'candidature')
      .select('jobOffer.id', 'jobOfferId')
      .addSelect('jobOffer.title', 'title')
      .addSelect('COUNT(candidature.id)', 'applicationCount')
      .groupBy('jobOffer.id')
      .addGroupBy('jobOffer.title')
      .getRawMany();
  }

  async countByJobType() {
    try {
      return await this.jobOfferRepository
        .createQueryBuilder('jobOffer')
        .select('jobOffer.jobType', 'jobType')
        .addSelect('COUNT(*)', 'count')
        .groupBy('jobOffer.jobType')
        .getRawMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to count by job type');
    }
  }

  async countOffersPerMonth() {
    return this.jobOfferRepository
      .createQueryBuilder('jobOffer')
      .select("TO_CHAR(jobOffer.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy("TO_CHAR(jobOffer.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async topRecruiters(limit = 5) {
    return this.jobOfferRepository
      .createQueryBuilder('jobOffer')
      .leftJoin('jobOffer.createdBy', 'user')
      .select('user.name', 'userName')
      .addSelect('COUNT(jobOffer.id)', 'offerCount')
      .groupBy('user.name')
      .orderBy('offerCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async countActiveInactiveOffers() {
    return this.jobOfferRepository
      .createQueryBuilder('jobOffer')
      .select('jobOffer.isActive', 'isActive')
      .addSelect('COUNT(*)', 'count')
      .groupBy('jobOffer.isActive')
      .getRawMany();
  }

}