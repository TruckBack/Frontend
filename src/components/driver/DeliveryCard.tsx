import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { FavoriteBorder, VisibilityOutlined } from "@mui/icons-material";
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
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColor = getDriverDeliveryStatusColor(
    delivery.status,
    theme.palette,
  );

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
        borderRadius: 2,
        borderLeft: `4px solid ${statusColor}`,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 2 }}
      >
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" fontWeight={600}>
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
            }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <FavoriteBorder
            sx={{
              fontSize: { xs: 20, sm: 24 },
              color: theme.palette.text.secondary,
              cursor: "pointer",
            }}
          />
          <Typography variant="subtitle2" fontWeight={600}>
            ${delivery.price.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {delivery.category} • {delivery.weight} • {delivery.distance}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: theme.palette.success.main,
              flexShrink: 0,
              mt: 0.5,
            }}
          />
          <Stack spacing={0}>
            <Typography variant="caption" color="text.secondary">
              Pickup
            </Typography>
            <Typography variant="caption" fontWeight={500}>
              {delivery.pickup}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: theme.palette.error.main,
              flexShrink: 0,
              mt: 0.5,
            }}
          />
          <Stack spacing={0}>
            <Typography variant="caption" color="text.secondary">
              Drop-off
            </Typography>
            <Typography variant="caption" fontWeight={500}>
              {delivery.dropoff}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={0}>
          <Typography variant="caption" color="text.secondary">
            Customer Phone:
          </Typography>
          <Typography variant="caption" fontWeight={500}>
            {delivery.phone}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          "& button": {
            flex: 1,
          },
        }}
      >
        {renderActionButtons()}
        

        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => onViewDetails?.(delivery.id)}
        >
          Details
        </Button>

        <Button
          variant="contained"
          color="secondary"
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
        >
          Chat
        </Button>
      </Stack>
    </Card>
  );
};

export default DeliveryCard;
