import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
	getStaticProductImage(imageName: string) {
		const path = join(__dirname, '../../static/products', imageName); // con esto se crea el path físico del servidor

		if (!existsSync(path))
			throw new BadRequestException(
				`No product found with image ${imageName}`,
			);

		return path;
	}
}
