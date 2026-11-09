// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

// Para que quede documentado este UpdateProductDto, se debe usar PartialType de @nestjs/swagger, en vez de @nestjs/mapped-types, con ese cambio se trae lo documentado de CreateProductDto, pero con todas las propiedades como opcionales, y se documenta en Swagger.