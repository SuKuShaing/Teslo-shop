import 'multer';
import { v4 as uuid } from 'uuid';

/**
 * Este es un archivo que le da un nombre a los archivos subidos
 * @param req
 * @param file
 * @param callback
 * @returns
 */
export const fileNamer = (
	req: Express.Request,
	file: Express.Multer.File,
	callback: Function,
) => {
	if (!file) return callback(new Error('File is empty'), false);

	const fileExtension = file.mimetype.split('/')[1];

	const fileName = `${uuid()}.${fileExtension}`;

	callback(null, fileName);
};
