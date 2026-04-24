import { FavoriteBorder } from '@mui/icons-material';
import { Box, Card, Stack, Typography, useTheme } from '@mui/material';

export interface PastDelivery {
    id: string;
    customerName: string;
    price: number;
    category: string;
    weight: string;
    distance: string;
    completedDate: string;
    rating?: number;
}

interface PastDeliveryCardProps {
    delivery: PastDelivery;
}

export default function PastDeliveryCard({ delivery }: PastDeliveryCardProps) {
    const theme = useTheme();

    return (
        <Card
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

            {delivery.rating ? (
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        Rating:
                    </Typography>
                    {Array.from({ length: delivery.rating }).map((_, index) => (
                        <Box
                            key={`${delivery.id}-rating-${index}`}
                            sx={{
                                color: theme.palette.warning.main,
                                fontSize: '0.875rem',
                            }}
                        >
                            ★
                        </Box>
                    ))}
                </Stack>
            ) : null}
        </Card>
    );
}
