import {
    Box,
    Button,
    Card,
    Stack,
    Typography,
    TextField,
    useTheme,
} from '@mui/material';
import { PersonOutlined, LogoutOutlined } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const DriverProfile = () => {
    const theme = useTheme();
    const { user, logout } = useAuth();

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
                <Stack sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your account settings
                    </Typography>
                </Stack>

                <Stack
                    alignItems="center"
                    sx={{
                        mb: 3,
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: theme.palette.action.hover,
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <PersonOutlined
                            sx={{
                                fontSize: 48,
                                color: 'white',
                            }}
                        />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                        {user?.name ?? 'Driver'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.email}
                    </Typography>
                </Stack>

                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Card sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={2}>
                            <TextField
                                label="Full Name"
                                value={user?.name ?? ''}
                                fullWidth
                                disabled
                                size="small"
                                variant="outlined"
                            />
                            <TextField
                                label="Email"
                                type="email"
                                value={user?.email ?? ''}
                                fullWidth
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Stack>
                    </Card>

                    <Card sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Delivery Statistics
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Completed
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        24
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Rating
                                    </Typography>
                                    <Stack direction="row" spacing={0.25}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    color: i < 4 ? theme.palette.warning.main : theme.palette.action.disabled,
                                                    fontSize: '1rem',
                                                }}
                                            >
                                                ★
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Stack>
                    </Card>
                </Stack>

                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<LogoutOutlined />}
                    onClick={logout}
                    sx={{
                        py: 1.5,
                        borderRadius: 1,
                    }}
                >
                    Logout
                </Button>
        </Box>
    );
};

export default DriverProfile;
