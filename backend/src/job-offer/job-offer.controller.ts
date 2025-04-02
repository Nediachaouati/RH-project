import { Controller, Get, Post, Body, Patch, Param, Request, Delete, UseGuards, Query } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';

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

  //tous les users peuvent voir la liste des offers avec authentification+filter
  @Get('all')
  findAll(@Query('search') search?: string) {
    return this.jobOfferService.findAll(search);
  }

  //les users peuvent voir la liste des offers sans authentification (afficher dans la page d'acceuil)+filter
  @Get('public')
  @Public()
  findAllPublic(@Query('search') search?: string) {
    return this.jobOfferService.findAll(search);
  }
}
