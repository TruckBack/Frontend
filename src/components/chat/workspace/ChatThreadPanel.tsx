import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import MessageOutlined from '@mui/icons-material/MessageOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import type { ChatConversation } from '../../../services/chat';
import { formatChatTime } from './chatFormatters';

interface ChatThreadPanelProps {
    isDesktop: boolean;
    role: 'customer' | 'driver';
    userId: string;
    selectedConversation: ChatConversation | null;
    recipientName: string;
    conversationTitle: string;
    draft: string;
    onDraftChange: (value: string) => void;
    onBackToInbox: () => void;
    onSend: () => void;
}

export default function ChatThreadPanel({
    isDesktop,
    role,
    userId,
    selectedConversation,
    recipientName,
    conversationTitle,
    draft,
    onDraftChange,
    onBackToInbox,
    onSend,
}: ChatThreadPanelProps) {
    const theme = useTheme();

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
                        const isOutgoing = message.senderRole === role && message.senderId === userId;

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
                                            {formatChatTime(message.createdAt)}
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
                        minRows={1}
                        maxRows={4}
                        placeholder="Write a message"
                        value={draft}
                        onChange={(event) => onDraftChange(event.target.value)}
                    />
                    <Button
                        variant="contained"
                        onClick={onSend}
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
}
