import { TextField, Box, Stack, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import type { VendorType } from '../types';

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
  vendorTypeFilter: number[];
  onVendorTypeFilterChange: (value: number[]) => void;
  vendorTypes: VendorType[];
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
  vendorTypeFilter,
  onVendorTypeFilterChange,
  vendorTypes,
  onClearFilters,
  activeFilterCount,
}: VendorFiltersProps) {
  const handleVendorTypeChange = (value: number[]) => {
    if (value.includes(-1)) {
      // Toggle select all
      if (vendorTypeFilter.length === vendorTypes.length) {
        onVendorTypeFilterChange([]);
      } else {
        onVendorTypeFilterChange(vendorTypes.map(vt => vt.id));
      }
    } else {
      onVendorTypeFilterChange(value);
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
          placeholder="Search by ID or vendor name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          size="medium"
        />

        {/* Filter fields */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Vendor Type</InputLabel>
            <Select
              multiple
              value={vendorTypeFilter}
              label="Vendor Type"
              onChange={(e) => handleVendorTypeChange(e.target.value as number[])}
              renderValue={() => getFilterLabel(vendorTypeFilter.length, vendorTypes.length)}
            >
              <MenuItem value={-1}>
                <Checkbox checked={vendorTypeFilter.length === vendorTypes.length} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {vendorTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  <Checkbox checked={vendorTypeFilter.includes(type.id)} />
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