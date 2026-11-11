import { IsIn, IsOptional } from "class-validator";

export class UpdateTasksDto {
  @IsOptional()
  title?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'COMPLETED'])
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}
