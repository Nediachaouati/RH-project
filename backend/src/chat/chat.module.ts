import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([JobOffer])], 
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
