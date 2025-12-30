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
import type { UnitOfMeasure } from '../types';

interface UnitOfMeasureEditDialogProps {
  open: boolean;
  unitOfMeasure: UnitOfMeasure | null;
  onClose: () => void;
  onSave: (id: number, name: string, shortName: string) => Promise<boolean>;
}

export default function UnitOfMeasureEditDialog({
  open,
  unitOfMeasure,
  onClose,
  onSave,
}: UnitOfMeasureEditDialogProps) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (unitOfMeasure) {
      setName(unitOfMeasure.name);
      setShortName(unitOfMeasure.shortName || '');
    }
  };

  const handleClose = () => {
    setName('');
    setShortName('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!unitOfMeasure) return;
    setSaving(true);
    const success = await onSave(unitOfMeasure.id, name, shortName);
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
        Edit Unit of Measure
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
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            required
          />
          <TextField
            label="Short Name (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            disabled={saving}
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