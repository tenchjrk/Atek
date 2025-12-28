import { TextField, Box, Stack, Chip, IconButton } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

interface VendorFiltersProps {
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
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function VendorFilters({
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
  onClearFilters,
  activeFilterCount,
}: VendorFiltersProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          placeholder="Search by ID or vendor name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          size="medium"
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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