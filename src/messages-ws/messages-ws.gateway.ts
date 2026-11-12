import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
	implements OnGatewayConnection, OnGatewayDisconnect {
	
	@WebSocketServer() wss: Server;
	
	constructor(private readonly messagesWsService: MessagesWsService) {}

	// Cuando un cliente se conecta
	handleConnection(client: Socket) {
		// console.log('Client connected:', client.id);
		this.messagesWsService.registerClient(client);

		// Emitir a todos los clientes conectados y que estén escuchando 'clients-updated', el id de los clientes conectados
		this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()); // Emitir a todos los clientes conectados el número de clientes conectados
	}
	
	// Cuando un cliente se desconecta
	handleDisconnect(client: Socket) {
		// console.log('Client disconnected:', client.id);
		this.messagesWsService.removeClient(client.id);
		
		// Emitir a todos los clientes conectados y que estén escuchando 'clients-updated', el id de los clientes conectados
		// por en se envía la lista sin el que se desconectó
		this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()); // Emitir a todos los clientes conectados el número de clientes conectados
	}
}
