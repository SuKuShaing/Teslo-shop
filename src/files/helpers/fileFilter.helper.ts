import 'multer';

/**
 * Este es un archivo que filtra, y verifica que el archivo subido tenga el formato indicado
 * @param req
 * @param file
 * @param callback
 * @returns
 */
export const fileFilter = (
	req: Express.Request,
	file: Express.Multer.File,
	callback: Function,
) => {
	// console.log({ file });
	// {
	//     file: {
	//         fieldname: 'file',
	//         originalname: 'MindValley Workbook.pdf',
	//         encoding: '7bit',
	//         mimetype: 'application/pdf'
	//     }
	// }
	if (!file) return callback(new Error('File is empty'), false);

	const fileExtension = file.mimetype.split('/')[1];
	const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
	// esto es para aceptar o no un archivo, no lanza excepciones de nest

	if (validExtensions.includes(fileExtension)) {
		return callback(null, true);
	}

	callback(null, false);
};
