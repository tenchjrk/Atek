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
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { Item, UnitOfMeasure, ItemType } from '../types';

interface ItemEditDialogProps {
  open: boolean;
  item: Item | null;
  categoryName: string;
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

export default function ItemEditDialog({
  open,
  item,
  categoryName,
  unitOfMeasures,
  itemTypes,
  onClose,
  onSave,
}: ItemEditDialogProps) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [description, setDescription] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [cost, setCost] = useState('');
  const [eachesPerUnitOfMeasure, setEachesPerUnitOfMeasure] = useState('');
  const [unitOfMeasureId, setUnitOfMeasureId] = useState<number | ''>('');
  const [itemTypeId, setItemTypeId] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (item) {
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
    if (!item) return;
    setSaving(true);
    const success = await onSave({
      id: item.id,
      itemCategoryId: item.itemCategoryId,
      name,
      shortName,
      description,
      listPrice: parseFloat(listPrice) || 0,
      cost: parseFloat(cost) || 0,
      eachesPerUnitOfMeasure: parseInt(eachesPerUnitOfMeasure) || 0,
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
        Edit Item in {categoryName}
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
            label="Short Name (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            disabled={saving}
          />
          <TextField
            label="Description (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
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
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
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
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
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
            inputProps={{ min: '1' }}
          />
          <FormControl fullWidth required disabled={saving}>
            <InputLabel>Unit of Measure</InputLabel>
            <Select
              value={unitOfMeasureId}
              label="Unit of Measure"
              onChange={(e) => setUnitOfMeasureId(e.target.value as number)}
            >
              {unitOfMeasures.map((uom) => (
                <MenuItem key={uom.id} value={uom.id}>
                  {uom.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required disabled={saving}>
            <InputLabel>Item Type</InputLabel>
            <Select
              value={itemTypeId}
              label="Item Type"
              onChange={(e) => setItemTypeId(e.target.value as number)}
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
          disabled={
            saving ||
            !name ||
            !listPrice ||
            !cost ||
            !eachesPerUnitOfMeasure ||
            unitOfMeasureId === '' ||
            itemTypeId === ''
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}