import MessageOutlined from '@mui/icons-material/MessageOutlined';
import {
    Alert,
    Avatar,
    Box,
    CircularProgress,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import type { ConversationSummary } from '../../../services/chat';
import { formatChatTime } from './chatFormatters';

interface ChatInboxPanelProps {
    title: string;
    subtitle: string;
    emptyMessage: string;
    loading: boolean;
    error: string | null;
    selectedOrderId: number | null;
    conversations: ConversationSummary[];
    onOpenConversation: (conversation: ConversationSummary) => void;
}

export default function ChatInboxPanel({
    title,
    subtitle,
    emptyMessage,
    loading,
    error,
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
                minHeight: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
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
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : error ? (
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : conversations.length > 0 ? (
                <List disablePadding sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                    {conversations.map((conversation) => {
                        const unread = conversation.unread_count;
                        const lastBody = conversation.last_message?.body ?? 'No messages yet';
                        const lastTime = conversation.updated_at;

                        return (
                            <ListItemButton
                                key={conversation.id}
                                selected={conversation.order_id === selectedOrderId}
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
                                                Order #{conversation.order_id}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatChatTime(lastTime)}
                                            </Typography>
                                        </Stack>
                                    }
                                    secondary={
                                        <Stack spacing={0.4} sx={{ mt: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {lastBody}
                                            </Typography>
                                            {unread > 0 ? (
                                                <Box
                                                    sx={{
                                                        alignSelf: 'flex-end',
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
