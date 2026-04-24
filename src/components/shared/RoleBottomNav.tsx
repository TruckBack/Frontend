import type { ReactNode } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, useTheme } from '@mui/material';

export interface RoleNavAction {
    value: string;
    icon: ReactNode;
}

interface RoleBottomNavProps {
    actions: RoleNavAction[];
    currentValue: string;
    onChange: (newValue: string) => void;
    mobileSafeArea?: boolean;
    navSurface?: string;
}

export default function RoleBottomNav({
    actions,
    currentValue,
    onChange,
    mobileSafeArea = false,
    navSurface,
}: RoleBottomNavProps) {
    const theme = useTheme();
    const surface = navSurface ?? theme.palette.action.hover;

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: { xs: 'block', md: 'none' },
                    zIndex: 1100,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: surface,
                    pb: mobileSafeArea ? 'env(safe-area-inset-bottom)' : 0,
                }}
            >
                <BottomNavigation
                    value={currentValue}
                    onChange={(_, newValue) => onChange(newValue)}
                    sx={{
                        height: 56,
                        backgroundColor: surface,
                    }}
                >
                    {actions.map((action) => (
                        <BottomNavigationAction
                            key={action.value}
                            value={action.value}
                            icon={action.icon}
                            sx={{
                                color: currentValue === action.value ? theme.palette.primary.main : 'inherit',
                                '& .MuiBottomNavigationAction-label': {
                                    display: 'none',
                                },
                                '& .MuiBadge-badge': {
                                    fontWeight: 700,
                                    fontSize: '0.65rem',
                                },
                            }}
                        />
                    ))}
                </BottomNavigation>
            </Box>

            <Box
                sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 1200,
                    width: 76,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    backgroundColor: surface,
                }}
            >
                <BottomNavigation
                    value={currentValue}
                    onChange={(_, newValue) => onChange(newValue)}
                    sx={{
                        height: '100%',
                        minHeight: '100dvh',
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        py: 1.25,
                        gap: 1,
                        backgroundColor: surface,
                    }}
                >
                    {actions.map((action) => (
                        <BottomNavigationAction
                            key={action.value}
                            value={action.value}
                            icon={action.icon}
                            sx={{
                                flex: '0 0 auto',
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                minWidth: 0,
                                p: 0,
                                color: currentValue === action.value ? theme.palette.common.white : theme.palette.text.secondary,
                                bgcolor: currentValue === action.value ? theme.palette.common.black : 'transparent',
                                transition: 'all 0.2s ease',
                                '& .MuiSvgIcon-root': {
                                    fontSize: 24,
                                },
                                '&:hover': {
                                    bgcolor: currentValue === action.value ? theme.palette.common.black : theme.palette.action.selected,
                                },

                                '& .MuiBadge-badge': {
                                    fontWeight: 700,
                                    fontSize: '0.65rem',
                                },
                            }}
                        />
                    ))}
                </BottomNavigation>
            </Box>
        </>
    );
}
