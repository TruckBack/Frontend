import { CalendarToday, LocationOn } from '@mui/icons-material';
import { Card, InputAdornment, Stack, TextField, Typography } from '@mui/material';

export default function NewOrderLocationStep() {
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
                        defaultValue="2025-12-28"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <CalendarToday fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    <Stack spacing={1} sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                            Pickup Time:
                        </Typography>
                        <TextField type="time" size="small" fullWidth defaultValue="19:00" />
                    </Stack>
                    <Stack spacing={1} sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                            Delivery By:
                        </Typography>
                        <TextField type="time" size="small" fullWidth defaultValue="19:00" />
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
}
