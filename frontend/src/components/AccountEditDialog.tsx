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
import AccountSelector from './AccountSelector';
import AddressFields from './AddressFields';
import type { Account } from '../types';

interface AccountEditDialogProps {
  open: boolean;
  account: Account | null;
  accounts: Account[];
  onClose: () => void;
  onSave: (accountData: {
    id: number;
    name: string;
    parentAccountId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => Promise<boolean>;
}

export default function AccountEditDialog({
  open,
  account,
  accounts,
  onClose,
  onSave,
}: AccountEditDialogProps) {
  const [name, setName] = useState('');
  const [parentAccountId, setParentAccountId] = useState<number | null>(null);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (account) {
      setName(account.name);
      setParentAccountId(account.parentAccountId ?? null);
      setAddressLine1(account.addressLine1 ?? '');
      setAddressLine2(account.addressLine2 ?? '');
      setCity(account.city ?? '');
      setState(account.state ?? '');
      setPostalCode(account.postalCode ?? '');
      setCountry(account.country ?? '');
    }
  };

  const handleClose = () => {
    setName('');
    setParentAccountId(null);
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
    if (!account) return;
    setSaving(true);
    const success = await onSave({
      id: account.id,
      name,
      parentAccountId,
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
        Edit Account
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
            label="Account Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />

          <AccountSelector
            accounts={accounts}
            value={parentAccountId}
            onChange={setParentAccountId}
            currentAccountId={account?.id}
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