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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './dcorators/get-user.decorator';
import { User } from './entities/user.entity';

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
		// @Req() request: Express.Request // con un Decorador de parámetro com @GetUser nos evitamos repetir request.user en todos los endpoints protegidos, centralizamos la lógica y queda más limpio y directo
		@GetUser(['email', 'role', 'fullName']) user: User,
	) {
		return {
			ok: true,
			message: 'Hola Mundo Private',
			user,
		};
	}
}
