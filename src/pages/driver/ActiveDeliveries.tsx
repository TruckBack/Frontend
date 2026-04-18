import { useState } from 'react';
import {
    Box,
    Button,
    Stack,
    Typography,
} from '@mui/material';
import DeliveryCard, { type Delivery } from '../../components/driver/DeliveryCard';

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
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'accepted' | 'in-progress'>('all');

    const allCount = mockDeliveries.length;
    const acceptedCount = mockDeliveries.filter((delivery) => delivery.status === 'accepted').length;
    const inProgressCount = mockDeliveries.filter((delivery) => delivery.status === 'in-progress').length;
    const filterOptions: Array<{ value: 'all' | 'accepted' | 'in-progress'; label: string }> = [
        { value: 'all', label: `All (${allCount})` },
        { value: 'accepted', label: `Accepted (${acceptedCount})` },
        { value: 'in-progress', label: `In Progress (${inProgressCount})` },
    ];

    const filteredDeliveries = selectedFilter === 'all'
        ? mockDeliveries
        : mockDeliveries.filter((delivery) => delivery.status === selectedFilter);

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
                <Stack sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Active Deliveries
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your current delivery jobs
                    </Typography>
                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        mb: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    {filterOptions.map((filter) => (
                        <Button
                            key={filter.value}
                            variant={selectedFilter === filter.value ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setSelectedFilter(filter.value)}
                            sx={{
                                textTransform: 'none',
                                flexShrink: 0,
                                minWidth: { xs: 108, sm: 126 },
                            }}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </Stack>

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
