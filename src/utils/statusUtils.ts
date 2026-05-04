import type { Palette } from '@mui/material/styles';

export type CustomerOrderStatus = 'pending' | 'in-transit' | 'delivered' | 'cancelled';
export type DriverDeliveryStatus = 'pending' | 'accepted' | 'in-progress' | 'picked-up' | 'completed' | 'cancelled';

// Semantic hex values so components can use them directly without a palette reference
const STATUS_COLORS = {
    customer: {
        pending: '#F59E0B',
        'in-transit': '#2563EB',
        delivered: '#10B981',
        cancelled: '#EF4444',
    },
    driver: {
        pending: '#F59E0B',
        accepted: '#3B82F6',
        'in-progress': '#6366F1',
        'picked-up': '#8B5CF6',
        completed: '#10B981',
        cancelled: '#EF4444',
    },
} as const;

export function getCustomerOrderStatusColor(status: CustomerOrderStatus, _palette?: Palette): string {
    return STATUS_COLORS.customer[status] ?? '#64748B';
}

export function getCustomerOrderStatusLabel(status: CustomerOrderStatus): string {
    switch (status) {
        case 'pending': return 'Pending';
        case 'in-transit': return 'In Transit';
        case 'delivered': return 'Delivered';
        case 'cancelled': return 'Cancelled';
        default: return status;
    }
}

export function getDriverDeliveryStatusColor(status: DriverDeliveryStatus, _palette?: Palette): string {
    return STATUS_COLORS.driver[status] ?? '#64748B';
}

export function getDriverDeliveryStatusLabel(status: DriverDeliveryStatus): string {
    switch (status) {
        case 'in-progress': return 'In Progress';
        case 'picked-up': return 'Picked Up';
        default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
}
