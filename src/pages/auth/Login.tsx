import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import {
    BadgeOutlined,
    Google,
    PhoneRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { AccountRole } from '../../services/types';

type AuthMode = 'login' | 'register';

const Login = () => {
    const [role, setRole] = useState<AccountRole>('driver');
    const [modeType, setModeType] = useState<AuthMode>('login');
    const [idNumber, setIdNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login, register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleRoleChange = (_event: React.MouseEvent<HTMLElement>, newRole: AccountRole | null) => {
        if (!newRole) {
            return;
        }

        setRole(newRole);
        setError(null);
    };

    const clearFormError = () => {
        if (error) {
            setError(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (modeType === 'login') {
                await login(idNumber, phoneNumber, role);
            } else {
                await register(idNumber, phoneNumber, email, role);
            }

            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle(role);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google login failed');
            setLoading(false);
        }
    };

    return (
        <Box
            sx={(theme) => ({
                minHeight: '100dvh',
                display: 'flex',
                boxSizing: 'border-box',
                position: 'relative',
                overflowX: 'hidden',
                overflowY: 'auto',
                justifyContent: 'center',
                alignContent: 'center',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, #08111f 0%, #0d1728 45%, #111827 100%)'
                    : 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 45%, #ffffff 100%)',
                px: { xs: 2, sm: 3, md: 4 },
            })}
        >
            <Stack
                paddingTop={0}
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: '430px',
                    mx: 'auto',
                    minHeight: '100%',
                    justifyContent: 'center',
                    py: { xs: 5, sm: 6 },
                }}
            >
                <Stack spacing={2.25}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" component="h1" fontWeight={700}>
                            Welcome to TruckBack
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                            {modeType === 'login' ? 'Login to continue' : 'Register to continue'}
                        </Typography>
                    </Box>

                    <ToggleButtonGroup
                        value={role}
                        exclusive
                        onChange={handleRoleChange}
                        fullWidth
                        aria-label="account role"
                        sx={{
                            borderRadius: 3,
                            p: 0.5,
                            bgcolor: 'action.hover',
                            '& .MuiToggleButtonGroup-grouped': {
                                border: 0,
                                borderRadius: 2,
                                py: 1.1,
                                fontWeight: 600,
                            },
                        }}
                    >
                        <ToggleButton value="driver" aria-label="driver">
                            Driver
                        </ToggleButton>
                        <ToggleButton value="customer" aria-label="customer">
                            Customer
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Google />}
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                        }}
                    >
                        Sign in with Google
                    </Button>

                    <Divider>
                        <Typography variant="body2" color="text.secondary">
                            Or continue with
                        </Typography>
                    </Divider>

                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                                    ID Number
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter your ID"
                                    value={idNumber}
                                    onChange={(event) => {
                                        setIdNumber(event.target.value);
                                        clearFormError();
                                    }}
                                    required
                                    autoComplete="username"
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeOutlined color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                                    Phone Number
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="+1-555-0123"
                                    value={phoneNumber}
                                    onChange={(event) => {
                                        setPhoneNumber(event.target.value);
                                        clearFormError();
                                    }}
                                    required
                                    autoComplete={modeType === 'login' ? 'current-password' : 'new-password'}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneRounded color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            {modeType === 'register' && (
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                                        Email
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        placeholder="example@truckback.app"
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                            clearFormError();
                                        }}
                                        required
                                        autoComplete="email"
                                        disabled={loading}
                                    />
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading || !idNumber || !phoneNumber || (modeType === 'register' && !email)}
                                sx={{ mt: 2, py: 1.5, borderRadius: 2.5 }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : modeType === 'login' ? (
                                    'Login'
                                ) : (
                                    'Register'
                                )}
                            </Button>

                            <Typography textAlign="center" variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                {modeType === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                                <Button
                                    type="button"
                                    variant="text"
                                    onClick={() => {
                                        setModeType(modeType === 'login' ? 'register' : 'login');
                                        clearFormError();
                                    }}
                                    disabled={loading}
                                    sx={{ minWidth: 0, p: 0, fontWeight: 700, verticalAlign: 'baseline' }}
                                >
                                    {modeType === 'login' ? 'Register' : 'Login'}
                                </Button>
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Login;
