import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class FilterTasksDto {
  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'COMPLETED'])
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  title?: string;

}
