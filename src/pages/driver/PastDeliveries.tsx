import { useEffect, useState } from 'react';
import {
    Box,
    Stack,
    CircularProgress,
    Typography,
} from '@mui/material';
import PageHeader from '../../components/shared/PageHeader';
import PastDeliveryCard, { type PastDelivery } from '../../components/driver/deliveries/PastDeliveryCard';
import { orderService } from '../../services/order';
import type { Order } from '../../services/types';

const mapOrderToPastDelivery = (order: Order): PastDelivery => ({
    id: String(order.id),
    customerName: 'Unknown Customer', // Requires fetching customer user details
    price: order.price_cents / 100,
    category: order.cargo_description || 'General',
    weight: `${order.cargo_weight_kg || 0} kg`,
    distance: 'N/A', // Requires calculation
    completedDate: order.completed_at ? new Date(order.completed_at).toLocaleString() : 'N/A',
    rating: 5, // This would come from a separate rating entity
});

const PastDeliveries = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPastDeliveries = async () => {
            try {
                setLoading(true);
                const response = await orderService.listOrderHistory();
                // The API returns all history, so we filter for completed/cancelled for the driver view
                const driverHistory = response.items.filter(o => o.status === 'completed' || o.status === 'cancelled');
                setOrders(driverHistory);
            } catch (err) {
                setError('Failed to fetch past deliveries.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPastDeliveries();
    }, []);

    const pastDeliveries = orders.map(mapOrderToPastDelivery);

    if (loading) {
        return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
    }

    if (error) {
        return <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>{error}</Typography>;
    }

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
            <PageHeader title="Past Deliveries" subtitle="Your completed delivery history" />

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
                    {pastDeliveries.map((delivery) => (
                        <PastDeliveryCard key={delivery.id} delivery={delivery} />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default PastDeliveries;
