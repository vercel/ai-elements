/**
 * WebSocket hook for real-time updates from Cloudflare Durable Objects
 */

import { useEffect, useState, useCallback, useRef } from 'react';

export interface RealtimeMessage {
  type: 'sync_started' | 'sync_progress' | 'sync_completed' | 'error';
  data: any;
  timestamp: string;
}

export interface RealtimeState {
  connected: boolean;
  messages: RealtimeMessage[];
  lastMessage: RealtimeMessage | null;
  error: string | null;
}

/**
 * Hook for connecting to Cloudflare Durable Object WebSocket
 */
export function useRealtime(phoneNumberId?: string) {
  const [state, setState] = useState<RealtimeState>({
    connected: false,
    messages: [],
    lastMessage: null,
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!phoneNumberId) return;

    const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || '';
    if (!workerUrl) {
      setState((prev) => ({
        ...prev,
        error: 'WebSocket URL not configured',
      }));
      return;
    }

    // Convert https:// to wss://
    const wsUrl = workerUrl.replace('https://', 'wss://').replace('http://', 'ws://');
    const fullUrl = `${wsUrl}/ws/phone/${phoneNumberId}`;

    try {
      const ws = new WebSocket(fullUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setState((prev) => ({
          ...prev,
          connected: true,
          error: null,
        }));
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message: RealtimeMessage = JSON.parse(event.data);
          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
            lastMessage: message,
          }));
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState((prev) => ({
          ...prev,
          error: 'WebSocket connection error',
        }));
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setState((prev) => ({
          ...prev,
          connected: false,
        }));

        // Attempt to reconnect with exponential backoff
        const maxAttempts = 5;
        const baseDelay = 1000; // 1 second

        if (reconnectAttemptsRef.current < maxAttempts) {
          const delay = baseDelay * Math.pow(2, reconnectAttemptsRef.current);
          console.log(`Reconnecting in ${delay}ms...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, delay);
        } else {
          setState((prev) => ({
            ...prev,
            error: 'Failed to connect after multiple attempts',
          }));
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to create WebSocket connection',
      }));
    }
  }, [phoneNumberId]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      connected: false,
    }));
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      lastMessage: null,
    }));
  }, []);

  useEffect(() => {
    if (phoneNumberId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [phoneNumberId, connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
  };
}

/**
 * Hook for monitoring global sync status
 */
export function useGlobalSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<{
    active: boolean;
    progress: number;
    currentOperation: string | null;
  }>({
    active: false,
    progress: 0,
    currentOperation: null,
  });

  const { lastMessage, connected } = useRealtime();

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'sync_started':
          setSyncStatus({
            active: true,
            progress: 0,
            currentOperation: lastMessage.data.operation,
          });
          break;

        case 'sync_progress':
          setSyncStatus((prev) => ({
            ...prev,
            progress: lastMessage.data.progress,
            currentOperation: lastMessage.data.operation,
          }));
          break;

        case 'sync_completed':
          setSyncStatus({
            active: false,
            progress: 100,
            currentOperation: null,
          });
          break;

        case 'error':
          setSyncStatus({
            active: false,
            progress: 0,
            currentOperation: null,
          });
          break;
      }
    }
  }, [lastMessage]);

  return {
    ...syncStatus,
    connected,
  };
}
