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
	Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import type { Response } from 'express';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get('product/:imageName')
	findProductImage(
		@Res() res: Response, // Ahora nest no responde, yo manualmente voy a emitir la respuesta
		@Param('imageName') imageName: string,
	) {
		const path = this.filesService.getStaticProductImage(imageName);

		res.sendFile(path);
		// res.status(403).json({
		// 	ok: false,
		// 	path: path,
		// });
	}

	@Post('product')
	@UseInterceptors(
		FileInterceptor('file', {
			// 'file' es el nombre de la key en el form-data
			fileFilter: fileFilter,
			// fileFilter es el filtro que colocamos, en este caso validamos que sea una imagen
			// limits: { fileSize: 10000000 }, // valor en bytes, aquí hay 10 MB
			storage: diskStorage({
				destination: './static/products',
				filename: fileNamer,
			}),
		}),
	)
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {
		if (!file) {
			// sí no es una imagen, no pasa el filtro y aquí no llega ninguna imagen
			throw new BadRequestException(
				'Make suere that the file is an image',
			);
		}

		const secureUrl = `${file.filename}`;

		// console.log({ fileInController: file });
		// fieldname: file.fieldname,
		// mimetype: file.mimetype,
		// originalname: file.originalname,
		console.log(file);

		return { secureUrl };
	}
}
