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

const chatStore: ChatConversation[] = [
    {
        orderId: '1',
        orderTitle: 'Furniture Delivery',
        partnerName: 'Driver User',
        customerId: 'customer-1',
        customerName: 'Customer User',
        driverId: 'driver-1',
        driverName: 'Driver User',
        lastMessage: 'I am arriving in 8 minutes.',
        lastMessageAt: '2026-04-21T08:25:00.000Z',
        unreadCount: { customer: 1, driver: 0 },
        messages: [
            {
                id: 'm-1',
                senderId: 'customer-1',
                senderRole: 'customer',
                body: 'Hi, can you confirm the pickup is still scheduled for 9:00 AM?',
                createdAt: '2026-04-21T07:55:00.000Z',
                readBy: { customer: true, driver: true },
            },
            {
                id: 'm-2',
                senderId: 'driver-1',
                senderRole: 'driver',
                body: 'Yes, I am on the way now and should arrive within 10 minutes.',
                createdAt: '2026-04-21T08:05:00.000Z',
                readBy: { customer: false, driver: true },
            },
            {
                id: 'm-3',
                senderId: 'driver-1',
                senderRole: 'driver',
                body: 'I am arriving in 8 minutes.',
                createdAt: '2026-04-21T08:25:00.000Z',
                readBy: { customer: false, driver: true },
            },
        ],
    },
    {
        orderId: '2',
        orderTitle: 'Electronics Delivery',
        partnerName: 'Driver User',
        customerId: 'customer-1',
        customerName: 'Customer User',
        driverId: 'driver-1',
        driverName: 'Driver User',
        lastMessage: 'Loaded and heading out now.',
        lastMessageAt: '2026-04-20T16:10:00.000Z',
        unreadCount: { customer: 0, driver: 0 },
        messages: [
            {
                id: 'm-4',
                senderId: 'customer-1',
                senderRole: 'customer',
                body: 'Please handle the package carefully. It is fragile.',
                createdAt: '2026-04-20T15:55:00.000Z',
                readBy: { customer: true, driver: true },
            },
            {
                id: 'm-5',
                senderId: 'driver-1',
                senderRole: 'driver',
                body: 'Loaded and heading out now.',
                createdAt: '2026-04-20T16:10:00.000Z',
                readBy: { customer: true, driver: true },
            },
        ],
    },
    {
        orderId: '3',
        orderTitle: 'Documents Delivery',
        partnerName: 'Sarah Driver',
        customerId: 'customer-1',
        customerName: 'Customer User',
        driverId: 'driver-2',
        driverName: 'Sarah Driver',
        lastMessage: 'Delivered to reception. Thanks!',
        lastMessageAt: '2026-04-19T10:20:00.000Z',
        unreadCount: { customer: 0, driver: 0 },
        messages: [
            {
                id: 'm-6',
                senderId: 'driver-2',
                senderRole: 'driver',
                body: 'Delivered to reception. Thanks!',
                createdAt: '2026-04-19T10:20:00.000Z',
                readBy: { customer: true, driver: true },
            },
        ],
    },
];

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

const canAccessConversation = (conversation: ChatConversation, role: AccountRole, userId: string) => {
    if (role === 'customer') {
        return conversation.customerId === userId;
    }

    return conversation.driverId === userId;
};

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
        customerId: role === 'customer' ? userId : 'customer-1',
        customerName: seed.customerName ?? (role === 'customer' ? 'Customer User' : partnerName),
        driverId: role === 'driver' ? userId : 'driver-1',
        driverName: seed.driverName ?? (role === 'driver' ? 'Driver User' : partnerName),
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
