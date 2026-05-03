import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Rating as MuiRating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { orderService } from "../../services/order";
import type { Rating } from "../../services/types";

interface DriverRatingSectionProps {
  /** The raw Order id (number) */
  orderId: number;
  /** Initial rating object — null means no rating yet, undefined means still loading */
  initialRating: Rating | null | undefined;
}

export default function DriverRatingSection({
  orderId,
  initialRating,
}: DriverRatingSectionProps) {
  const [rating, setRating] = useState<Rating | null | undefined>(
    initialRating,
  );
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (initialRating === undefined && rating === undefined) {
    return null; // still loading in parent
  }

  if (!rating) {
    return (
      <Typography variant="caption" color="text.secondary">
        No rating submitted by the customer yet.
      </Typography>
    );
  }

  const handleOpenReply = () => {
    setResponseText(rating.driver_response ?? "");
    setSaveError(null);
    setShowReplyForm(true);
  };

  const handleSaveResponse = async () => {
    if (!responseText.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await orderService.submitDriverResponse(orderId, {
        response: responseText.trim(),
      });
      setRating(updated);
      setShowReplyForm(false);
    } catch {
      setSaveError("Failed to save response. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResponse = async () => {
    setDeleting(true);
    try {
      const updated = await orderService.deleteDriverResponse(orderId);
      setRating(updated);
      setConfirmDelete(false);
      setShowReplyForm(false);
    } catch {
      // silently ignore — user can retry
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Stack spacing={1.5}>
      {/* Customer review */}
      <Stack spacing={0.5}>
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          Customer review
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <MuiRating value={rating.score} readOnly size="small" />
          <Typography variant="caption" color="text.secondary">
            {new Date(rating.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Typography>
        </Stack>
        {rating.comment && (
          <Typography variant="body2">{rating.comment}</Typography>
        )}
      </Stack>

      {/* Driver response */}
      {rating.driver_response && !showReplyForm && (
        <>
          <Divider />
          <Box sx={{ pl: 1.5, borderLeft: 3, borderColor: "primary.main" }}>
            <Typography variant="caption" fontWeight={600} color="primary.main">
              Your response
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              {rating.driver_response}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={handleOpenReply}>
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          </Stack>
        </>
      )}

      {/* Reply / edit form */}
      {showReplyForm ? (
        <Stack spacing={1.5}>
          {saveError && (
            <Alert severity="error" onClose={() => setSaveError(null)}>
              {saveError}
            </Alert>
          )}
          <TextField
            label="Your response"
            multiline
            minRows={3}
            fullWidth
            value={responseText}
            onChange={(e) => setResponseText(e.target.value.slice(0, 2000))}
            helperText={`${responseText.length} / 2000`}
            inputProps={{ maxLength: 2000 }}
            size="small"
          />
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              onClick={handleSaveResponse}
              disabled={saving || !responseText.trim()}
              startIcon={
                saving ? (
                  <CircularProgress size={14} color="inherit" />
                ) : undefined
              }
            >
              Save
            </Button>
            <Button
              size="small"
              onClick={() => setShowReplyForm(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      ) : !rating.driver_response ? (
        <Button
          size="small"
          variant="outlined"
          onClick={handleOpenReply}
          sx={{ alignSelf: "flex-start" }}
        >
          Reply to review
        </Button>
      ) : null}

      {/* Delete confirmation dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Delete your response?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove your reply to this review.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteResponse}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={14} color="inherit" />
              ) : undefined
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

// Also re-export RatingCard for convenience
export { default as RatingCard } from "../shared/RatingCard";
