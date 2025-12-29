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
import type { VendorRegion } from '../types';

interface VendorRegionEditDialogProps {
  open: boolean;
  region: VendorRegion | null;
  segmentName: string;
  onClose: () => void;
  onSave: (regionData: { id: number; vendorSegmentId: number; name: string }) => Promise<boolean>;
}

export default function VendorRegionEditDialog({
  open,
  region,
  segmentName,
  onClose,
  onSave,
}: VendorRegionEditDialogProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (region) {
      setName(region.name);
    }
  };

  const handleClose = () => {
    setName('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!region) return;
    setSaving(true);
    const success = await onSave({
      id: region.id,
      vendorSegmentId: region.vendorSegmentId,
      name,
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
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onEnter: handleOpen,
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Region in {segmentName}
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
            label="Region Name"
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