import { Card, Stack, Typography, useTheme } from '@mui/material';

interface OrderStatsRowProps {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
}

export default function OrderStatsRow({ total, pending, inTransit, delivered }: OrderStatsRowProps) {
    const theme = useTheme();

    return (
        <Stack direction="row" spacing={1.25}>
            <Card
                sx={{
                    flex: 1,
                    p: 1.25,
                    borderRadius: 2,
                    backgroundColor: theme.palette.success.dark,
                    color: 'common.white',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" fontWeight={700} lineHeight={1.1}>
                    {total}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.95 }}>
                    Total
                </Typography>
            </Card>
            <Card
                sx={{
                    flex: 1,
                    p: 1.25,
                    borderRadius: 2,
                    backgroundColor: theme.palette.warning.dark,
                    color: 'common.white',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" fontWeight={700} lineHeight={1.1}>
                    {pending}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.95 }}>
                    Pending
                </Typography>
            </Card>
            <Card
                sx={{
                    flex: 1,
                    p: 1.25,
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: 'common.white',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" fontWeight={700} lineHeight={1.1}>
                    {inTransit}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.95 }}>
                    In Transit
                </Typography>
            </Card>
            <Card
                sx={{
                    flex: 1,
                    p: 1.25,
                    borderRadius: 2,
                    backgroundColor: theme.palette.success.main,
                    color: 'common.white',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" fontWeight={700} lineHeight={1.1}>
                    {delivered}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.95 }}>
                    Done
                </Typography>
            </Card>
        </Stack>
    );
}
