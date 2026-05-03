import { useEffect, useState } from 'react';
import { ExpandMore, FavoriteBorder } from '@mui/icons-material';
import { Box, Card, Collapse, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { orderService } from '../../../services/order';
import type { Rating } from '../../../services/types';
import DriverRatingSection from '../DriverRatingSection';

export interface PastDelivery {
    id: string;
    orderId: number;
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
    const [expanded, setExpanded] = useState(false);
    const [rating, setRating] = useState<Rating | null | undefined>(undefined);

    // Fetch rating when user expands the card
    useEffect(() => {
        if (!expanded || rating !== undefined) return;
        orderService.getOrderRating(delivery.orderId)
            .then(r => setRating(r))
            .catch(() => setRating(null));
    }, [expanded, delivery.orderId, rating]);

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

            {/* Rating section toggle */}
            <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
                <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => setExpanded(e => !e)}
                >
                    {expanded ? 'Hide review' : 'Customer review'}
                </Typography>
                <IconButton
                    size="small"
                    onClick={() => setExpanded(e => !e)}
                    sx={{
                        transform: expanded ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                        ml: 0.5,
                    }}
                >
                    <ExpandMore fontSize="small" />
                </IconButton>
            </Stack>

            <Collapse in={expanded} unmountOnExit>
                <Divider sx={{ my: 1.5 }} />
                {rating === undefined ? (
                    <Typography variant="caption" color="text.secondary">Loading…</Typography>
                ) : (
                    <DriverRatingSection orderId={delivery.orderId} initialRating={rating} />
                )}
            </Collapse>
        </Card>
    );
}
