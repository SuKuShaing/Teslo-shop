import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() wss!: Server;

	constructor(
		private readonly messagesWsService: MessagesWsService,
		private readonly jwtService: JwtService
	) {}

	// Cuando un cliente se conecta
	async handleConnection(client: Socket) {
		const token = client.handshake.headers.authentication as string;
		let payload: JwtPayload;
		try {
			payload = this.jwtService.verify(token);
			await this.messagesWsService.registerClient(client, payload.id);

		} catch (error) {
			client.disconnect();
			return; 
		}

		// Emitir a todos los clientes conectados y que estén escuchando 'clients-updated', el id de los clientes conectados
		this.wss.emit(
			'clients-updated',
			this.messagesWsService.getConnectedClients(),
		); // Emitir a todos los clientes conectados el número de clientes conectados
	}

	// Cuando un cliente se desconecta
	handleDisconnect(client: Socket) {
		// console.log('Client disconnected:', client.id);
		this.messagesWsService.removeClient(client.id);

		// Emitir a todos los clientes conectados y que estén escuchando 'clients-updated', el id de los clientes conectados
		// por en se envía la lista sin el que se desconectó
		this.wss.emit(
			'clients-updated',
			this.messagesWsService.getConnectedClients(),
		); // Emitir a todos los clientes conectados el número de clientes conectados
	}

	@SubscribeMessage('message-from-client')
	onMessageFromClient(client: Socket, payload: NewMessageDto) {
		// el id del payload se puede modificar, el id del cliente que envía el mensaje es el client.id
		// console.log(client.id, payload );

		// Emite únicamente al cliente que envió el mensaje, "el mensaje que envió" por ejemplo
		// client.emit('message-from-server', {
		// 	fullName: 'Soy yo',
		// 	message: `Tu mensaje fue: ${payload.message}`,
		// })

		// Emitir a todos los clientes, menos al que envió el mensaje,
		// client.broadcast.emit('message-from-server', {
		// 	fullName: 'Soy yo',
		// 	message: `Tu mensaje fue: ${payload.message}`,
		// })

		// Emitir a todos los clientes, incluyendo al que envió el mensaje
		this.wss.emit('message-from-server', {
			fullName: this.messagesWsService.getUserFullName(client.id),
			message: `Tu mensaje fue: ${payload.message}`,
		}) // Emitir a todos los clientes conectados el número de clientes conectados
	}
}
