import { Box, Stack, Typography } from '@mui/material';

interface OrderStatsRowProps {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
}

interface StatBadgeProps {
    value: number;
    label: string;
    color: string;
}

function StatBadge({ value, label, color }: StatBadgeProps) {
    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                py: 1.25,
                px: 1,
                borderRadius: 2,
                bgcolor: color + '15',
                border: `1px solid ${color}30`,
            }}
        >
            <Typography variant="h5" fontWeight={800} lineHeight={1} sx={{ color }}>
                {value}
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ letterSpacing: '0.02em' }}>
                {label}
            </Typography>
        </Box>
    );
}

export default function OrderStatsRow({ total, pending, inTransit, delivered }: OrderStatsRowProps) {
    return (
        <Stack direction="row" spacing={1}>
            <StatBadge value={total}     label="Total"     color="#2563EB" />
            <StatBadge value={pending}   label="Pending"   color="#F59E0B" />
            <StatBadge value={inTransit} label="In Transit" color="#6366F1" />
            <StatBadge value={delivered} label="Done"      color="#10B981" />
        </Stack>
    );
}
