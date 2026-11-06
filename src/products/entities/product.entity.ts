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

	@ApiProperty({})
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@ApiProperty()
	@Column('text', {
		unique: true,
	})
	title!: string;

	@ApiProperty()
	@Column('float', {
		default: 0,
	})
	price!: number;

	@ApiProperty()
	@Column({
		type: 'text',
		nullable: true,
	})
	description!: string;

	@ApiProperty()
	@Column('text', {
		unique: true,
	})
	slug!: string;

	@ApiProperty()
	@Column('int', {
		default: 0,
	})
	stock!: number;

	@ApiProperty()
	@Column('text', {
		array: true,
	})
	sizes!: string[];

	@ApiProperty()
	@Column('text')
	gender!: string;

	@ApiProperty()
	@Column('text', {
		array: true,
		default: [],
	})
	tags!: string[];

	// Imágenes
	@ApiProperty()
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
