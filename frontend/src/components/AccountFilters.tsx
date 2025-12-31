import { TextField, Box, Stack, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import type { AccountType } from '../types';

interface AccountFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cityFilter: string;
  onCityFilterChange: (value: string) => void;
  stateFilter: string;
  onStateFilterChange: (value: string) => void;
  postalCodeFilter: string;
  onPostalCodeFilterChange: (value: string) => void;
  countryFilter: string;
  onCountryFilterChange: (value: string) => void;
  accountTypeFilter: number[];
  onAccountTypeFilterChange: (value: number[]) => void;
  accountTypes: AccountType[];
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function AccountFilters({
  searchTerm,
  onSearchChange,
  cityFilter,
  onCityFilterChange,
  stateFilter,
  onStateFilterChange,
  postalCodeFilter,
  onPostalCodeFilterChange,
  countryFilter,
  onCountryFilterChange,
  accountTypeFilter,
  onAccountTypeFilterChange,
  accountTypes,
  onClearFilters,
  activeFilterCount,
}: AccountFiltersProps) {
  const handleAccountTypeChange = (value: number[]) => {
    if (value.includes(-1)) {
      // Toggle select all
      if (accountTypeFilter.length === accountTypes.length) {
        onAccountTypeFilterChange([]);
      } else {
        onAccountTypeFilterChange(accountTypes.map(at => at.id));
      }
    } else {
      onAccountTypeFilterChange(value);
    }
  };

  const getFilterLabel = (count: number, total: number) => {
    if (count === 0) return 'All Types';
    if (count === total) return 'All Types';
    return `${count} Type${count !== 1 ? 's' : ''}`;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>
        {/* Search bar */}
        <TextField
          fullWidth
          placeholder="Search by ID or account name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          size="medium"
        />

        {/* Filter fields */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Account Type</InputLabel>
            <Select
              multiple
              value={accountTypeFilter}
              label="Account Type"
              onChange={(e) => handleAccountTypeChange(e.target.value as number[])}
              renderValue={() => getFilterLabel(accountTypeFilter.length, accountTypes.length)}
            >
              <MenuItem value={-1}>
                <Checkbox checked={accountTypeFilter.length === accountTypes.length} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {accountTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  <Checkbox checked={accountTypeFilter.includes(type.id)} />
                  <ListItemText primary={type.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="City"
            value={cityFilter}
            onChange={(e) => onCityFilterChange(e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            label="State"
            value={stateFilter}
            onChange={(e) => onStateFilterChange(e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            label="Postal Code"
            value={postalCodeFilter}
            onChange={(e) => onPostalCodeFilterChange(e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            label="Country"
            value={countryFilter}
            onChange={(e) => onCountryFilterChange(e.target.value)}
            size="small"
          />
        </Stack>

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <IconButton size="small" onClick={onClearFilters} title="Clear all filters">
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
}