import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('text')
	url!: string;

	@ManyToOne(
		() => Product, // Esta es la clase Product de la otra tabla o entidad
		(product) => product.images, //  Este es el objeto (con minúscula) product.nombreDeLaColumna
		{ onDelete: 'CASCADE' }, // Con esto genera una eliminación en cascada, sí se elimina el producto, también se eliminan las imágenes asociadas al producto
	)
	product!: Product;
}
