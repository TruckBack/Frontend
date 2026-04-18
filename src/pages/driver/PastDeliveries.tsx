import {
    Box,
    Card,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';

interface PastDelivery {
    id: string;
    customerName: string;
    price: number;
    category: string;
    weight: string;
    distance: string;
    completedDate: string;
    rating?: number;
}

const mockPastDeliveries: PastDelivery[] = [
    {
        id: '1',
        customerName: 'John Smith',
        price: 35.0,
        category: 'Documents',
        weight: '2 kg',
        distance: '5.3 miles',
        completedDate: 'Today at 2:30 PM',
        rating: 5,
    },
    {
        id: '2',
        customerName: 'Emma Davis',
        price: 50.0,
        category: 'Groceries',
        weight: '12 kg',
        distance: '8.7 miles',
        completedDate: 'Yesterday',
        rating: 4,
    },
];

const PastDeliveries = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 680,
                mx: 'auto',
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 3 },
                boxSizing: 'border-box',
                height: { xs: 'calc(100dvh - 56px)', md: '100dvh' },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Stack sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                    Past Deliveries
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Your completed delivery history
                </Typography>
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
                <Stack spacing={2}>
                    {mockPastDeliveries.map((delivery) => (
                        <Card
                            key={delivery.id}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                borderLeft: `4px solid ${theme.palette.success.main}`,
                            }}
                        >
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                sx={{ mb: 2 }}
                            >
                                <Stack spacing={0.5}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {delivery.customerName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {delivery.completedDate}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <FavoriteBorder
                                        sx={{
                                            fontSize: { xs: 20, sm: 24 },
                                            color: theme.palette.text.secondary,
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        ${delivery.price.toFixed(2)}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                {delivery.category} • {delivery.weight} • {delivery.distance}
                            </Typography>

                            {delivery.rating && (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="caption" color="text.secondary">
                                        Rating:
                                    </Typography>
                                    {Array.from({ length: delivery.rating }).map((_, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                color: theme.palette.warning.main,
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            ★
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Card>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default PastDeliveries;
