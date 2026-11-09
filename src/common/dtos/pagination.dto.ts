import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

	@ApiProperty({
		default: 10,
		description: 'Cantidad de registros a solicitar',
	})
	@IsOptional()
	@IsPositive()
	@Type(() => Number) // enableImplicitConversions: true
	limit?: number;

	@ApiProperty({
		default: 0,
		description: 'Número de registros a saltar',
	})
	@IsOptional()
	@Min(0)
	@Type(() => Number) // enableImplicitConversions: true
	offset?: number;
}
