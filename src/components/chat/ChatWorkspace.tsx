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
    const [draftsByOrderId, setDraftsByOrderId] = useState<Record<string, string>>({});
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
    const draft = selectedOrderId ? draftsByOrderId[selectedOrderId] ?? '' : '';
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

    useEffect(() => {
        if (!selectedOrderId) {
            return;
        }

        setDraftsByOrderId((previousDrafts) => {
            if (Object.prototype.hasOwnProperty.call(previousDrafts, selectedOrderId)) {
                return previousDrafts;
            }

            return {
                ...previousDrafts,
                [selectedOrderId]: '',
            };
        });
    }, [selectedOrderId]);

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

        setDraftsByOrderId((previousDrafts) => ({
            ...previousDrafts,
            [selectedOrderId]: '',
        }));
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
                minHeight: { xs: 'calc(100dvh - 56px - env(safe-area-inset-bottom))', md: '100dvh' },
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
            }}
        >
            <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: isDesktop ? '360px minmax(0, 1fr)' : '1fr',
                        gap: 2,
                        flex: 1,
                        minHeight: 0,
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
                            onDraftChange={(value) => {
                                if (!selectedOrderId) {
                                    return;
                                }

                                setDraftsByOrderId((previousDrafts) => ({
                                    ...previousDrafts,
                                    [selectedOrderId]: value,
                                }));
                            }}
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
