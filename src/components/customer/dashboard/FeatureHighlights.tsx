import type { ReactNode } from 'react';
import { Box, Card, Stack, Typography } from '@mui/material';

interface FeatureItem {
    title: string;
    description: string;
    icon: ReactNode;
}

interface FeatureHighlightsProps {
    features: FeatureItem[];
}

export default function FeatureHighlights({ features }: FeatureHighlightsProps) {
    return (
        <Stack spacing={1.5}>
            <Typography variant="h6" fontWeight={600}>
                Why Choose TruckBack?
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 1.5,
                }}
            >
                {features.map((feature) => (
                    <Card
                        key={feature.title}
                        variant="outlined"
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            minHeight: 132,
                        }}
                    >
                        <Stack spacing={1.25}>
                            <Box
                                sx={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 1.5,
                                    bgcolor: 'action.hover',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {feature.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {feature.description}
                            </Typography>
                        </Stack>
                    </Card>
                ))}
            </Box>
        </Stack>
    );
}
