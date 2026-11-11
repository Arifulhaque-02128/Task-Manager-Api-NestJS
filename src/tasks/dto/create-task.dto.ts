import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsIn(['OPEN', 'IN_PROGRESS', 'COMPLETED'])
  @IsNotEmpty()
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}
