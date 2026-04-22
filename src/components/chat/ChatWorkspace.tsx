import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import MessageOutlined from '@mui/icons-material/MessageOutlined';
import { useAuth } from '../../contexts/AuthContext';
import { chatService, type ChatConversationSummary } from '../../services/chat';
import type { AccountRole } from '../../services/types';

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

const formatTime = (value: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
    }).format(date);
};

const ChatWorkspace = ({ role, title, subtitle, basePath, emptyMessage }: ChatWorkspaceProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ orderId?: string }>();
    const { user } = useAuth();
    const [draft, setDraft] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const routeState = (location.state ?? {}) as ChatRouteState;

    const conversations = useMemo(() => {
        if (!user) {
            return [];
        }

        return chatService.listConversations(role, user.id);
    }, [refreshKey, role, user]);

    const selectedOrderId = params.orderId ?? null;
    const selectedConversation = useMemo(() => {
        if (!user || !selectedOrderId) {
            return null;
        }

        return chatService.getConversation(role, user.id, selectedOrderId);
    }, [refreshKey, role, selectedOrderId, user]);

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
        setRefreshKey((value) => value + 1);
    }, [role, routeState.customerName, routeState.driverName, routeState.orderTitle, routeState.partnerName, selectedOrderId, user]);

    useEffect(() => {
        if (!user || !selectedOrderId) {
            return;
        }

        chatService.markConversationRead(role, user.id, selectedOrderId);
        setRefreshKey((value) => value + 1);
    }, [role, selectedOrderId, user]);

    const unreadCount = user ? chatService.getUnreadCount(role, user.id) : 0;
    const recipientName = selectedConversation?.partnerName ?? routeState.partnerName ?? 'Recipient';
    const conversationTitle = selectedConversation?.orderTitle ?? routeState.orderTitle ?? 'Order';

    const handleOpenConversation = (conversation: ChatConversationSummary) => {
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
        setRefreshKey((value) => value + 1);
    };

    const renderInbox = () => (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                minHeight: { md: '72dvh' },
            }}
        >
            <Box sx={{ p: 2 }}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={700}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                </Stack>
            </Box>
            <Divider />
            {conversations.length > 0 ? (
                <List disablePadding>
                    {conversations.map((conversation) => {
                        const unread = conversation.unreadCount[role];

                        return (
                            <ListItemButton
                                key={conversation.orderId}
                                selected={conversation.orderId === selectedOrderId}
                                onClick={() => handleOpenConversation(conversation)}
                                sx={{ alignItems: 'flex-start', py: 1.5, px: 2 }}
                            >
                                <Avatar sx={{ mr: 1.5, width: 40, height: 40 }}>
                                    <MessageOutlined fontSize="small" />
                                </Avatar>
                                <ListItemText
                                    primary={
                                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                {conversation.orderTitle}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatTime(conversation.lastMessageAt)}
                                            </Typography>
                                        </Stack>
                                    }
                                    secondary={
                                        <Stack spacing={0.4} sx={{ mt: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {conversation.lastMessage}
                                            </Typography>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color="text.secondary">
                                                    {conversation.partnerName}
                                                </Typography>
                                                {unread > 0 ? (
                                                    <Box
                                                        sx={{
                                                            minWidth: 22,
                                                            height: 22,
                                                            px: 0.8,
                                                            borderRadius: 99,
                                                            bgcolor: 'error.main',
                                                            color: 'common.white',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {unread}
                                                    </Box>
                                                ) : null}
                                            </Stack>
                                        </Stack>
                                    }
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            ) : (
                <Box sx={{ p: 3 }}>
                    <Alert severity="info">{emptyMessage}</Alert>
                </Box>
            )}
        </Paper>
    );

    const renderThread = () => {
        if (!selectedConversation) {
            return (
                <Paper
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        minHeight: { md: '72dvh' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                    }}
                >
                    <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ maxWidth: 360 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'action.hover', color: 'text.secondary' }}>
                            <MessageOutlined />
                        </Avatar>
                        <Typography variant="h6" fontWeight={700}>
                            Select a conversation
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Open a delivery thread from the inbox to read messages and reply.
                        </Typography>
                    </Stack>
                </Paper>
            );
        }

        return (
            <Paper
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: { md: '72dvh' },
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        {!isDesktop ? (
                            <IconButton onClick={handleBackToInbox} edge="start">
                                <ArrowBackOutlined />
                            </IconButton>
                        ) : null}
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h6" fontWeight={700} noWrap>
                                {recipientName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {conversationTitle}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
                <Divider />
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        p: 2,
                        bgcolor: theme.palette.action.hover,
                    }}
                >
                    <Stack spacing={1.5}>
                        {selectedConversation.messages.map((message) => {
                            const isOutgoing = message.senderRole === role && message.senderId === user?.id;

                            return (
                                <Box
                                    key={message.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: isOutgoing ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <Card
                                        sx={{
                                            maxWidth: '82%',
                                            px: 1.5,
                                            py: 1.25,
                                            borderRadius: 2.5,
                                            bgcolor: isOutgoing ? theme.palette.primary.main : theme.palette.background.paper,
                                            color: isOutgoing ? 'common.white' : 'text.primary',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {message.body}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    opacity: isOutgoing ? 0.8 : 0.7,
                                                    alignSelf: 'flex-end',
                                                }}
                                            >
                                                {formatTime(message.createdAt)}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                </Box>
                            );
                        })}

                        {selectedConversation.messages.length === 0 ? (
                            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                                <Alert severity="info" sx={{ maxWidth: 380 }}>
                                    No messages yet. Start the conversation with {recipientName}.
                                </Alert>
                            </Box>
                        ) : null}
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-end">
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            maxRows={4}
                            placeholder="Write a message"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            disabled={!draft.trim()}
                            startIcon={<SendOutlined />}
                            sx={{ flexShrink: 0, minHeight: 56 }}
                        >
                            Send
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        );
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
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box>
                        <Typography variant="h5" fontWeight={800}>
                            Messages
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount === 1 ? '' : 's'}` : 'All caught up'}
                        </Typography>
                    </Box>
                    {location.pathname !== basePath ? (
                        <Button variant="text" onClick={handleBackToInbox} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                            Back to inbox
                        </Button>
                    ) : null}
                </Stack>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: isDesktop ? '360px minmax(0, 1fr)' : '1fr',
                        gap: 2,
                    }}
                >
                    {isDesktop || !selectedOrderId ? renderInbox() : null}
                    {isDesktop ? renderThread() : selectedOrderId ? renderThread() : null}
                </Box>
            </Stack>
        </Box>
    );
};

export default ChatWorkspace;
