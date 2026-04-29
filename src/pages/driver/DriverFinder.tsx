import { useEffect, useState } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import DeliveryCard, {
  type Delivery,
} from "../../components/driver/DeliveryCard";
import { orderService } from "../../services/order";
import type { Order } from "../../services/types";

const mapOrderToDelivery = (order: Order): Delivery => ({
  id: String(order.id),
  driverName: order.cargo_description || "General Cargo",
  status: "pending",
  price: order.price_cents / 100,
  category: order.cargo_description || "General",
  weight: order.cargo_weight_kg ? `${order.cargo_weight_kg} kg` : "N/A",
  distance: "N/A",
  pickup: order.pickup_address,
  dropoff: order.dropoff_address,
  phone: "",
});

const DriverFinder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableOrders = async () => {
    try {
      setLoading(true);
      const page = await orderService.listAvailableOrders();
      setOrders(page.items);
    } catch (err) {
      setError("Failed to load available deliveries.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await orderService.acceptOrder(Number(id));
      fetchAvailableOrders();
    } catch (err) {
      console.error(`Failed to accept order ${id}:`, err);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 680,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        boxSizing: "border-box",
        height: { xs: "calc(100dvh - 56px)", md: "100dvh" },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <PageHeader
        title="Find Deliveries"
        subtitle="Available orders you can assign to yourself"
      />

      {loading && (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
      )}

      {error && (
        <Typography color="error" sx={{ textAlign: "center", my: 4 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && orders.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", my: 4 }}>
          No available deliveries right now.
        </Typography>
      )}

      {!loading && !error && orders.length > 0 && (
        <Stack spacing={2} sx={{ overflowY: "auto", pb: { xs: 10, md: 3 } }}>
          {orders.map((order) => (
            <DeliveryCard
              key={order.id}
              delivery={mapOrderToDelivery(order)}
              onAccept={handleAccept}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default DriverFinder;
