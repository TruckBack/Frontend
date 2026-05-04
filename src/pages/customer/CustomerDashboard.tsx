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
            </Stack>
        </Box>
    );
}
