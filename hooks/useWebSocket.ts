import { useEffect, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (typeof window === 'undefined') return;

    const ws = (window as any).__ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;

    const connect = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${protocol}//${window.location.host}${url}`);

        ws.onopen = () => {
          console.log('[WebSocket] Connected');
          setIsConnected(true);
          setError(null);
          reconnectAttempts = 0;
          (window as any).__ws = ws;
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data) as WebSocketMessage;
            setData(msg);
          } catch (err) {
            console.error('[WebSocket] Parse error:', err);
          }
        };

        ws.onerror = (event) => {
          console.error('[WebSocket] Error');
          setError(new Error('WebSocket error'));
        };

        ws.onclose = () => {
          console.log('[WebSocket] Disconnected');
          setIsConnected(false);

          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            reconnectTimeout = setTimeout(connect, 3000);
          } else {
            setError(new Error('Failed to connect after max attempts'));
          }
        };
      } catch (err) {
        console.error('[WebSocket] Connection error:', err);
        setError(err instanceof Error ? err : new Error('Connection failed'));
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  return { isConnected, data, error, sendMessage };
}
