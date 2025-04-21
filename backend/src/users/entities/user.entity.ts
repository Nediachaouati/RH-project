import { Candidature } from "src/candidature/entities/candidature.entity";
import { JobOffer } from "src/job-offer/entities/job-offer.entity";
import { Role } from "src/role.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
@PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email:string;

    @Column({ nullable: true })
    password?: string;

    @Column({nullable:true})
    name:string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.CANDIDAT, 
    })
    role: Role; 

   /* @Column({ default: false }) // pour soft delete
    isDeleted: boolean;*/
    @Column({nullable:true})
    phoneNumber?: string;

    @Column({nullable:true})
    address?: string;

    @Column({ type: 'date', nullable: true })
    birthDate?: string;

    @Column({ nullable: true })
    specialty?: string; 

    @Column({ nullable: true })
    school?: string; 

    @Column({ nullable: true })
    degree?: string; 

    @Column({ nullable: true })
    graduationYear?: string; 

    @Column({ nullable: true })
    experienceLevel?: string;

    @Column({ nullable: true }) 
    photo?: string;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => JobOffer, (jobOffer) => jobOffer.createdBy)
    jobOffers: JobOffer[];

    @OneToMany(() => Candidature, (candidature) => candidature.candidate)
    candidatures: Candidature[];

}
