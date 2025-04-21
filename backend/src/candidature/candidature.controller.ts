// src/candidatures/candidatures.controller.ts
import { Controller, Post, Get, UseInterceptors, UploadedFiles, Body, UseGuards, Request, BadRequestException, Query, Param, ParseIntPipe, Patch, ParseEnumPipe } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CandidaturesService } from './candidature.service';
import { CandidatureStatus } from './entities/candidature.entity';


@Controller('candidatures')
export class CandidaturesController {
  constructor(private readonly candidaturesService: CandidaturesService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './Uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/i)) {
          return cb(new BadRequestException('Seuls les fichiers PDF sont acceptés'), false);
        }
        cb(null, true);
      },
    }),
  )
  async applyToJob(
    @Request() req,
    @Body('jobOfferId') jobOfferId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const cvFile = files.find((file) => file.fieldname === 'cv');
    const coverLetterFile = files.find((file) => file.fieldname === 'coverLetter');

    if (!cvFile) {
      throw new BadRequestException('Le CV est requis');
    }

    return this.candidaturesService.applyToJob(
      req.user.id,
      parseInt(jobOfferId, 10),
      cvFile,
      coverLetterFile,
    );
  }

  // candidat peut voir les offres auxquelles il a postulé
  @Get('my-candidatures')
  @UseGuards(JwtAuthGuard)
  async getUserCandidatures(@Request() req) {
    return this.candidaturesService.getUserCandidatures(req.user.id);
  }

   // RH voit toutes les candidatures pour ses offres
  @Get('rh-candidatures')
  @UseGuards(JwtAuthGuard)
  async getRHCandidatures(
    @Request() req,
    @Query('minScore') minScore?: string,
  ) {
    const score = minScore ? parseFloat(minScore) : undefined;
    return this.candidaturesService.getRHCandidatures(req.user.id, score);
  }

  // rh voir Toutes les candidatures pour une offre spécifique
  @Get('rh-candidatures/offer/:jobOfferId')
  @UseGuards(JwtAuthGuard)
  async getCandidaturesByOffer(
    @Request() req,
    @Param('jobOfferId', ParseIntPipe) jobOfferId: number,
    @Query('minScore') minScore?: string,
  ) {
    const score = minScore ? parseFloat(minScore) : undefined;
    return this.candidaturesService.getCandidaturesByOffer(req.user.id, jobOfferId, score);
  }

  // rh voir les Candidatures pertinentes pour une offre spécifique
  @Get('rh-candidatures/offer/:jobOfferId/relevant')
  @UseGuards(JwtAuthGuard)
  async getRelevantCandidaturesByOffer(
    @Request() req,
    @Param('jobOfferId', ParseIntPipe) jobOfferId: number,
    @Query('minScore') minScore: string = '0.4',
  ) {
    const score = parseFloat(minScore);
    return this.candidaturesService.getRelevantCandidaturesByOffer(req.user.id, jobOfferId, score);
  }

  //rh valide cv et envoyer un email 
  @Patch('rh-candidatures/:candidatureId/validate')
  @UseGuards(JwtAuthGuard)
  async validateCandidature(
    @Request() req,
    @Param('candidatureId', ParseIntPipe) candidatureId: number,
    @Body('status', new ParseEnumPipe(CandidatureStatus)) status: CandidatureStatus.ACCEPTED | CandidatureStatus.REJECTED,
  ) {
    return this.candidaturesService.validateCandidature(req.user.id, candidatureId, status);
  }
}