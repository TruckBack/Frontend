import { useEffect, useState } from "react";
import { ExpandMore, StarRounded } from "@mui/icons-material";
import {
  Box,
  Card,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { orderService } from "../../../services/order";
import type { Rating } from "../../../services/types";
import DriverRatingSection from "../DriverRatingSection";

export interface PastDelivery {
  id: string;
  orderId: number;
  customerName: string;
  price: number;
  category: string;
  weight: string;
  distance: string;
  completedDate: string;
  rating?: number;
}

interface PastDeliveryCardProps {
  delivery: PastDelivery;
}

export default function PastDeliveryCard({ delivery }: PastDeliveryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState<Rating | null | undefined>(undefined);

  // Fetch rating when user expands the card
  useEffect(() => {
    if (!expanded || rating !== undefined) return;
    orderService
      .getOrderRating(delivery.orderId)
      .then((r) => setRating(r))
      .catch(() => setRating(null));
  }, [expanded, delivery.orderId, rating]);

  return (
    <Card
      sx={{
        p: 0,
        overflow: "hidden",
        borderLeft: "3px solid #10B981",
      }}
    >
      <Box sx={{ px: 2, py: 1.75 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 1 }}
        >
          <Stack spacing={0.25}>
            <Typography variant="subtitle2" fontWeight={700}>
              {delivery.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {delivery.completedDate} · {delivery.category} · {delivery.weight}{" "}
              · {delivery.distance}
            </Typography>
          </Stack>
          <Typography variant="subtitle1" fontWeight={700} color="success.main">
            ${delivery.price.toFixed(2)}
          </Typography>
        </Stack>

        {delivery.rating ? (
          <Stack
            direction="row"
            spacing={0.25}
            alignItems="center"
            sx={{ mb: 1 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <StarRounded
                key={i}
                sx={{
                  fontSize: 16,
                  color: i < delivery.rating! ? "#F59E0B" : "action.disabled",
                }}
              />
            ))}
          </Stack>
        ) : null}

        {/* Rating section toggle */}
        <Stack direction="row" alignItems="center">
          <Typography
            variant="caption"
            color="primary.main"
            fontWeight={600}
            sx={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Hide review" : "Customer review"}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setExpanded((e) => !e)}
            sx={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
              ml: 0.5,
            }}
          >
            <ExpandMore fontSize="small" />
          </IconButton>
        </Stack>

        <Collapse in={expanded} unmountOnExit>
          <Divider sx={{ my: 1.5 }} />
          {rating === undefined ? (
            <Typography variant="caption" color="text.secondary">
              Loading…
            </Typography>
          ) : (
            <DriverRatingSection
              orderId={delivery.orderId}
              initialRating={rating}
            />
          )}
        </Collapse>
      </Box>
    </Card>
  );
}
