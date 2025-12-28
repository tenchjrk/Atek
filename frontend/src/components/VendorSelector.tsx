import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { Vendor } from '../types';
import { useState } from 'react';

interface VendorSelectorProps {
  vendors: Vendor[];
  value: number | null;
  onChange: (value: number | null) => void;
  currentVendorId?: number;
  label?: string;
  disabled?: boolean;
}

export default function VendorSelector({
  vendors,
  value,
  onChange,
  currentVendorId,
  label = 'Parent Vendor',
  disabled = false,
}: VendorSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: SelectChangeEvent<number | string>) => {
    const newValue = event.target.value;
    onChange(newValue === '' ? null : Number(newValue));
  };

  const availableVendors = vendors.filter(
    (vendor) => vendor.id !== currentVendorId
  );

  const filteredVendors = availableVendors.filter((vendor) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const idMatch = vendor.id.toString().includes(search);
    const nameMatch = vendor.name.toLowerCase().includes(search);
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
        <Box sx={{ px: 2, py: 1, position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search by ID or name..."
            value={searchTerm}
            onChange={(e) => {
              e.stopPropagation();
              setSearchTerm(e.target.value);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
        
        <MenuItem value="">
          <em>None (Root Vendor)</em>
        </MenuItem>
        
        {filteredVendors.length === 0 ? (
          <MenuItem disabled>
            <em>No vendors found</em>
          </MenuItem>
        ) : (
          filteredVendors.map((vendor) => (
            <MenuItem key={vendor.id} value={vendor.id}>
              <Box>
                <Box sx={{ fontWeight: 500 }}>
                  ID: {vendor.id} - {vendor.name}
                </Box>
                {vendor.parentVendor && (
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    Child of: {vendor.parentVendor.name} (ID: {vendor.parentVendor.id})
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