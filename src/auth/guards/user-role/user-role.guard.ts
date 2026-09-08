import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

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
		); // con reflector obtengo la metadata de los roles que asociamos

		console.log({ validRoles });

		return true;
	}
}
