import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidature } from './entities/candidature.entity';
import { User } from 'src/users/entities/user.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { CandidaturesService } from './candidature.service';
import { CandidaturesController } from './candidature.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Candidature, JobOffer, User]),MailModule,],
  providers: [CandidaturesService],
  controllers: [CandidaturesController],
})
export class CandidaturesModule {}
