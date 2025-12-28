import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface VendorTypeCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (type: string) => Promise<boolean>;
}

export default function VendorTypeCreateDialog({
  open,
  onClose,
  onSave,
}: VendorTypeCreateDialogProps) {
  const [type, setType] = useState('');
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setType('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(type);
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create New Vendor Type
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
        <TextField
          autoFocus
          margin="dense"
          label="Vendor Type"
          type="text"
          fullWidth
          variant="outlined"
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={saving}
          required
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving || !type}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}