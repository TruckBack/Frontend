import { Box, Button, Stack, Typography } from '@mui/material';

interface ChatWorkspaceHeaderProps {
    unreadCount: number;
    showBackButton: boolean;
    onBackToInbox: () => void;
}

export default function ChatWorkspaceHeader({
    unreadCount,
    showBackButton,
    onBackToInbox,
}: ChatWorkspaceHeaderProps) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
                <Typography variant="h5" fontWeight={800}>
                    Messages
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {unreadCount > 0
                        ? `${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`
                        : 'All caught up'}
                </Typography>
            </Box>
            {showBackButton ? (
                <Button variant="text" onClick={onBackToInbox} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                    Back to inbox
                </Button>
            ) : null}
        </Stack>
    );
}
