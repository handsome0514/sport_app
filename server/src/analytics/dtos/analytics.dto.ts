import { ApiProperty } from '@nestjs/swagger';

export class GetAnalyticsResponseDto {
  @ApiProperty({
    description: 'Tournaments count',
    type: Number,
    example: 591,
  })
  readonly tournaments: number;

  @ApiProperty({
    description: 'Users count',
    type: Number,
    example: 256,
  })
  readonly users: number;
}
