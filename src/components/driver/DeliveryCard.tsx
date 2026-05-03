import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  FmdGoodOutlined,
  PlaceOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
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
        p: 0,
        overflow: "hidden",
        borderLeft: `3px solid ${statusColor}`,
      }}
    >
      <Box sx={{ px: 2, py: 1.75 }}>
        <Stack spacing={1.5}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Stack spacing={0.5}>
              <Chip
                label={getDriverDeliveryStatusLabel(delivery.status)}
                size="small"
                sx={{
                  height: 20,
                  bgcolor: statusColor + "18",
                  color: statusColor,
                  border: `1px solid ${statusColor}40`,
                  width: "fit-content",
                  "& .MuiChip-label": { px: 1, fontSize: "0.68rem" },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {delivery.category} · {delivery.weight} · {delivery.distance}
              </Typography>
            </Stack>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="success.main"
            >
              ${delivery.price.toFixed(2)}
            </Typography>
          </Stack>

          {/* Route */}
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <FmdGoodOutlined
                sx={{ fontSize: 16, color: "#10B981", mt: 0.2, flexShrink: 0 }}
              />
              <Stack spacing={0}>
                <Typography variant="caption" color="text.secondary">
                  Pickup
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ lineHeight: 1.3 }}
                >
                  {delivery.pickup}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <PlaceOutlined
                sx={{ fontSize: 16, color: "#EF4444", mt: 0.2, flexShrink: 0 }}
              />
              <Stack spacing={0}>
                <Typography variant="caption" color="text.secondary">
                  Drop-off
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ lineHeight: 1.3 }}
                >
                  {delivery.dropoff}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Customer phone strip */}
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
                Customer
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {delivery.phone}
              </Typography>
            </Stack>
          )}

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            <Box sx={{ flex: 2 }}>{renderActionButtons()}</Box>
            <Tooltip title="View Details">
              <Button
                variant="outlined"
                size="small"
                sx={{ flex: 1, minWidth: 0 }}
                onClick={() => onViewDetails?.(delivery.id)}
                startIcon={<VisibilityOutlined fontSize="small" />}
              >
                Details
              </Button>
            </Tooltip>
            <Button
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
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
            >
              Chat
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
};

export default DeliveryCard;
