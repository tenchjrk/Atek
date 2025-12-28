import { TextField, Box, Stack, Chip, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
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
  accountTypeFilter: number | null;
  onAccountTypeFilterChange: (value: number | null) => void;
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
  const handleAccountTypeChange = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value;
    onAccountTypeFilterChange(value === '' ? null : Number(value));
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
            <InputLabel>Filter by Account Type</InputLabel>
            <Select
              value={accountTypeFilter ?? ''}
              label="Filter by Account Type"
              onChange={handleAccountTypeChange}
            >
              <MenuItem value="">
                <em>All Types</em>
              </MenuItem>
              {accountTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Filter by City"
            value={cityFilter}
            onChange={(e) => onCityFilterChange(e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            label="Filter by State"
            value={stateFilter}
            onChange={(e) => onStateFilterChange(e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            label="Filter by Postal Code"
            value={postalCodeFilter}
            onChange={(e) => onPostalCodeFilterChange(e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            label="Filter by Country"
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