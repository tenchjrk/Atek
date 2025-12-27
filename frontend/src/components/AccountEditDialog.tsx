import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import AccountSelector from './AccountSelector';
import type { Account } from '../types';

interface AccountEditDialogProps {
  open: boolean;
  account: Account | null;
  accounts: Account[];
  onClose: () => void;
  onSave: (id: number, name: string, parentAccountId: number | null) => Promise<boolean>;
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
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (account) {
      setName(account.name);
      setParentAccountId(account.parentAccountId ?? null);
    }
  };

  const handleClose = () => {
    setName('');
    setParentAccountId(null);
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!account) return;
    setSaving(true);
    const success = await onSave(account.id, name, parentAccountId);
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onEnter: handleOpen,
      }}
    >
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
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