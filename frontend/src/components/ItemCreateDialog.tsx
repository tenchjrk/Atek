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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { UnitOfMeasure, ItemType } from "../types";

interface ItemCreateDialogProps {
  open: boolean;
  categoryId: number;
  categoryName: string;
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

export default function ItemCreateDialog({
  open,
  categoryId,
  categoryName,
  unitOfMeasures,
  itemTypes,
  onClose,
  onSave,
}: ItemCreateDialogProps) {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [cost, setCost] = useState("");
  const [eachesPerUnitOfMeasure, setEachesPerUnitOfMeasure] = useState("");
  const [unitOfMeasureId, setUnitOfMeasureId] = useState<number | "">("");
  const [itemTypeId, setItemTypeId] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setName("");
    setShortName("");
    setDescription("");
    setListPrice("");
    setCost("");
    setEachesPerUnitOfMeasure("");
    setUnitOfMeasureId("");
    setItemTypeId("");
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave({
      itemCategoryId: categoryId,
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
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add Item to {categoryName}
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
            label='Item Name'
            type='text'
            fullWidth
            variant='outlined'
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            required
          />
          <TextField
            label='Short Name (Optional)'
            type='text'
            fullWidth
            variant='outlined'
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            disabled={saving}
          />
          <TextField
            label='Description (Optional)'
            type='text'
            fullWidth
            variant='outlined'
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
          />
          <TextField
            label='List Price'
            type='number'
            fullWidth
            variant='outlined'
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
            disabled={saving}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
            }}
            inputProps={{ step: "0.01", min: "0" }}
          />
          <TextField
            label='Cost'
            type='number'
            fullWidth
            variant='outlined'
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            disabled={saving}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
            }}
            inputProps={{ step: "0.01", min: "0" }}
          />
          <TextField
            label='Eaches Per Unit of Measure'
            type='number'
            fullWidth
            variant='outlined'
            value={eachesPerUnitOfMeasure}
            onChange={(e) => setEachesPerUnitOfMeasure(e.target.value)}
            disabled={saving}
            required
            inputProps={{ min: "1" }}
          />
          <FormControl fullWidth required disabled={saving}>
            <InputLabel>Unit of Measure</InputLabel>
            <Select
              value={unitOfMeasureId}
              label='Unit of Measure'
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
              label='Item Type'
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
          variant='contained'
          disabled={
            saving ||
            !name ||
            !listPrice ||
            !cost ||
            !eachesPerUnitOfMeasure ||
            unitOfMeasureId === "" ||
            itemTypeId === ""
          }
        >
          Add Item
        </Button>
      </DialogActions>
    </Dialog>
  );
}
