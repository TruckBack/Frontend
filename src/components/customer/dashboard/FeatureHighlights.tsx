import type { ReactNode } from "react";
import { Box, Card, Stack, Typography } from "@mui/material";

interface FeatureItem {
  title: string;
  description: string;
  icon: ReactNode;
}

interface FeatureHighlightsProps {
  features: FeatureItem[];
}

export default function FeatureHighlights({
  features,
}: FeatureHighlightsProps) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h6" fontWeight={700}>
        Why Choose TruckBack?
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1.5,
        }}
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            variant="outlined"
            sx={{ p: 2, minHeight: 120 }}
          >
            <Stack spacing={1.5}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& svg": { color: "common.white", fontSize: 20 },
                }}
              >
                {feature.icon}
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.5 }}
                >
                  {feature.description}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
