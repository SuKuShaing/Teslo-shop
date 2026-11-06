import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

	@ApiProperty({
		example: 'f4c0e3b2-1d2a-4b5c-9e6f-7a8b9c0d1e2f',
		description: 'Identificador único del producto',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@ApiProperty({
		example: 'T-Shirt Teslo',
		description: 'Nombre del producto',
		uniqueItems: true,
	})
	@Column('text', {
		unique: true,
	})
	title!: string;

	@ApiProperty({
		example: 19.99,
		description: 'Precio del producto',
		default: 0,
	})
	@Column('float', {
		default: 0,
	})
	price!: number;

	@ApiProperty({
		example: 'Camiseta de algodón',
		description: 'Descripción del producto',
		default: null,
	})
	@Column({
		type: 'text',
		nullable: true,
	})
	description!: string;

	@ApiProperty({
		example: 't-shirt-teslo',
		description: 'Slug del producto for SEO-friendly URLs',
		uniqueItems: true,
	})
	@Column('text', {
		unique: true,
	})
	slug!: string;

	@ApiProperty({
		example: 10,
		description: 'Stock del producto',
		default: 0,
	})
	@Column('int', {
		default: 0,
	})
	stock!: number;

	@ApiProperty({
		example: ['S', 'M', 'L', 'XL'],
		description: 'Tallas disponibles del producto',
	})
	@Column('text', {
		array: true,
	})
	sizes!: string[];

	@ApiProperty({
		example: 'unisex',
		description: 'Género del producto',
	})
	@Column('text')
	gender!: string;

	@ApiProperty({
		example: ['casual', 'deportivo'],
		description: 'Etiquetas del producto',
		default: [],
	})
	@Column('text', {
		array: true,
		default: [],
	})
	tags!: string[];

	// Imágenes
	@ApiProperty({
		example: [
			'https://example.com/image-1.jpg',
			'https://example.com/image-2.jpg',
		],
		description: 'Array de links de las Imágenes del producto',
	})
	@OneToMany(
		() => ProductImage, // Esto es la clase ProductImage de la otra tabla o entidad
		(productImage) => productImage.product, // Este es el objeto (con minúscula) productImage.nombreDeLaColumna
		{ cascade: true, eager: true }, // eager, en las búsquedas, también se trae las relaciones
	)
	images?: ProductImage[];

	@ManyToOne(
		() => User, // Entidad con las que se va a relacionar
		(user) => user.products, // el como el usuario se relaciona con la tabla
		{ eager: true }, // le decimos que cargue automáticamente la relación
		// @ManyToOne crea un columna porque debe almacenar la clave foránea
	)
	user!: User;

	@BeforeInsert()
	checkSlugInsert() {
		if (!this.slug) {
			this.slug = this.title;
		}
		this.slug = this.slug
			.toLocaleLowerCase()
			.replaceAll(' ', '_')
			.replaceAll("'", '');
	}

	@BeforeUpdate()
	checkSlugUpdate() {
		this.slug = this.slug
			.toLocaleLowerCase()
			.replaceAll(' ', '_')
			.replaceAll("'", '');
	}
}
