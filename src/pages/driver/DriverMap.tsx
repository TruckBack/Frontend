import {
    Box,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { MapOutlined } from '@mui/icons-material';

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
                minHeight: { xs: 'auto', sm: 'calc(100dvh - 120px)' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
                <Stack sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600}>
                        Delivery Map
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View your active deliveries on the map
                    </Typography>
                </Stack>

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
