import { ArrowForward } from "@mui/icons-material";
import { Box, Card, Chip, Stack, Typography, useTheme } from "@mui/material";

interface RecentOrder {
  id: string;
  title: string;
  status: string;
  from: string;
  to: string;
}

interface RecentOrdersListProps {
  orders: RecentOrder[];
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "#F59E0B";
    case "in-transit":
      return "#2563EB";
    case "delivered":
      return "#10B981";
    case "cancelled":
      return "#EF4444";
    default:
      return "#64748B";
  }
}

export default function RecentOrdersList({ orders }: RecentOrdersListProps) {
  const theme = useTheme();
  return (
    <Stack spacing={1.5}>
      <Typography variant="h6" fontWeight={700}>
        Recent Orders
      </Typography>
      <Stack spacing={1}>
        {orders.map((order) => {
          const statusColor = getStatusColor(order.status);
          return (
            <Card
              key={order.id}
              variant="outlined"
              sx={{
                p: 0,
                overflow: "hidden",
                borderLeft: `3px solid ${statusColor}`,
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 0.75 }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    noWrap
                    sx={{ flex: 1, mr: 1 }}
                  >
                    {order.title}
                  </Typography>
                  <Chip
                    label={order.status}
                    size="small"
                    sx={{
                      height: 20,
                      bgcolor: statusColor + "20",
                      color: statusColor,
                      fontWeight: 700,
                      fontSize: "0.68rem",
                      border: `1px solid ${statusColor}40`,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Stack>
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <Typography variant="caption" noWrap sx={{ maxWidth: 120 }}>
                    {order.from}
                  </Typography>
                  <ArrowForward sx={{ fontSize: 12, flexShrink: 0 }} />
                  <Typography variant="caption" noWrap sx={{ maxWidth: 120 }}>
                    {order.to}
                  </Typography>
                </Stack>
              </Box>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
}
