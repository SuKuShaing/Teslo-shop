import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
