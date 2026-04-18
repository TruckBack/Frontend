import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    BottomNavigation,
    BottomNavigationAction,
    useTheme,
} from '@mui/material';
import {
    HomeOutlined,
    Add,
    AssignmentOutlined,
    PersonOutline,
} from '@mui/icons-material';

const CustomerBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const getValue = () => {
        switch (location.pathname) {
            case '/customer/home':
                return 'home';
            case '/customer/new-order':
                return 'new-order';
            case '/customer/orders':
                return 'orders';
            case '/customer/profile':
                return 'profile';
            default:
                return 'home';
        }
    };

    const handleChange = (newValue: string) => {
        switch (newValue) {
            case 'home':
                navigate('/customer/home');
                break;
            case 'new-order':
                navigate('/customer/new-order');
                break;
            case 'orders':
                navigate('/customer/orders');
                break;
            case 'profile':
                navigate('/customer/profile');
                break;
        }
    };

    const currentValue = getValue();
    const navSurface = theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200];

    const navActions = [
        { label: 'Home', value: 'home', icon: <HomeOutlined /> },
        { label: 'New Order', value: 'new-order', icon: <Add /> },
        { label: 'My Orders', value: 'orders', icon: <AssignmentOutlined /> },
        { label: 'Profile', value: 'profile', icon: <PersonOutline /> },
    ];

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
                    backgroundColor: navSurface,
                    pb: 'env(safe-area-inset-bottom)',
                }}
            >
                <BottomNavigation
                    value={currentValue}
                    onChange={(_, newValue) => handleChange(newValue)}
                    sx={{
                        height: 56,
                        backgroundColor: navSurface,
                    }}
                >
                    {navActions.map((action) => (
                        <BottomNavigationAction
                            key={action.value}
                            label={action.label}
                            value={action.value}
                            icon={action.icon}
                            sx={{
                                color: currentValue === action.value ? theme.palette.primary.main : 'inherit',
                                '& .MuiBottomNavigationAction-label': {
                                    fontSize: '0.75rem',
                                    marginTop: '4px',
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
                    backgroundColor: navSurface,
                }}
            >
                <BottomNavigation
                    value={currentValue}
                    onChange={(_, newValue) => handleChange(newValue)}
                    sx={{
                        height: '100%',
                        minHeight: '100dvh',
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        py: 1.25,
                        gap: 1,
                        backgroundColor: navSurface,
                    }}
                >
                    {navActions.map((action) => (
                        <BottomNavigationAction
                            key={action.value}
                            label={action.label}
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
                                '& .MuiBottomNavigationAction-label': {
                                    display: 'none',
                                },
                            }}
                        />
                    ))}
                </BottomNavigation>
            </Box>
        </>
    );
};

export default CustomerBottomNav;
