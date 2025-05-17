// src/candidatures/entities/candidature.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';

export enum CandidatureStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class Candidature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CandidatureStatus,
    default: CandidatureStatus.PENDING,
  })
  status: CandidatureStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cvPath: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  coverLetterPath: string | null;

  @Column({ type: 'float', nullable: true }) // entre 0 et 1 e score
  aiScore: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.candidatures)
  candidate: User;

  @ManyToOne(() => JobOffer, (jobOffer) => jobOffer.candidatures)
  jobOffer: JobOffer;
}