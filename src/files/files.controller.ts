import 'multer';
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
	BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('product')
	@UseInterceptors(
		FileInterceptor('file', {
			// 'file' es el nombre de la key en el form-data
			fileFilter: fileFilter,
			// fileFilter es el filtro que colocamos, en este caso validamos que sea una imagen
		}),
	)
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {
		if (!file) {
			// sí no es una imagen, no pasa el filtro y aquí no llega ninguna imagen
			throw new BadRequestException(
				'Make suere that the file is an image',
			);
		}

		console.log({ fileInController: file });

		return {
			fieldname: file.fieldname,
			mimetype: file.mimetype,
			originalname: file.originalname,
		};
	}
}
