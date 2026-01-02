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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { Item } from '../types';

interface ContractItemCreateDialogProps {
  open: boolean;
  contractId: number;
  items: Item[];
  onClose: () => void;
  onSave: (contractItemData: {
    contractId: number;
    itemId: number;
    discountPercentage?: number | null;
    rebatePercentage?: number | null;
  }) => Promise<boolean>;
}

export default function ContractItemCreateDialog({
  open,
  contractId,
  items,
  onClose,
  onSave,
}: ContractItemCreateDialogProps) {
  const [itemId, setItemId] = useState<number | ''>('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [rebatePercentage, setRebatePercentage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setItemId('');
    setDiscountPercentage('');
    setRebatePercentage('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave({
      contractId,
      itemId: itemId as number,
      discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null,
      rebatePercentage: rebatePercentage ? parseFloat(rebatePercentage) : null,
    });
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Add Contract Item
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
          <FormControl fullWidth required>
            <InputLabel>Item</InputLabel>
            <Select
              value={itemId}
              label="Item"
              onChange={(e) => setItemId(e.target.value as number)}
              disabled={saving}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name} - ${item.listPrice?.toFixed(2) || '0.00'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Discount %"
            type="number"
            fullWidth
            variant="outlined"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            disabled={saving}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            helperText="Percentage discount applied to all purchases"
          />

          <TextField
            label="Rebate %"
            type="number"
            fullWidth
            variant="outlined"
            value={rebatePercentage}
            onChange={(e) => setRebatePercentage(e.target.value)}
            disabled={saving}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            helperText="Rebate percentage applied to all purchases"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving || !itemId}
        >
          Add Item
        </Button>
      </DialogActions>
    </Dialog>
  );
}