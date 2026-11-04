import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
	// En los constructores injectamos los servicios
	constructor(
		private readonly productsService: ProductsService, 
		
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async runSeed() {
		await this.deleteTables();
		const adminUser = await this.inserUsers();

		await this.inserNewProducts(adminUser);

		return 'SEED EXECUTED';
	}

	private async deleteTables() {
		await this.productsService.deleteAllProducts();

		const queryBuilder = this.userRepository.createQueryBuilder();
		await queryBuilder
			.delete()
			.where({})
			.execute();
	}

	private async inserUsers() {
		const seedUsers = initialData.users;

		const users: User[] = [];

		seedUsers.forEach(({password, ...user}) => {
			users.push(this.userRepository.create({
				...user,
				password: bcrypt.hashSync(password, 10),
			})); // Crea la entidad pero no la guarda en la base de datos
		});

		const dbUsers = await this.userRepository.save(users); // Guarda a los usuarios creados en la base de datos

		return dbUsers[0]; // Retorna el primer usuario creado
	}

	private async inserNewProducts(user: User) {
		await this.productsService.deleteAllProducts();

		const products = initialData.products;

		const insertPromises = products.map((product) =>
			this.productsService.create(product, user),
		);

		// products.forEach((product) => {
		// 	insertPromises.push(this.productsService.create(product, user));
		// });
		

		await Promise.all(insertPromises);

		return true;
	}
}
