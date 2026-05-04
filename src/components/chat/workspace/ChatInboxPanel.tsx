import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { ConversationSummary } from "../../../services/chat";
import { formatChatTime } from "./chatFormatters";

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

function getInitials(orderId: number): string {
  return `#${orderId}`;
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
        overflow: "hidden",
        minHeight: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {subtitle}
        </Typography>
      </Box>
      <Divider />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : conversations.length > 0 ? (
        <List
          disablePadding
          sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 1, py: 0.5 }}
        >
          {conversations.map((conversation) => {
            const unread = conversation.unread_count;
            const lastBody =
              conversation.last_message?.body ?? "No messages yet";
            const lastTime = conversation.updated_at;
            const isSelected = conversation.order_id === selectedOrderId;

            return (
              <ListItemButton
                key={conversation.id}
                selected={isSelected}
                onClick={() => onOpenConversation(conversation)}
                sx={{
                  alignItems: "center",
                  py: 1.25,
                  px: 1.5,
                  mb: 0.25,
                  borderRadius: 2,
                  borderLeft: isSelected
                    ? "3px solid"
                    : "3px solid transparent",
                  borderLeftColor: isSelected ? "primary.main" : "transparent",
                  bgcolor: isSelected ? "action.selected" : "transparent",
                  transition: "background-color 0.15s, border-color 0.15s",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Avatar
                  sx={{
                    mr: 1.5,
                    width: 40,
                    height: 40,
                    bgcolor: isSelected ? "primary.main" : "action.selected",
                    color: isSelected ? "common.white" : "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(conversation.order_id)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 0.3 }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} noWrap>
                      Order #{conversation.order_id}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ flexShrink: 0, ml: 1 }}
                    >
                      {formatChatTime(lastTime)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ flex: 1, fontSize: "0.78rem" }}
                    >
                      {lastBody}
                    </Typography>
                    {unread > 0 && (
                      <Box
                        sx={{
                          ml: 1,
                          minWidth: 20,
                          height: 20,
                          px: 0.75,
                          borderRadius: 99,
                          bgcolor: "primary.main",
                          color: "common.white",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {unread}
                      </Box>
                    )}
                  </Stack>
                </Box>
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
