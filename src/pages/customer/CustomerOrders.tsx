import {
    Box,
    Button,
    Card,
    Chip,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import {
    Place,
} from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type OrderStatus = 'pending' | 'in-transit' | 'delivered';

interface CustomerOrder {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    price: number;
    date: string;
    category: string;
    weight: string;
    pickup: string;
    dropoff: string;
    driverName: string;
    driverPhone: string;
}

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

const CustomerOrders = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState<'all' | OrderStatus>('all');

    const counts = useMemo(() => {
        const pending = mockOrders.filter((order) => order.status === 'pending').length;
        const inTransit = mockOrders.filter((order) => order.status === 'in-transit').length;
        const delivered = mockOrders.filter((order) => order.status === 'delivered').length;

        return {
            total: mockOrders.length,
            pending,
            inTransit,
            delivered,
        };
    }, []);

    const filteredOrders = selectedFilter === 'all'
        ? mockOrders
        : mockOrders.filter((order) => order.status === selectedFilter);

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return theme.palette.warning.main;
            case 'in-transit':
                return theme.palette.primary.main;
            case 'delivered':
                return theme.palette.success.main;
            default:
                return theme.palette.divider;
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'in-transit':
                return 'In Transit';
            case 'delivered':
                return 'Delivered';
            default:
                return status;
        }
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
                <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={600}>
                        My Orders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track your delivery requests
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1.25}>
                    <Card
                        sx={{
                            flex: 1,
                            p: 1.25,
                            borderRadius: 2,
                            backgroundColor: theme.palette.success.dark,
                            color: 'common.white',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} lineHeight={1.1}>
                            {counts.total}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.95 }}>
                            Total
                        </Typography>
                    </Card>
                    <Card
                        sx={{
                            flex: 1,
                            p: 1.25,
                            borderRadius: 2,
                            backgroundColor: theme.palette.warning.dark,
                            color: 'common.white',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} lineHeight={1.1}>
                            {counts.pending}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.95 }}>
                            Pending
                        </Typography>
                    </Card>
                    <Card
                        sx={{
                            flex: 1,
                            p: 1.25,
                            borderRadius: 2,
                            backgroundColor: theme.palette.primary.main,
                            color: 'common.white',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} lineHeight={1.1}>
                            {counts.inTransit}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.95 }}>
                            In Transit
                        </Typography>
                    </Card>
                    <Card
                        sx={{
                            flex: 1,
                            p: 1.25,
                            borderRadius: 2,
                            backgroundColor: theme.palette.success.main,
                            color: 'common.white',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} lineHeight={1.1}>
                            {counts.delivered}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.95 }}>
                            Done
                        </Typography>
                    </Card>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant={selectedFilter === 'all' ? 'contained' : 'outlined'}
                        onClick={() => setSelectedFilter('all')}
                        sx={{ textTransform: 'none', borderRadius: 99, minWidth: 0, px: 2.2 }}
                    >
                        All
                    </Button>
                    <Button
                        size="small"
                        variant={selectedFilter === 'pending' ? 'contained' : 'outlined'}
                        onClick={() => setSelectedFilter('pending')}
                        sx={{ textTransform: 'none', borderRadius: 99, minWidth: 0, px: 2.2 }}
                    >
                        Pending
                    </Button>
                    <Button
                        size="small"
                        variant={selectedFilter === 'in-transit' ? 'contained' : 'outlined'}
                        onClick={() => setSelectedFilter('in-transit')}
                        sx={{ textTransform: 'none', borderRadius: 99, minWidth: 0, px: 2.2 }}
                    >
                        In Transit
                    </Button>
                    <Button
                        size="small"
                        variant={selectedFilter === 'delivered' ? 'contained' : 'outlined'}
                        onClick={() => setSelectedFilter('delivered')}
                        sx={{ textTransform: 'none', borderRadius: 99, minWidth: 0, px: 2.2 }}
                    >
                        Delivered
                    </Button>
                </Stack>

                <Stack spacing={1.5}>
                    {filteredOrders.map((order) => (
                        <Card
                            key={order.id}
                            variant="outlined"
                            sx={{
                                p: 1.75,
                                borderRadius: 2,
                                borderLeft: `3px solid ${getStatusColor(order.status)}`,
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip
                                            label={getStatusLabel(order.status)}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                height: 22,
                                                borderColor: getStatusColor(order.status),
                                                color: getStatusColor(order.status),
                                                '& .MuiChip-label': {
                                                    px: 1,
                                                    fontSize: '0.7rem',
                                                },
                                            }}
                                        />
                                        <Typography variant="body2" fontWeight={500} color="text.secondary">
                                            {order.orderNumber}
                                        </Typography>
                                    </Stack>
                                    <Stack alignItems="flex-end" spacing={0.25}>
                                        <Typography variant="h6" fontWeight={700} color="success.main" lineHeight={1}>
                                            ${order.price.toFixed(2)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {order.date}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Typography variant="body2" color="text.secondary">
                                    {order.category} • {order.weight}
                                </Typography>

                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="flex-start">
                                        <Place sx={{ fontSize: 18, color: theme.palette.success.main, mt: 0.1 }} />
                                        <Stack spacing={0.25}>
                                            <Typography variant="caption" color="text.secondary">Pickup</Typography>
                                            <Typography variant="body2" fontWeight={500}>{order.pickup}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="flex-start">
                                        <Place sx={{ fontSize: 18, color: theme.palette.primary.main, mt: 0.1 }} />
                                        <Stack spacing={0.25}>
                                            <Typography variant="caption" color="text.secondary">Drop-off</Typography>
                                            <Typography variant="body2" fontWeight={500}>{order.dropoff}</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-end"
                                    sx={{
                                        p: 1,
                                        borderRadius: 1.5,
                                        backgroundColor: 'action.hover',
                                    }}
                                >
                                    <Stack spacing={0.2}>
                                        <Typography variant="caption" color="text.secondary">Driver</Typography>
                                        <Typography variant="body2" fontWeight={500}>{order.driverName}</Typography>
                                    </Stack>
                                    <Typography variant="body2" fontWeight={500}>{order.driverPhone}</Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        '& button': {
                                            borderRadius: 1.5,
                                            textTransform: 'none',
                                        },
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ flex: 1.8 }}
                                    >
                                        Track Delivery
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="secondary"
                                        sx={{ flex: 1 }}
                                        disabled={order.driverName === 'Not assigned'}
                                        onClick={() => navigate(`/customer/chat/${order.id}`, {
                                            state: {
                                                partnerName: order.driverName,
                                                orderTitle: order.orderNumber,
                                                driverName: order.driverName,
                                            },
                                        })}
                                    >
                                        Chat
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="success"
                                        sx={{ flex: 1 }}
                                    >
                                        Call
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            </Stack>
        </Box>
    );
};

export default CustomerOrders;
