import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { title } from 'process';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {
	private readonly logger = new Logger('ProductsService');

	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,

		@InjectRepository(ProductImage)
		private readonly productImageRepository: Repository<ProductImage>,

		private readonly dataSource: DataSource,
	) {}

	async create(createProductDto: CreateProductDto) {
		try {
			const { images = [], ...productDetails } = createProductDto;

			const product = this.productRepository.create({
				...productDetails,
				images: images.map((image) =>
					this.productImageRepository.create({ url: image }),
				),
			});
			await this.productRepository.save(product);

			return { ...product, images };
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit = 10, offset = 0 } = paginationDto;

		const products = await this.productRepository.find({
			take: limit,
			skip: offset,
			relations: {
				images: true,
			},
		});

		return products.map((product) => ({
			...product,
			// esto aplana las imágenes, y entrega solo la propiedad que queremos
			images: product.images?.map((img) => img.url),
		}));
	}

	async findOne(terminoDeBusqueda: string) {
		let product: Product | null;

		// saber sí terminoDeBusqueda es un uuid
		if (isUUID(terminoDeBusqueda)) {
			product = await this.productRepository.findOneBy({
				id: terminoDeBusqueda,
			});
		} else {
			// sí no es un uuid buscamos por slug
			// product = await this.productRepository.findOneBy({
			// 	slug: terminoDeBusqueda,
			// });

			// Esto es un Query Builder
			const queryBuilder =
				this.productRepository.createQueryBuilder('prod');
			product = await queryBuilder
				.where('UPPER(title) =:title or slug =:slug', {
					title: terminoDeBusqueda.toUpperCase(),
					slug: terminoDeBusqueda.toLowerCase(),
				})
				.leftJoinAndSelect('prod.images', 'prodImages') // Se trae la relación, en este caso, con las imágenes
				.getOne();

			// `select * from Products where slug = 'XX' or title='XX'`;
		}

		if (!product)
			throw new BadRequestException(
				`No se encontró un producto con el id o slug ${terminoDeBusqueda}`,
			);

		return product;
	}

	// Creamos otra función que toma a findOne y la aplana, por qué, porque findOne se ocupa en otras partes, entonces no convenía alterar su salida
	async findOnePlain(term: string) {
		const { images = [], ...rest } = await this.findOne(term);
		return {
			...rest,
			images: images.map((image) => image.url),
		};
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		const { images, ...toUpdate } = updateProductDto;

		// Preload no actualiza, simplemente prepara para la actualización
		const product = await this.productRepository.preload({
			id,
			...toUpdate,
		});

		if (!product)
			throw new NotFoundException(`Product with id: ${id} not found`);

		// Create Query Runner (son funciones que queremos que se ejecuten en una transacción en la base de datos)
		const queryRunner = this.dataSource.createQueryRunner();

		try {
			// Save guarda el producto precargado
			await this.productRepository.save(product);

			return product;
		} catch (error) {
			this.handleDBExceptions(error);
		}
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
