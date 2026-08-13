import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('product')
	@UseInterceptors(FileInterceptor('file')) // file es el nombre de la key en el form-data
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {
		return file;
	}
}
