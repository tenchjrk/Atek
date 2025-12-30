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
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { Vendor, VendorSegment, ItemCategory, UnitOfMeasure, ItemType } from '../types';

interface QuickAddItemDialogProps {
  open: boolean;
  vendors: Vendor[];
  segments: VendorSegment[];
  categories: ItemCategory[];
  unitOfMeasures: UnitOfMeasure[];
  itemTypes: ItemType[];
  onClose: () => void;
  onSave: (itemData: {
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

export default function QuickAddItemDialog({
  open,
  vendors,
  segments,
  categories,
  unitOfMeasures,
  itemTypes,
  onClose,
  onSave,
}: QuickAddItemDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
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

  const steps = ['Select Vendor', 'Select Segment', 'Select Category', 'Item Details'];

  const filteredSegments = selectedVendorId
    ? segments.filter(s => s.vendorId === selectedVendorId)
    : [];

  const filteredCategories = selectedSegmentId
    ? categories.filter(c => c.vendorSegmentId === selectedSegmentId)
    : [];

  const handleClose = () => {
    setActiveStep(0);
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSave = async () => {
    if (selectedCategoryId === '') return;
    setSaving(true);
    const success = await onSave({
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

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return selectedVendorId !== '';
      case 1:
        return selectedSegmentId !== '';
      case 2:
        return selectedCategoryId !== '';
      case 3:
        return name && listPrice && cost && eachesPerUnitOfMeasure && unitOfMeasureId && itemTypeId;
      default:
        return false;
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth>
            <InputLabel>Vendor</InputLabel>
            <Select
              value={selectedVendorId}
              label="Vendor"
              onChange={(e) => {
                setSelectedVendorId(e.target.value as number);
                setSelectedSegmentId('');
                setSelectedCategoryId('');
              }}
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 1:
        return (
          <FormControl fullWidth>
            <InputLabel>Segment</InputLabel>
            <Select
              value={selectedSegmentId}
              label="Segment"
              onChange={(e) => {
                setSelectedSegmentId(e.target.value as number);
                setSelectedCategoryId('');
              }}
              disabled={!selectedVendorId}
            >
              {filteredSegments.map((segment) => (
                <MenuItem key={segment.id} value={segment.id}>
                  {segment.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 2:
        return (
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategoryId}
              label="Category"
              onChange={(e) => setSelectedCategoryId(e.target.value as number)}
              disabled={!selectedSegmentId}
            >
              {filteredCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 3:
        return (
          <Stack spacing={3}>
            <TextField
              autoFocus
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
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Quick Add Item
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
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 2 }}>
            {getStepContent(activeStep)}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={saving}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained" disabled={!canProceed()}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSave} variant="contained" disabled={!canProceed() || saving}>
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}