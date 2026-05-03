import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Rating as MuiRating,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { orderService } from '../../services/order';
import type { Rating, RatingCreate } from '../../services/types';
import RatingCard from './RatingCard';

interface RatingModalProps {
    orderId: number;
    open: boolean;
    onClose: () => void;
    onRated?: (rating: Rating) => void;
}

export default function RatingModal({ orderId, open, onClose, onRated }: RatingModalProps) {
    const [existing, setExisting] = useState<Rating | null | undefined>(undefined);
    const [loadingExisting, setLoadingExisting] = useState(false);

    const [score, setScore] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset and fetch existing rating when modal opens
    useEffect(() => {
        if (!open) return;
        setScore(null);
        setComment('');
        setError(null);
        setExisting(undefined);
        setLoadingExisting(true);
        orderService.getOrderRating(orderId)
            .then(r => setExisting(r))
            .catch(() => setExisting(null))
            .finally(() => setLoadingExisting(false));
    }, [open, orderId]);

    const handleSubmit = async () => {
        if (!score) return;
        setSubmitting(true);
        setError(null);
        try {
            const payload: RatingCreate = {
                score,
                comment: comment.trim() || null,
            };
            const created = await orderService.submitRating(orderId, payload);
            setExisting(created);
            onRated?.(created);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 409) {
                setError('You have already submitted a rating for this order.');
                // Refresh to show the existing rating
                const r = await orderService.getOrderRating(orderId).catch(() => null);
                setExisting(r);
            } else if (status === 400) {
                setError('This order cannot be rated yet (not completed or no assigned driver).');
            } else if (status === 403) {
                setError('You are not authorized to rate this order.');
            } else {
                setError('Failed to submit rating. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={700}>
                        Rate Your Driver — Order #{orderId}
                    </Typography>
                    <IconButton size="small" onClick={onClose}>
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent>
                {loadingExisting ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : existing ? (
                    // Already rated — show read-only card
                    <RatingCard rating={existing} />
                ) : (
                    // Show rating form
                    <Stack spacing={2.5} sx={{ mt: 0.5 }}>
                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        <Stack spacing={1} alignItems="flex-start">
                            <Typography variant="body2" fontWeight={600}>
                                Your rating <Typography component="span" color="error.main">*</Typography>
                            </Typography>
                            <MuiRating
                                value={score}
                                onChange={(_, val) => setScore(val)}
                                size="large"
                            />
                            {score !== null && (
                                <Typography variant="caption" color="text.secondary">
                                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][score]}
                                </Typography>
                            )}
                        </Stack>

                        <TextField
                            label="Comment (optional)"
                            multiline
                            minRows={3}
                            fullWidth
                            value={comment}
                            onChange={e => setComment(e.target.value.slice(0, 1000))}
                            helperText={`${comment.length} / 1000`}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Stack>
                )}
            </DialogContent>

            {!loadingExisting && !existing && (
                <DialogActions>
                    <Button onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={submitting || !score}
                        startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
                    >
                        Submit Rating
                    </Button>
                </DialogActions>
            )}

            {existing && (
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            )}
        </Dialog>
    );
}
