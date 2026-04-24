import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { chatService, type ChatConversationSummary } from '../../services/chat';
import type { AccountRole } from '../../services/types';
import ChatWorkspaceHeader from './workspace/ChatWorkspaceHeader';
import ChatInboxPanel from './workspace/ChatInboxPanel';
import ChatThreadPanel from './workspace/ChatThreadPanel';

interface ChatWorkspaceProps {
    role: AccountRole;
    title: string;
    subtitle: string;
    basePath: string;
    emptyMessage: string;
}

interface ChatRouteState {
    orderTitle?: string;
    partnerName?: string;
    customerName?: string;
    driverName?: string;
}

const ChatWorkspace = ({ role, title, subtitle, basePath, emptyMessage }: ChatWorkspaceProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ orderId?: string }>();
    const { user } = useAuth();
    const [draft, setDraft] = useState('');
    const routeState = (location.state ?? {}) as ChatRouteState;
    const chatStoreVersion = useSyncExternalStore(
        chatService.subscribe,
        chatService.getStoreVersion,
        chatService.getStoreVersion,
    );

    const conversations = useMemo(() => {
        if (!user) {
            return [];
        }

        return chatService.listConversations(role, user.id);
    }, [chatStoreVersion, role, user]);

    const selectedOrderId = params.orderId ?? null;
    const selectedConversation = useMemo(() => {
        if (!user || !selectedOrderId) {
            return null;
        }

        return chatService.getConversation(role, user.id, selectedOrderId);
    }, [chatStoreVersion, role, selectedOrderId, user]);

    useEffect(() => {
        if (!user || !selectedOrderId) {
            return;
        }

        chatService.ensureConversation(role, user.id, selectedOrderId, {
            orderTitle: routeState.orderTitle,
            partnerName: routeState.partnerName,
            customerName: routeState.customerName,
            driverName: routeState.driverName,
        });
    }, [role, routeState.customerName, routeState.driverName, routeState.orderTitle, routeState.partnerName, selectedOrderId, user]);

    useEffect(() => {
        if (!user || !selectedOrderId) {
            return;
        }

        chatService.markConversationRead(role, user.id, selectedOrderId);
    }, [role, selectedOrderId, user]);

    const unreadCount = user ? chatService.getUnreadCount(role, user.id) : 0;
    const recipientName = selectedConversation?.partnerName ?? routeState.partnerName ?? 'Recipient';
    const conversationTitle = selectedConversation?.orderTitle ?? routeState.orderTitle ?? 'Order';

    const handleOpenConversation = (conversation: ChatConversationSummary) => {
        if (user && conversation.unreadCount[role] > 0) {
            chatService.markConversationRead(role, user.id, conversation.orderId);
        }

        navigate(`${basePath}/${conversation.orderId}`, {
            state: {
                orderTitle: conversation.orderTitle,
                partnerName: conversation.partnerName,
                customerName: conversation.customerName,
                driverName: conversation.driverName,
            },
        });
    };

    const handleBackToInbox = () => {
        navigate(basePath);
    };

    const handleSend = () => {
        if (!user || !selectedOrderId) {
            return;
        }

        const updatedConversation = chatService.sendMessage(role, user.id, selectedOrderId, draft);

        if (!updatedConversation) {
            return;
        }

        setDraft('');
    };

    if (!user) {
        return null;
    }

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 1200,
                mx: 'auto',
                px: { xs: 2, sm: 3 },
                py: { xs: 2.5, sm: 3 },
            }}
        >
            <Stack spacing={2}>
                <ChatWorkspaceHeader
                    unreadCount={unreadCount}
                    showBackButton={location.pathname !== basePath}
                    onBackToInbox={handleBackToInbox}
                />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: isDesktop ? '360px minmax(0, 1fr)' : '1fr',
                        gap: 2,
                    }}
                >
                    {isDesktop || !selectedOrderId ? (
                        <ChatInboxPanel
                            title={title}
                            subtitle={subtitle}
                            emptyMessage={emptyMessage}
                            role={role}
                            selectedOrderId={selectedOrderId}
                            conversations={conversations}
                            onOpenConversation={handleOpenConversation}
                        />
                    ) : null}
                    {isDesktop || selectedOrderId ? (
                        <ChatThreadPanel
                            isDesktop={isDesktop}
                            role={role}
                            userId={user.id}
                            selectedConversation={selectedConversation}
                            recipientName={recipientName}
                            conversationTitle={conversationTitle}
                            draft={draft}
                            onDraftChange={setDraft}
                            onBackToInbox={handleBackToInbox}
                            onSend={handleSend}
                        />
                    ) : null}
                </Box>
            </Stack>
        </Box>
    );
};

export default ChatWorkspace;
