import { useSyncExternalStore } from 'react';
import { unreadStore } from '../services/chat';
import type { AccountRole } from '../services/types';

export function useUnreadCount(_role: AccountRole, userId: string | undefined) {
    useSyncExternalStore(
        unreadStore.subscribe,
        unreadStore.getVersion,
        unreadStore.getVersion,
    );

    if (!userId) {
        return 0;
    }

    return unreadStore.getTotal();
}
