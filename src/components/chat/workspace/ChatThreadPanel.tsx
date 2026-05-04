import { useEffect, useRef } from "react";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import MessageOutlined from "@mui/icons-material/MessageOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
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
} from "@mui/material";
import type { ChatMessage } from "../../../services/chat";
import { formatChatTime } from "./chatFormatters";

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
  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const hasAutoScrolledOnOpenRef = useRef(false);

  useEffect(() => {
    hasAutoScrolledOnOpenRef.current = false;
  }, [conversationTitle]);

  useEffect(() => {
    if (!conversationTitle || loading || error || hasAutoScrolledOnOpenRef.current)
      return;

    requestAnimationFrame(() => {
      const viewport = messageViewportRef.current;
      if (!viewport) return;
      viewport.scrollTop = viewport.scrollHeight;
      hasAutoScrolledOnOpenRef.current = true;
    });
  }, [conversationTitle, loading, error, messages.length]);

  if (!conversationTitle) {
    return (
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          minHeight: { md: "72dvh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack
          spacing={1.5}
          alignItems="center"
          textAlign="center"
          sx={{ maxWidth: 360 }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "action.hover",
              color: "text.secondary",
            }}
          >
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
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, flexShrink: 0 }}>
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

      {/* Body (loading/error/messages) */}
      <Box
        ref={messageViewportRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehavior: "contain",
          p: 2.5,
        }}
      >
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loading ? (
            <CircularProgress sx={{ alignSelf: "center", my: 4 }} />
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          ) : (
            messages.map((message, index) => {
              const isOutgoing = message.sender_id === userId;
              const previousMessage = index > 0 ? messages[index - 1] : null;
              const nextMessage =
                index < messages.length - 1 ? messages[index + 1] : null;

              const isFirstInGroup =
                !previousMessage ||
                previousMessage.sender_id !== message.sender_id;

              const isLastInGroup =
                !nextMessage || nextMessage.sender_id !== message.sender_id;

              return (
                <Stack
                  key={message.id}
                  direction="column"
                  alignItems={isOutgoing ? "flex-end" : "flex-start"}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      p: 1.25,
                      borderRadius: 3,
                      borderTopLeftRadius: isOutgoing || !isFirstInGroup ? 3 : 0,
                      borderTopRightRadius: !isOutgoing || !isFirstInGroup ? 3 : 0,
                      borderBottomLeftRadius: isOutgoing || !isLastInGroup ? 3 : 0,
                      borderBottomRightRadius:
                        !isOutgoing || !isLastInGroup ? 3 : 0,
                      maxWidth: "80%",
                      bgcolor: isOutgoing ? "primary.main" : "background.paper",
                      color: isOutgoing ? "common.white" : "text.primary",
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {message.body}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: isOutgoing ? 0.75 : 0.6,
                          alignSelf: "flex-end",
                          fontSize: "0.68rem",
                        }}
                      >
                        {formatChatTime(message.created_at)}
                      </Typography>
                    </Stack>
                  </Card>
                </Stack>
              );
            })
          )}
        </Stack>
      </Box>

      {/* Footer Input */}
      <Divider />
      <Box sx={{ p: 2, bgcolor: "background.default", flexShrink: 0 }}>
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
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !sending &&
                draft.trim()
              ) {
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
            startIcon={
              sending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SendOutlined />
              )
            }
            sx={{ flexShrink: 0, minHeight: 56 }}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
