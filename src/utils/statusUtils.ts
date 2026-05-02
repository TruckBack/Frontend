import type { Palette } from '@mui/material/styles';

export type CustomerOrderStatus = 'pending' | 'in-transit' | 'delivered' | 'cancelled';
export type DriverDeliveryStatus = 'pending' | 'accepted' | 'in-progress' | 'picked-up' | 'completed' | 'cancelled';

export function getCustomerOrderStatusColor(status: CustomerOrderStatus, palette: Palette) {
    switch (status) {
        case 'pending':
            return palette.warning.main;
        case 'in-transit':
            return palette.primary.main;
        case 'delivered':
            return palette.success.main;
        case 'cancelled':
            return palette.error.main;
        default:
            return palette.divider;
    }
}

export function getCustomerOrderStatusLabel(status: CustomerOrderStatus) {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'in-transit':
            return 'In Transit';
        case 'delivered':
            return 'Delivered';
        case 'cancelled':
            return 'Cancelled';
        default:
            return status;
    }
}

export function getDriverDeliveryStatusColor(status: DriverDeliveryStatus, palette: Palette) {
    switch (status) {
        case 'pending':
            return palette.info.main;
        case 'accepted':
            return palette.warning.main;
        case 'in-progress':
        case 'picked-up':
            return palette.primary.main;
        case 'completed':
            return palette.success.main;
        case 'cancelled':
            return palette.error.main;
        default:
            return palette.grey[400];
    }
}

export function getDriverDeliveryStatusLabel(status: DriverDeliveryStatus) {
    switch (status) {
        case 'in-progress': return 'In Progress';
        case 'picked-up': return 'Picked Up';
        default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
}
