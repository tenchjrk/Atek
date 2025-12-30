import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { AccountType } from '../types';

interface AccountTypeSelectorProps {
  accountTypes: AccountType[];
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
  disabled?: boolean;
}

export default function AccountTypeSelector({
  accountTypes,
  value,
  onChange,
  label = 'Account Type',
  disabled = false,
}: AccountTypeSelectorProps) {
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
        {accountTypes.map((accountType) => (
          <MenuItem key={accountType.id} value={accountType.id}>
            {accountType.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}