import {
    Box,
    Stack,
} from '@mui/material';
import DeliveryCard, { type Delivery } from '../../components/driver/DeliveryCard';
import PageHeader from '../../components/shared/PageHeader';
import DeliveryFilters from '../../components/driver/deliveries/DeliveryFilters';
import { useDeliveryFiltering } from '../../hooks/useDeliveryFiltering';

const mockDeliveries: Delivery[] = [
    {
        id: '1',
        driverName: 'Sarah Johnson',
        status: 'in-progress',
        price: 45.0,
        category: 'Furniture',
        weight: '15 kg',
        distance: '12.5 miles',
        pickup: '123 Main St. Downtown',
        dropoff: '456 Oak Ave. Uptown',
        phone: '+1-555-0199',
    },
    {
        id: '2',
        driverName: 'Mike Chen',
        status: 'accepted',
        price: 30.0,
        category: 'Electronics',
        weight: '8 kg',
        distance: '8.2 miles',
        pickup: '789 Tech Ave.',
        dropoff: '321 Park St.',
        phone: '+1-555-0200',
    },
];

const ActiveDeliveries = () => {
    const {
        selectedFilter,
        setSelectedFilter,
        counts,
        filteredDeliveries,
    } = useDeliveryFiltering(mockDeliveries);

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 680,
                mx: 'auto',
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 3 },
                boxSizing: 'border-box',
                height: { xs: 'calc(100dvh - 56px)', md: '100dvh' },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
                <PageHeader
                    title="Active Deliveries"
                    subtitle="Manage your current delivery jobs"
                />

                <DeliveryFilters
                    selectedFilter={selectedFilter}
                    allCount={counts.total}
                    acceptedCount={counts.accepted}
                    inProgressCount={counts.inProgress}
                    onSelectFilter={setSelectedFilter}
                />

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        pr: { xs: 0, sm: 0.5 },
                        pb: 1,
                    }}
                >
                    <Stack spacing={2}>
                        {filteredDeliveries.map((delivery) => (
                            <DeliveryCard key={delivery.id} delivery={delivery} />
                        ))}
                    </Stack>
                </Box>
        </Box>
    );
};

export default ActiveDeliveries;
