import {
    Box,
    Stack,
} from '@mui/material';
import {
    AccessTime,
    VerifiedUserOutlined,
    Equalizer,
    MonetizationOnOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import DeliveryActionCard from '../../components/customer/dashboard/DeliveryActionCard';
import FeatureHighlights from '../../components/customer/dashboard/FeatureHighlights';
import RecentOrdersList from '../../components/customer/dashboard/RecentOrdersList';

const features = [
    {
        title: 'Fast Delivery',
        description: 'Same-day delivery available',
        icon: <AccessTime fontSize="small" />,
    },
    {
        title: 'Trusted Drivers',
        description: 'Verified & insured drivers',
        icon: <VerifiedUserOutlined fontSize="small" />,
    },
    {
        title: 'Track Live',
        description: 'Real-time GPS tracking',
        icon: <Equalizer fontSize="small" />,
    },
    {
        title: 'Fair Pricing',
        description: 'Transparent cost estimates',
        icon: <MonetizationOnOutlined fontSize="small" />,
    },
];

const recentOrders = [
    { id: '1', title: 'Furniture Delivery', status: 'Delivered', from: 'Downtown', to: 'Uptown' },
    { id: '2', title: 'Groceries', status: 'On Route', from: 'Westside', to: 'North Park' },
];

export default function CustomerDashboard() {
    const navigate = useNavigate();

    return (
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
                <PageHeader
                    title="Welcome Back!"
                    subtitle="Request a delivery in minutes"
                    titleVariant="h4"
                />

                <DeliveryActionCard onCreateOrder={() => navigate('/customer/new-order')} />
                <FeatureHighlights features={features} />
                <RecentOrdersList orders={recentOrders} />
            </Stack>
        </Box>
    );
}
