import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import AddressFields from './AddressFields';
import type { AccountAddress } from '../types';

interface AccountAddressEditDialogProps {
  open: boolean;
  accountAddress: AccountAddress | null;
  accountName: string;
  onClose: () => void;
  onSave: (addressData: {
    id: number;
    accountId: number;
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isShipping: boolean;
    isBilling: boolean;
  }) => Promise<boolean>;
}

export default function AccountAddressEditDialog({
  open,
  accountAddress,
  accountName,
  onClose,
  onSave,
}: AccountAddressEditDialogProps) {
  const [name, setName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [isShipping, setIsShipping] = useState(false);
  const [isBilling, setIsBilling] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (accountAddress) {
      setName(accountAddress.name ?? '');
      setAddressLine1(accountAddress.addressLine1);
      setAddressLine2(accountAddress.addressLine2 ?? '');
      setCity(accountAddress.city);
      setState(accountAddress.state);
      setPostalCode(accountAddress.postalCode);
      setCountry(accountAddress.country);
      setIsShipping(accountAddress.isShipping);
      setIsBilling(accountAddress.isBilling);
    }
  };

  const handleClose = () => {
    setName('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('');
    setIsShipping(false);
    setIsBilling(false);
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!accountAddress) return;
    setSaving(true);
    const success = await onSave({
      id: accountAddress.id,
      accountId: accountAddress.accountId,
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isShipping,
      isBilling,
    });
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  const isFormValid = addressLine1 && city && state && postalCode && country;

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
        Edit Address for {accountName}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={saving}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            autoFocus
            label="Location Name (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            helperText="e.g., 'Chicago Warehouse', 'Phoenix Office'"
          />

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

          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isShipping}
                  onChange={(e) => setIsShipping(e.target.checked)}
                  disabled={saving}
                />
              }
              label="Shipping Address"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isBilling}
                  onChange={(e) => setIsBilling(e.target.checked)}
                  disabled={saving}
                />
              }
              label="Billing Address"
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving || !isFormValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}