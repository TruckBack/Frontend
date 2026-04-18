import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import DriverBottomNav from '../../components/DriverBottomNav';

const DriverHome = () => {
    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <DriverBottomNav />
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    ml: { xs: 0, md: '76px' },
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default DriverHome;
