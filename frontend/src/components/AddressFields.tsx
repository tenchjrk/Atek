import { TextField, Typography, Box, Stack } from '@mui/material';

interface AddressFieldsProps {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  onAddressLine1Change: (value: string) => void;
  onAddressLine2Change: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onPostalCodeChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  disabled?: boolean;
}

export default function AddressFields({
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  country,
  onAddressLine1Change,
  onAddressLine2Change,
  onCityChange,
  onStateChange,
  onPostalCodeChange,
  onCountryChange,
  disabled = false,
}: AddressFieldsProps) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Address Information (Optional)
      </Typography>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Address Line 1"
          value={addressLine1}
          onChange={(e) => onAddressLine1Change(e.target.value)}
          disabled={disabled}
        />
        <TextField
          fullWidth
          label="Address Line 2"
          value={addressLine2}
          onChange={(e) => onAddressLine2Change(e.target.value)}
          disabled={disabled}
        />
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth
            label="City"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={disabled}
          />
          <TextField
            fullWidth
            label="State/Province"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            disabled={disabled}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth
            label="Postal Code"
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value)}
            disabled={disabled}
          />
          <TextField
            fullWidth
            label="Country"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            disabled={disabled}
          />
        </Box>
      </Stack>
    </Box>
  );
}