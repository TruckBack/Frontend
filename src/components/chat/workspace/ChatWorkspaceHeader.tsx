import { ChatBubbleOutlineRounded } from "@mui/icons-material";
import { Box, Chip, Stack, Typography } from "@mui/material";

interface ChatWorkspaceHeaderProps {
  unreadCount: number;
  showBackButton: boolean;
  onBackToInbox: () => void;
}

export default function ChatWorkspaceHeader({
  unreadCount,
}: ChatWorkspaceHeaderProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ChatBubbleOutlineRounded
          sx={{ color: "common.white", fontSize: 20 }}
        />
      </Box>
      <Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" fontWeight={800}>
            Messages
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={unreadCount}
              size="small"
              sx={{
                height: 20,
                bgcolor: "primary.main",
                color: "common.white",
                fontWeight: 700,
                fontSize: "0.7rem",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {unreadCount > 0
            ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
            : "All caught up"}
        </Typography>
      </Box>
    </Stack>
  );
}
