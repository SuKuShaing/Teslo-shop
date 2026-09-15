import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
	return applyDecorators(
		RoleProtected(...roles), // llamamos a este decorador, indica que roles están autorizados // Reemplaza a @SetMetadata('roles', ['admin', 'super-user']) ahorra el tener que escribir roles
		UseGuards(AuthGuard(), UserRoleGuard), // llamamos a este decorador, sin esto no tenemos usuario en @GetUser // (AuthGuard(), UserRoleGuard) (Autenticación, Autorización)
	);
}
