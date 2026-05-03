import { Box, Divider, Rating as MuiRating, Stack, Typography } from '@mui/material';
import type { Rating } from '../../services/types';

interface RatingCardProps {
    rating: Rating;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function RatingCard({ rating }: RatingCardProps) {
    return (
        <Stack spacing={1.5}>
            <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <MuiRating value={rating.score} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(rating.created_at)}
                    </Typography>
                </Stack>
                {rating.comment && (
                    <Typography variant="body2">{rating.comment}</Typography>
                )}
            </Stack>

            {rating.driver_response && (
                <>
                    <Divider />
                    <Box
                        sx={{
                            pl: 1.5,
                            borderLeft: 3,
                            borderColor: 'primary.main',
                        }}
                    >
                        <Typography variant="caption" fontWeight={600} color="primary.main">
                            Driver's response
                            {rating.driver_responded_at && (
                                <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                    fontWeight={400}
                                >
                                    {' '}· {formatDate(rating.driver_responded_at)}
                                </Typography>
                            )}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.25 }}>
                            {rating.driver_response}
                        </Typography>
                    </Box>
                </>
            )}
        </Stack>
    );
}
