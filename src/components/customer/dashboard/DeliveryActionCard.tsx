import { Add, LocalShippingOutlined } from "@mui/icons-material";
import { Box, Button, Card, Stack, Typography } from "@mui/material";

interface DeliveryActionCardProps {
  onCreateOrder: () => void;
}

export default function DeliveryActionCard({
  onCreateOrder,
}: DeliveryActionCardProps) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        background:
          "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)",
        color: "common.white",
        border: "none",
        position: "relative",
        overflow: "hidden",
        "&:hover": { boxShadow: "0 8px 30px rgba(37,99,235,0.40)" },
      }}
    >
      {/* Watermark icon */}
      <Box
        sx={{
          position: "absolute",
          right: -16,
          bottom: -16,
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        <LocalShippingOutlined sx={{ fontSize: 120 }} />
      </Box>

      <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={0.75}>
          <Typography variant="h5" fontWeight={800} lineHeight={1.2}>
            Request a Delivery
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, maxWidth: 280 }}>
            Get your items picked up and delivered quickly and safely.
          </Typography>
        </Stack>
        <Box>
          <Button
            variant="contained"
            size="medium"
            startIcon={<Add />}
            onClick={onCreateOrder}
            sx={{
              bgcolor: "#F59E0B",
              color: "#fff",
              fontWeight: 700,
              px: 2.5,
              "&:hover": {
                bgcolor: "#D97706",
                boxShadow: "0 4px 14px rgba(245,158,11,0.45)",
              },
            }}
          >
            New Order
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}
