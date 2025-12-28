import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { VendorType } from '../types';

interface VendorTypeSelectorProps {
  vendorTypes: VendorType[];
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
  disabled?: boolean;
}

export default function VendorTypeSelector({
  vendorTypes,
  value,
  onChange,
  label = 'Vendor Type',
  disabled = false,
}: VendorTypeSelectorProps) {
  const handleChange = (event: SelectChangeEvent<number | string>) => {
    const newValue = event.target.value;
    onChange(newValue === '' ? null : Number(newValue));
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value ?? ''}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {vendorTypes.map((vendorType) => (
          <MenuItem key={vendorType.id} value={vendorType.id}>
            {vendorType.type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}