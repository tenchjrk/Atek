import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import ContractItemRow from './ContractItemRow';
import type { ItemCategory, Item } from '../types';

interface CategoryAccordionProps {
  category: ItemCategory;
  items: Item[];
  categoryState: {
    selected: boolean;
    discountPercentage: string;
    rebatePercentage: string;
    itemSearch: string;
    items: Record<number, {
      selected: boolean;
      discountPercentage: string;
      rebatePercentage: string;
      isDirty: boolean;
      isInherited: boolean;
    }>;
  };
  segmentId: number;
  onToggleCategory: () => void;
  onCategoryDiscountChange: (value: string) => void;
  onCategoryRebateChange: (value: string) => void;
  onToggleItem: (itemId: number) => void;
  onItemDiscountChange: (itemId: number, value: string) => void;
  onItemRebateChange: (itemId: number, value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function CategoryAccordion({
  category,
  items,
  categoryState,
  onToggleCategory,
  onCategoryDiscountChange,
  onCategoryRebateChange,
  onToggleItem,
  onItemDiscountChange,
  onItemRebateChange,
  onSearchChange,
}: CategoryAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  // Filter items based on search
  const filteredItems = items.filter(item => {
    if (!categoryState.itemSearch) return true;
    const search = categoryState.itemSearch.toLowerCase();
    return (
      item.id.toString().includes(search) ||
      item.name.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search)
    );
  });

  // Calculate checkbox state (checked/indeterminate)
  const selectedCount = items.filter(item => categoryState.items[item.id]?.selected).length;
  const isAllSelected = selectedCount === items.length && items.length > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < items.length;

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{ ml: 4 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 } }}
      >
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={(e) => {
            e.stopPropagation();
            onToggleCategory();
          }}
          onClick={(e) => e.stopPropagation()}
        />
        
        <Typography sx={{ flex: 1 }}>
          {category.name}
        </Typography>

        <TextField
          label="Category Discount %"
          type="number"
          size="small"
          value={categoryState.discountPercentage}
          onChange={(e) => {
            e.stopPropagation();
            onCategoryDiscountChange(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          inputProps={{ min: 0, max: 100, step: 0.01 }}
          sx={{ width: 150 }}
        />

        <TextField
          label="Category Rebate %"
          type="number"
          size="small"
          value={categoryState.rebatePercentage}
          onChange={(e) => {
            e.stopPropagation();
            onCategoryRebateChange(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          inputProps={{ min: 0, max: 100, step: 0.01 }}
          sx={{ width: 150 }}
        />
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            placeholder="Search items by ID, name, or description..."
            size="small"
            fullWidth
            value={categoryState.itemSearch}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Box>

        {filteredItems.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            No items found
          </Box>
        ) : (
          filteredItems.map(item => (
            <ContractItemRow
              key={item.id}
              item={item}
              selected={categoryState.items[item.id]?.selected || false}
              discountPercentage={categoryState.items[item.id]?.discountPercentage || ''}
              rebatePercentage={categoryState.items[item.id]?.rebatePercentage || ''}
              isInherited={categoryState.items[item.id]?.isInherited || false}
              onToggle={() => onToggleItem(item.id)}
              onDiscountChange={(value) => onItemDiscountChange(item.id, value)}
              onRebateChange={(value) => onItemRebateChange(item.id, value)}
            />
          ))
        )}
      </AccordionDetails>
    </Accordion>
  );
}