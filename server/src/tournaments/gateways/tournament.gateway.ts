import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: [
      'http://localhost:8000',
      'http://localhost:3000',
      'https://alpha.subsoccer.app',
      'https://subsoccer.app',
      'https://dev.subsoccer.app'
    ]
  },
})
export class TournamentGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_tournament')
  joinTournament(@MessageBody() data: any) {
    this.server.emit('new_update_tournament', data.tournamentId);
  }

  @SubscribeMessage('tournament_updated')
  tournamentUpdate(@MessageBody() data: any) {
    this.server.emit('new_update_tournament_data', data.tournamentId);
  }

  @SubscribeMessage('tournament_started')
  tournamentStarted(@MessageBody() data: any) {
    this.server.emit('new_tournament_added', { user: data.uesr });
  }
}
