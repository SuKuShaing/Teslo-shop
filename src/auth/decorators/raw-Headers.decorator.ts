// rawHeaders: [
//       'Cache-Control',
//       'no-cache',
//       'Postman-Token',
//       '801fd368-1ab9-42f9-ac2f-0982db230b93',
//       'Content-Type',
//       'application/json',
//       'Content-Length',
//       '108',
//       'Host',
//       'localhost:3000',
//       'User-Agent',
//       'PostmanRuntime/2.5.0',
//       'Accept',
//       '*/*',
//       'Accept-Encoding',
//       'gzip, deflate, br',
//       'Connection',
//       'keep-alive',
//       'Authorization',
//       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI2YWUxZDYyLWNkNjktNDM0Yy04NGE5LWVjM2ZlY2RhOTNkYSIsImlhdCI6MTc4ODg4MjE0NSwiZXhwIjoxNzg4ODg5MzQ1fQ.VkGEQPK0eCohEsZGAlj6Xn9yaCmf93Fat74ISINH9xw'
//     ],

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator((_, ctx: ExecutionContext) => {
	// ctx debe ir en segunda posición por definición de como funciona la función createParamDecorator
	const req = ctx.switchToHttp().getRequest();
	return req.rawHeaders;
});
