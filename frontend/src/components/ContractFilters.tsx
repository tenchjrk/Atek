import { TextField, Box, Stack, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useState } from 'react';
import type { ContractStatus, Account } from '../types';

interface ContractFiltersProps {
  searchQuery: string;
  selectedStatusIds: number[];
  selectedAccountIds: number[];
  availableStatuses: ContractStatus[];
  availableAccounts: Account[];
  onSearchChange: (query: string) => void;
  onStatusChange: (statusIds: number[]) => void;
  onAccountChange: (accountIds: number[]) => void;
  onClearFilters: () => void;
}

export default function ContractFilters({
  searchQuery,
  selectedStatusIds,
  selectedAccountIds,
  availableStatuses,
  availableAccounts,
  onSearchChange,
  onStatusChange,
  onAccountChange,
  onClearFilters,
}: ContractFiltersProps) {
  const [accountSearchTerm, setAccountSearchTerm] = useState('');

  const handleStatusChange = (value: number[]) => {
    if (value.includes(-1)) {
      // Toggle select all
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
      // Toggle select all
      if (selectedAccountIds.length === availableAccounts.length) {
        onAccountChange([]);
      } else {
        onAccountChange(availableAccounts.map(a => a.id));
      }
    } else {
      onAccountChange(value);
    }
  };

  const getStatusFilterLabel = (count: number, total: number) => {
    if (count === 0) return 'All Statuses';
    if (count === total) return 'All Statuses';
    return `${count} Status${count !== 1 ? 'es' : ''}`;
  };

  const getAccountFilterLabel = (count: number, total: number) => {
    if (count === 0) return 'All Accounts';
    if (count === total) return 'All Accounts';
    return `${count} Account${count !== 1 ? 's' : ''}`;
  };

  const filteredAccounts = availableAccounts.filter(account =>
    account.name.toLowerCase().includes(accountSearchTerm.toLowerCase())
  );

  const activeFilterCount = 
    (searchQuery ? 1 : 0) + 
    (selectedStatusIds.length > 0 && selectedStatusIds.length < availableStatuses.length ? 1 : 0) +
    (selectedAccountIds.length > 0 && selectedAccountIds.length < availableAccounts.length ? 1 : 0);

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
            <InputLabel>Account</InputLabel>
            <Select
              multiple
              value={selectedAccountIds}
              label="Account"
              onChange={(e) => handleAccountChange(e.target.value as number[])}
              renderValue={() => getAccountFilterLabel(selectedAccountIds.length, availableAccounts.length)}
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
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={selectedStatusIds}
              label="Status"
              onChange={(e) => handleStatusChange(e.target.value as number[])}
              renderValue={() => getStatusFilterLabel(selectedStatusIds.length, availableStatuses.length)}
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