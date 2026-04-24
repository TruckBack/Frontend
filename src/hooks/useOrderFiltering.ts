import { useMemo, useState } from 'react';
import type { CustomerOrderStatus } from '../utils/statusUtils';
import type { CustomerOrder } from '../components/customer/orders/CustomerOrderCard';

export function useOrderFiltering(orders: CustomerOrder[]) {
    const [selectedFilter, setSelectedFilter] = useState<'all' | CustomerOrderStatus>('all');

    const counts = useMemo(() => {
        const pending = orders.filter((order) => order.status === 'pending').length;
        const inTransit = orders.filter((order) => order.status === 'in-transit').length;
        const delivered = orders.filter((order) => order.status === 'delivered').length;

        return {
            total: orders.length,
            pending,
            inTransit,
            delivered,
        };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (selectedFilter === 'all') {
            return orders;
        }

        return orders.filter((order) => order.status === selectedFilter);
    }, [orders, selectedFilter]);

    return {
        selectedFilter,
        setSelectedFilter,
        counts,
        filteredOrders,
    };
}
