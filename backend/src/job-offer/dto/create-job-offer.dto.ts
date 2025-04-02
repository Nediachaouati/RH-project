import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateJobOfferDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  numberOfPositions?: number;

  @IsString()
  jobType: string;

  @IsString()
  experience: string;

  @IsString()
  educationLevel: string;

  @IsString()
  salaryRange: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsString()
  language: string;

  @IsString()
  requirements: string;

  @IsOptional()
  @IsDateString()
  postedDate?: string; 

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
