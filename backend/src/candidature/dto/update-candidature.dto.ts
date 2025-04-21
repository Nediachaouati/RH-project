import { PartialType } from '@nestjs/swagger';
import { CreateCandidatureDto } from './create-candidature.dto';

export class UpdateCandidatureDto extends PartialType(CreateCandidatureDto) {}
