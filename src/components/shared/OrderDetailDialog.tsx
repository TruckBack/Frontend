import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { Close, Place, LocalShipping, AttachMoney, Note, ImageOutlined } from '@mui/icons-material';
import { orderService } from '../../services/order';
import { resolveImageUrl } from '../../services/upload';
import type { Order } from '../../services/types';

const statusColorMap: Record<Order['status'], 'default' | 'info' | 'warning' | 'success' | 'error' | 'primary'> = {
    pending: 'info',
    accepted: 'warning',
    in_progress: 'primary',
    picked_up: 'primary',
    completed: 'success',
    cancelled: 'error',
};

const statusLabelMap: Record<Order['status'], string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    picked_up: 'Picked Up',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

interface OrderDetailDialogProps {
    orderId: number | null;
    open: boolean;
    onClose: () => void;
    role: 'driver' | 'customer';
    onAccept?: (orderId: number) => Promise<void>;
    onStart?: (orderId: number) => Promise<void>;
    onPickup?: (orderId: number) => Promise<void>;
    onComplete?: (orderId: number) => Promise<void>;
    onChat?: (orderId: number) => void;
}

export default function OrderDetailDialog({
    orderId,
    open,
    onClose,
    role,
    onAccept,
    onStart,
    onPickup,
    onComplete,
    onChat,
}: OrderDetailDialogProps) {
    const theme = useTheme();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!orderId) return;

        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        orderService.getOrder(orderId)
            .then((data) => { if (!cancelled) setOrder(data); })
            .catch(() => { if (!cancelled) setOrder(null); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [orderId]);

    if (!orderId) return null;

    const handleAction = async (action: (orderId: number) => Promise<void>) => {
        await action(orderId);
        const updated = await orderService.getOrder(orderId);
        setOrder(updated);
    };

    const renderActions = () => {
        if (role === 'driver' && order) {
            switch (order.status) {
                case 'pending':
                    return onAccept && (
                        <Button variant="contained" fullWidth onClick={() => handleAction(onAccept)}>
                            Accept
                        </Button>
                    );
                case 'accepted':
                    return onStart && (
                        <Button variant="contained" color="info" fullWidth onClick={() => handleAction(onStart)}>
                            Start Driving
                        </Button>
                    );
                case 'in_progress':
                    return onPickup && (
                        <Button variant="contained" color="warning" fullWidth onClick={() => handleAction(onPickup)}>
                            Confirm Pickup
                        </Button>
                    );
                case 'picked_up':
                    return onComplete && (
                        <Button variant="contained" color="success" fullWidth onClick={() => handleAction(onComplete)}>
                            Complete Delivery
                        </Button>
                    );
                default:
                    return null;
            }
        }
        return null;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={false}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    maxHeight: { xs: '90dvh', md: '85dvh' },
                },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={700}>
                        Order #{orderId}
                    </Typography>
                    <IconButton size="small" onClick={onClose}>
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ pb: 1 }}>
                {loading ? (
                    <Typography color="text.secondary" textAlign="center" py={3}>
                        Loading order details...
                    </Typography>
                ) : order ? (
                    <Stack spacing={2.5}>
                        {/* Status & Price */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Chip
                                label={statusLabelMap[order.status]}
                                color={statusColorMap[order.status]}
                                size="small"
                                variant="outlined"
                            />
                            <Typography variant="h6" fontWeight={700} color="success.main">
                                ${order.price_cents / 100}
                            </Typography>
                        </Stack>

                        {/* Cargo Image */}
                        {order.cargo_image_url && (
                            <Box
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <img
                                    src={resolveImageUrl(order.cargo_image_url)}
                                    alt="Cargo"
                                    style={{
                                        width: '100%',
                                        maxHeight: 300,
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            </Box>
                        )}

                        {/* Addresses */}
                        <Stack spacing={1.5}>
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Place sx={{ fontSize: 20, color: theme.palette.success.main, mt: 0.25, flexShrink: 0 }} />
                                <Stack spacing={0.25}>
                                    <Typography variant="caption" color="text.secondary">Pickup</Typography>
                                    <Typography variant="body2" fontWeight={500}>{order.pickup_address}</Typography>
                                </Stack>
                            </Stack>
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Place sx={{ fontSize: 20, color: theme.palette.primary.main, mt: 0.25, flexShrink: 0 }} />
                                <Stack spacing={0.25}>
                                    <Typography variant="caption" color="text.secondary">Drop-off</Typography>
                                    <Typography variant="body2" fontWeight={500}>{order.dropoff_address}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Divider />

                        {/* Cargo Details */}
                        <Stack spacing={1.5}>
                            {order.cargo_description && (
                                <Stack spacing={0.5}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <LocalShipping sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            Cargo Description
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2">{order.cargo_description}</Typography>
                                </Stack>
                            )}

                            <Stack direction="row" spacing={2}>
                                {order.cargo_weight_kg != null && (
                                    <Stack direction="row" spacing={0.75} alignItems="center">
                                        <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            {order.cargo_weight_kg} kg
                                        </Typography>
                                    </Stack>
                                )}
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                    <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {order.currency} ${(order.price_cents / 100).toFixed(2)}
                                    </Typography>
                                </Stack>
                            </Stack>

                            {order.notes && (
                                <Stack spacing={0.5}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Note sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            Notes
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">{order.notes}</Typography>
                                </Stack>
                            )}

                            {!order.cargo_image_url && !order.cargo_description && (
                                <Stack direction="row" spacing={1} alignItems="center" color="text.disabled">
                                    <ImageOutlined sx={{ fontSize: 18 }} />
                                    <Typography variant="caption">No cargo image or description</Typography>
                                </Stack>
                            )}
                        </Stack>

                        {/* Chat button for both roles */}
                        {onChat && order.status !== 'pending' && order.status !== 'cancelled' && (
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={() => onChat(order.id)}
                            >
                                Chat
                            </Button>
                        )}
                    </Stack>
                ) : (
                    <Typography color="error" textAlign="center" py={3}>
                        Failed to load order details.
                    </Typography>
                )}
            </DialogContent>

            {/* Driver action buttons */}
            {role === 'driver' && (
                <DialogActions sx={{ px: 2, pb: 2 }}>
                    {renderActions()}
                </DialogActions>
            )}
        </Dialog>
    );
}
