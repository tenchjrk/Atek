import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import AccountSelector from './AccountSelector';
import AddressFields from './AddressFields';
import type { Account } from '../types';

interface AccountCreateFormProps {
  accounts: Account[];
  onSubmit: (accountData: {
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

export default function AccountCreateForm({ accounts, onSubmit }: AccountCreateFormProps) {
  const [name, setName] = useState('');
  const [parentAccountId, setParentAccountId] = useState<number | null>(null);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit({
      name,
      parentAccountId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    });
    if (success) {
      setName('');
      setParentAccountId(null);
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPostalCode('');
      setCountry('');
    }
    setSubmitting(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Account Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting}
          />
          
          <AccountSelector
            accounts={accounts}
            value={parentAccountId}
            onChange={setParentAccountId}
            disabled={submitting}
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
            disabled={submitting}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            disabled={submitting}
            size="large"
          >
            Add Account
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}