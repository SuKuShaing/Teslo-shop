import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

type UserData = keyof Pick<
	User,
	'id' | 'email' | 'fullName' | 'isActive' | 'roles'
>;

export const GetUser = createParamDecorator(
	(data: UserData, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest();
		const user = req.user;

		if (!user)
			throw new InternalServerErrorException('User not found (request)');

		return !data ? user : user[data];
	},
);
