import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { ContractStatus } from '../types';

interface ContractStatusEditDialogProps {
  open: boolean;
  contractStatus: ContractStatus | null;
  onClose: () => void;
  onSave: (id: number, name: string) => Promise<boolean>;
}

export default function ContractStatusEditDialog({
  open,
  contractStatus,
  onClose,
  onSave,
}: ContractStatusEditDialogProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (contractStatus) {
      setName(contractStatus.name);
    }
  };

  const handleClose = () => {
    setName('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!contractStatus) return;
    setSaving(true);
    const success = await onSave(contractStatus.id, name);
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
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Contract Status
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
            label="Contract Status Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving || !name}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}