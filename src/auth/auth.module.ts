import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({ defaultStrategy: 'jwt' }),

		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				// console.log('JWT Secret', configService.get('JWT_SECRET'));
				// console.log('JWT Secret', process.env.JWT_SECRET);
				// Ambos Console.log muestran lo mismo en consola, es decir tiene el valor secreto, la diferencia está en cuando el valor secreto no está definido, ahí process.env.JWT_SECRET muestra undefined, en cambio en configService.get('JWT_SECRET') muestra JWT_SECRET la cual es undefined, la diferencia que este último muestra la variable, el otro no, aunque estén undefined
				return {
					secret: configService.get('JWT_SECRET'), // Este secret lo debe saber solo quien despliega, el código, no el equipo de desarrollo
					signOptions: {
						expiresIn: '2h',
					},
				};
			},
		}),
	],
	exports: [TypeOrmModule],
})
export class AuthModule {}
