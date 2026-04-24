import { MonetizationOnOutlined } from '@mui/icons-material';
import { Box, Card, Stack, TextField, Typography } from '@mui/material';

export default function NewOrderBudgetStep() {
    return (
        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <MonetizationOnOutlined color="secondary" fontSize="small" />
                    <Typography variant="h6" fontWeight={600} color="secondary.main">
                        Budget & Payment
                    </Typography>
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Your Budget ($)
                    </Typography>
                    <TextField size="small" fullWidth placeholder="Enter your budget" type="number" />
                    <Typography variant="caption" color="text.secondary">
                        Suggested: $45.00
                    </Typography>
                </Stack>

                <Card
                    variant="outlined"
                    sx={{
                        p: 1.5,
                        borderColor: 'primary.light',
                        backgroundColor: 'action.hover',
                    }}
                >
                    <Stack spacing={0.75}>
                        <Typography variant="subtitle2" fontWeight={700}>
                            What affects pricing:
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                            <Typography component="li" variant="body2" color="text.secondary">
                                Distance and route complexity
                            </Typography>
                            <Typography component="li" variant="body2" color="text.secondary">
                                Package size and weight
                            </Typography>
                            <Typography component="li" variant="body2" color="text.secondary">
                                Time sensitivity and urgency
                            </Typography>
                            <Typography component="li" variant="body2" color="text.secondary">
                                Special handling requirements
                            </Typography>
                        </Box>
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
                    <Typography variant="body2" color="success.main" fontWeight={500}>
                        Tip: Higher budgets attract more drivers and faster pickups!
                    </Typography>
                </Card>
            </Stack>
        </Card>
    );
}
