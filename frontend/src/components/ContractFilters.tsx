import { TextField, Box, Stack, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useState } from 'react';
import type { ContractStatus, ContractType, Account, Vendor } from '../types';

interface ContractFiltersProps {
  searchQuery: string;
  selectedStatusIds: number[];
  selectedAccountIds: number[];
  selectedVendorIds: number[];
  selectedTypeIds: number[];
  availableStatuses: ContractStatus[];
  availableAccounts: Account[];
  availableVendors: Vendor[];
  availableTypes: ContractType[];
  onSearchChange: (query: string) => void;
  onStatusChange: (statusIds: number[]) => void;
  onAccountChange: (accountIds: number[]) => void;
  onVendorChange: (vendorIds: number[]) => void;
  onTypeChange: (typeIds: number[]) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function ContractFilters({
  searchQuery,
  selectedStatusIds,
  selectedAccountIds,
  selectedVendorIds,
  selectedTypeIds,
  availableStatuses,
  availableAccounts,
  availableVendors,
  availableTypes,
  onSearchChange,
  onStatusChange,
  onAccountChange,
  onVendorChange,
  onTypeChange,
  onClearFilters,
  activeFilterCount,
}: ContractFiltersProps) {
  const [accountSearchTerm, setAccountSearchTerm] = useState('');
  const [vendorSearchTerm, setVendorSearchTerm] = useState('');

  const handleStatusChange = (value: number[]) => {
    if (value.includes(-1)) {
      if (selectedStatusIds.length === availableStatuses.length) {
        onStatusChange([]);
      } else {
        onStatusChange(availableStatuses.map(s => s.id));
      }
    } else {
      onStatusChange(value);
    }
  };

  const handleAccountChange = (value: number[]) => {
    if (value.includes(-1)) {
      if (selectedAccountIds.length === availableAccounts.length) {
        onAccountChange([]);
      } else {
        onAccountChange(availableAccounts.map(a => a.id));
      }
    } else {
      onAccountChange(value);
    }
  };

  const handleVendorChange = (value: number[]) => {
    if (value.includes(-1)) {
      if (selectedVendorIds.length === availableVendors.length) {
        onVendorChange([]);
      } else {
        onVendorChange(availableVendors.map(v => v.id));
      }
    } else {
      onVendorChange(value);
    }
  };

  const handleTypeChange = (value: number[]) => {
    if (value.includes(-1)) {
      if (selectedTypeIds.length === availableTypes.length) {
        onTypeChange([]);
      } else {
        onTypeChange(availableTypes.map(t => t.id));
      }
    } else {
      onTypeChange(value);
    }
  };

  const getFilterLabel = (count: number, total: number, singular: string) => {
    if (count === 0) return `All ${singular}s`;
    if (count === total) return `All ${singular}s`;
    return `${count} ${singular}${count !== 1 ? 's' : ''}`;
  };

  const filteredAccounts = availableAccounts.filter(account =>
    account.name.toLowerCase().includes(accountSearchTerm.toLowerCase())
  );

  const filteredVendors = availableVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(vendorSearchTerm.toLowerCase())
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>
        {/* Search bar */}
        <TextField
          fullWidth
          placeholder="Search by ID, name, or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          size="medium"
        />

        {/* Filter fields */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Vendor</InputLabel>
            <Select
              multiple
              value={selectedVendorIds}
              label="Vendor"
              onChange={(e) => handleVendorChange(e.target.value as number[])}
              renderValue={() => getFilterLabel(selectedVendorIds.length, availableVendors.length, 'Vendor')}
              onClose={() => setVendorSearchTerm('')}
            >
              <Box sx={{ px: 2, pb: 1, pt: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search vendors..."
                  fullWidth
                  value={vendorSearchTerm}
                  onChange={(e) => setVendorSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </Box>
              <MenuItem value={-1}>
                <Checkbox checked={selectedVendorIds.length === availableVendors.length} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {filteredVendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  <Checkbox checked={selectedVendorIds.includes(vendor.id)} />
                  <ListItemText primary={vendor.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Account</InputLabel>
            <Select
              multiple
              value={selectedAccountIds}
              label="Account"
              onChange={(e) => handleAccountChange(e.target.value as number[])}
              renderValue={() => getFilterLabel(selectedAccountIds.length, availableAccounts.length, 'Account')}
              onClose={() => setAccountSearchTerm('')}
            >
              <Box sx={{ px: 2, pb: 1, pt: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search accounts..."
                  fullWidth
                  value={accountSearchTerm}
                  onChange={(e) => setAccountSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </Box>
              <MenuItem value={-1}>
                <Checkbox checked={selectedAccountIds.length === availableAccounts.length} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {filteredAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  <Checkbox checked={selectedAccountIds.includes(account.id)} />
                  <ListItemText primary={account.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              multiple
              value={selectedTypeIds}
              label="Type"
              onChange={(e) => handleTypeChange(e.target.value as number[])}
              renderValue={() => getFilterLabel(selectedTypeIds.length, availableTypes.length, 'Type')}
            >
              <MenuItem value={-1}>
                <Checkbox checked={selectedTypeIds.length === availableTypes.length} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {availableTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  <Checkbox checked={selectedTypeIds.includes(type.id)} />
                  <ListItemText primary={type.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={selectedStatusIds}
              label="Status"
              onChange={(e) => handleStatusChange(e.target.value as number[])}
              renderValue={() => getFilterLabel(selectedStatusIds.length, availableStatuses.length, 'Status')}
            >
              <MenuItem value={-1}>
                <Checkbox checked={selectedStatusIds.length === availableStatuses.length} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {availableStatuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  <Checkbox checked={selectedStatusIds.includes(status.id)} />
                  <ListItemText primary={status.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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