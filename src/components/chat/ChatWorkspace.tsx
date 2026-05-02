import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import {
  chatApi,
  openChatWebSocket,
  unreadStore,
  type ChatMessage,
  type ConversationSummary,
  type ConversationDetail,
  type WsEvent,
} from "../../services/chat";
import type { AccountRole } from "../../services/types";
import ChatInboxPanel from "./workspace/ChatInboxPanel";
import ChatThreadPanel from "./workspace/ChatThreadPanel";

interface ChatWorkspaceProps {
  role: AccountRole;
  title: string;
  subtitle: string;
  basePath: string;
  emptyMessage: string;
}

const ChatWorkspace = ({
  title,
  subtitle,
  basePath,
  emptyMessage,
}: ChatWorkspaceProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const params = useParams<{ orderId?: string }>();
  const { user } = useAuth();

  const selectedOrderId = params.orderId ? parseInt(params.orderId, 10) : null;
  const userId = user ? Number(user.id) : null;

  // -----------------------------------------------------------------------
  // Inbox state
  // -----------------------------------------------------------------------
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Thread state
  // -----------------------------------------------------------------------
  const [conversationDetail, setConversationDetail] =
    useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Compose state
  // -----------------------------------------------------------------------
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Whether the thread panel is currently visible (drives auto-mark-read on WS events)
  const threadVisibleRef = useRef(false);

  // -----------------------------------------------------------------------
  // Load inbox
  // -----------------------------------------------------------------------
  const loadInbox = useCallback(async () => {
    try {
      setInboxLoading(true);
      setInboxError(null);
      const list = await chatApi.listConversations();
      setConversations(list);
      unreadStore.setFromConversations(list);
    } catch {
      setInboxError("Failed to load conversations.");
    } finally {
      setInboxLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  // -----------------------------------------------------------------------
  // Load conversation thread when orderId changes
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!selectedOrderId) {
      setConversationDetail(null);
      setMessages([]);
      setThreadError(null);
      threadVisibleRef.current = false;
      return;
    }

    let cancelled = false;
    setThreadLoading(true);
    setThreadError(null);
    threadVisibleRef.current = true;
    setDraft("");

    chatApi
      .getConversation(selectedOrderId)
      .then(async (detail) => {
        if (cancelled) return;
        setConversationDetail(detail);
        setMessages(detail.messages);

        // Mark as read and update inbox unread counts
        try {
          const { marked_count } = await chatApi.markRead(selectedOrderId);
          if (marked_count > 0 && !cancelled) {
            setConversations((prev) =>
              prev.map((c) =>
                c.order_id === selectedOrderId ? { ...c, unread_count: 0 } : c,
              ),
            );
            unreadStore.decrementBy(marked_count);
          }
        } catch {
          // Non-critical — silently ignore mark-read failures
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = (err as { response?: { status?: number } }).response
          ?.status;
        if (status === 403) {
          setThreadError("You are not a participant in this conversation.");
        } else if (status === 404) {
          setThreadError("Order not found.");
        } else {
          setThreadError("Failed to load conversation.");
        }
      })
      .finally(() => {
        if (!cancelled) setThreadLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedOrderId]);

  // -----------------------------------------------------------------------
  // WebSocket — one connection per open thread
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!selectedOrderId || !userId) return;

    const cleanup = openChatWebSocket(selectedOrderId, (event: WsEvent) => {
      if (event.event_type === "new_message") {
        const msg = event.payload;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        // Update inbox last_message regardless
        setConversations((prev) =>
          prev.map((c) =>
            c.order_id === selectedOrderId
              ? { ...c, last_message: msg, updated_at: msg.created_at }
              : c,
          ),
        );

        if (threadVisibleRef.current) {
          // Thread open → mark as read immediately
          chatApi.markRead(selectedOrderId).catch(() => {
            /* best-effort */
          });
        } else {
          setConversations((prev) =>
            prev.map((c) =>
              c.order_id === selectedOrderId
                ? { ...c, unread_count: c.unread_count + 1 }
                : c,
            ),
          );
          unreadStore.increment();
        }
      } else if (event.event_type === "messages_read") {
        const { message_ids, read_by_user_id } = event.payload;
        if (read_by_user_id === userId) return;
        setMessages((prev) =>
          prev.map((m) =>
            message_ids.includes(m.id) ? { ...m, is_read: true } : m,
          ),
        );
      }
    });

    return cleanup;
  }, [selectedOrderId, userId]);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------
  const handleOpenConversation = (conversation: ConversationSummary) => {
    navigate(`${basePath}/${conversation.order_id}`);
  };

  const handleBackToInbox = () => {
    threadVisibleRef.current = false;
    navigate(basePath);
    // Refresh inbox so unread counts are accurate after leaving a thread
    loadInbox();
  };

  const handleSend = async () => {
    if (!selectedOrderId || !draft.trim() || sending || !userId) return;

    const body = draft.trim();
    const optimisticId = -Date.now(); // negative to distinguish from real server IDs
    const optimisticMsg: ChatMessage = {
      id: optimisticId,
      conversation_id: conversationDetail?.id ?? 0,
      sender_id: userId,
      sender: { id: userId, full_name: user?.full_name ?? "" },
      body,
      created_at: new Date().toISOString(),
      is_read: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setDraft("");
    setSending(true);
    setSendError(null);

    try {
      const real = await chatApi.sendMessage(selectedOrderId, body);
      // Replace optimistic entry with the authoritative server response
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);
        if (withoutOptimistic.some((m) => m.id === real.id))
          return withoutOptimistic;
        return [...withoutOptimistic, real];
      });
    } catch (err: unknown) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setDraft(body);
      const status = (err as { response?: { status?: number } }).response
        ?.status;
      setSendError(
        status === 422
          ? "Message cannot be empty."
          : "Failed to send message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  // Derive recipient name from loaded messages (first sender who is not the current user)
  const recipientName =
    messages.find((m) => m.sender_id !== userId)?.sender.full_name ??
    "Delivery partner";
  const conversationTitle = selectedOrderId ? `Order #${selectedOrderId}` : "";

  if (!user) return null;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 2.5, sm: 3 },
        minHeight: {
          xs: "calc(100dvh - 56px - env(safe-area-inset-bottom))",
          md: "100dvh",
        },
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "360px minmax(0, 1fr)" : "1fr",
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
              loading={inboxLoading}
              error={inboxError}
              selectedOrderId={selectedOrderId}
              conversations={conversations}
              onOpenConversation={handleOpenConversation}
            />
          ) : null}
          {isDesktop || selectedOrderId ? (
            <ChatThreadPanel
              isDesktop={isDesktop}
              userId={userId ?? 0}
              loading={threadLoading}
              error={threadError}
              messages={messages}
              recipientName={recipientName}
              conversationTitle={conversationTitle}
              draft={draft}
              sending={sending}
              sendError={sendError}
              onDraftChange={setDraft}
              onBackToInbox={handleBackToInbox}
              onSend={handleSend}
              onDismissSendError={() => setSendError(null)}
            />
          ) : null}
        </Box>
      </Stack>
    </Box>
  );
};

export default ChatWorkspace;
