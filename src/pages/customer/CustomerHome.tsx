import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CustomerBottomNav from '../../components/CustomerBottomNav';

const CustomerHome = () => {
    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CustomerBottomNav />
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    ml: { xs: 0, md: '76px' },
                    pb: { xs: 'calc(56px + env(safe-area-inset-bottom))', md: 0 },
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default CustomerHome;
