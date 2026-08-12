import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { CreateProductDto } from 'src/products/dto/create-product.dto';

@Injectable()
export class SeedService {
	// En los constructores injectamos los servicios
	constructor(private readonly productsService: ProductsService) {}

	async runSeed() {
		await this.inserNewProducts();

		return 'SEED EXECUTED';
	}

	private async inserNewProducts() {
		await this.productsService.deleteAllProducts();

		const products = initialData.products;

		const insertPromises = products.map((product) =>
			this.productsService.create(product),
		);

		await Promise.all(insertPromises);

		return true;
	}
}
