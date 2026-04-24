import { useSyncExternalStore } from 'react';
import { chatService } from '../services/chat';
import type { AccountRole } from '../services/types';

export function useUnreadCount(role: AccountRole, userId: string | undefined) {
    useSyncExternalStore(
        chatService.subscribe,
        chatService.getStoreVersion,
        chatService.getStoreVersion,
    );

    if (!userId) {
        return 0;
    }

    return chatService.getUnreadCount(role, userId);
}
