import {
  CheckCircle,
  DeleteOutline,
  EditOutlined,
  FmdGoodOutlined,
  LocalShipping,
  PlaceOutlined,
  RadioButtonUnchecked,
  StarOutline,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  getCustomerOrderStatusColor,
  getCustomerOrderStatusLabel,
  type CustomerOrderStatus,
} from "../../../utils/statusUtils";

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: CustomerOrderStatus;
  price: number;
  date: string;
  category: string;
  weight: string;
  pickup: string;
  dropoff: string;
  driverName: string;
  driverPhone: string;
  /** true when a rating was already submitted for this order */
  rated?: boolean;
}

interface CustomerOrderCardProps {
  order: CustomerOrder;
  onOpenChat: (order: CustomerOrder) => void;
  onViewDetails?: (order: CustomerOrder) => void;
  onEdit?: (order: CustomerOrder) => void;
  onDelete?: (order: CustomerOrder) => void;
  onRate?: (order: CustomerOrder) => void;
}

export default function CustomerOrderCard({
  order,
  onOpenChat,
  onViewDetails,
  onEdit,
  onDelete,
  onRate,
}: CustomerOrderCardProps) {
  const statusColor = getCustomerOrderStatusColor(order.status);
  const canModify = order.status === "pending";
  const canRate = order.status === "delivered";

  return (
    <Card
      variant="outlined"
      sx={{
        p: 0,
        overflow: "hidden",
        borderLeft: `3px solid ${statusColor}`,
      }}
    >
      <Box sx={{ px: 2, py: 1.75 }}>
        <Stack spacing={1.5}>
          {/* Header row */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={getCustomerOrderStatusLabel(order.status)}
                  size="small"
                  sx={{
                    height: 20,
                    bgcolor: statusColor + "18",
                    color: statusColor,
                    border: `1px solid ${statusColor}40`,
                    "& .MuiChip-label": { px: 1, fontSize: "0.68rem" },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={500}
                >
                  {order.orderNumber}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {order.category} · {order.weight} · {order.date}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.25}>
              {canModify && (
                <>
                  <Tooltip title="Edit order">
                    <IconButton size="small" onClick={() => onEdit?.(order)}>
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete order">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete?.(order)}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              <Stack alignItems="flex-end" spacing={0.1} sx={{ ml: 0.5 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  color="success.main"
                  lineHeight={1.1}
                >
                  ${order.price.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
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
                  {order.pickup}
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
                  {order.dropoff}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Driver strip */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 1.25, py: 1, borderRadius: 1.5, bgcolor: "action.hover" }}
          >
            <Stack spacing={0}>
              <Typography variant="caption" color="text.secondary">
                Driver
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {order.driverName}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              {order.driverPhone}
            </Typography>
          </Stack>

          {/* Status timeline */}
          {order.status !== "cancelled" && (
            <>
              <Divider />
              <StatusTimeline status={order.status} />
            </>
          )}

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
              disabled={
                order.driverName === "Not assigned" ||
                order.status === "delivered"
              }
              onClick={() => onOpenChat(order)}
            >
              Chat
            </Button>
            {canRate && (
              <Tooltip
                title={order.rated ? "View your rating" : "Rate your driver"}
              >
                <Button
                  variant={order.rated ? "outlined" : "contained"}
                  size="small"
                  color="warning"
                  startIcon={<StarOutline fontSize="small" />}
                  onClick={() => onRate?.(order)}
                  sx={{ flex: 1.2 }}
                >
                  {order.rated ? "Rated" : "Rate"}
                </Button>
              </Tooltip>
            )}
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => onViewDetails?.(order)}
                sx={{ border: 1, borderColor: "divider" }}
              >
                <VisibilityOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}

const TIMELINE_STEPS: {
  key: CustomerOrderStatus | "in-transit";
  label: string;
}[] = [
  { key: "pending", label: "Pending" },
  { key: "in-transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
];

function StatusTimeline({ status }: { status: CustomerOrderStatus }) {
  const stepIndex = TIMELINE_STEPS.findIndex((s) => s.key === status);

  return (
    <Stack direction="row" alignItems="center" spacing={0}>
      {TIMELINE_STEPS.map((step, idx) => {
        const done =
          idx < stepIndex || (status === "delivered" && idx === stepIndex);
        const active = idx === stepIndex && status !== "delivered";
        const color = active
          ? getCustomerOrderStatusColor(status)
          : done
            ? "#10B981"
            : "#CBD5E1";

        return (
          <Stack
            key={step.key}
            direction="row"
            alignItems="center"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Stack alignItems="center" spacing={0.25} sx={{ minWidth: 48 }}>
              {done ? (
                <CheckCircle sx={{ fontSize: 16, color: "#10B981" }} />
              ) : active && status === "in-transit" ? (
                <LocalShipping sx={{ fontSize: 16, color }} />
              ) : (
                <RadioButtonUnchecked sx={{ fontSize: 16, color }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.6rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? color : done ? "#10B981" : "text.disabled",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </Typography>
            </Stack>
            {idx < TIMELINE_STEPS.length - 1 && (
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  mb: 2.2,
                  bgcolor: done ? "#10B981" : "divider",
                  borderRadius: 1,
                }}
              />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}
