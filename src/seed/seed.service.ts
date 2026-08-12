import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

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

		return true;
	}
}
