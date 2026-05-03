import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import DeliveryCard, {
  type Delivery,
} from "../../components/driver/DeliveryCard";
import { orderService } from "../../services/order";
import { driverService } from "../../services/driver";
import type { Order, DriverStatus } from "../../services/types";
import OrderDetailDialog from "../../components/shared/OrderDetailDialog";

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
  const [driverStatus, setDriverStatus] = useState<DriverStatus | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [snack, setSnack] = useState<{
    open: boolean;
    severity: "success" | "error" | "warning";
    message: string;
  }>({ open: false, severity: "success", message: "" });

  const showSnack = (severity: typeof snack.severity, message: string) =>
    setSnack({ open: true, severity, message });

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
    driverService
      .getMyProfile()
      .then((profile) => setDriverStatus(profile.status))
      .catch(() => {
        /* status check is best-effort */
      });
  }, []);

  const handleAccept = async (id: string) => {
    if (driverStatus === "offline") {
      showSnack(
        "warning",
        "You're currently offline. Switch to Available from your Active Deliveries page before accepting orders.",
      );
      return;
    }

    setAcceptingId(id);
    try {
      await orderService.acceptOrder(Number(id));
      showSnack(
        "success",
        "Order accepted! Check your Active Deliveries to get started.",
      );
      await fetchAvailableOrders();
    } catch (err) {
      const detail =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response
            ?.data?.detail
          : undefined;
      showSnack(
        "error",
        typeof detail === "string"
          ? detail
          : "Failed to accept the order. Please try again.",
      );
      console.error(`Failed to accept order ${id}:`, err);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleViewDetails = (id: string) => {
    setSelectedOrderId(Number(id));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 680,
        mx: "auto",
        pb: { xs: 10, md: 0 },
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
              onViewDetails={handleViewDetails}
              accepting={acceptingId === String(order.id)}
            />
          ))}
        </Stack>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
      <OrderDetailDialog
        key={selectedOrderId ?? "closed"}
        orderId={selectedOrderId}
        open={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        role="driver"
        onAccept={(id) =>
          handleAccept(String(id)).then(() => setSelectedOrderId(null))
        }
      />
    </Box>
  );
};

export default DriverFinder;

