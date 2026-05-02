import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { LocalShippingOutlined } from "@mui/icons-material";
import { driverService } from "../../services/driver";
import type { DriverStatus } from "../../services/types";

function getDetailMessage(err: unknown): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "detail" in err.response.data &&
    typeof (err.response.data as { detail: unknown }).detail === "string"
  ) {
    const detail = (err.response.data as { detail: string }).detail;
    if (detail === "Cannot go offline while having active orders") {
      return "You have an active order. Complete or cancel it before going offline.";
    }
    return detail;
  }
  return err instanceof Error ? err.message : "Failed to update status.";
}

interface DriverStatusToggleProps {
  /** Optionally pass an already-fetched status to avoid a duplicate network call. */
  initialStatus?: DriverStatus;
}

export default function DriverStatusToggle({
  initialStatus,
}: DriverStatusToggleProps) {
  const [status, setStatus] = useState<DriverStatus | null>(
    initialStatus ?? null,
  );
  const [loading, setLoading] = useState(!initialStatus);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialStatus !== undefined) return;
    driverService
      .getMyProfile()
      .then((profile) => setStatus(profile.status))
      .catch(() => setError("Could not load driver status."))
      .finally(() => setLoading(false));
  }, [initialStatus]);

  const handleToggle = async () => {
    if (!status || status === "busy" || toggling) return;
    const next: DriverStatus = status === "offline" ? "available" : "offline";
    setToggling(true);
    setError(null);
    const previous = status;
    try {
      const updated = await driverService.updateStatus({ status: next });
      setStatus(updated.status);
    } catch (err) {
      setStatus(previous);
      setError(getDetailMessage(err));
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <CircularProgress size={20} />;
  }

  const isBusy = status === "busy";
  const isAvailable = status === "available";
  const isDisabled = isBusy || toggling;

  return (
    <Stack spacing={0.5}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          bgcolor: isBusy
            ? "warning.light"
            : isAvailable
              ? "success.light"
              : "action.selected",
          transition: "background-color 0.3s",
        }}
      >
        {isBusy ? (
          <>
            <LocalShippingOutlined
              sx={{ color: "warning.dark", fontSize: 20 }}
            />
            <Typography variant="body2" fontWeight={600} color="warning.dark">
              On a delivery
            </Typography>
          </>
        ) : (
          <FormControlLabel
            control={
              <Switch
                checked={isAvailable}
                onChange={handleToggle}
                disabled={isDisabled}
                size="small"
                sx={{
                  "& .MuiSwitch-thumb": {
                    bgcolor: isAvailable ? "success.main" : "text.disabled",
                  },
                  "& .MuiSwitch-track": {
                    bgcolor: isAvailable ? "success.light" : undefined,
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {toggling && <CircularProgress size={12} />}
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={isAvailable ? "success.dark" : "text.secondary"}
                >
                  {isAvailable ? "Available" : "Offline"}
                </Typography>
              </Box>
            }
          />
        )}
      </Box>

      {error && (
        <Alert
          severity="warning"
          onClose={() => setError(null)}
          sx={{ py: 0.5 }}
        >
          {error}
        </Alert>
      )}
    </Stack>
  );
}
