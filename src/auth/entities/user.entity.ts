import { Product } from 'src/products/entities';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column('text', { unique: true })
	email!: string;

	@Column('text', {
		select: false, // Cuando hacemos un find del usuario, no retorna el dato de esta columna
	})
	password!: string;

	@Column('text')
	fullName!: string;

	@Column('bool', { default: true }) // Postgres requiere bool en vez de boolean
	isActive!: boolean;

	@Column('text', { array: true, default: ['user'] })
	roles!: string[];

	@OneToMany(
		() => Product, // Entidad con las que se va a relacionar
		(product) => product.user, // el como el producto se relaciona con la tabla
	)
	products!: Product[];

	@BeforeInsert()
	checkFieldsBeforeInsert() {
		this.email = this.email.toLowerCase().trim();
	}

	@BeforeUpdate()
	checkFieldsBeforeUpdate() {
		this.checkFieldsBeforeInsert();
	}
}
