import { Box, FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type { ContractSortField, SortOrder } from '../hooks/useContractSort';

interface ContractSortControlsProps {
  sortField: ContractSortField;
  sortOrder: SortOrder;
  onSortChange: (field: ContractSortField) => void;
}

export default function ContractSortControls({ sortField, sortOrder, onSortChange }: ContractSortControlsProps) {
  const handleFieldChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value as ContractSortField);
  };

  const handleOrderToggle = () => {
    onSortChange(sortField);
  };

  const getFieldLabel = () => {
    if (sortField === 'id') return 'ID';
    if (sortField === 'contractNumber') return 'Contract Number';
    if (sortField === 'lastModifiedDate') return 'Last Modified';
    return '';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortField}
          label="Sort by"
          onChange={handleFieldChange}
        >
          <MenuItem value="lastModifiedDate">Last Modified</MenuItem>
          <MenuItem value="contractNumber">Contract Number</MenuItem>
          <MenuItem value="id">ID</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        value={sortOrder}
        exclusive
        onChange={handleOrderToggle}
        size="small"
      >
        <ToggleButton value="asc" aria-label="ascending">
          <ArrowUpward fontSize="small" />
        </ToggleButton>
        <ToggleButton value="desc" aria-label="descending">
          <ArrowDownward fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
        {getFieldLabel()}
        {' • '}
        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      </Box>
    </Box>
  );
}