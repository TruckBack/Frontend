import { CalendarToday, LocationOn } from '@mui/icons-material';
import { Card, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import type { NewOrderFieldErrors, NewOrderFormData } from '../../../hooks/useNewOrderFlow';

interface NewOrderLocationStepProps {
    formData: NewOrderFormData;
    fieldErrors: NewOrderFieldErrors;
    onFieldChange: <K extends keyof NewOrderFormData>(field: K, value: NewOrderFormData[K]) => void;
}

export default function NewOrderLocationStep({
    formData,
    fieldErrors,
    onFieldChange,
}: NewOrderLocationStepProps) {
    return (
        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOn color="primary" fontSize="small" />
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                        Delivery Details
                    </Typography>
                </Stack>

                <TextField
                    placeholder="Pickup address..."
                    size="small"
                    fullWidth
                    required
                    value={formData.pickupAddress}
                    onChange={(event) => onFieldChange('pickupAddress', event.target.value)}
                    error={Boolean(fieldErrors.pickupAddress)}
                    helperText={fieldErrors.pickupAddress}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocationOn color="success" fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    placeholder="Delivery address..."
                    size="small"
                    fullWidth
                    required
                    value={formData.deliveryAddress}
                    onChange={(event) => onFieldChange('deliveryAddress', event.target.value)}
                    error={Boolean(fieldErrors.deliveryAddress)}
                    helperText={fieldErrors.deliveryAddress}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocationOn color="primary" fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                        Preferred Date
                    </Typography>
                    <TextField
                        type="date"
                        size="small"
                        fullWidth
                        required
                        value={formData.preferredDate}
                        onChange={(event) => onFieldChange('preferredDate', event.target.value)}
                        error={Boolean(fieldErrors.preferredDate)}
                        helperText={fieldErrors.preferredDate}

                    />
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    <Stack spacing={1} sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                            Pickup Time:
                        </Typography>
                        <TextField
                            type="time"
                            size="small"
                            fullWidth
                            required
                            value={formData.pickupTime}
                            onChange={(event) => onFieldChange('pickupTime', event.target.value)}
                            error={Boolean(fieldErrors.pickupTime)}
                            helperText={fieldErrors.pickupTime}
                        />
                    </Stack>
                    <Stack spacing={1} sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                            Delivery By:
                        </Typography>
                        <TextField
                            type="time"
                            size="small"
                            fullWidth
                            required
                            value={formData.deliveryBy}
                            onChange={(event) => onFieldChange('deliveryBy', event.target.value)}
                            error={Boolean(fieldErrors.deliveryBy)}
                            helperText={fieldErrors.deliveryBy}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
}
