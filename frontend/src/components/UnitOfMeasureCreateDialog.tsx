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

interface UnitOfMeasureCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, shortName: string) => Promise<boolean>;
}

export default function UnitOfMeasureCreateDialog({
  open,
  onClose,
  onSave,
}: UnitOfMeasureCreateDialogProps) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setName('');
    setShortName('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(name, shortName);
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Add Unit of Measure
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
            helperText="e.g., 'Case', 'Box', 'Pallet', 'Each'"
          />
          <TextField
            label="Short Name (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            disabled={saving}
            helperText="e.g., 'CS', 'BX', 'PLT', 'EA'"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving || !name}>
          Add Unit of Measure
        </Button>
      </DialogActions>
    </Dialog>
  );
}