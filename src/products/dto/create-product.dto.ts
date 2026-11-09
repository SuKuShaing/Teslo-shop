import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsIn,
	IsInt,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator';

export class CreateProductDto {

	@ApiProperty({
		description: 'product title (Unique)',
		nullable: false,
		minLength: 1,
	})
	@IsString()
	@MinLength(1)
	title!: string;

	@ApiProperty({
		description: 'product price',
		nullable: true,
	})
	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number;

	@ApiProperty({
		description: 'product description',
		nullable: true,
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		description: 'product slug for SEO',
		nullable: true,
	})
	@IsString()
	@IsOptional()
	slug?: string;

	@ApiProperty({
		description: 'product stock',
		nullable: true,
	})
	@IsInt()
	@IsPositive()
	@IsOptional()
	stock?: number;

	@ApiProperty({
		description: 'product sizes',
		nullable: false,
	})
	@IsString({ each: true })
	@IsArray()
	sizes!: string[];

	@ApiProperty({
		description: 'product gender',
		nullable: false,
		enum: ['men', 'women', 'kid', 'unisex'],
	})
	@IsString()
	@IsIn(['men', 'women', 'kid', 'unisex'])
	gender!: string;

	@ApiProperty({
		description: 'product tags',
		nullable: true,
	})
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	tags?: string[];

	@ApiProperty({
		description: 'product images',
		nullable: true,
	})
	@IsArray()
	@IsOptional()
	images?: string[];
}
