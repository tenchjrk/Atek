import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { Account } from '../types';
import { useState } from 'react';

interface AccountSelectorProps {
  accounts: Account[];
  value: number | null;
  onChange: (value: number | null) => void;
  currentAccountId?: number; // To prevent selecting self as parent
  label?: string;
  disabled?: boolean;
}

export default function AccountSelector({
  accounts,
  value,
  onChange,
  currentAccountId,
  label = 'Parent Account',
  disabled = false,
}: AccountSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: SelectChangeEvent<number | string>) => {
    const newValue = event.target.value;
    onChange(newValue === '' ? null : Number(newValue));
  };

  // Filter out current account to prevent circular reference
  const availableAccounts = accounts.filter(
    (account) => account.id !== currentAccountId
  );

  // Filter accounts based on search term (search by ID or name)
  const filteredAccounts = availableAccounts.filter((account) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const idMatch = account.id.toString().includes(search);
    const nameMatch = account.name.toLowerCase().includes(search);
    return idMatch || nameMatch;
  });

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value ?? ''}
        label={label}
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 400 }
          }
        }}
      >
        {/* Search field at the top of the dropdown */}
        <Box sx={{ px: 2, py: 1, position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search by ID or name..."
            value={searchTerm}
            onChange={(e) => {
              e.stopPropagation(); // Prevent select from closing
              setSearchTerm(e.target.value);
            }}
            onKeyDown={(e) => e.stopPropagation()} // Prevent select keyboard navigation
            onClick={(e) => e.stopPropagation()} // Prevent select from closing
          />
        </Box>
        
        <MenuItem value="">
          <em>None (Root Account)</em>
        </MenuItem>
        
        {filteredAccounts.length === 0 ? (
          <MenuItem disabled>
            <em>No accounts found</em>
          </MenuItem>
        ) : (
          filteredAccounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              <Box>
                <Box sx={{ fontWeight: 500 }}>
                  ID: {account.id} - {account.name}
                </Box>
                {account.parentAccount && (
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    Child of: {account.parentAccount.name} (ID: {account.parentAccount.id})
                  </Box>
                )}
              </Box>
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}