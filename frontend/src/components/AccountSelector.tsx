import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { Account } from '../types';

interface AccountSelectorProps {
  accounts: Account[];
  value: number | null;
  onChange: (value: number | null) => void;
  currentAccountId?: number; // To prevent selecting self as parent
  label?: string;
  disabled?: boolean;
}

export default function AccountSelector({
  accounts,
  value,
  onChange,
  currentAccountId,
  label = 'Parent Account',
  disabled = false,
}: AccountSelectorProps) {
  const handleChange = (event: SelectChangeEvent<number | string>) => {
    const newValue = event.target.value;
    onChange(newValue === '' ? null : Number(newValue));
  };

  // Filter out current account to prevent circular reference
  const availableAccounts = accounts.filter(
    (account) => account.id !== currentAccountId
  );

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value ?? ''}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None (Root Account)</em>
        </MenuItem>
        {availableAccounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name}
            {account.parentAccount && ` (under ${account.parentAccount.name})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}