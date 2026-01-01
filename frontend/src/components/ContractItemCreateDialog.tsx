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
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { Item, ItemCategory, VendorSegment } from '../types';

interface ContractItemCreateDialogProps {
  open: boolean;
  contractId: number;
  items: Item[];
  itemCategories: ItemCategory[];
  vendorSegments: VendorSegment[];
  onClose: () => void;
  onSave: (contractItemData: {
    contractId: number;
    pricingLevel: string;
    itemId?: number | null;
    itemCategoryId?: number | null;
    vendorSegmentId?: number | null;
    discountPercentage?: number | null;
    flatDiscountPrice?: number | null;
    rebatePercentage?: number | null;
    commitmentQuantity?: number | null;
    commitmentDollars?: number | null;
  }) => Promise<boolean>;
}

export default function ContractItemCreateDialog({
  open,
  contractId,
  items,
  itemCategories,
  vendorSegments,
  onClose,
  onSave,
}: ContractItemCreateDialogProps) {
  const [pricingLevel, setPricingLevel] = useState<string>('');
  const [itemId, setItemId] = useState<number | ''>('');
  const [itemCategoryId, setItemCategoryId] = useState<number | ''>('');
  const [vendorSegmentId, setVendorSegmentId] = useState<number | ''>('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [flatDiscountPrice, setFlatDiscountPrice] = useState('');
  const [rebatePercentage, setRebatePercentage] = useState('');
  const [commitmentQuantity, setCommitmentQuantity] = useState('');
  const [commitmentDollars, setCommitmentDollars] = useState('');
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setPricingLevel('');
    setItemId('');
    setItemCategoryId('');
    setVendorSegmentId('');
    setDiscountPercentage('');
    setFlatDiscountPrice('');
    setRebatePercentage('');
    setCommitmentQuantity('');
    setCommitmentDollars('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave({
      contractId,
      pricingLevel,
      itemId: pricingLevel === 'Item' ? (itemId as number) : null,
      itemCategoryId: pricingLevel === 'Category' ? (itemCategoryId as number) : null,
      vendorSegmentId: pricingLevel === 'Segment' ? (vendorSegmentId as number) : null,
      discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null,
      flatDiscountPrice: flatDiscountPrice ? parseFloat(flatDiscountPrice) : null,
      rebatePercentage: rebatePercentage ? parseFloat(rebatePercentage) : null,
      commitmentQuantity: commitmentQuantity ? parseInt(commitmentQuantity) : null,
      commitmentDollars: commitmentDollars ? parseFloat(commitmentDollars) : null,
    });
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  const isValid = () => {
    if (!pricingLevel) return false;
    if (pricingLevel === 'Item' && !itemId) return false;
    if (pricingLevel === 'Category' && !itemCategoryId) return false;
    if (pricingLevel === 'Segment' && !vendorSegmentId) return false;
    return true;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
            <InputLabel>Pricing Level</InputLabel>
            <Select
              value={pricingLevel}
              label="Pricing Level"
              onChange={(e) => {
                setPricingLevel(e.target.value);
                setItemId('');
                setItemCategoryId('');
                setVendorSegmentId('');
              }}
              disabled={saving}
            >
              <MenuItem value="Item">Item</MenuItem>
              <MenuItem value="Category">Category</MenuItem>
              <MenuItem value="Segment">Segment</MenuItem>
            </Select>
          </FormControl>

          {pricingLevel === 'Item' && (
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
          )}

          {pricingLevel === 'Category' && (
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={itemCategoryId}
                label="Category"
                onChange={(e) => setItemCategoryId(e.target.value as number)}
                disabled={saving}
              >
                {itemCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {pricingLevel === 'Segment' && (
            <FormControl fullWidth required>
              <InputLabel>Segment</InputLabel>
              <Select
                value={vendorSegmentId}
                label="Segment"
                onChange={(e) => setVendorSegmentId(e.target.value as number)}
                disabled={saving}
              >
                {vendorSegments.map((segment) => (
                  <MenuItem key={segment.id} value={segment.id}>
                    {segment.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Pricing
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Discount %"
                type="number"
                fullWidth
                variant="outlined"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                disabled={saving}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                helperText="Percentage discount off list price"
              />

              <TextField
                label="Flat Discount Price"
                type="number"
                fullWidth
                variant="outlined"
                value={flatDiscountPrice}
                onChange={(e) => setFlatDiscountPrice(e.target.value)}
                disabled={saving}
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Final price after discount (calculated or manual)"
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
                helperText="Rebate percentage (applied to flat discount price)"
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Commitment
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Commitment Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={commitmentQuantity}
                onChange={(e) => setCommitmentQuantity(e.target.value)}
                disabled={saving}
                inputProps={{ min: 0, step: 1 }}
                helperText="Minimum quantity commitment"
              />

              <TextField
                label="Commitment Dollars"
                type="number"
                fullWidth
                variant="outlined"
                value={commitmentDollars}
                onChange={(e) => setCommitmentDollars(e.target.value)}
                disabled={saving}
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Minimum dollar commitment"
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving || !isValid()}
        >
          Add Item
        </Button>
      </DialogActions>
    </Dialog>
  );
}