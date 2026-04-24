import { Add } from '@mui/icons-material';
import { Card, IconButton, Stack, Typography } from '@mui/material';

interface DeliveryActionCardProps {
    onCreateOrder: () => void;
}

export default function DeliveryActionCard({ onCreateOrder }: DeliveryActionCardProps) {
    return (
        <Card
            sx={{
                p: 2,
                borderRadius: 2.5,
                background: (theme) => `linear-gradient(120deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
                color: 'common.white',
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Stack spacing={1}>
                    <Typography variant="h6" fontWeight={700}>
                        Request a Delivery
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.95 }}>
                        Get your items delivered quickly and safely
                    </Typography>
                </Stack>
                <IconButton
                    aria-label="new delivery"
                    onClick={onCreateOrder}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'common.white',
                        width: 48,
                        height: 48,
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.3)',
                        },
                    }}
                >
                    <Add />
                </IconButton>
            </Stack>
        </Card>
    );
}
