type SocketCallback = () => void;

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
const listeners: Map<string, Set<SocketCallback>> = new Map();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5000';

export const socketService = {
  connect: () => {
    if (ws && ws.readyState === WebSocket.OPEN) return;

    try {
      ws = new WebSocket(SOCKET_URL);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const callbacks = listeners.get(data.type);
          if (callbacks) callbacks.forEach((cb) => cb());
        } catch {}
      };

      ws.onclose = () => {
        reconnectTimer = setTimeout(() => socketService.connect(), 3000);
      };

      ws.onerror = () => ws?.close();
    } catch {}
  },

  disconnect: () => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    ws?.close();
    ws = null;
  },

  joinBoard: (boardId: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'join-board', boardId }));
    }
  },

  leaveBoard: (boardId: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'leave-board', boardId }));
    }
  },

  emitTaskChange: (boardId: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'task-change', boardId }));
    }
  },

  on: (event: string, callback: SocketCallback) => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(callback);
    return () => listeners.get(event)?.delete(callback);
  },
};
