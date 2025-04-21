import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Candidature } from 'src/candidature/entities/candidature.entity';

@Entity()
export class JobOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; 

  @Column('text')
  description: string; 

  @Column({ default: 1 })
  numberOfPositions: number; 

  @Column()
  jobType: string; 

  @Column()
  experience: string; 

  @Column()
  educationLevel: string; 

  @Column()
  salaryRange: string; 

  @Column({ nullable: true })
  gender?: string; 

  @Column()
  language: string; 

  @Column('text')
  requirements: string; 

  @Column({ type: 'date' })
  postedDate: string; 

  @Column({ type: 'date', nullable: true })
  expirationDate?: string; 

  @CreateDateColumn()
  createdAt: Date; 

  @UpdateDateColumn()
  updatedAt: Date; 

  @ManyToOne(() => User, (user) => user.jobOffers, { eager: true })
  createdBy: User; 

  @OneToMany(() => Candidature, (candidature) => candidature.jobOffer)
  candidatures: Candidature[];

  @Column({ default: true })
  isActive: boolean; 
}
