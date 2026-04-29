import { useEffect, useState } from 'react';
import {
    Box,
    Stack,
    CircularProgress,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import OrderStatsRow from '../../components/customer/orders/OrderStatsRow';
import OrderFilters from '../../components/customer/orders/OrderFilters';
import CustomerOrderCard, { type CustomerOrder } from '../../components/customer/orders/CustomerOrderCard';
import { useOrderFiltering } from '../../hooks/useOrderFiltering';
import { orderService } from '../../services/order';
import type { Order } from '../../services/types';

const mapOrderStatus = (status: Order['status']): CustomerOrder['status'] => {
    switch (status) {
        case 'pending':
        case 'accepted':
            return 'pending';
        case 'in_progress':
        case 'picked_up':
            return 'in-transit';
        case 'completed':
            return 'delivered';
        case 'cancelled':
            return 'cancelled';
        default:
            return 'pending';
    }
}

const mapOrderToCustomerOrder = (order: Order): CustomerOrder => ({
    id: String(order.id),
    orderNumber: `Order #${order.id}`,
    status: mapOrderStatus(order.status),
    price: order.price_cents / 100,
    date: new Date(order.created_at).toISOString().split('T')[0],
    category: order.cargo_description || 'General',
    weight: `${order.cargo_weight_kg || 0} kg`,
    pickup: order.pickup_address,
    dropoff: order.dropoff_address,
    driverName: 'Not assigned', // This would need more logic, maybe fetching user by driver_id
    driverPhone: '', // Same as above
});

export default function CustomerOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const [history, active] = await Promise.all([
                    orderService.listOrderHistory(),
                    orderService.listMyActiveOrders(),
                ]);
                setOrders([...active, ...history.items]);
            } catch (err) {
                setError('Failed to fetch orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const customerOrders = orders.map(mapOrderToCustomerOrder);

    const {
        selectedFilter,
        setSelectedFilter,
        counts,
        filteredOrders,
    } = useOrderFiltering(customerOrders);

    const handleOpenChat = (order: CustomerOrder) => {
        navigate(`/customer/chat/${order.id}`, {
            state: {
                partnerName: order.driverName,
                orderTitle: order.orderNumber,
                driverName: order.driverName,
            },
        });
    };

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
                py: { xs: 2.5, sm: 3 },
            }}
        >
            <Stack spacing={2.5}>
                <PageHeader title="My Orders" subtitle="Track your delivery requests" />
                <OrderStatsRow
                    total={counts.total}
                    pending={counts.pending}
                    inTransit={counts.inTransit}
                    delivered={counts.delivered}
                />
                <OrderFilters selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />

                <Stack spacing={1.5}>
                    {filteredOrders.map((order) => (
                        <CustomerOrderCard key={order.id} order={order} onOpenChat={handleOpenChat} />
                    ))}
                </Stack>
            </Stack>
        </Box>
    );
}
