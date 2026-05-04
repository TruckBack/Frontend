import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import OrderStatsRow from '../../components/customer/orders/OrderStatsRow';
import OrderFilters from '../../components/customer/orders/OrderFilters';
import OrderDetailDialog from '../../components/shared/OrderDetailDialog';
import RatingModal from '../../components/shared/RatingModal';
import CustomerOrderCard, { type CustomerOrder } from '../../components/customer/orders/CustomerOrderCard';
import { useOrderFiltering } from '../../hooks/useOrderFiltering';
import { orderService } from '../../services/order';
import { userService } from '../../services/user';
import type { Order, OrderUpdate } from '../../services/types';
import type { UserPublic } from '../../services/types';

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

const mapOrderToCustomerOrder = (
    order: Order,
    ratedIds: Set<number>,
    driverMap?: Map<number, UserPublic>,
): CustomerOrder => ({
    id: String(order.id),
    orderNumber: `Order #${order.id}`,
    status: mapOrderStatus(order.status),
    price: order.price_cents / 100,
    date: new Date(order.created_at).toISOString().split('T')[0],
    category: order.cargo_description || 'General',
    weight: `${order.cargo_weight_kg || 0} kg`,
    pickup: order.pickup_address,
    dropoff: order.dropoff_address,
    driverName:
        order.driver_id && driverMap?.get(order.driver_id)
            ? driverMap.get(order.driver_id)!.full_name
            : 'Not assigned',
    driverPhone: '',
    rated: ratedIds.has(order.id),
});

export default function CustomerOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [driverMap, setDriverMap] = useState<Map<number, UserPublic>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit dialog state
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [editForm, setEditForm] = useState<{
        pickup_address: string;
        dropoff_address: string;
        cargo_description: string;
        cargo_weight_kg: string;
        notes: string;
        budget: string;
    }>({ pickup_address: '', dropoff_address: '', cargo_description: '', cargo_weight_kg: '', notes: '', budget: '' });
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    // Delete confirmation state
    const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
    const [deleteInProgress, setDeleteInProgress] = useState(false);

    // Detail dialog state
    const [detailOrderId, setDetailOrderId] = useState<number | null>(null);

    // Rating modal state
    const [ratingOrderId, setRatingOrderId] = useState<number | null>(null);
    /** Set of order ids that have already been rated (optimistic cache) */
    const [ratedOrderIds, setRatedOrderIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const [history, active] = await Promise.all([
                    orderService.listOrderHistory(),
                    orderService.listMyActiveOrders(),
                ]);
                // Active orders may also appear in history — deduplicate by id, keeping active-first
                const merged = [...active, ...history.items];
                const seen = new Set<number>();
                const unique = merged.filter(o => {
                    if (seen.has(o.id)) return false;
                    seen.add(o.id);
                    return true;
                });
                // Fetch driver names for orders that have an assigned driver and are not pending
                const driverIds = Array.from(new Set(
                    unique
                        .filter(o => o.driver_id && o.status !== 'pending')
                        .map(o => o.driver_id as number),
                ));
                if (driverIds.length > 0) {
                    try {
                        const drivers = await Promise.all(driverIds.map(id => userService.getUser(id)));
                        const map = new Map<number, UserPublic>(drivers.map(d => [d.id, d]));
                        setDriverMap(map);
                    } catch (e) {
                        // Non-fatal — leave driverMap empty
                        console.error('Failed to fetch driver names', e);
                    }
                } else {
                    setDriverMap(new Map());
                }
                setOrders(unique);
            } catch (err) {
                setError('Failed to fetch orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const customerOrders = orders.map(o => mapOrderToCustomerOrder(o, ratedOrderIds, driverMap));

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

    const handleViewDetails = (order: CustomerOrder) => {
        setDetailOrderId(Number(order.id));
    };

    const handleRate = (order: CustomerOrder) => {
        setRatingOrderId(Number(order.id));
    };

    const handleOpenEdit = (customerOrder: CustomerOrder) => {
        const raw = orders.find(o => String(o.id) === customerOrder.id);
        if (!raw) return;
        setEditingOrder(raw);
        setEditForm({
            pickup_address: raw.pickup_address,
            dropoff_address: raw.dropoff_address,
            cargo_description: raw.cargo_description ?? '',
            cargo_weight_kg: String(raw.cargo_weight_kg ?? ''),
            notes: raw.notes ?? '',
            budget: String(raw.price_cents / 100),
        });
        setEditError(null);
    };

    const handleSaveEdit = async () => {
        if (!editingOrder) return;
        setEditSaving(true);
        setEditError(null);
        try {
            const payload: OrderUpdate = {
                pickup_address: editForm.pickup_address,
                dropoff_address: editForm.dropoff_address,
                cargo_description: editForm.cargo_description || null,
                cargo_weight_kg: editForm.cargo_weight_kg ? parseFloat(editForm.cargo_weight_kg) : null,
                notes: editForm.notes || null,
                price_cents: Math.round(parseFloat(editForm.budget) * 100),
            };
            const updated = await orderService.updateOrder(editingOrder.id, payload);
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
            setEditingOrder(null);
        } catch {
            setEditError('Failed to save changes. Please try again.');
        } finally {
            setEditSaving(false);
        }
    };

    const handleOpenDelete = (customerOrder: CustomerOrder) => {
        const raw = orders.find(o => String(o.id) === customerOrder.id);
        if (raw) setDeletingOrder(raw);
    };

    const handleConfirmDelete = async () => {
        if (!deletingOrder) return;
        setDeleteInProgress(true);
        try {
            await orderService.deleteOrder(deletingOrder.id);
            setOrders(prev => prev.filter(o => o.id !== deletingOrder.id));
            setDeletingOrder(null);
        } catch {
            // keep dialog open, user can retry
        } finally {
            setDeleteInProgress(false);
        }
    };

    if (loading) {
        return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
    }

    if (error) {
        return <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>{error}</Typography>;
    }

    return (
        <>
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
                        <CustomerOrderCard
                            key={order.id}
                            order={order}
                            onOpenChat={handleOpenChat}
                            onViewDetails={handleViewDetails}
                            onEdit={handleOpenEdit}
                            onDelete={handleOpenDelete}
                            onRate={handleRate}
                        />
                    ))}
                </Stack>
            </Stack>
        </Box>

        {/* Edit Order Dialog */}
        <Dialog open={!!editingOrder} onClose={() => setEditingOrder(null)} fullWidth maxWidth="sm">
            <DialogTitle>Edit Order #{editingOrder?.id}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {editError && <Typography color="error" variant="body2">{editError}</Typography>}
                    <TextField
                        label="Pickup Address"
                        fullWidth
                        value={editForm.pickup_address}
                        onChange={e => setEditForm(f => ({ ...f, pickup_address: e.target.value }))}
                    />
                    <TextField
                        label="Dropoff Address"
                        fullWidth
                        value={editForm.dropoff_address}
                        onChange={e => setEditForm(f => ({ ...f, dropoff_address: e.target.value }))}
                    />
                    <TextField
                        label="Cargo Description"
                        fullWidth
                        multiline
                        minRows={2}
                        value={editForm.cargo_description}
                        onChange={e => setEditForm(f => ({ ...f, cargo_description: e.target.value }))}
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Weight (kg)"
                            type="number"
                            fullWidth
                            value={editForm.cargo_weight_kg}
                            onChange={e => setEditForm(f => ({ ...f, cargo_weight_kg: e.target.value }))}
                        />
                        <TextField
                            label="Budget ($)"
                            type="number"
                            fullWidth
                            value={editForm.budget}
                            onChange={e => setEditForm(f => ({ ...f, budget: e.target.value }))}
                        />
                    </Stack>
                    <TextField
                        label="Notes"
                        fullWidth
                        multiline
                        minRows={2}
                        value={editForm.notes}
                        onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEditingOrder(null)} disabled={editSaving}>Cancel</Button>
                <Button variant="contained" onClick={handleSaveEdit} disabled={editSaving}>
                    {editSaving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingOrder} onClose={() => setDeletingOrder(null)}>
            <DialogTitle>Delete Order #{deletingOrder?.id}?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This action cannot be undone. The order will be permanently deleted.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeletingOrder(null)} disabled={deleteInProgress}>Cancel</Button>
                <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={deleteInProgress}>
                    {deleteInProgress ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>

        <OrderDetailDialog
            key={detailOrderId ?? 'closed'}
            orderId={detailOrderId}
            open={detailOrderId !== null}
            onClose={() => setDetailOrderId(null)}
            role="customer"
            onChat={(_orderId: number) => {
                const customerOrder = customerOrders.find(o => Number(o.id) === _orderId);
                if (customerOrder) handleOpenChat(customerOrder);
            }}
        />

        {ratingOrderId !== null && (
            <RatingModal
                key={ratingOrderId}
                orderId={ratingOrderId}
                open={ratingOrderId !== null}
                onClose={() => setRatingOrderId(null)}
                onRated={() => {
                    setRatedOrderIds(prev => new Set([...prev, ratingOrderId]));
                }}
            />
        )}
        </>
    );
}
