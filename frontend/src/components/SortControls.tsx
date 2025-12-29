import { Box, FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type { SortField, SortOrder } from '../hooks/useSort';

interface SortControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
}

export default function SortControls({ sortField, sortOrder, onSortChange }: SortControlsProps) {
  const handleFieldChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value as SortField);
  };

  const handleOrderToggle = () => {
    onSortChange(sortField); // This will toggle the order
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortField}
          label="Sort by"
          onChange={handleFieldChange}
        >
          <MenuItem value="lastModified">Last Modified</MenuItem>
          <MenuItem value="name">Name</MenuItem>
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
        {sortField === 'lastModified' && 'Last Modified'}
        {sortField === 'name' && 'Name'}
        {sortField === 'id' && 'ID'}
        {' • '}
        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      </Box>
    </Box>
  );
}