import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' }) // sí se le cambia el nombre a tabla, hay que eliminar la anterior en la db, a veces hay que matar el docker que tiene la db, el volumen permanece y volver a levantarlo
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
