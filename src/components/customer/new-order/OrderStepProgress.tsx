import { Box, Stack, Typography } from '@mui/material';
import type { OrderStep } from './orderSteps';

interface OrderStepProgressProps {
    steps: OrderStep[];
    currentStep: number;
    onStepChange: (stepId: number) => void;
}

export default function OrderStepProgress({ steps, currentStep, onStepChange }: OrderStepProgressProps) {
    return (
        <Stack spacing={0.75}>
            <Box
                sx={{
                    position: 'relative',
                    px: 2,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        left: 24,
                        right: 24,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        height: '1px',
                        bgcolor: 'divider',
                    }}
                />
                <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                    {steps.map((step) => (
                        <Box
                            key={`circle-${step.id}`}
                            onClick={() => onStepChange(step.id)}
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: step.id === currentStep
                                    ? 'primary.main'
                                    : (theme) => (theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300]),
                                color: step.id === currentStep ? 'primary.contrastText' : 'text.secondary',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                            }}
                        >
                            {step.id}
                        </Box>
                    ))}
                </Stack>
            </Box>

            <Stack direction="row" justifyContent="space-between" sx={{ px: 0.25 }}>
                {steps.map((step) => (
                    <Typography
                        key={`label-${step.id}`}
                        variant="caption"
                        sx={{
                            width: 68,
                            textAlign: 'center',
                            color: step.id === currentStep ? 'primary.main' : 'text.secondary',
                            fontWeight: step.id === currentStep ? 600 : 500,
                        }}
                    >
                        {step.label}
                    </Typography>
                ))}
            </Stack>
        </Stack>
    );
}
