import { Injectable, Logger } from "@nestjs/common";
import { ChatSession, GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { GetAiMessageDTO } from './dto/get-ai-response.dto';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';

const GEMINI_MODEL = 'gemini-1.5-flash';

@Injectable()
export class ChatService {
  private readonly googleAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private chatSessions: { [sessionId: string]: ChatSession } = {};
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
  ) {
    const geminiApiKey = configService.get('GEMINI_API_KEY');
    this.googleAI = new GoogleGenerativeAI(geminiApiKey);
    this.model = this.googleAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });
  }

  private getChatSession(sessionId?: string) {
    let sessionIdToUse = sessionId ?? v4();
    let result = this.chatSessions[sessionIdToUse];

    if (!result) {
      result = this.model.startChat();
      this.chatSessions[sessionIdToUse] = result;
    }

    return {
      sessionId: sessionIdToUse,
      chat: result,
    };
  }

  // Construire le contexte avec les offres et des infos sur la société
  private async buildContext(): Promise<string> {
    // Récupérer les offres actives dans la bd
    const jobOffers = await this.jobOfferRepository.find({ where: { isActive: true } });
    const jobOffersText = jobOffers
      .map(
        (offer) => `
          
          Titre: ${offer.title}
          Description: ${offer.description}
          Type de poste: ${offer.jobType}
          Expérience requise: ${offer.experience}
          Niveau d’éducation: ${offer.educationLevel}
          Salaire: ${offer.salaryRange}
          Genre: ${offer.gender}
          Exigences: ${offer.requirements}
          Date de publication: ${offer.postedDate}
          Date d’expiration: ${offer.expirationDate || 'Non spécifiée'}
          Nombre de postes: ${offer.numberOfPositions}
          Langue: ${offer.language}
        `,
      )
      .join('\n---\n');

    // Informations statiques pour la société 
    const companyInfo = `
      Nom de la société : 
      Mission : Développer des logiciels informatiques, des applications et des sites web mobiles innovants, tout en offrant des opportunités d’emploi uniques et en soutenant les candidats dans leur recherche de carrière.
      Localisation : Ariana Technopole Ghazela Bloc B1, Tunisie.
      Valeurs : Excellence, inclusion, croissance.
      Secteur : Nous travaillons dans l’informatique, spécialisés dans le développement de logiciels, d’applications mobiles et de sites web.
    `;

    return `
      Tu es un chatbot conçu pour aider les candidats à poser des questions sur les offres d’emploi de notre société et sur la société elle-même.
      Voici les informations dont tu disposes :

      ### Offres d’emploi disponibles :
      ${jobOffersText || "Aucune offre disponible pour le moment."}

      ### Informations sur la société :
      ${companyInfo}

      Instructions :
      - Réponds uniquement en fonction de ces données.
      - Si le candidat demande des informations sur une offre spécifique, utilise son **titre** pour répondre précisément.
      - Si le candidat veut simplifier le choix des offres, pose-lui des questions comme "Quel type de poste cherchez-vous ?" ou "Quel niveau d’expérience avez-vous ?" pour filtrer les offres.
      - Si une question est hors contexte, dis simplement : "Je ne peux répondre qu’aux questions sur nos offres d’emploi ou notre société."
    `;
  }

  async generateText(data: GetAiMessageDTO) {
    try {
      const { sessionId, chat } = this.getChatSession(data.sessionId);

      // Ajouter le contexte au prompt
      const context = await this.buildContext();
      const fullPrompt = `${context}\n\nQuestion du candidat : ${data.prompt}`;

      const result = await chat.sendMessage(fullPrompt);

      return {
        result: await result.response.text(),
        sessionId,
      };
    } catch (error) {
      this.logger.error('Erreur lors de l’envoi du message à l’API Gemini >>', error);
      throw error;
    }
  }
}