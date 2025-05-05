import { Controller, Get, Post, Body, Patch, Param, Request, Delete, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import { JobOffer } from './entities/job-offer.entity';

@Controller('job-offer')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Post('add')
  @Roles(Role.RH) 
  create(@Body() createJobOfferDto: CreateJobOfferDto, @Request() req) {
    return this.jobOfferService.create(createJobOfferDto, req.user);
  }

  @Patch(':id')
  @Roles(Role.RH)
  update(@Param('id') id: string, @Body() updateJobOfferDto: UpdateJobOfferDto, @Request() req) {
    return this.jobOfferService.update(+id, updateJobOfferDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.RH)
  delete(@Param('id') id: string, @Request() req) {
    return this.jobOfferService.remove(+id, req.user);
  }

  //admin+candiat voir tout les offres actives dispo et rh voir juste vos propres offres avec authentification+filter
  @Get('all')
  findAll(@Query('search') search?: string, @Request() req?: any) { 
    return this.jobOfferService.findAll(search, req?.user);
  }

  //les users peuvent voir la liste des offers sans authentification (afficher dans la page d'acceuil)+filter
  @Get('public')
  @Public()
  findAllPublic(@Query('search') search?: string) {
    return this.jobOfferService.findAll(search);
  }

  // récupérer une offre par ID
  @Get(':id')
  @Roles(Role.RH)
  findOne(@Param('id') id: string, @Request() req) {
  return this.jobOfferService.findOne(+id, req.user);
}

@Get('offer/:id')
async findForCandidat(@Param('id') id: number): Promise<JobOffer> {
  const jobOffer = await this.jobOfferService.findOneForCandidat(id);
  if (!jobOffer) {
    throw new NotFoundException(`Offre d’emploi avec l’ID ${id} non trouvée`);
  }
  return jobOffer;
}
}
