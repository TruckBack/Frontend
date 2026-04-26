import { AutoAwesomeRounded } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';

interface AIInsightsCardProps {
    insight?: string;
    isGenerating: boolean;
    title?: string;
    loadingText?: string;
    emptyText?: string;
}

export default function AIInsightsCard({
    insight = '',
    isGenerating,
    title = 'AI Insights',
    loadingText = 'Analyzing...',
    emptyText = '',
}: AIInsightsCardProps) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'primary.light',
                background: (theme) => `linear-gradient(120deg, ${theme.palette.info.light} 0%, ${theme.palette.primary.light} 100%)`,
                boxShadow: (theme) => `0 10px 24px ${theme.palette.primary.main}33`,
                position: 'relative',
                overflow: 'hidden',
                opacity: 0,
                transform: 'translateY(16px) scale(0.9)',
                animation: 'aiInsightCardEnter 460ms cubic-bezier(0.2, 0.9, 0.24, 1.15) forwards',
                '@keyframes aiInsightCardEnter': {
                    '0%': {
                        opacity: 0,
                        transform: 'translateY(16px) scale(0.9)',
                    },
                    '62%': {
                        opacity: 1,
                        transform: 'translateY(-2px) scale(1.035)',
                    },
                    '82%': {
                        opacity: 1,
                        transform: 'translateY(1px) scale(0.992)',
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'translateY(0) scale(1)',
                    },
                },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <AutoAwesomeRounded sx={{ fontSize: 18, color: 'common.white' }} />
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'common.white' }}>
                        {title}
                    </Typography>
                </Stack>
            </Stack>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.94)', fontWeight: 500, pr: 4 }}>
                {isGenerating ? (
                    <Box
                        component="span"
                        sx={{
                            display: 'inline-block',
                            color: 'transparent',
                            backgroundImage:
                                'linear-gradient(110deg, rgba(255,255,255,0.35) 10%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.35) 90%)',
                            backgroundSize: '220% 100%',
                            backgroundPosition: '100% 50%',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            animation: 'aiInsightTextShimmer 1.6s linear infinite',
                            '@keyframes aiInsightTextShimmer': {
                                '0%': { backgroundPosition: '100% 50%' },
                                '100%': { backgroundPosition: '-100% 50%' },
                            },
                        }}
                    >
                        {loadingText}
                    </Box>
                ) : (
                    insight || emptyText
                )}
            </Typography>
        </Box>
    );
}
