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
  Divider,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { Item, Vendor, VendorSegment, ItemCategory, UnitOfMeasure, ItemType } from '../types';

interface QuickEditItemDialogProps {
  open: boolean;
  item: Item | null;
  vendors: Vendor[];
  segments: VendorSegment[];
  categories: ItemCategory[];
  unitOfMeasures: UnitOfMeasure[];
  itemTypes: ItemType[];
  onClose: () => void;
  onSave: (itemData: {
    id: number;
    itemCategoryId: number;
    name: string;
    shortName: string;
    description: string;
    listPrice: number;
    cost: number;
    eachesPerUnitOfMeasure: number;
    unitOfMeasureId: number;
    itemTypeId: number;
  }) => Promise<boolean>;
}

export default function QuickEditItemDialog({
  open,
  item,
  vendors,
  segments,
  categories,
  unitOfMeasures,
  itemTypes,
  onClose,
  onSave,
}: QuickEditItemDialogProps) {
  const [selectedVendorId, setSelectedVendorId] = useState<number | ''>('');
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | ''>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [description, setDescription] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [cost, setCost] = useState('');
  const [eachesPerUnitOfMeasure, setEachesPerUnitOfMeasure] = useState('');
  const [unitOfMeasureId, setUnitOfMeasureId] = useState<number | ''>('');
  const [itemTypeId, setItemTypeId] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  const filteredSegments = selectedVendorId
    ? segments.filter(s => s.vendorId === selectedVendorId)
    : [];

  const filteredCategories = selectedSegmentId
    ? categories.filter(c => c.vendorSegmentId === selectedSegmentId)
    : [];

  const handleOpen = () => {
    if (item) {
      // Set category hierarchy
      const category = categories.find(c => c.id === item.itemCategoryId);
      const segment = category ? segments.find(s => s.id === category.vendorSegmentId) : undefined;
      const vendorId = segment?.vendorId;

      setSelectedVendorId(vendorId || '');
      setSelectedSegmentId(category?.vendorSegmentId || '');
      setSelectedCategoryId(item.itemCategoryId);
      
      // Set item details
      setName(item.name);
      setShortName(item.shortName || '');
      setDescription(item.description || '');
      setListPrice(item.listPrice.toString());
      setCost(item.cost.toString());
      setEachesPerUnitOfMeasure(item.eachesPerUnitOfMeasure.toString());
      setUnitOfMeasureId(item.unitOfMeasureId);
      setItemTypeId(item.itemTypeId);
    }
  };

  const handleClose = () => {
    setSelectedVendorId('');
    setSelectedSegmentId('');
    setSelectedCategoryId('');
    setName('');
    setShortName('');
    setDescription('');
    setListPrice('');
    setCost('');
    setEachesPerUnitOfMeasure('');
    setUnitOfMeasureId('');
    setItemTypeId('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!item || selectedCategoryId === '') return;
    setSaving(true);
    const success = await onSave({
      id: item.id,
      itemCategoryId: selectedCategoryId as number,
      name,
      shortName,
      description,
      listPrice: parseFloat(listPrice),
      cost: parseFloat(cost),
      eachesPerUnitOfMeasure: parseInt(eachesPerUnitOfMeasure),
      unitOfMeasureId: unitOfMeasureId as number,
      itemTypeId: itemTypeId as number,
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
      maxWidth="md"
      fullWidth
      TransitionProps={{
        onEnter: handleOpen,
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Item
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
          <Typography variant="subtitle2" color="text.secondary">
            Category Assignment
          </Typography>
          
          <FormControl fullWidth size="small">
            <InputLabel>Vendor</InputLabel>
            <Select
              value={selectedVendorId}
              label="Vendor"
              onChange={(e) => {
                setSelectedVendorId(e.target.value as number);
                setSelectedSegmentId('');
                setSelectedCategoryId('');
              }}
              disabled={saving}
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Segment</InputLabel>
            <Select
              value={selectedSegmentId}
              label="Segment"
              onChange={(e) => {
                setSelectedSegmentId(e.target.value as number);
                setSelectedCategoryId('');
              }}
              disabled={!selectedVendorId || saving}
            >
              {filteredSegments.map((segment) => (
                <MenuItem key={segment.id} value={segment.id}>
                  {segment.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategoryId}
              label="Category"
              onChange={(e) => setSelectedCategoryId(e.target.value as number)}
              disabled={!selectedSegmentId || saving}
            >
              {filteredCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          <Typography variant="subtitle2" color="text.secondary">
            Item Details
          </Typography>

          <TextField
            label="Item Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            required
          />
          <TextField
            label="Short Name"
            type="text"
            fullWidth
            variant="outlined"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            disabled={saving}
          />
          <TextField
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
          />
          <TextField
            label="List Price"
            type="number"
            fullWidth
            variant="outlined"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
            disabled={saving}
            required
            inputProps={{ step: '0.01', min: '0' }}
          />
          <TextField
            label="Cost"
            type="number"
            fullWidth
            variant="outlined"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            disabled={saving}
            required
            inputProps={{ step: '0.01', min: '0' }}
          />
          <TextField
            label="Eaches Per Unit of Measure"
            type="number"
            fullWidth
            variant="outlined"
            value={eachesPerUnitOfMeasure}
            onChange={(e) => setEachesPerUnitOfMeasure(e.target.value)}
            disabled={saving}
            required
            inputProps={{ step: '1', min: '1' }}
          />
          <FormControl fullWidth required>
            <InputLabel>Unit of Measure</InputLabel>
            <Select
              value={unitOfMeasureId}
              label="Unit of Measure"
              onChange={(e) => setUnitOfMeasureId(e.target.value as number)}
              disabled={saving}
            >
              {unitOfMeasures.map((uom) => (
                <MenuItem key={uom.id} value={uom.id}>
                  {uom.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Item Type</InputLabel>
            <Select
              value={itemTypeId}
              label="Item Type"
              onChange={(e) => setItemTypeId(e.target.value as number)}
              disabled={saving}
            >
              {itemTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving || !name || !selectedCategoryId}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}