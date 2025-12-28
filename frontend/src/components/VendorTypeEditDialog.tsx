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
import type { VendorType } from '../types';

interface VendorTypeEditDialogProps {
  open: boolean;
  vendorType: VendorType | null;
  onClose: () => void;
  onSave: (id: number, type: string) => Promise<boolean>;
}

export default function VendorTypeEditDialog({
  open,
  vendorType,
  onClose,
  onSave,
}: VendorTypeEditDialogProps) {
  const [type, setType] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (vendorType) {
      setType(vendorType.type);
    }
  };

  const handleClose = () => {
    setType('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!vendorType) return;
    setSaving(true);
    const success = await onSave(vendorType.id, type);
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
        Edit Vendor Type
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
          sx={{ mt: 2 }}
        />
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