import type { Palette } from '@mui/material/styles';

export type CustomerOrderStatus = 'pending' | 'in-transit' | 'delivered';
export type DriverDeliveryStatus = 'accepted' | 'in-progress' | 'completed';

export function getCustomerOrderStatusColor(status: CustomerOrderStatus, palette: Palette) {
    switch (status) {
        case 'pending':
            return palette.warning.main;
        case 'in-transit':
            return palette.primary.main;
        case 'delivered':
            return palette.success.main;
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
        default:
            return status;
    }
}

export function getDriverDeliveryStatusColor(status: DriverDeliveryStatus, palette: Palette) {
    switch (status) {
        case 'accepted':
            return palette.warning.main;
        case 'in-progress':
            return palette.primary.main;
        case 'completed':
            return palette.success.main;
        default:
            return palette.grey[400];
    }
}

export function getDriverDeliveryStatusLabel(status: DriverDeliveryStatus) {
    if (status === 'in-progress') {
        return 'In Progress';
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
}
