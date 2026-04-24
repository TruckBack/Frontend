import { Card, Stack, Typography } from '@mui/material';

interface RecentOrder {
    id: string;
    title: string;
    status: string;
    from: string;
    to: string;
}

interface RecentOrdersListProps {
    orders: RecentOrder[];
}

export default function RecentOrdersList({ orders }: RecentOrdersListProps) {
    return (
        <Stack spacing={1.5}>
            <Typography variant="h6" fontWeight={600}>
                Recent Orders
            </Typography>
            <Stack spacing={1.5}>
                {orders.map((order) => (
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
    );
}
