import type { ReactNode } from 'react';
import { Box } from '@mui/material';

interface RoleShellProps {
    navigation: ReactNode;
    children: ReactNode;
    mobileBottomInset?: boolean;
}

export default function RoleShell({ navigation, children, mobileBottomInset = false }: RoleShellProps) {
    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {navigation}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    ml: { xs: 0, md: '76px' },
                    pb: { xs: mobileBottomInset ? 'calc(56px + env(safe-area-inset-bottom))' : 0, md: 0 },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
