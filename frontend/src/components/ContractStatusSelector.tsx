import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { ContractStatus } from '../types';

interface ContractStatusSelectorProps {
  contractStatuses: ContractStatus[];
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}

export default function ContractStatusSelector({
  contractStatuses,
  value,
  onChange,
  disabled = false,
}: ContractStatusSelectorProps) {
  const handleChange = (event: SelectChangeEvent<number | string>) => {
    const newValue = event.target.value;
    onChange(newValue === '' ? null : Number(newValue));
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>Contract Status</InputLabel>
      <Select
        value={value ?? ''}
        label="Contract Status"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {contractStatuses.map((status) => (
          <MenuItem key={status.id} value={status.id}>
            {status.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}