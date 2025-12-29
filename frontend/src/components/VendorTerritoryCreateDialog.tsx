import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface VendorTerritoryCreateDialogProps {
  open: boolean;
  regionId: number;
  regionName: string;
  onClose: () => void;
  onSave: (territoryData: {
    vendorRegionId: number;
    name: string;
  }) => Promise<boolean>;
}

export default function VendorTerritoryCreateDialog({
  open,
  regionId,
  regionName,
  onClose,
  onSave,
}: VendorTerritoryCreateDialogProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setName("");
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave({ vendorRegionId: regionId, name });
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add Territory to {regionName}
        <IconButton
          aria-label='close'
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
            label='Territory Name'
            type='text'
            fullWidth
            variant='outlined'
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            required
            helperText="e.g., 'New York Metro', 'Southern California', 'Texas Gulf Coast'"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant='contained'
          disabled={saving || !name}
        >
          Add Territory
        </Button>
      </DialogActions>
    </Dialog>
  );
}
