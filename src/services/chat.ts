import apiService from './api';
import { storage } from './storage';

// ---------------------------------------------------------------------------
// Backend API types
// ---------------------------------------------------------------------------

export interface ChatSender {
    id: number;
    full_name: string;
}

export interface ChatMessage {
    id: number;
    conversation_id: number;
    sender_id: number;
    sender: ChatSender;
    body: string;
    created_at: string;
    is_read: boolean;
}

export interface ConversationSummary {
    id: number;
    order_id: number;
    last_message: ChatMessage | null;
    unread_count: number;
    created_at: string;
    updated_at: string;
}

export interface ConversationDetail {
    id: number;
    order_id: number;
    messages: ChatMessage[];
    created_at: string;
    updated_at: string;
}

export interface WsNewMessageEvent {
    event_type: 'new_message';
    payload: ChatMessage;
}

export interface WsMessagesReadEvent {
    event_type: 'messages_read';
    payload: {
        conversation_id: number;
        read_by_user_id: number;
        message_ids: number[];
    };
}

export type WsEvent = WsNewMessageEvent | WsMessagesReadEvent;

// ---------------------------------------------------------------------------
// REST API functions
// ---------------------------------------------------------------------------

export const chatApi = {
    listConversations(): Promise<ConversationSummary[]> {
        return apiService.get('/chat/conversations').then(res => res.data);
    },

    getConversation(orderId: number | string): Promise<ConversationDetail> {
        return apiService.get(`/chat/conversations/${orderId}`).then(res => res.data);
    },

    sendMessage(orderId: number | string, body: string): Promise<ChatMessage> {
        return apiService
            .post(`/chat/conversations/${orderId}/messages`, { body })
            .then(res => res.data);
    },

    markRead(orderId: number | string): Promise<{ marked_count: number; message_ids: number[] }> {
        return apiService.post(`/chat/conversations/${orderId}/read`).then(res => res.data);
    },
};

// ---------------------------------------------------------------------------
// Unread count pub-sub (bottom-nav badge)
// ---------------------------------------------------------------------------

type UnreadListener = () => void;

let _unreadTotal = 0;
let _unreadVersion = 0;
const _unreadListeners = new Set<UnreadListener>();

const _notifyUnread = () => {
    _unreadVersion += 1;
    _unreadListeners.forEach(l => l());
};

export const unreadStore = {
    subscribe(listener: UnreadListener) {
        _unreadListeners.add(listener);
        return () => _unreadListeners.delete(listener);
    },

    getVersion() {
        return _unreadVersion;
    },

    getTotal() {
        return _unreadTotal;
    },

    setFromConversations(conversations: ConversationSummary[]) {
        const total = conversations.reduce((sum, c) => sum + c.unread_count, 0);
        if (total !== _unreadTotal) {
            _unreadTotal = total;
            _notifyUnread();
        }
    },

    decrementBy(amount: number) {
        const next = Math.max(0, _unreadTotal - amount);
        if (next !== _unreadTotal) {
            _unreadTotal = next;
            _notifyUnread();
        }
    },

    increment() {
        _unreadTotal += 1;
        _notifyUnread();
    },
};

// ---------------------------------------------------------------------------
// WebSocket connection factory
// ---------------------------------------------------------------------------

function buildWsUrl(orderId: number | string, token: string): string {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    const wsBase = base.replace(/^https?/, (match: string) => match === 'https' ? 'wss' : 'ws');
    return `${wsBase}/chat/ws/${orderId}?token=${encodeURIComponent(token)}`;
}

/**
 * Opens a WebSocket for a conversation thread.
 * Returns a cleanup function that should be called on unmount.
 * Handles: ping/pong every 25 s, exponential-backoff reconnect, token refresh on 1008.
 */
export function openChatWebSocket(
    orderId: number | string,
    onEvent: (event: WsEvent) => void,
): () => void {
    let ws: WebSocket | null = null;
    let pingInterval: ReturnType<typeof setInterval> | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;
    let destroyed = false;

    const connect = () => {
        const token = storage.getAccessToken();
        if (!token || destroyed) return;

        ws = new WebSocket(buildWsUrl(orderId, token));

        ws.onopen = () => {
            attempt = 0;
            pingInterval = setInterval(() => {
                if (ws?.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'ping' }));
                }
            }, 25_000);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data as string) as Record<string, unknown>;
                if (data.type === 'pong') return;
                if (
                    data.event_type === 'new_message' ||
                    data.event_type === 'messages_read'
                ) {
                    onEvent(data as unknown as WsEvent);
                }
            } catch {
                // malformed — ignore
            }
        };

        ws.onclose = (closeEvent) => {
            if (pingInterval) clearInterval(pingInterval);
            pingInterval = null;
            if (destroyed) return;

            if (closeEvent.code === 1008) {
                // Token expired/policy violation — refresh then reconnect
                const refreshToken = storage.getRefreshToken();
                if (!refreshToken) {
                    window.location.href = '/login';
                    return;
                }
                apiService
                    .post('/auth/refresh', { refresh_token: refreshToken })
                    .then((res) => {
                        storage.setAccessToken(res.data.access_token as string);
                        if (res.data.refresh_token) {
                            storage.setRefreshToken(res.data.refresh_token as string);
                        }
                        if (!destroyed) connect();
                    })
                    .catch(() => {
                        window.location.href = '/login';
                    });
                return;
            }

            // Generic reconnect with exponential backoff (cap at 30 s)
            const delay = Math.min(1_000 * 2 ** attempt, 30_000);
            attempt += 1;
            reconnectTimeout = setTimeout(() => {
                if (!destroyed) connect();
            }, delay);
        };

        ws.onerror = () => {
            // onclose fires after onerror — reconnect handled there
        };
    };

    connect();

    return () => {
        destroyed = true;
        if (pingInterval) clearInterval(pingInterval);
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        ws?.close();
    };
}
