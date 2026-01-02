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
import CategoryAccordion from './CategoryAccordion';
import type { VendorSegment, ItemCategory, Item, ItemType } from '../types';

interface TypePricing {
  discountPercentage: string;
  rebatePercentage: string;
}

interface SegmentAccordionProps {
  segment: VendorSegment;
  categories: ItemCategory[];
  items: Item[];
  itemTypes: ItemType[];
  segmentState: {
    selected: boolean;
    pricingByType: Record<number, TypePricing>;
    categories: Record<number, {
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
    }>;
  };
  onToggleSegment: () => void;
  onSegmentPricingChange: (itemTypeId: number, discount: string, rebate: string) => void;
  onToggleCategory: (categoryId: number) => void;
  onCategoryPricingChange: (categoryId: number, itemTypeId: number, discount: string, rebate: string) => void;
  onToggleItem: (categoryId: number, itemId: number) => void;
  onItemDiscountChange: (categoryId: number, itemId: number, value: string) => void;
  onItemRebateChange: (categoryId: number, itemId: number, value: string) => void;
  onCategorySearchChange: (categoryId: number, value: string) => void;
}

export default function SegmentAccordion({
  segment,
  categories,
  items,
  itemTypes,
  segmentState,
  onToggleSegment,
  onSegmentPricingChange,
  onToggleCategory,
  onCategoryPricingChange,
  onToggleItem,
  onItemDiscountChange,
  onItemRebateChange,
  onCategorySearchChange,
}: SegmentAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate checkbox state (checked/indeterminate)
  const allItems: Array<{ id: number; typeId: number }> = [];
  categories.forEach(category => {
    const categoryItems = items.filter(i => i.itemCategoryId === category.id);
    categoryItems.forEach(item => allItems.push({ id: item.id, typeId: item.itemTypeId }));
  });

  const selectedCount = allItems.filter(item => {
    const foundItem = items.find(i => i.id === item.id);
    if (!foundItem) return false;
    const categoryId = foundItem.itemCategoryId;
    return segmentState.categories[categoryId]?.items[item.id]?.selected;
  }).length;

  const isAllSelected = selectedCount === allItems.length && allItems.length > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < allItems.length;

  // Calculate total margin for selected items in segment by type
  const calculateTotalMarginByType = (itemTypeId: number) => {
    let totalCost = 0;
    let totalNetPrice = 0;

    categories.forEach(category => {
      const categoryItems = items.filter(i => i.itemCategoryId === category.id && i.itemTypeId === itemTypeId);
      const categoryState = segmentState.categories[category.id];

      categoryItems.forEach(item => {
        const itemState = categoryState?.items[item.id];
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
    });

    if (totalNetPrice === 0) return 0;
    return ((totalNetPrice - totalCost) / totalNetPrice) * 100;
  };

  // Calculate total margin across all types
  const calculateTotalMargin = () => {
    let totalCost = 0;
    let totalNetPrice = 0;

    categories.forEach(category => {
      const categoryItems = items.filter(i => i.itemCategoryId === category.id);
      const categoryState = segmentState.categories[category.id];

      categoryItems.forEach(item => {
        const itemState = categoryState?.items[item.id];
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
    });

    if (totalNetPrice === 0) return 0;
    return ((totalNetPrice - totalCost) / totalNetPrice) * 100;
  };

  const totalMargin = calculateTotalMargin();

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
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
              onToggleSegment();
            }}
            onClick={(e) => e.stopPropagation()}
          />
          
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight="bold">
              Segment: {segment.name}
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
            const hasSelectedItems = allItems.some(item => {
              const foundItem = items.find(i => i.id === item.id);
              if (!foundItem || foundItem.itemTypeId !== itemType.id) return false;
              const categoryId = foundItem.itemCategoryId;
              return segmentState.categories[categoryId]?.items[item.id]?.selected;
            });

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
                    value={segmentState.pricingByType[itemType.id]?.discountPercentage || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSegmentPricingChange(
                        itemType.id,
                        e.target.value,
                        segmentState.pricingByType[itemType.id]?.rebatePercentage || ''
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
                    value={segmentState.pricingByType[itemType.id]?.rebatePercentage || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSegmentPricingChange(
                        itemType.id,
                        segmentState.pricingByType[itemType.id]?.discountPercentage || '',
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
        {categories.map(category => {
          const categoryItems = items.filter(i => i.itemCategoryId === category.id);
          return (
            <CategoryAccordion
              key={category.id}
              category={category}
              items={categoryItems}
              itemTypes={itemTypes}
              categoryState={segmentState.categories[category.id]}
              segmentId={segment.id}
              onToggleCategory={() => onToggleCategory(category.id)}
              onCategoryPricingChange={(itemTypeId, discount, rebate) => 
                onCategoryPricingChange(category.id, itemTypeId, discount, rebate)
              }
              onToggleItem={(itemId) => onToggleItem(category.id, itemId)}
              onItemDiscountChange={(itemId, value) => onItemDiscountChange(category.id, itemId, value)}
              onItemRebateChange={(itemId, value) => onItemRebateChange(category.id, itemId, value)}
              onSearchChange={(value) => onCategorySearchChange(category.id, value)}
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
}