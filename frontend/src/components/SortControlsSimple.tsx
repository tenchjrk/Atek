import { Box, FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type { SimpleSortField, SortOrder } from '../hooks/useSortSimple';

interface SortControlsSimpleProps {
  sortField: SimpleSortField;
  sortOrder: SortOrder;
  onSortChange: (field: SimpleSortField) => void;
  showNameField?: boolean;
  showTypeField?: boolean;
}

export default function SortControlsSimple({ 
  sortField, 
  sortOrder, 
  onSortChange,
  showNameField = true,
  showTypeField = false,
}: SortControlsSimpleProps) {
  const handleFieldChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value as SimpleSortField);
  };

  const handleOrderToggle = () => {
    onSortChange(sortField); // This will toggle the order
  };

  const getFieldLabel = () => {
    if (sortField === 'id') return 'ID';
    if (sortField === 'name') return 'Name';
    if (sortField === 'type') return 'Type';
    return '';
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
          <MenuItem value="id">ID</MenuItem>
          {showNameField && <MenuItem value="name">Name</MenuItem>}
          {showTypeField && <MenuItem value="type">Type</MenuItem>}
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