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
import AccountTypeSelector from './AccountTypeSelector';
import AddressFields from './AddressFields';
import type { Account, AccountType } from '../types';

interface AccountCreateDialogProps {
  open: boolean;
  accounts: Account[];
  accountTypes: AccountType[];
  onClose: () => void;
  onSave: (accountData: {
    name: string;
    parentAccountId: number | null;
    accountTypeId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => Promise<boolean>;
}

export default function AccountCreateDialog({
  open,
  accounts,
  accountTypes,
  onClose,
  onSave,
}: AccountCreateDialogProps) {
  const [name, setName] = useState('');
  const [parentAccountId, setParentAccountId] = useState<number | null>(null);
  const [accountTypeId, setAccountTypeId] = useState<number | null>(null);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setName('');
    setParentAccountId(null);
    setAccountTypeId(null);
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
    setSaving(true);
    const success = await onSave({
      name,
      parentAccountId,
      accountTypeId,
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
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create New Account
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
            required
          />

          <AccountTypeSelector
            accountTypes={accountTypes}
            value={accountTypeId}
            onChange={setAccountTypeId}
            disabled={saving}
          />

          <AccountSelector
            accounts={accounts}
            value={parentAccountId}
            onChange={setParentAccountId}
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
        <Button onClick={handleSave} variant="contained" disabled={saving || !name}>
          Create Account
        </Button>
      </DialogActions>
    </Dialog>
  );
}