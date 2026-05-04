import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { VisibilityOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getDriverDeliveryStatusColor,
  getDriverDeliveryStatusLabel,
  type DriverDeliveryStatus,
} from "../../utils/statusUtils";

export interface Delivery {
  id: string;
  driverName: string;
  status: DriverDeliveryStatus;
  price: number;
  category: string;
  weight: string;
  distance: string;
  pickup: string;
  dropoff: string;
  phone: string;
}

interface DeliveryCardProps {
  delivery: Delivery;
  onViewDetails?: (id: string) => void;
  onAccept?: (id: string) => void;
  onStart?: (id: string) => void;
  onPickup?: (id: string) => void;
  onComplete?: (id: string) => void;
  /** True while an accept request for this card is in-flight. */
  accepting?: boolean;
}

const DeliveryCard = ({
  delivery,
  onViewDetails,
  onAccept,
  onStart,
  onPickup,
  onComplete,
  accepting = false,
}: DeliveryCardProps) => {
  const navigate = useNavigate();
  const statusColor = getDriverDeliveryStatusColor(delivery.status);
  const theme = useTheme();

  const renderActionButtons = () => {
    switch (delivery.status) {
      case "pending":
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            disabled={accepting}
            onClick={() => onAccept?.(delivery.id)}
            startIcon={
              accepting ? (
                <CircularProgress size={14} color="inherit" />
              ) : undefined
            }
          >
            {accepting ? "Accepting…" : "Accept"}
          </Button>
        );
      case "accepted":
        return (
          <Button
            variant="contained"
            color="info"
            size="small"
            fullWidth
            onClick={() => onStart?.(delivery.id)}
          >
            Start Driving
          </Button>
        );
      case "in-progress":
        return (
          <Button
            variant="contained"
            color="warning"
            size="small"
            fullWidth
            onClick={() => onPickup?.(delivery.id)}
          >
            Confirm Pickup
          </Button>
        );
      case "picked-up":
        return (
          <Button
            variant="contained"
            color="success"
            size="small"
            fullWidth
            onClick={() => onComplete?.(delivery.id)}
          >
            Complete Delivery
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        p: 2,
        overflow: "hidden",
        borderLeft: `4px solid ${statusColor}`,
        borderRadius: 2,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {delivery.driverName}
            </Typography>
            <Chip
              label={getDriverDeliveryStatusLabel(delivery.status)}
              size="small"
              variant="outlined"
              sx={{
                width: "fit-content",
                borderColor: statusColor,
                color: statusColor,
                fontWeight: 600,
              }}
            />
          </Stack>

          <Typography variant="subtitle2" fontWeight={700} noWrap>
            ${delivery.price.toFixed(2)}
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {delivery.category} • {delivery.weight}
        </Typography>

        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: theme.palette.success.main,
                flexShrink: 0,
                mt: 0.35,
              }}
            />
            <Stack spacing={0} sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary">
                Pickup
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.35 }}>
                {delivery.pickup}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: theme.palette.error.main,
                flexShrink: 0,
                mt: 0.35,
              }}
            />
            <Stack spacing={0} sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary">
                Drop-off
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.35 }}>
                {delivery.dropoff}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {delivery.phone && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              px: 1.25,
              py: 1,
              borderRadius: 1.5,
              bgcolor: "action.hover",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Customer phone
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {delivery.phone}
            </Typography>
          </Stack>
        )}

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {renderActionButtons()}
          <Tooltip title="View Details">
            <Button
              variant="outlined"
              size="small"
              onClick={() => onViewDetails?.(delivery.id)}
              startIcon={<VisibilityOutlined fontSize="small" />}
              sx={{ flex: "1 1 140px" }}
            >
              Details
            </Button>
          </Tooltip>
          <Button
            variant="outlined"
            size="small"
            disabled={delivery.status === "completed"}
            onClick={() =>
              navigate(`/driver/chat/${delivery.id}`, {
                state: {
                  partnerName: "Customer",
                  orderTitle: `${delivery.category} Delivery`,
                  customerName: "Customer",
                },
              })
            }
            sx={{ flex: "1 1 120px" }}
          >
            Chat
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default DeliveryCard;
