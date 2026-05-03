import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
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

  const segments: {
    value: DriverStatus;
    label: string;
    color: string;
    bg: string;
  }[] = [
    { value: "offline", label: "Offline", color: "#64748B", bg: "#64748B" },
    { value: "available", label: "Available", color: "#10B981", bg: "#10B981" },
    { value: "busy", label: "On Delivery", color: "#F59E0B", bg: "#F59E0B" },
  ];

  return (
    <Stack spacing={0.75}>
      <Box
        sx={{
          display: "inline-flex",
          borderRadius: 99,
          p: "3px",
          bgcolor: "action.selected",
          gap: "2px",
          width: "fit-content",
        }}
      >
        {segments.map((seg) => {
          const isActive = status === seg.value;
          const isClickable =
            seg.value !== "busy" && !toggling && status !== "busy";
          return (
            <Box
              key={seg.value}
              onClick={() => {
                if (!isClickable || isActive) return;
                handleToggle();
              }}
              sx={{
                px: 1.75,
                py: 0.6,
                borderRadius: 99,
                cursor: isClickable && !isActive ? "pointer" : "default",
                bgcolor: isActive ? seg.bg : "transparent",
                transition: "background-color 0.25s ease, color 0.25s ease",
                display: "flex",
                alignItems: "center",
                gap: 0.6,
              }}
            >
              {toggling && isActive && (
                <CircularProgress size={10} sx={{ color: "common.white" }} />
              )}
              <Typography
                variant="caption"
                fontWeight={isActive ? 700 : 500}
                sx={{
                  color: isActive ? "common.white" : "text.secondary",
                  userSelect: "none",
                }}
              >
                {seg.label}
              </Typography>
            </Box>
          );
        })}
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
