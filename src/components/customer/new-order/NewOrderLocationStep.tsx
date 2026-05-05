import { useEffect, useRef, useState } from "react";
import { LocationOn } from "@mui/icons-material";
import {
  Autocomplete,
  Card,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  NewOrderFieldErrors,
  NewOrderFormData,
} from "../../../hooks/useNewOrderFlow";

interface NominatimResult {
  display_name: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: boolean;
  helperText?: string;
  icon: React.ReactNode;
}

/** Returns a 0–1 score for how well `query` fuzzy-matches `text`. */
function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let matched = 0;
  let pos = 0;
  for (const ch of q) {
    const idx = t.indexOf(ch, pos);
    if (idx !== -1) {
      matched++;
      pos = idx + 1;
    }
  }
  return q.length === 0 ? 0 : matched / q.length;
}

function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon,
}: AddressAutocompleteProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const lastResultsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      if (debounceRef.current !== null)
        window.clearTimeout(debounceRef.current);
    };
  }, []);

  const handleInputChange = (_: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
    if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);

    if (newValue.trim().length < 3) {
      setOptions([]);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(newValue)}&format=json&limit=7`,
          { headers: { "Accept-Language": "he,en" } },
        );
        const data: NominatimResult[] = await res.json();
        const fresh = data.map((item) => item.display_name);

        if (fresh.length > 0) {
          lastResultsRef.current = fresh;
          setOptions(fresh);
        } else if (lastResultsRef.current.length > 0) {
          // No API results — fuzzy-rank the last known results against the current query
          const ranked = lastResultsRef.current
            .map((opt) => ({ opt, score: fuzzyScore(newValue, opt) }))
            .sort((a, b) => b.score - a.score)
            .filter(({ score }) => score > 0.4);
          // Always show at least the top match even if score is low
          const fallback =
            ranked.length > 0
              ? ranked.slice(0, 3).map(({ opt }) => opt)
              : [lastResultsRef.current[0]];
          setOptions(fallback);
        } else {
          setOptions([]);
        }
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      inputValue={value}
      onInputChange={handleInputChange}
      onChange={(_, newValue) => {
        if (typeof newValue === "string") onChange(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          size="small"
          fullWidth
          required
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">{icon}</InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={16} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

interface NewOrderLocationStepProps {
  formData: NewOrderFormData;
  fieldErrors: NewOrderFieldErrors;
  onFieldChange: <K extends keyof NewOrderFormData>(
    field: K,
    value: NewOrderFormData[K],
  ) => void;
}

export default function NewOrderLocationStep({
  formData,
  fieldErrors,
  onFieldChange,
}: NewOrderLocationStepProps) {
  const _now = new Date();
  const today = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, "0")}-${String(_now.getDate()).padStart(2, "0")}`;

  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <LocationOn color="primary" fontSize="small" />
          <Typography variant="h6" fontWeight={600} color="primary.main">
            Delivery Details
          </Typography>
        </Stack>

        <AddressAutocomplete
          value={formData.pickupAddress}
          onChange={(val) => onFieldChange("pickupAddress", val)}
          placeholder="Pickup address..."
          error={Boolean(fieldErrors.pickupAddress)}
          helperText={fieldErrors.pickupAddress}
          icon={<LocationOn color="success" fontSize="small" />}
        />
        <AddressAutocomplete
          value={formData.deliveryAddress}
          onChange={(val) => onFieldChange("deliveryAddress", val)}
          placeholder="Delivery address..."
          error={Boolean(fieldErrors.deliveryAddress)}
          helperText={fieldErrors.deliveryAddress}
          icon={<LocationOn color="primary" fontSize="small" />}
        />

        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={600} color="primary.main">
            Preferred Date
          </Typography>
          <TextField
            type="date"
            size="small"
            fullWidth
            required
            value={formData.preferredDate}
            onChange={(event) =>
              onFieldChange("preferredDate", event.target.value)
            }
            error={Boolean(fieldErrors.preferredDate)}
            helperText={fieldErrors.preferredDate}
            inputProps={{ min: today }}
          />
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="primary.main"
            >
              Pickup Time:
            </Typography>
            <TextField
              type="time"
              size="small"
              fullWidth
              required
              value={formData.pickupTime}
              onChange={(event) =>
                onFieldChange("pickupTime", event.target.value)
              }
              error={Boolean(fieldErrors.pickupTime)}
              helperText={fieldErrors.pickupTime}
            />
          </Stack>
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="primary.main"
            >
              Delivery By:
            </Typography>
            <TextField
              type="time"
              size="small"
              fullWidth
              required
              value={formData.deliveryBy}
              onChange={(event) =>
                onFieldChange("deliveryBy", event.target.value)
              }
              error={Boolean(fieldErrors.deliveryBy)}
              helperText={fieldErrors.deliveryBy}
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
