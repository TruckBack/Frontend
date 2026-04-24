import {
    Box,
    Stack,
} from '@mui/material';
import PageHeader from '../../components/shared/PageHeader';
import PastDeliveryCard, { type PastDelivery } from '../../components/driver/deliveries/PastDeliveryCard';

const mockPastDeliveries: PastDelivery[] = [
    {
        id: '1',
        customerName: 'John Smith',
        price: 35.0,
        category: 'Documents',
        weight: '2 kg',
        distance: '5.3 miles',
        completedDate: 'Today at 2:30 PM',
        rating: 5,
    },
    {
        id: '2',
        customerName: 'Emma Davis',
        price: 50.0,
        category: 'Groceries',
        weight: '12 kg',
        distance: '8.7 miles',
        completedDate: 'Yesterday',
        rating: 4,
    },
];

const PastDeliveries = () => {
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
            <PageHeader title="Past Deliveries" subtitle="Your completed delivery history" />

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
                    {mockPastDeliveries.map((delivery) => (
                        <PastDeliveryCard key={delivery.id} delivery={delivery} />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default PastDeliveries;
