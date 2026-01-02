import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  TextField,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import ContractItemRow from './ContractItemRow';
import type { ItemCategory, Item, ItemType } from '../types';

interface TypePricing {
  discountPercentage: string;
  rebatePercentage: string;
}

interface CategoryAccordionProps {
  category: ItemCategory;
  items: Item[];
  itemTypes: ItemType[];
  categoryState: {
    selected: boolean;
    pricingByType: Record<number, TypePricing>;
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
  onCategoryPricingChange: (itemTypeId: number, discount: string, rebate: string) => void;
  onToggleItem: (itemId: number) => void;
  onItemDiscountChange: (itemId: number, value: string) => void;
  onItemRebateChange: (itemId: number, value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function CategoryAccordion({
  category,
  items,
  itemTypes,
  categoryState,
  onToggleCategory,
  onCategoryPricingChange,
  onToggleItem,
  onItemDiscountChange,
  onItemRebateChange,
  onSearchChange,
}: CategoryAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const [hideDeselected, setHideDeselected] = useState(false);

  // Filter items based on search and selection
  const filteredItems = items.filter(item => {
    // Apply search filter
    if (categoryState.itemSearch) {
      const search = categoryState.itemSearch.toLowerCase();
      const matchesSearch = (
        item.id.toString().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      );
      if (!matchesSearch) return false;
    }

    // Apply hide deselected filter
    if (hideDeselected) {
      return categoryState.items[item.id]?.selected;
    }

    return true;
  });

  // Calculate checkbox state (checked/indeterminate)
  const selectedCount = items.filter(item => categoryState.items[item.id]?.selected).length;
  const isAllSelected = selectedCount === items.length && items.length > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < items.length;

  // Calculate total margin for selected items by type
  const calculateTotalMarginByType = (itemTypeId: number) => {
    let totalCost = 0;
    let totalNetPrice = 0;

    items.forEach(item => {
      if (item.itemTypeId !== itemTypeId) return;
      
      const itemState = categoryState.items[item.id];
      if (itemState?.selected) {
        const listPrice = item.listPrice || 0;
        const cost = item.cost || 0;
        const discountPercent = itemState.discountPercentage ? parseFloat(itemState.discountPercentage) / 100 : 0;
        const priceAfterDiscount = listPrice * (1 - discountPercent);
        const rebatePercent = itemState.rebatePercentage ? parseFloat(itemState.rebatePercentage) / 100 : 0;
        const netPrice = priceAfterDiscount * (1 - rebatePercent);

        totalCost += cost;
        totalNetPrice += netPrice;
      }
    });

    if (totalNetPrice === 0) return 0;
    return ((totalNetPrice - totalCost) / totalNetPrice) * 100;
  };

  // Calculate total margin across all types
  const calculateTotalMargin = () => {
    let totalCost = 0;
    let totalNetPrice = 0;

    items.forEach(item => {
      const itemState = categoryState.items[item.id];
      if (itemState?.selected) {
        const listPrice = item.listPrice || 0;
        const cost = item.cost || 0;
        const discountPercent = itemState.discountPercentage ? parseFloat(itemState.discountPercentage) / 100 : 0;
        const priceAfterDiscount = listPrice * (1 - discountPercent);
        const rebatePercent = itemState.rebatePercentage ? parseFloat(itemState.rebatePercentage) / 100 : 0;
        const netPrice = priceAfterDiscount * (1 - rebatePercent);

        totalCost += cost;
        totalNetPrice += netPrice;
      }
    });

    if (totalNetPrice === 0) return 0;
    return ((totalNetPrice - totalCost) / totalNetPrice) * 100;
  };

  const totalMargin = calculateTotalMargin();

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{ ml: 4 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2, flexWrap: 'wrap' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 300 }}>
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={(e) => {
              e.stopPropagation();
              onToggleCategory();
            }}
            onClick={(e) => e.stopPropagation()}
          />
          
          <Box sx={{ flex: 1 }}>
            <Typography>
              {category.name}
            </Typography>
            {selectedCount > 0 && (
              <Typography 
                variant="caption"
                sx={{ 
                  color: totalMargin >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 'medium'
                }}
              >
                Margin: {totalMargin.toFixed(1)}%
              </Typography>
            )}
          </Box>
        </Box>

        {/* Pricing inputs for each item type */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
          {itemTypes.map(itemType => {
            const typeName = itemType.shortName || itemType.name;
            const typeMargin = calculateTotalMarginByType(itemType.id);
            const hasSelectedItems = items.some(item => 
              item.itemTypeId === itemType.id && categoryState.items[item.id]?.selected
            );

            return (
              <Box key={itemType.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" fontWeight="medium" sx={{ minWidth: 80 }}>
                    {typeName}
                  </Typography>
                  {hasSelectedItems && (
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: typeMargin >= 0 ? 'success.main' : 'error.main',
                        fontWeight: 'medium',
                        minWidth: 60
                      }}
                    >
                      {typeMargin.toFixed(1)}%
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Disc %"
                    type="number"
                    size="small"
                    value={categoryState.pricingByType[itemType.id]?.discountPercentage || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onCategoryPricingChange(
                        itemType.id,
                        e.target.value,
                        categoryState.pricingByType[itemType.id]?.rebatePercentage || ''
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    sx={{ width: 80 }}
                  />
                  <TextField
                    label="Reb %"
                    type="number"
                    size="small"
                    value={categoryState.pricingByType[itemType.id]?.rebatePercentage || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onCategoryPricingChange(
                        itemType.id,
                        categoryState.pricingByType[itemType.id]?.discountPercentage || '',
                        e.target.value
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    sx={{ width: 80 }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 0, width: '100%' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search items by ID, name, or description..."
            size="small"
            fullWidth
            value={categoryState.itemSearch}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => setHideDeselected(!hideDeselected)}
            sx={{ minWidth: 140 }}
          >
            {hideDeselected ? 'Show All' : 'Hide Deselected'}
          </Button>
        </Box>

        {filteredItems.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            No items found
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            {filteredItems.map(item => (
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
            ))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}