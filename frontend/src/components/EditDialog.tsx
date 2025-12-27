import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface EditDialogProps<T extends { id: number; name: string }> {
  open: boolean;
  item: T | null;
  onClose: () => void;
  onSave: (id: number, name: string) => Promise<boolean>;
  title?: string;
}

export default function EditDialog<T extends { id: number; name: string }>({
  open,
  item,
  onClose,
  onSave,
  title = 'Edit Item',
}: EditDialogProps<T>) {
  // Initialize state directly from prop - React will reset when item changes
  const [name, setName] = useState(item?.name || '');
  const [saving, setSaving] = useState(false);

  // Reset name when dialog opens with a new item
  const handleOpen = () => {
    if (item) {
      setName(item.name);
    }
  };

  const handleClose = () => {
    setName('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!item) return;
    setSaving(true);
    const success = await onSave(item.id, name);
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  // Use onTransitionEnter to sync state when dialog opens
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2 }}
          disabled={saving}
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