import {
    Box,
    Card,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import {
    Add,
    AccessTime,
    VerifiedUserOutlined,
    Equalizer,
    MonetizationOnOutlined,
} from '@mui/icons-material';

const CustomerDashboard = () => {
    const features = [
        {
            title: 'Fast Delivery',
            description: 'Same-day delivery available',
            icon: <AccessTime fontSize="small" />,
        },
        {
            title: 'Trusted Drivers',
            description: 'Verified & insured drivers',
            icon: <VerifiedUserOutlined fontSize="small" />,
        },
        {
            title: 'Track Live',
            description: 'Real-time GPS tracking',
            icon: <Equalizer fontSize="small" />,
        },
        {
            title: 'Fair Pricing',
            description: 'Transparent cost estimates',
            icon: <MonetizationOnOutlined fontSize="small" />,
        },
    ];

    const recentOrders = [
        { id: '1', title: 'Furniture Delivery', status: 'Delivered', from: 'Downtown', to: 'Uptown' },
        { id: '2', title: 'Groceries', status: 'On Route', from: 'Westside', to: 'North Park' },
    ];

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
                    <Typography variant="h4" fontWeight={700}>
                        Welcome Back!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Request a delivery in minutes
                    </Typography>
                </Stack>

                <Card
                    sx={{
                        p: 2,
                        borderRadius: 2.5,
                        background: (theme) => `linear-gradient(120deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
                        color: 'common.white',
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                        <Stack spacing={1}>
                            <Typography variant="h6" fontWeight={700}>
                                Request a Delivery
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.95 }}>
                                Get your items delivered quickly and safely
                            </Typography>
                        </Stack>
                        <IconButton
                            aria-label="new delivery"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'common.white',
                                width: 48,
                                height: 48,
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                },
                            }}
                        >
                            <Add />
                        </IconButton>
                    </Stack>
                </Card>

                <Stack spacing={1.5}>
                    <Typography variant="h6" fontWeight={600}>
                        Why Choose TruckBack?
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                            gap: 1.5,
                        }}
                    >
                        {features.map((feature) => (
                            <Card
                                key={feature.title}
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    minHeight: 132,
                                }}
                            >
                                <Stack spacing={1.25}>
                                    <Box
                                        sx={{
                                            width: 34,
                                            height: 34,
                                            borderRadius: 1.5,
                                            bgcolor: 'action.hover',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Stack>
                            </Card>
                        ))}
                    </Box>
                </Stack>

                <Stack spacing={1.5}>
                    <Typography variant="h6" fontWeight={600}>
                        Recent Orders
                    </Typography>
                    <Stack spacing={1.5}>
                        {recentOrders.map((order) => (
                            <Card key={order.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {order.title}
                                    </Typography>
                                    <Typography variant="caption" color="success.main" fontWeight={600}>
                                        {order.status}
                                    </Typography>
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                    {order.from} {'->'} {order.to}
                                </Typography>
                            </Card>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export default CustomerDashboard;
