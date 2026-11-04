import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('products')
// @Auth() // Sí se defini aquí, todas las rutas dentro necesitan autentificación
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@Auth()
	create(
		@Body() createProductDto: CreateProductDto,
		@GetUser() user: User,
	) {
		return this.productsService.create(createProductDto, user);
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.productsService.findAll(paginationDto);
	}

	@Get(':terminoDeBusqueda')
	findOne(@Param('terminoDeBusqueda') terminoDeBusqueda: string) {
		return this.productsService.findOnePlain(terminoDeBusqueda);
	}

	@Patch(':id')
	@Auth(ValidRoles.admin)
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
		@GetUser() user: User,
	) {
		return this.productsService.update(id, updateProductDto, user);
	}

	@Delete(':terminoDeBusqueda')
	@Auth(ValidRoles.admin)
	remove(
		@Param('terminoDeBusqueda', ParseUUIDPipe) terminoDeBusqueda: string,
	) {
		return this.productsService.remove(terminoDeBusqueda);
	}
}
