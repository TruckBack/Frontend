import { useEffect, useState } from 'react';
import {
    Box,
    Stack,
    CircularProgress,
    Typography,
} from '@mui/material';
import DeliveryCard, { type Delivery } from '../../components/driver/DeliveryCard';
import PageHeader from '../../components/shared/PageHeader';
import DeliveryFilters from '../../components/driver/deliveries/DeliveryFilters';
import { useDeliveryFiltering } from '../../hooks/useDeliveryFiltering';
import { orderService } from '../../services/order';
import type { Order } from '../../services/types';

const mapOrderStatusToDeliveryStatus = (status: Order['status']): Delivery['status'] => {
    switch (status) {
        case 'pending':
            return 'pending';
        case 'accepted':
            return 'accepted';
        case 'in_progress':
            return 'in-progress';
        case 'picked_up':
            return 'picked-up';
        case 'completed':
            return 'completed';
        case 'cancelled':
            return 'cancelled';
        default:
            return 'pending';
    }
}

const mapOrderToDelivery = (order: Order): Delivery => ({
    id: String(order.id),
    driverName: 'You', // This is the driver's view of their own deliveries
    status: mapOrderStatusToDeliveryStatus(order.status),
    price: order.price_cents / 100,
    category: order.cargo_description || 'General',
    weight: `${order.cargo_weight_kg || 0} kg`,
    distance: 'N/A', // This would require calculation based on lat/lng
    pickup: order.pickup_address,
    dropoff: order.dropoff_address,
    phone: '', // Customer phone not directly on order
});


const ActiveDeliveries = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            const [myActiveOrders, availableOrders] = await Promise.all([
                orderService.listMyActiveOrders(),
                orderService.listAvailableOrders()
            ]);
            setOrders([...myActiveOrders, ...availableOrders.items]);
        } catch (err) {
            setError('Failed to fetch deliveries.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const handleAction = async (action: (orderId: number) => Promise<any>, orderId: string) => {
        try {
            await action(Number(orderId));
            fetchDeliveries(); // Refetch to update the list
        } catch (error) {
            console.error(`Failed to perform action on order ${orderId}:`, error);
            // Optionally show an error to the user
        }
    };

    const deliveries = orders.map(mapOrderToDelivery);

    const {
        selectedFilter,
        setSelectedFilter,
        counts,
        filteredDeliveries,
    } = useDeliveryFiltering(deliveries);

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
            <PageHeader
                title="Active Deliveries"
                subtitle="Manage your current delivery jobs"
            />

            <DeliveryFilters
                selectedFilter={selectedFilter}
                allCount={counts.total}
                acceptedCount={counts.accepted}
                inProgressCount={counts.inProgress}
                onSelectFilter={setSelectedFilter}
            />

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
                    {filteredDeliveries.map((delivery) => (
                        <DeliveryCard
                            key={delivery.id}
                            delivery={delivery}
                            onAccept={(id) => handleAction(orderService.acceptOrder, id)}
                            onStart={(id) => handleAction(orderService.startOrder, id)}
                            onPickup={(id) => handleAction(orderService.pickupOrder, id)}
                            onComplete={(id) => handleAction(orderService.completeOrder, id)}
                        />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default ActiveDeliveries;
