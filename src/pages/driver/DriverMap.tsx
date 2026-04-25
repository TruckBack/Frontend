import {
    Box,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { MapOutlined } from '@mui/icons-material';
import PageHeader from '../../components/shared/PageHeader';

const DriverMap = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 680,
                mx: 'auto',
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 3 },
                pb: { xs: 10, md: 3 },
            }}
        >
            <PageHeader
                title="Delivery Map"
                subtitle="View your active deliveries on the map"
            />

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    aspectRatio: '1',
                    borderRadius: 2,
                    backgroundColor: theme.palette.action.hover,
                    border: `2px dashed ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <MapOutlined
                    sx={{
                        fontSize: 64,
                        color: theme.palette.text.secondary,
                    }}
                />
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ px: 2 }}>
                    Map integration coming soon
                </Typography>
            </Box>
        </Box>
    );
};

export default DriverMap;
