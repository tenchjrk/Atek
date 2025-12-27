import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import AccountSelector from './AccountSelector';
import type { Account } from '../types';

interface AccountCreateFormProps {
  accounts: Account[];
  onSubmit: (name: string, parentAccountId: number | null) => Promise<boolean>;
}

export default function AccountCreateForm({ accounts, onSubmit }: AccountCreateFormProps) {
  const [name, setName] = useState('');
  const [parentAccountId, setParentAccountId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit(name, parentAccountId);
    if (success) {
      setName('');
      setParentAccountId(null);
    }
    setSubmitting(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
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

          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            disabled={submitting}
          >
            Add Account
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}