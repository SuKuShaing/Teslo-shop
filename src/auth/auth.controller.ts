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
	SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';

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

	//Ruta que solo se necesita estar loggeado, no necesita tener algún rol para ingresar
	@Get('private')
	@UseGuards(AuthGuard()) // sin esto no tenemos usuario en @GetUser, dado que pasa por aquí primero
	testingPrivateRoute(
		@Req() request: Express.Request, // con un Decorador de parámetro com @GetUser nos evitamos repetir request.user en todos los endpoints protegidos, centralizamos la lógica y queda más limpio y directo
		@GetUser() user: User, // retorna todo sobre el usuario
		@GetUser('email') userEmail: string, // Retorna solo el email | @GetUser('email', parseboolPipe) se puede hacer uso de los parsePipe
		@RawHeaders() rawHeader: string[],
		@Headers() headers,
	) {
		return {
			ok: true,
			message: 'Hola Mundo Private',
			user,
			userEmail,
			rawHeader,
			headers,
		};
	}

	// @SetMetadata('roles', ['admin', 'super-user']) // asocia información adicional a una clase o método mediante metadata de reflexión. No la inyecta en los parámetros ni la obtiene automáticamente de la petición, guarda esto { roles: ['admin', 'super-user'] }

	//Ruta que va necesitar cierto rol para ingresar
	@Get('private-2')
	@RoleProtected(ValidRoles.superUser, ValidRoles.admin) // indica que roles están autorizados // Reemplaza a @SetMetadata('roles', ['admin', 'super-user']) ahorra el tener que escribir roles
	@UseGuards(AuthGuard(), UserRoleGuard) // sin esto no tenemos usuario en @GetUser // (AuthGuard(), UserRoleGuard) (Autenticación, Autorización)
	privateRoute2(@GetUser() user: User) {
		return {
			ok: true,
			user,
		};
	}
}
