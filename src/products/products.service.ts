import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
	private readonly logger = new Logger('ProductsService');

	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
	) {}

	async create(createProductDto: CreateProductDto) {
		try {
			const product = this.productRepository.create(createProductDto);
			await this.productRepository.save(product);

			return product;
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	// To Do: Paginar
	async findAll() {
		return await this.productRepository.find();
	}

	async findOne(terminoDeBusqueda: string) {
		let product: Product[];

		// saber sí terminoDeBusqueda es un uuid
		if (isUUID(terminoDeBusqueda)) {
			product = await this.productRepository.findBy({
				id: terminoDeBusqueda,
			});
		} else {
			// sí no es un uuid buscamos por slug
			product = await this.productRepository.findBy({
				slug: terminoDeBusqueda,
			});
		}

		if (product.length === 0)
			throw new BadRequestException(
				`No se encontró un producto con el id o slug ${terminoDeBusqueda}`,
			);

		return product;
	}

	update(id: number, updateProductDto: UpdateProductDto) {
		return `This action updates a #${id} product`;
	}

	async remove(terminoDeBusqueda: string) {
		let result: DeleteResult;
		// saber sí terminoDeBusqueda es un uuid
		if (isUUID(terminoDeBusqueda)) {
			result = await this.productRepository.delete({
				id: terminoDeBusqueda,
			});
		} else {
			// sí no es un uuid buscamos por slug
			result = await this.productRepository.delete({
				slug: terminoDeBusqueda,
			});
		}

		if (result.affected === 0)
			throw new BadRequestException(
				`No se encontró un registro con el id ${terminoDeBusqueda}`,
			);

		return result;
	}

	private handleDBExceptions(error: any) {
		// console.log(error); // Esto lo dejamos en el servidor

		if (error.code === '23505') throw new BadRequestException(error.detail);

		this.logger.error(error);

		throw new InternalServerErrorException('Ayuda!!!'); // Esto lo ve el usuario
	}
}
