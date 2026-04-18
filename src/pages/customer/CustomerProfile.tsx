import {
    Box,
    Button,
    Card,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const CustomerProfile = () => {
    const { user, logout } = useAuth();

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 680,
                mx: 'auto',
                px: { xs: 2, sm: 3 },
                py: { xs: 2.5, sm: 3 },
            }}
        >
            <Stack spacing={2.5}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={600}>
                        Profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage account details
                    </Typography>
                </Stack>

                <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack spacing={1.5}>
                        <TextField label="Name" value={user?.name ?? ''} size="small" fullWidth disabled />
                        <TextField label="Email" value={user?.email ?? ''} size="small" fullWidth disabled />
                        <Button variant="contained" color="error" startIcon={<LogoutOutlined />} onClick={logout}>
                            Logout
                        </Button>
                    </Stack>
                </Card>
            </Stack>
        </Box>
    );
};

export default CustomerProfile;
