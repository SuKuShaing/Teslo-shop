import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateUserDto {

	@ApiProperty({
		description: 'user email',
		nullable: false,
	})
	@IsString()
	@IsEmail()
	email!: string;

	@ApiProperty({
		description: 'user password',
		nullable: false,
	})
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			'The password must have a Uppercase, lowercase letter and a number',
	})
	password!: string;

	@ApiProperty({
		description: 'user full name',
		nullable: false,
	})
	@IsString()
	@MinLength(1)
	fullName!: string;
}
