import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('seed')
export class SeedController {
	constructor(private readonly seedService: SeedService) {}

	@Get()
	@Auth(ValidRoles.admin, ValidRoles.superUser) // Borrar esta línea para poblar la primera vez y que nos dé el token, luego de la primera poblada, volver a activar esta línea para que solo los admin puedan poblar la base de datos
	executeSeed() {
		return this.seedService.runSeed();
	}
}
