import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface AccountTypeCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<boolean>;
}

export default function AccountTypeCreateDialog({
  open,
  onClose,
  onSave,
}: AccountTypeCreateDialogProps) {
  const [name, setName] = useState('');

  const handleSave = async () => {
    const success = await onSave(name);
    if (success) {
      setName('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Account Type</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Account Type Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!name.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}