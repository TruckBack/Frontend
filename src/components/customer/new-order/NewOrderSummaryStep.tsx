import {
    AssignmentTurnedInOutlined,
    Inventory2Outlined,
    LocationOn,
    MonetizationOnOutlined,
} from '@mui/icons-material';
import { Card, Stack, Typography } from '@mui/material';
import type { NewOrderFormData } from '../../../hooks/useNewOrderFlow';

interface NewOrderSummaryStepProps {
    formData: NewOrderFormData;
    attachmentName: string;
}

const formatBudget = (budget: string) => {
    const numeric = Number(budget);

    if (Number.isNaN(numeric)) {
        return '$0.00';
    }

    return `$${numeric.toFixed(2)}`;
};

export default function NewOrderSummaryStep({ formData, attachmentName }: NewOrderSummaryStepProps) {
    return (
        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <AssignmentTurnedInOutlined color="primary" fontSize="small" />
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                        Review Your Order
                    </Typography>
                </Stack>

                <Card
                    variant="outlined"
                    sx={{
                        p: 1.5,
                        borderColor: 'success.light',
                        backgroundColor: 'action.hover',
                    }}
                >
                    <Stack spacing={1.25}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOn color="success" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={600} color="success.main">
                                Locations & Schedule
                            </Typography>
                        </Stack>
                        <Stack spacing={0.75}>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" color="text.secondary">Pickup:</Typography>
                                <Typography variant="body2" fontWeight={500}>{formData.pickupAddress || 'Not specified'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" color="text.secondary">Delivery:</Typography>
                                <Typography variant="body2" fontWeight={500}>{formData.deliveryAddress || 'Not specified'}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Stack spacing={0.25} sx={{ flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Date:</Typography>
                                    <Typography variant="body2" fontWeight={500}>{formData.preferredDate || 'Not specified'}</Typography>
                                </Stack>
                                <Stack spacing={0.25} sx={{ flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Time Window:</Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {formData.pickupTime && formData.deliveryBy
                                            ? `${formData.pickupTime} - ${formData.deliveryBy}`
                                            : 'Not specified'}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>

                <Card
                    variant="outlined"
                    sx={{
                        p: 1.5,
                        borderColor: 'secondary.light',
                        backgroundColor: 'action.hover',
                    }}
                >
                    <Stack spacing={1.25}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Inventory2Outlined color="secondary" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={600} color="secondary.main">
                                Package Details
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Stack spacing={0.25} sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary">Type:</Typography>
                                <Typography variant="body2" fontWeight={500}>{formData.packageType || 'Not specified'}</Typography>
                            </Stack>
                            <Stack spacing={0.25} sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary">Weight:</Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {formData.weightKg ? `${formData.weightKg} kg` : 'Not specified'}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack spacing={0.25}>
                            <Typography variant="caption" color="text.secondary">Dimensions:</Typography>
                            <Typography variant="body2" fontWeight={500}>{formData.dimensions || 'Not specified'}</Typography>
                        </Stack>
                        <Stack spacing={0.25}>
                            <Typography variant="caption" color="text.secondary">Description:</Typography>
                            <Typography variant="body2" fontWeight={500}>{formData.description || 'Not specified'}</Typography>
                        </Stack>
                        <Stack spacing={0.25}>
                            <Typography variant="caption" color="text.secondary">Attachment:</Typography>
                            <Typography variant="body2" fontWeight={500}>{attachmentName || 'Not specified'}</Typography>
                        </Stack>
                    </Stack>
                </Card>

                <Card
                    variant="outlined"
                    sx={{
                        p: 1.5,
                        borderColor: 'success.light',
                        backgroundColor: 'action.hover',
                    }}
                >
                    <Stack spacing={1.25}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <MonetizationOnOutlined color="success" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={600} color="success.main">
                                Your Budget
                            </Typography>
                        </Stack>
                        <Card variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" fontWeight={500}>Budget:</Typography>
                                <Typography variant="body2" fontWeight={700} color="success.main">{formatBudget(formData.budget)}</Typography>
                            </Stack>
                        </Card>
                    </Stack>
                </Card>
            </Stack>
        </Card>
    );
}
