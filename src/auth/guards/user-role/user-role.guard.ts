import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

// este archivo se genera con `nest g guard auth/guards/userRole --no-spec`

@Injectable()
export class UserRoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const validRoles: string[] = this.reflector.get(
			'roles',
			context.getHandler(),
		); // con reflector obtengo la metadata de los roles que asociamos, { roles: ['admin', 'super-user'] }

		console.log({ validRoles }); // ['admin', 'super-user']

		if (!validRoles) return true; // Sí no viene ningún role, todos pueden pasar o estamos validando en otro lugar
		if (validRoles.length === 0) return true; // No restringimos a ningún role

		const req = context.switchToHttp().getRequest();
		const user = req.user as User;

		if (!user) throw new BadRequestException('User not found');

		for (const role of user.roles) {
			if (validRoles.includes(role)) {
				return true;
			}
		}

		throw new ForbiddenException(
			`User ${user.fullName} need a valid role: [${validRoles}]`,
		);
	}
}
