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
import type { VendorSegment } from '../types';

interface VendorSegmentEditDialogProps {
  open: boolean;
  segment: VendorSegment | null;
  vendorName: string;
  onClose: () => void;
  onSave: (segmentData: { id: number; vendorId: number; name: string }) => Promise<boolean>;
}

export default function VendorSegmentEditDialog({
  open,
  segment,
  vendorName,
  onClose,
  onSave,
}: VendorSegmentEditDialogProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (segment) {
      setName(segment.name);
    }
  };

  const handleClose = () => {
    setName('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!segment) return;
    setSaving(true);
    const success = await onSave({
      id: segment.id,
      vendorId: segment.vendorId,
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
        Edit Segment for {vendorName}
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
            label="Segment Name"
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