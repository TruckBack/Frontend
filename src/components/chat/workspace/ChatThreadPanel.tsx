import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import DoneAllOutlined from '@mui/icons-material/DoneAllOutlined';
import MessageOutlined from '@mui/icons-material/MessageOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import type { ChatMessage } from '../../../services/chat';
import { formatChatTime } from './chatFormatters';

interface ChatThreadPanelProps {
    isDesktop: boolean;
    userId: number;
    loading: boolean;
    error: string | null;
    messages: ChatMessage[];
    recipientName: string;
    conversationTitle: string;
    draft: string;
    sending: boolean;
    sendError: string | null;
    onDraftChange: (value: string) => void;
    onBackToInbox: () => void;
    onSend: () => void;
    onDismissSendError: () => void;
}

export default function ChatThreadPanel({
    isDesktop,
    userId,
    loading,
    error,
    messages,
    recipientName,
    conversationTitle,
    draft,
    sending,
    sendError,
    onDraftChange,
    onBackToInbox,
    onSend,
    onDismissSendError,
}: ChatThreadPanelProps) {
    const theme = useTheme();

    // Index of the last outgoing message that has been read by the other party
    const lastReadOutgoingIndex = (() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].sender_id === userId && messages[i].is_read) {
                return i;
            }
        }
        return -1;
    })();

    if (!conversationTitle) {
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
                borderRadius: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    {!isDesktop ? (
                        <IconButton onClick={onBackToInbox} edge="start">
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

            {/* Message list */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    p: 2,
                    bgcolor: theme.palette.action.hover,
                }}
            >
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mx: 'auto', maxWidth: 420 }}>
                        {error}
                    </Alert>
                ) : (
                    <Stack spacing={1.5}>
                        {messages.map((message, index) => {
                            const isOutgoing = message.sender_id === userId;
                            const showSeen = isOutgoing && index === lastReadOutgoingIndex;

                            return (
                                <Box
                                    key={message.id}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: isOutgoing ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <Card
                                        sx={{
                                            maxWidth: '82%',
                                            px: 1.5,
                                            py: 1.25,
                                            borderRadius: 2.5,
                                            bgcolor: isOutgoing
                                                ? theme.palette.primary.main
                                                : theme.palette.background.paper,
                                            color: isOutgoing ? 'common.white' : 'text.primary',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        <Stack spacing={0.5}>
                                            {!isOutgoing && (
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={600}
                                                    color="text.secondary"
                                                >
                                                    {message.sender.full_name}
                                                </Typography>
                                            )}
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
                                                {formatChatTime(message.created_at)}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                    {showSeen && (
                                        <Stack
                                            direction="row"
                                            spacing={0.4}
                                            alignItems="center"
                                            sx={{ mt: 0.25, mr: 0.5 }}
                                        >
                                            <DoneAllOutlined
                                                sx={{ fontSize: 14, color: 'primary.main' }}
                                            />
                                            <Typography variant="caption" color="primary.main">
                                                Seen
                                            </Typography>
                                        </Stack>
                                    )}
                                </Box>
                            );
                        })}

                        {messages.length === 0 && (
                            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                                <Alert severity="info" sx={{ maxWidth: 380 }}>
                                    No messages yet. Start the conversation with {recipientName}.
                                </Alert>
                            </Box>
                        )}
                    </Stack>
                )}
            </Box>

            {/* Compose bar */}
            <Divider />
            <Box sx={{ p: 2 }}>
                {sendError && (
                    <Alert
                        severity="error"
                        onClose={onDismissSendError}
                        sx={{ mb: 1, py: 0.5 }}
                    >
                        {sendError}
                    </Alert>
                )}
                <Stack direction="row" spacing={1} alignItems="flex-end">
                    <TextField
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={4}
                        placeholder="Write a message"
                        value={draft}
                        onChange={(event) => onDraftChange(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey && !sending && draft.trim()) {
                                event.preventDefault();
                                onSend();
                            }
                        }}
                        disabled={sending}
                    />
                    <Button
                        variant="contained"
                        onClick={onSend}
                        disabled={!draft.trim() || sending}
                        startIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendOutlined />}
                        sx={{ flexShrink: 0, minHeight: 56 }}
                    >
                        Send
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}
