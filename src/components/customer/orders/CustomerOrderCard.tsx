import { DeleteOutline, EditOutlined, Place, VisibilityOutlined } from '@mui/icons-material';
import { Button, Card, Chip, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { getCustomerOrderStatusColor, getCustomerOrderStatusLabel, type CustomerOrderStatus } from '../../../utils/statusUtils';

export interface CustomerOrder {
    id: string;
    orderNumber: string;
    status: CustomerOrderStatus;
    price: number;
    date: string;
    category: string;
    weight: string;
    pickup: string;
    dropoff: string;
    driverName: string;
    driverPhone: string;
}

interface CustomerOrderCardProps {
    order: CustomerOrder;
    onOpenChat: (order: CustomerOrder) => void;
    onViewDetails?: (order: CustomerOrder) => void;
    onEdit?: (order: CustomerOrder) => void;
    onDelete?: (order: CustomerOrder) => void;
}

export default function CustomerOrderCard({ order, onOpenChat, onViewDetails, onEdit, onDelete }: CustomerOrderCardProps) {
    const theme = useTheme();
    const canModify = order.status === 'pending';

    return (
        <Card
            variant="outlined"
            sx={{
                p: 1.75,
                borderRadius: 2,
                borderLeft: `3px solid ${getCustomerOrderStatusColor(order.status, theme.palette)}`,
            }}
        >
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            label={getCustomerOrderStatusLabel(order.status)}
                            size="small"
                            variant="outlined"
                            sx={{
                                height: 22,
                                borderColor: getCustomerOrderStatusColor(order.status, theme.palette),
                                color: getCustomerOrderStatusColor(order.status, theme.palette),
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
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        {canModify && (
                            <>
                                <Tooltip title="Edit order">
                                    <IconButton size="small" onClick={() => onEdit?.(order)}>
                                        <EditOutlined fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete order">
                                    <IconButton size="small" color="error" onClick={() => onDelete?.(order)}>
                                        <DeleteOutline fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        <Stack alignItems="flex-end" spacing={0.25}>
                            <Typography variant="h6" fontWeight={700} color="success.main" lineHeight={1}>
                                ${order.price.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {order.date}
                            </Typography>
                        </Stack>
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
                        disabled={order.driverName === 'Not assigned' || order.status === 'delivered'}
                    >
                        Track Delivery
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        sx={{ flex: 1 }}
                        disabled={order.driverName === 'Not assigned' || order.status === 'delivered'}
                        onClick={() => onOpenChat(order)}
                    >
                        Chat
                    </Button>
                    <Tooltip title="View Details">
                        <IconButton
                            size="small"
                            onClick={() => onViewDetails?.(order)}
                            sx={{
                                flex: '0 0 auto',
                                border: 1,
                                borderColor: 'divider',
                            }}
                        >
                            <VisibilityOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
        </Card>
    );
}
