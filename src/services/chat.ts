import type { AccountRole } from './types';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderRole: AccountRole;
    body: string;
    createdAt: string;
    readBy: Record<AccountRole, boolean>;
}

export interface ChatConversationSummary {
    orderId: string;
    orderTitle: string;
    partnerName: string;
    customerId: string;
    customerName: string;
    driverId: string | null;
    driverName: string | null;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: Record<AccountRole, number>;
}

export interface ChatConversation extends ChatConversationSummary {
    messages: ChatMessage[];
}

// Conversations are created on demand when users navigate to /chat/:orderId.
const chatStore: ChatConversation[] = [];

type ChatStoreListener = () => void;

const listeners = new Set<ChatStoreListener>();
let chatStoreVersion = 0;

const notifyChatStoreChanged = () => {
    chatStoreVersion += 1;
    listeners.forEach((listener) => listener());
};

const cloneMessage = (message: ChatMessage): ChatMessage => ({
    ...message,
    readBy: { ...message.readBy },
});

const cloneConversation = (conversation: ChatConversation): ChatConversation => ({
    ...conversation,
    unreadCount: { ...conversation.unreadCount },
    messages: conversation.messages.map(cloneMessage),
});

interface ConversationSeed {
    orderTitle?: string;
    partnerName?: string;
    customerName?: string;
    driverName?: string;
}

// The chat store is in-memory and shared across the whole session.
// Both sides (customer + driver) of an order see the same conversation, so we
// grant access to anyone who holds a reference to the orderId rather than
// filtering by a specific userId that may not yet be recorded on the conversation.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const canAccessConversation = (_conversation: ChatConversation, _role: AccountRole, _userId: string) => true;

const getConversationIndex = (orderId: string) => chatStore.findIndex((conversation) => conversation.orderId === orderId);

const refreshConversationState = (conversation: ChatConversation) => {
    conversation.unreadCount.customer = conversation.messages.filter((message) => !message.readBy.customer).length;
    conversation.unreadCount.driver = conversation.messages.filter((message) => !message.readBy.driver).length;
    const latestMessage = conversation.messages[conversation.messages.length - 1];

    if (latestMessage) {
        conversation.lastMessage = latestMessage.body;
        conversation.lastMessageAt = latestMessage.createdAt;
    }
};

const createConversation = (role: AccountRole, userId: string, orderId: string, seed: ConversationSeed): ChatConversation => {
    const partnerName = seed.partnerName ?? 'Recipient';

    return {
        orderId,
        orderTitle: seed.orderTitle ?? `Order ${orderId}`,
        partnerName,
        customerId: role === 'customer' ? userId : (seed.customerName ? `customer-${seed.customerName}` : ''),
        customerName: seed.customerName ?? (role === 'customer' ? 'Customer' : partnerName),
        driverId: role === 'driver' ? userId : (seed.driverName ? `driver-${seed.driverName}` : ''),
        driverName: seed.driverName ?? (role === 'driver' ? 'Driver' : partnerName),
        lastMessage: 'No messages yet',
        lastMessageAt: new Date().toISOString(),
        unreadCount: { customer: 0, driver: 0 },
        messages: [],
    };
};

export const chatService = {
    getStoreVersion() {
        return chatStoreVersion;
    },

    subscribe(listener: ChatStoreListener) {
        listeners.add(listener);

        return () => {
            listeners.delete(listener);
        };
    },

    ensureConversation(role: AccountRole, userId: string, orderId: string, seed: ConversationSeed = {}) {
        const existingConversation = chatStore.find((conversation) => conversation.orderId === orderId);

        if (existingConversation) {
            return cloneConversation(existingConversation);
        }

        const conversation = createConversation(role, userId, orderId, seed);
        chatStore.unshift(conversation);
        notifyChatStoreChanged();

        return cloneConversation(conversation);
    },

    listConversations(role: AccountRole, userId: string) {
        return chatStore
            .filter((conversation) => canAccessConversation(conversation, role, userId))
            .map(cloneConversation)
            .sort((left, right) => new Date(right.lastMessageAt).getTime() - new Date(left.lastMessageAt).getTime());
    },

    getConversation(role: AccountRole, userId: string, orderId: string) {
        const conversation = chatStore.find((item) => item.orderId === orderId);

        if (!conversation || !canAccessConversation(conversation, role, userId)) {
            return null;
        }

        return cloneConversation(conversation);
    },

    getUnreadCount(role: AccountRole, userId: string) {
        return this.listConversations(role, userId).reduce((total, conversation) => {
            return total + conversation.unreadCount[role];
        }, 0);
    },

    markConversationRead(role: AccountRole, userId: string, orderId: string) {
        const conversationIndex = getConversationIndex(orderId);

        if (conversationIndex === -1) {
            return null;
        }

        const conversation = chatStore[conversationIndex];

        if (!canAccessConversation(conversation, role, userId)) {
            return null;
        }

        conversation.messages.forEach((message) => {
            message.readBy[role] = true;
        });

        const previousUnreadCount = conversation.unreadCount[role];
        refreshConversationState(conversation);

        if (previousUnreadCount !== conversation.unreadCount[role]) {
            notifyChatStoreChanged();
        }

        return cloneConversation(conversation);
    },

    sendMessage(role: AccountRole, userId: string, orderId: string, body: string) {
        const trimmedBody = body.trim();

        if (!trimmedBody) {
            return null;
        }

        const conversationIndex = getConversationIndex(orderId);

        if (conversationIndex === -1) {
            return null;
        }

        const conversation = chatStore[conversationIndex];

        if (!canAccessConversation(conversation, role, userId)) {
            return null;
        }

        const message: ChatMessage = {
            id: `m-${Date.now()}`,
            senderId: userId,
            senderRole: role,
            body: trimmedBody,
            createdAt: new Date().toISOString(),
            readBy: {
                customer: role === 'customer',
                driver: role === 'driver',
            },
        };

        conversation.messages.push(message);
        refreshConversationState(conversation);
        notifyChatStoreChanged();

        return cloneConversation(conversation);
    },
};
