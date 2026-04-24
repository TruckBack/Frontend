import {
    Box,
    Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import OrderStatsRow from '../../components/customer/orders/OrderStatsRow';
import OrderFilters from '../../components/customer/orders/OrderFilters';
import CustomerOrderCard, { type CustomerOrder } from '../../components/customer/orders/CustomerOrderCard';
import { useOrderFiltering } from '../../hooks/useOrderFiltering';

const mockOrders: CustomerOrder[] = [
    {
        id: '1',
        orderNumber: 'Order #1',
        status: 'in-transit',
        price: 45,
        date: '2025-12-28',
        category: 'Furniture',
        weight: '15 kg',
        pickup: '123 Main St, Downtown',
        dropoff: '456 Oak Ave, Uptown',
        driverName: 'John Driver',
        driverPhone: '+1-555-0111',
    },
    {
        id: '2',
        orderNumber: 'Order #2',
        status: 'pending',
        price: 30,
        date: '2025-12-28',
        category: 'Electronics',
        weight: '8 kg',
        pickup: '789 Tech Ave, Midtown',
        dropoff: '321 Park St, Northside',
        driverName: 'Not assigned',
        driverPhone: '+1-555-0000',
    },
    {
        id: '3',
        orderNumber: 'Order #3',
        status: 'delivered',
        price: 28,
        date: '2025-12-27',
        category: 'Documents',
        weight: '2 kg',
        pickup: '22 Green St, Westside',
        dropoff: '88 River Rd, Eastside',
        driverName: 'Sarah Driver',
        driverPhone: '+1-555-0199',
    },
];

export default function CustomerOrders() {
    const navigate = useNavigate();
    const {
        selectedFilter,
        setSelectedFilter,
        counts,
        filteredOrders,
    } = useOrderFiltering(mockOrders);

    const handleOpenChat = (order: CustomerOrder) => {
        navigate(`/customer/chat/${order.id}`, {
            state: {
                partnerName: order.driverName,
                orderTitle: order.orderNumber,
                driverName: order.driverName,
            },
        });
    };

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
