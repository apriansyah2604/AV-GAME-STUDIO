import { WebSocketServer, WebSocket } from 'ws';
import type { IncomingMessage } from 'http';
import type { Server } from 'http';

export interface WebSocketServerConfig {
  port?: number;
  path?: string;
}

export interface WebSocketServerInstance {
  wss: WebSocketServer;
  clients: Set<WebSocket>;
  broadcast: (type: string, data: any) => void;
  broadcastToClient: (ws: WebSocket, type: string, data: any) => void;
}

export function createWebSocketServer(config: WebSocketServerConfig = {}): WebSocketServerInstance {
  const { port = 3001, path = '/ws' } = config;

  const wss = new WebSocketServer({ port, path });
  const clients = new Set<WebSocket>();

  const broadcast = (type: string, data: any) => {
    const message = JSON.stringify({
      type,
      data,
      timestamp: new Date().toISOString(),
    });

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  const broadcastToClient = (ws: WebSocket, type: string, data: any) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString(),
        })
      );
    }
  };

  wss.on('connection', (ws: WebSocket) => {
    console.log('[WebSocket Server] Client connected');
    clients.add(ws);

    ws.on('message', (data: Buffer) => {
      try {
        const msg = JSON.parse(data.toString());
        console.log('[WebSocket Server] Received:', msg.type);
        
        // Handle different message types
        switch (msg.type) {
          case 'ping':
            broadcastToClient(ws, 'pong', { timestamp: new Date().toISOString() });
            break;
          case 'subscribe':
            // Client subscribed to updates
            break;
          default:
            console.log('[WebSocket Server] Unknown message type:', msg.type);
        }
      } catch (error) {
        console.error('[WebSocket Server] Message parse error:', error);
      }
    });

    ws.on('error', (error: Error) => {
      console.error('[WebSocket Server] Client error:', error);
    });

    ws.on('close', () => {
      console.log('[WebSocket Server] Client disconnected');
      clients.delete(ws);
    });
  });

  wss.on('error', (error: Error) => {
    console.error('[WebSocket Server] Server error:', error);
  });

  return { wss, clients, broadcast, broadcastToClient };
}

export function closeWebSocketServer(instance: WebSocketServerInstance): void {
  instance.wss.close(() => {
    console.log('[WebSocket Server] Closed');
  });
}
