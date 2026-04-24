import MessageOutlined from '@mui/icons-material/MessageOutlined';
import {
    Alert,
    Avatar,
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import type { AccountRole } from '../../../services/types';
import type { ChatConversationSummary } from '../../../services/chat';
import { formatChatTime } from './chatFormatters';

interface ChatInboxPanelProps {
    title: string;
    subtitle: string;
    emptyMessage: string;
    role: AccountRole;
    selectedOrderId: string | null;
    conversations: ChatConversationSummary[];
    onOpenConversation: (conversation: ChatConversationSummary) => void;
}

export default function ChatInboxPanel({
    title,
    subtitle,
    emptyMessage,
    role,
    selectedOrderId,
    conversations,
    onOpenConversation,
}: ChatInboxPanelProps) {
    return (
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
                                onClick={() => onOpenConversation(conversation)}
                                sx={{ alignItems: 'flex-start', py: 1.5, px: 2 }}
                            >
                                <Avatar sx={{ mr: 1.5, width: 40, height: 40 }}>
                                    <MessageOutlined fontSize="small" />
                                </Avatar>
                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                {conversation.orderTitle}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatChatTime(conversation.lastMessageAt)}
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
}
