import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import VendorSelector from './VendorSelector';
import VendorTypeSelector from './VendorTypeSelector';
import AddressFields from './AddressFields';
import type { Vendor, VendorType } from '../types';

interface VendorEditDialogProps {
  open: boolean;
  vendor: Vendor | null;
  vendors: Vendor[];
  vendorTypes: VendorType[];
  onClose: () => void;
  onSave: (vendorData: {
    id: number;
    name: string;
    parentVendorId: number | null;
    vendorTypeId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => Promise<boolean>;
}

export default function VendorEditDialog({
  open,
  vendor,
  vendors,
  vendorTypes,
  onClose,
  onSave,
}: VendorEditDialogProps) {
  const [name, setName] = useState('');
  const [parentVendorId, setParentVendorId] = useState<number | null>(null);
  const [vendorTypeId, setVendorTypeId] = useState<number | null>(null);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (vendor) {
      setName(vendor.name);
      setParentVendorId(vendor.parentVendorId ?? null);
      setVendorTypeId(vendor.vendorTypeId ?? null);
      setAddressLine1(vendor.addressLine1 ?? '');
      setAddressLine2(vendor.addressLine2 ?? '');
      setCity(vendor.city ?? '');
      setState(vendor.state ?? '');
      setPostalCode(vendor.postalCode ?? '');
      setCountry(vendor.country ?? '');
    }
  };

  const handleClose = () => {
    setName('');
    setParentVendorId(null);
    setVendorTypeId(null);
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!vendor) return;
    setSaving(true);
    const success = await onSave({
      id: vendor.id,
      name,
      parentVendorId,
      vendorTypeId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    });
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionProps={{
        onEnter: handleOpen,
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Vendor
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={saving}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            autoFocus
            label="Vendor Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />

          <VendorTypeSelector
            vendorTypes={vendorTypes}
            value={vendorTypeId}
            onChange={setVendorTypeId}
            disabled={saving}
          />

          <VendorSelector
            vendors={vendors}
            value={parentVendorId}
            onChange={setParentVendorId}
            currentVendorId={vendor?.id}
            disabled={saving}
          />

          <Divider />

          <AddressFields
            addressLine1={addressLine1}
            addressLine2={addressLine2}
            city={city}
            state={state}
            postalCode={postalCode}
            country={country}
            onAddressLine1Change={setAddressLine1}
            onAddressLine2Change={setAddressLine2}
            onCityChange={setCity}
            onStateChange={setState}
            onPostalCodeChange={setPostalCode}
            onCountryChange={setCountry}
            disabled={saving}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}