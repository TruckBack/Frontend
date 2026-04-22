import {
    Box,
    Button,
    Card,
    Chip,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import {
    FavoriteBorder,
    Phone,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface Delivery {
    id: string;
    driverName: string;
    status: 'accepted' | 'in-progress' | 'completed';
    price: number;
    category: string;
    weight: string;
    distance: string;
    pickup: string;
    dropoff: string;
    phone: string;
}

interface DeliveryCardProps {
    delivery: Delivery;
}

const DeliveryCard = ({ delivery }: DeliveryCardProps) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const getStatusColor = (status: Delivery['status']) => {
        switch (status) {
            case 'accepted':
                return theme.palette.warning.main;
            case 'in-progress':
                return theme.palette.primary.main;
            default:
                return theme.palette.grey[400];
        }
    };

    const statusColor = getStatusColor(delivery.status);

    return (
        <Card
            sx={{
                p: 2,
                borderRadius: 2,
                borderLeft: `4px solid ${statusColor}`,
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 2 }}
            >
                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        {delivery.driverName}
                    </Typography>
                    <Chip
                        label={delivery.status === 'in-progress' ? 'In Progress' : delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                        size="small"
                        variant="outlined"
                        sx={{
                            width: 'fit-content',
                            borderColor: statusColor,
                            color: statusColor,
                        }}
                    />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <FavoriteBorder
                        sx={{
                            fontSize: { xs: 20, sm: 24 },
                            color: theme.palette.text.secondary,
                            cursor: 'pointer',
                        }}
                    />
                    <Typography variant="subtitle2" fontWeight={600}>
                        ${delivery.price.toFixed(2)}
                    </Typography>
                </Stack>
            </Stack>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    {delivery.category} • {delivery.weight} • {delivery.distance}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Box
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.success.main,
                            flexShrink: 0,
                            mt: 0.5,
                        }}
                    />
                    <Stack spacing={0}>
                        <Typography variant="caption" color="text.secondary">
                            Pickup
                        </Typography>
                        <Typography variant="caption" fontWeight={500}>
                            {delivery.pickup}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Box
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.error.main,
                            flexShrink: 0,
                            mt: 0.5,
                        }}
                    />
                    <Stack spacing={0}>
                        <Typography variant="caption" color="text.secondary">
                            Drop-off
                        </Typography>
                        <Typography variant="caption" fontWeight={500}>
                            {delivery.dropoff}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack spacing={0}>
                    <Typography variant="caption" color="text.secondary">
                        Customer Phone:
                    </Typography>
                    <Typography variant="caption" fontWeight={500}>
                        {delivery.phone}
                    </Typography>
                </Stack>
            </Stack>

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    '& button': {
                        flex: 1,
                    },
                }}
            >
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    fullWidth
                >
                    Complete
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => navigate(`/driver/chat/${delivery.id}`, {
                        state: {
                            partnerName: delivery.driverName,
                            orderTitle: `${delivery.category} Delivery`,
                            customerName: delivery.driverName,
                        },
                    })}
                >
                    Chat
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Phone sx={{ fontSize: 18 }} />}
                    sx={{ minWidth: 'auto', px: 1 }}
                >
                    Call
                </Button>
            </Stack>
        </Card>
    );
};

export default DeliveryCard;
