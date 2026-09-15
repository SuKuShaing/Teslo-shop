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
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('products')
// @Auth() // Sí se defini aquí, todas las rutas dentro necesitan autentificación
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@Auth(ValidRoles.admin)
	create(@Body() createProductDto: CreateProductDto) {
		return this.productsService.create(createProductDto);
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
	) {
		return this.productsService.update(id, updateProductDto);
	}

	@Delete(':terminoDeBusqueda')
	@Auth(ValidRoles.admin)
	remove(
		@Param('terminoDeBusqueda', ParseUUIDPipe) terminoDeBusqueda: string,
	) {
		return this.productsService.remove(terminoDeBusqueda);
	}
}
