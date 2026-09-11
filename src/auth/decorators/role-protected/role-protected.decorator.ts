import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/interfaces';

export const META_ROLES = 'roles'; // Para tener una única fuente de verdad, se cambia aquí y se cambia en todos lados

export const RoleProtected = (...args: ValidRoles[]) => {
	return SetMetadata(META_ROLES, args);
};
