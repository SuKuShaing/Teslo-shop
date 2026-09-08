import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
	Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders } from './dcorators';
import { IncomingHttpHeaders } from 'http';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	create(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto);
	}

	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}

	@Get('private')
	@UseGuards(AuthGuard())
	testingPrivateRoute(
		@Req() request: Express.Request, // con un Decorador de parámetro com @GetUser nos evitamos repetir request.user en todos los endpoints protegidos, centralizamos la lógica y queda más limpio y directo
		@GetUser() user: User, // retorna todo sobre el usuario
		@GetUser('email') userEmail: string, // Retorna solo el email | @GetUser('email', parseboolPipe) se puede hacer uso de los parsePipe
		@RawHeaders() rawHeader: string[],
		@Headers() headers,
	) {
		console.log({ request });

		return {
			ok: true,
			message: 'Hola Mundo Private',
			user,
			userEmail,
			rawHeader,
			headers,
		};
	}
}
