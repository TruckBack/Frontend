import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import {
    AccessTime,
    AssignmentTurnedInOutlined,
    CalendarToday,
    MonetizationOnOutlined,
    Inventory2Outlined,
    LocationOn,
} from '@mui/icons-material';

const CustomerNewOrder = () => {
    const theme = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
        { id: 1, label: 'Location' },
        { id: 2, label: 'Package' },
        { id: 3, label: 'Price' },
        { id: 4, label: 'Summary' },
    ];

    const handleContinue = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 680,
                mx: 'auto',
                px: { xs: 2, sm: 3 },
                py: { xs: 2.5, sm: 3 },
                boxSizing: 'border-box',
                height: { xs: 'calc(100dvh - 56px - env(safe-area-inset-bottom))', md: '100dvh' },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Stack
                spacing={2.5}
                sx={{
                    backgroundColor: 'background.default',
                    zIndex: 1,
                    pb: 1.5,
                }}
            >
                <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={600}>
                        Request a Delivery
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Fill in the details for your delivery order
                    </Typography>
                </Stack>

                <Stack spacing={0.75}>
                    <Box
                        sx={{
                            position: 'relative',
                            px: 2,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 24,
                                right: 24,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                height: '1px',
                                bgcolor: 'divider',
                            }}
                        />
                        <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                            {steps.map((step) => (
                                <Box
                                    key={`circle-${step.id}`}
                                    onClick={() => setCurrentStep(step.id)}
                                    sx={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: step.id === currentStep
                                            ? 'primary.main'
                                            : (theme) => (theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300]),
                                        color: step.id === currentStep ? 'primary.contrastText' : 'text.secondary',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {step.id}
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    <Stack direction="row" justifyContent="space-between" sx={{ px: 0.25 }}>
                        {steps.map((step) => (
                            <Typography
                                key={`label-${step.id}`}
                                variant="caption"
                                sx={{
                                    width: 68,
                                    textAlign: 'center',
                                    color: step.id === currentStep ? 'primary.main' : 'text.secondary',
                                    fontWeight: step.id === currentStep ? 600 : 500,
                                }}
                            >
                                {step.label}
                            </Typography>
                        ))}
                    </Stack>
                </Stack>

            </Stack>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    pr: { xs: 0, sm: 0.5 },
                    pb: 1,
                }}
            >
                <Stack spacing={2.5}>

                {currentStep === 1 && (
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LocationOn color="primary" fontSize="small" />
                                <Typography variant="h6" fontWeight={600} color="primary.main">
                                    Delivery Details
                                </Typography>
                            </Stack>

                            <TextField
                                placeholder="Pickup address..."
                                size="small"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOn color="success" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                placeholder="Delivery address..."
                                size="small"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOn color="primary" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Stack spacing={1}>
                                <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                                    Preferred Date
                                </Typography>
                                <TextField
                                    type="date"
                                    size="small"
                                    fullWidth
                                    defaultValue="2025-12-28"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CalendarToday fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Stack>

                            <Stack direction="row" spacing={1.5}>
                                <Stack spacing={1} sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                                        Pickup Time:
                                    </Typography>
                                    <TextField
                                        type="time"
                                        size="small"
                                        fullWidth
                                        defaultValue="19:00"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <AccessTime fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>
                                <Stack spacing={1} sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                                        Delivery By:
                                    </Typography>
                                    <TextField
                                        type="time"
                                        size="small"
                                        fullWidth
                                        defaultValue="19:00"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <AccessTime fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Card>
                )}

                {currentStep === 2 && (
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Inventory2Outlined color="primary" fontSize="small" />
                                <Typography variant="h6" fontWeight={600} color="primary.main">
                                    Package Information
                                </Typography>
                            </Stack>

                            <Stack spacing={0.75}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Package Type
                                </Typography>
                                <TextField select size="small" fullWidth defaultValue="">
                                    <MenuItem value="" disabled>Select package type</MenuItem>
                                    <MenuItem value="documents">Documents</MenuItem>
                                    <MenuItem value="electronics">Electronics</MenuItem>
                                    <MenuItem value="furniture">Furniture</MenuItem>
                                    <MenuItem value="grocery">Grocery</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </TextField>
                            </Stack>

                            <Stack spacing={0.75}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Weight (kg)
                                </Typography>
                                <TextField
                                    type="number"
                                    size="small"
                                    fullWidth
                                    placeholder="Enter weight"
                                />
                            </Stack>

                            <Stack spacing={0.75}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Dimensions (L x W x H cm)
                                </Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="e.g. 50 x 30 x 20"
                                />
                            </Stack>

                            <Stack spacing={0.75}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Special Instructions
                                </Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Any special handling instructions..."
                                    multiline
                                    minRows={4}
                                />
                            </Stack>
                        </Stack>
                    </Card>
                )}

                {currentStep === 3 && (
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <MonetizationOnOutlined color="secondary" fontSize="small" />
                                <Typography variant="h6" fontWeight={600} color="secondary.main">
                                    Budget & Payment
                                </Typography>
                            </Stack>

                            <Stack spacing={0.75}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Your Budget ($)
                                </Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Enter your budget"
                                    type="number"
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Suggested: $45.00
                                </Typography>
                            </Stack>

                            <Card
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    borderColor: 'primary.light',
                                    backgroundColor: 'action.hover',
                                }}
                            >
                                <Stack spacing={0.75}>
                                    <Typography variant="subtitle2" fontWeight={700}>
                                        What affects pricing:
                                    </Typography>
                                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                        <Typography component="li" variant="body2" color="text.secondary">
                                            Distance and route complexity
                                        </Typography>
                                        <Typography component="li" variant="body2" color="text.secondary">
                                            Package size and weight
                                        </Typography>
                                        <Typography component="li" variant="body2" color="text.secondary">
                                            Time sensitivity and urgency
                                        </Typography>
                                        <Typography component="li" variant="body2" color="text.secondary">
                                            Special handling requirements
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Card>

                            <Card
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    borderColor: 'success.light',
                                    backgroundColor: 'action.hover',
                                }}
                            >
                                <Typography variant="body2" color="success.main" fontWeight={500}>
                                    Tip: Higher budgets attract more drivers and faster pickups!
                                </Typography>
                            </Card>
                        </Stack>
                    </Card>
                )}

                {currentStep === 4 && (
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AssignmentTurnedInOutlined color="primary" fontSize="small" />
                                <Typography variant="h6" fontWeight={600} color="primary.main">
                                    Review Your Order
                                </Typography>
                            </Stack>

                            <Card
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    borderColor: 'success.light',
                                    backgroundColor: 'action.hover',
                                }}
                            >
                                <Stack spacing={1.25}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <LocationOn color="success" fontSize="small" />
                                        <Typography variant="subtitle1" fontWeight={600} color="success.main">
                                            Locations & Schedule
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={0.75}>
                                        <Stack spacing={0.25}>
                                            <Typography variant="caption" color="text.secondary">Pickup:</Typography>
                                            <Typography variant="body2" fontWeight={500}>Not specified</Typography>
                                        </Stack>
                                        <Stack spacing={0.25}>
                                            <Typography variant="caption" color="text.secondary">Delivery:</Typography>
                                            <Typography variant="body2" fontWeight={500}>Not specified</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={2}>
                                            <Stack spacing={0.25} sx={{ flex: 1 }}>
                                                <Typography variant="caption" color="text.secondary">Date:</Typography>
                                                <Typography variant="body2" fontWeight={500}>2025-12-28</Typography>
                                            </Stack>
                                            <Stack spacing={0.25} sx={{ flex: 1 }}>
                                                <Typography variant="caption" color="text.secondary">Time Window:</Typography>
                                                <Typography variant="body2" fontWeight={500}>19:00 - 19:00</Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Card>

                            <Card
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    borderColor: 'secondary.light',
                                    backgroundColor: 'action.hover',
                                }}
                            >
                                <Stack spacing={1.25}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Inventory2Outlined color="secondary" fontSize="small" />
                                        <Typography variant="subtitle1" fontWeight={600} color="secondary.main">
                                            Package Details
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                        <Stack spacing={0.25} sx={{ flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary">Type:</Typography>
                                            <Typography variant="body2" fontWeight={500}>Not specified</Typography>
                                        </Stack>
                                        <Stack spacing={0.25} sx={{ flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary">Weight:</Typography>
                                            <Typography variant="body2" fontWeight={500}>Not specified</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack spacing={0.25}>
                                        <Typography variant="caption" color="text.secondary">Dimensions:</Typography>
                                        <Typography variant="body2" fontWeight={500}>Not specified</Typography>
                                    </Stack>
                                </Stack>
                            </Card>

                            <Card
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    borderColor: 'success.light',
                                    backgroundColor: 'action.hover',
                                }}
                            >
                                <Stack spacing={1.25}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <MonetizationOnOutlined color="success" fontSize="small" />
                                        <Typography variant="subtitle1" fontWeight={600} color="success.main">
                                            Your Budget
                                        </Typography>
                                    </Stack>
                                    <Card variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" fontWeight={500}>Budget:</Typography>
                                            <Typography variant="body2" fontWeight={700} color="success.main">$0.00</Typography>
                                        </Stack>
                                    </Card>
                                </Stack>
                            </Card>
                        </Stack>
                    </Card>
                )}

                <Stack direction="row" spacing={1.25}>
                    {currentStep > 1 && (
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleBack}
                            sx={{
                                borderRadius: 2,
                                py: 1.2,
                                minWidth: 110,
                            }}
                        >
                            Back
                        </Button>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleContinue}
                        sx={{
                            borderRadius: 2,
                            py: 1.2,
                            background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                        }}
                    >
                        {currentStep === 4 ? 'Submit Order' : 'Continue'}
                    </Button>
                </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default CustomerNewOrder;
