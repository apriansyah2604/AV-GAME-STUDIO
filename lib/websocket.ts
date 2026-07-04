import { WebSocket } from 'ws';

export interface WebSocketMessage {
  type: 'connection-update' | 'account-update' | 'activity-log' | 'bot-status' | 'error';
  data: any;
  timestamp: string;
}

export interface WebSocketClient {
  url: string;
  ws: WebSocket | null;
  isConnecting: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  messageQueue: WebSocketMessage[];
  listeners: Map<string, Set<(data: any) => void>>;
}

const DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;
const DEFAULT_RECONNECT_DELAY = 3000;

export function createWebSocketClient(url: string): WebSocketClient {
  return {
    url,
    ws: null,
    isConnecting: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: DEFAULT_MAX_RECONNECT_ATTEMPTS,
    reconnectDelay: DEFAULT_RECONNECT_DELAY,
    messageQueue: [],
    listeners: new Map(),
  };
}

export function connectWebSocket(
  client: WebSocketClient,
  onMessage?: (msg: WebSocketMessage) => void,
  onConnected?: () => void,
  onError?: (error: Error) => void
): void {
  if (client.isConnecting || client.ws) return;

  client.isConnecting = true;

  try {
    const ws = new WebSocket(client.url);

    ws.onopen = () => {
      console.log('[WebSocket] Connected');
      client.ws = ws;
      client.isConnecting = false;
      client.reconnectAttempts = 0;
      
      // Send queued messages
      while (client.messageQueue.length > 0) {
        const msg = client.messageQueue.shift();
        if (msg) {
          ws.send(JSON.stringify(msg));
        }
      }

      if (onConnected) onConnected();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as WebSocketMessage;
        
        // Trigger specific listeners
        const typeListeners = client.listeners.get(msg.type);
        if (typeListeners) {
          typeListeners.forEach(listener => listener(msg.data));
        }

        // Trigger generic message handler
        if (onMessage) onMessage(msg);
      } catch (error) {
        console.error('[WebSocket] Message parse error:', error);
      }
    };

    ws.onerror = (event) => {
      console.error('[WebSocket] Error:', event);
      client.isConnecting = false;
      const error = new Error('WebSocket error');
      if (onError) onError(error);
    };

    ws.onclose = () => {
      console.log('[WebSocket] Disconnected');
      client.ws = null;
      client.isConnecting = false;

      // Attempt reconnection
      if (client.reconnectAttempts < client.maxReconnectAttempts) {
        client.reconnectAttempts++;
        console.log(
          `[WebSocket] Reconnecting (${client.reconnectAttempts}/${client.maxReconnectAttempts})...`
        );
        setTimeout(
          () => connectWebSocket(client, onMessage, onConnected, onError),
          client.reconnectDelay
        );
      } else {
        console.error('[WebSocket] Max reconnection attempts reached');
      }
    };
  } catch (error) {
    console.error('[WebSocket] Connection error:', error);
    client.isConnecting = false;
    if (onError && error instanceof Error) {
      onError(error);
    }
  }
}

export function sendWebSocketMessage(client: WebSocketClient, msg: WebSocketMessage): void {
  if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
    client.messageQueue.push(msg);
    console.log('[WebSocket] Message queued (not connected)');
    return;
  }

  try {
    client.ws.send(JSON.stringify(msg));
  } catch (error) {
    console.error('[WebSocket] Send error:', error);
    client.messageQueue.push(msg);
  }
}

export function subscribeToWebSocketMessage(
  client: WebSocketClient,
  type: string,
  listener: (data: any) => void
): () => void {
  if (!client.listeners.has(type)) {
    client.listeners.set(type, new Set());
  }

  client.listeners.get(type)!.add(listener);

  // Return unsubscribe function
  return () => {
    const listeners = client.listeners.get(type);
    if (listeners) {
      listeners.delete(listener);
    }
  };
}

export function disconnectWebSocket(client: WebSocketClient): void {
  if (client.ws) {
    client.ws.close();
    client.ws = null;
  }
  client.isConnecting = false;
  client.reconnectAttempts = 0;
}
