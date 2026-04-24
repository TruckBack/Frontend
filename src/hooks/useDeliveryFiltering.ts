import { useMemo, useState } from 'react';
import type { Delivery } from '../components/driver/DeliveryCard';

export type DeliveryFilter = 'all' | 'accepted' | 'in-progress';

export function useDeliveryFiltering(deliveries: Delivery[]) {
    const [selectedFilter, setSelectedFilter] = useState<DeliveryFilter>('all');

    const counts = useMemo(() => {
        const accepted = deliveries.filter((delivery) => delivery.status === 'accepted').length;
        const inProgress = deliveries.filter((delivery) => delivery.status === 'in-progress').length;

        return {
            total: deliveries.length,
            accepted,
            inProgress,
        };
    }, [deliveries]);

    const filteredDeliveries = useMemo(() => {
        if (selectedFilter === 'all') {
            return deliveries;
        }

        return deliveries.filter((delivery) => delivery.status === selectedFilter);
    }, [deliveries, selectedFilter]);

    return {
        selectedFilter,
        setSelectedFilter,
        counts,
        filteredDeliveries,
    };
}
