import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Records limit per page',
    type: Number,
    example: 10,
    default: 10,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly limit?: number;

  @ApiProperty({
    description: 'Page number',
    type: Number,
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly page?: number;
}
