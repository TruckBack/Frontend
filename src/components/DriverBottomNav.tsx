import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    BottomNavigation,
    BottomNavigationAction,
    useTheme,
} from '@mui/material';
import {
    ElectricBoltOutlined,
    HistoryOutlined,
    MapOutlined,
    PersonOutlined,
} from '@mui/icons-material';

const DriverBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const getValue = () => {
        switch (location.pathname) {
            case '/driver/home':
                return 'active';
            case '/driver/past':
                return 'past';
            case '/driver/map':
                return 'map';
            case '/driver/profile':
                return 'profile';
            default:
                return 'active';
        }
    };

    const handleChange = (newValue: string) => {
        switch (newValue) {
            case 'active':
                navigate('/driver/home');
                break;
            case 'past':
                navigate('/driver/past');
                break;
            case 'map':
                navigate('/driver/map');
                break;
            case 'profile':
                navigate('/driver/profile');
                break;
        }
    };

    const currentValue = getValue();

    const navActions = [
        { label: 'Active', value: 'active', icon: <ElectricBoltOutlined /> },
        { label: 'Past', value: 'past', icon: <HistoryOutlined /> },
        { label: 'Map', value: 'map', icon: <MapOutlined /> },
        { label: 'Profile', value: 'profile', icon: <PersonOutlined /> },
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
                    backgroundColor: theme.palette.action.hover,
                }}
            >
                <BottomNavigation
                    value={currentValue}
                    onChange={(_, newValue) => handleChange(newValue)}
                    sx={{
                        backgroundColor: theme.palette.action.hover,
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
                    backgroundColor: theme.palette.action.hover,
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
                        backgroundColor: theme.palette.action.hover,
                    }}
                >
                    {navActions.map((action) => (
                        <BottomNavigationAction
                            key={action.value}
                            label={action.label}
                            value={action.value}
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
                                '& .MuiBadge-badge': {
                                    fontWeight: 700,
                                    fontSize: '0.65rem',
                                },
                            }}
                            icon={action.icon}
                        />
                    ))}
                </BottomNavigation>
            </Box>
        </>
    );
};

export default DriverBottomNav;
