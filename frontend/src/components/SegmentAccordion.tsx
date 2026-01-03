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
  conditionalRebate: string;
  growthRebate: string;
  quantityCommitment: string;
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
        conditionalRebate: string;
        growthRebate: string;
        quantityCommitment: string;
        isDirty: boolean;
        isInherited: boolean;
      }>;
    }>;
  };
  onToggleSegment: () => void;
  onSegmentPricingChange: (itemTypeId: number, discount: string, rebate: string, conditionalRebate: string, growthRebate: string, quantityCommitment: string) => void;
  onToggleCategory: (categoryId: number) => void;
  onCategoryPricingChange: (categoryId: number, itemTypeId: number, discount: string, rebate: string, conditionalRebate: string, growthRebate: string, quantityCommitment: string) => void;
  onToggleItem: (categoryId: number, itemId: number) => void;
  onItemDiscountChange: (categoryId: number, itemId: number, value: string) => void;
  onItemRebateChange: (categoryId: number, itemId: number, value: string) => void;
  onItemConditionalRebateChange: (categoryId: number, itemId: number, value: string) => void;
  onItemGrowthRebateChange: (categoryId: number, itemId: number, value: string) => void;
  onItemQuantityCommitmentChange: (categoryId: number, itemId: number, value: string) => void;
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
  onItemConditionalRebateChange,
  onItemGrowthRebateChange,
  onItemQuantityCommitmentChange,
  onCategorySearchChange,
}: SegmentAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const [showWarning, setShowWarning] = useState<Record<number, boolean>>({});

  // Get margin color based on value
  const getMarginColor = (margin: number) => {
    if (margin >= 80) return 'success.main'; // Green
    if (margin >= 70) return 'warning.main'; // Yellow
    return 'error.main'; // Red
  };

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

  // Toggle all items of a specific type in this segment
  const toggleItemType = (itemTypeId: number) => {
    const itemsOfType = allItems.filter(item => item.typeId === itemTypeId);
    const allOfTypeSelected = itemsOfType.every(item => {
      const foundItem = items.find(i => i.id === item.id);
      if (!foundItem) return false;
      const categoryId = foundItem.itemCategoryId;
      return segmentState.categories[categoryId]?.items[item.id]?.selected;
    });

    // Toggle all items of this type
    itemsOfType.forEach(item => {
      const foundItem = items.find(i => i.id === item.id);
      if (!foundItem) return;
      const categoryId = foundItem.itemCategoryId;
      const currentlySelected = segmentState.categories[categoryId]?.items[item.id]?.selected;
      
      if (currentlySelected === allOfTypeSelected) {
        onToggleItem(categoryId, item.id);
      }
    });
  };

  // Calculate total margin for selected items in segment by type (weighted by quantity commitment)
  const calculateTotalMarginByType = (itemTypeId: number) => {
    let totalCost = 0;
    let totalRevenue = 0;

    categories.forEach(category => {
      const categoryItems = items.filter(i => i.itemCategoryId === category.id && i.itemTypeId === itemTypeId);
      const categoryState = segmentState.categories[category.id];

      categoryItems.forEach(item => {
        const itemState = categoryState?.items[item.id];
        if (itemState?.selected) {
          const listPrice = item.listPrice || 0;
          const cost = item.cost || 0;
          const quantity = itemState.quantityCommitment ? parseFloat(itemState.quantityCommitment) : 1;
          
          // Calculate net price per unit
          const discountPercent = itemState.discountPercentage ? parseFloat(itemState.discountPercentage) / 100 : 0;
          const priceAfterDiscount = listPrice * (1 - discountPercent);
          
          const rebatePercent = itemState.rebatePercentage ? parseFloat(itemState.rebatePercentage) / 100 : 0;
          const priceAfterRebate = priceAfterDiscount * (1 - rebatePercent);
          
          const conditionalRebatePercent = itemState.conditionalRebate ? parseFloat(itemState.conditionalRebate) / 100 : 0;
          const netPricePerUnit = priceAfterRebate * (1 - conditionalRebatePercent);

          // Weight by quantity
          totalCost += cost * quantity;
          totalRevenue += netPricePerUnit * quantity;
        }
      });
    });

    if (totalRevenue === 0) return 0;
    return ((totalRevenue - totalCost) / totalRevenue) * 100;
  };

  // Calculate total margin across all types (weighted by quantity commitment)
  const calculateTotalMargin = () => {
    let totalCost = 0;
    let totalRevenue = 0;

    categories.forEach(category => {
      const categoryItems = items.filter(i => i.itemCategoryId === category.id);
      const categoryState = segmentState.categories[category.id];

      categoryItems.forEach(item => {
        const itemState = categoryState?.items[item.id];
        if (itemState?.selected) {
          const listPrice = item.listPrice || 0;
          const cost = item.cost || 0;
          const quantity = itemState.quantityCommitment ? parseFloat(itemState.quantityCommitment) : 1;
          
          // Calculate net price per unit
          const discountPercent = itemState.discountPercentage ? parseFloat(itemState.discountPercentage) / 100 : 0;
          const priceAfterDiscount = listPrice * (1 - discountPercent);
          
          const rebatePercent = itemState.rebatePercentage ? parseFloat(itemState.rebatePercentage) / 100 : 0;
          const priceAfterRebate = priceAfterDiscount * (1 - rebatePercent);
          
          const conditionalRebatePercent = itemState.conditionalRebate ? parseFloat(itemState.conditionalRebate) / 100 : 0;
          const netPricePerUnit = priceAfterRebate * (1 - conditionalRebatePercent);

          // Weight by quantity
          totalCost += cost * quantity;
          totalRevenue += netPricePerUnit * quantity;
        }
      });
    });

    if (totalRevenue === 0) return 0;
    return ((totalRevenue - totalCost) / totalRevenue) * 100;
  };

  const totalMargin = calculateTotalMargin();

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {}}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 32 }} />}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('.MuiAccordionSummary-expandIconWrapper')) {
            setExpanded(!expanded);
          }
        }}
        sx={{ 
          '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2, flexWrap: 'wrap' },
          '& .MuiAccordionSummary-expandIconWrapper': { 
            cursor: 'pointer',
          },
          cursor: 'default',
        }}
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
                  color: getMarginColor(totalMargin),
                  fontWeight: 'medium'
                }}
              >
                Margin: {totalMargin.toFixed(1)}%
              </Typography>
            )}
          </Box>
        </Box>

        {/* Pricing inputs for each item type - NO Quantity Commitment */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
          {itemTypes.map(itemType => {
            const typeName = itemType.shortName || itemType.name;
            const typeMargin = calculateTotalMarginByType(itemType.id);
            
            const itemsOfType = allItems.filter(item => item.typeId === itemType.id);
            const selectedOfType = itemsOfType.filter(item => {
              const foundItem = items.find(i => i.id === item.id);
              if (!foundItem) return false;
              const categoryId = foundItem.itemCategoryId;
              return segmentState.categories[categoryId]?.items[item.id]?.selected;
            }).length;
            
            const hasItems = itemsOfType.length > 0;
            const allOfTypeSelected = hasItems && selectedOfType === itemsOfType.length;
            const someOfTypeSelected = selectedOfType > 0 && selectedOfType < itemsOfType.length;

            return (
              <Box key={itemType.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {hasItems && (
                    <Checkbox
                      size="small"
                      checked={allOfTypeSelected}
                      indeterminate={someOfTypeSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleItemType(itemType.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ p: 0 }}
                    />
                  )}
                  <Typography variant="caption" fontWeight="medium" sx={{ minWidth: 60 }}>
                    {typeName}
                  </Typography>
                  {selectedOfType > 0 && (
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: getMarginColor(typeMargin),
                        fontWeight: 'medium',
                        minWidth: 60
                      }}
                    >
                      {typeMargin.toFixed(1)}%
                    </Typography>
                  )}
                </Box>
                
                {/* Row 1: Discount and Rebate */}
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
                        segmentState.pricingByType[itemType.id]?.rebatePercentage || '',
                        segmentState.pricingByType[itemType.id]?.conditionalRebate || '',
                        segmentState.pricingByType[itemType.id]?.growthRebate || '',
                        segmentState.pricingByType[itemType.id]?.quantityCommitment || ''
                      );
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setShowWarning({ ...showWarning, [itemType.id]: true });
                    }}
                    onBlur={() => {
                      setShowWarning({ ...showWarning, [itemType.id]: false });
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
                        e.target.value,
                        segmentState.pricingByType[itemType.id]?.conditionalRebate || '',
                        segmentState.pricingByType[itemType.id]?.growthRebate || '',
                        segmentState.pricingByType[itemType.id]?.quantityCommitment || ''
                      );
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setShowWarning({ ...showWarning, [itemType.id]: true });
                    }}
                    onBlur={() => {
                      setShowWarning({ ...showWarning, [itemType.id]: false });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    sx={{ width: 80 }}
                  />
                </Box>
                
                {/* Row 2: Conditional Rebate and Growth Rebate */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Cond %"
                    type="number"
                    size="small"
                    value={segmentState.pricingByType[itemType.id]?.conditionalRebate || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSegmentPricingChange(
                        itemType.id,
                        segmentState.pricingByType[itemType.id]?.discountPercentage || '',
                        segmentState.pricingByType[itemType.id]?.rebatePercentage || '',
                        e.target.value,
                        segmentState.pricingByType[itemType.id]?.growthRebate || '',
                        segmentState.pricingByType[itemType.id]?.quantityCommitment || ''
                      );
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setShowWarning({ ...showWarning, [itemType.id]: true });
                    }}
                    onBlur={() => {
                      setShowWarning({ ...showWarning, [itemType.id]: false });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    sx={{ width: 80 }}
                  />
                  <TextField
                    label="Grwth %"
                    type="number"
                    size="small"
                    value={segmentState.pricingByType[itemType.id]?.growthRebate || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSegmentPricingChange(
                        itemType.id,
                        segmentState.pricingByType[itemType.id]?.discountPercentage || '',
                        segmentState.pricingByType[itemType.id]?.rebatePercentage || '',
                        segmentState.pricingByType[itemType.id]?.conditionalRebate || '',
                        e.target.value,
                        segmentState.pricingByType[itemType.id]?.quantityCommitment || ''
                      );
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setShowWarning({ ...showWarning, [itemType.id]: true });
                    }}
                    onBlur={() => {
                      setShowWarning({ ...showWarning, [itemType.id]: false });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    sx={{ width: 80 }}
                  />
                </Box>
                
                {showWarning[itemType.id] && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'warning.main',
                      fontStyle: 'italic',
                      fontSize: '0.7rem'
                    }}
                  >
                    ⚠️ This will overwrite all related items
                  </Typography>
                )}
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
              onCategoryPricingChange={(itemTypeId, discount, rebate, conditionalRebate, growthRebate, quantityCommitment) => 
                onCategoryPricingChange(category.id, itemTypeId, discount, rebate, conditionalRebate, growthRebate, quantityCommitment)
              }
              onToggleItem={(itemId) => onToggleItem(category.id, itemId)}
              onItemDiscountChange={(itemId, value) => onItemDiscountChange(category.id, itemId, value)}
              onItemRebateChange={(itemId, value) => onItemRebateChange(category.id, itemId, value)}
              onItemConditionalRebateChange={(itemId, value) => onItemConditionalRebateChange(category.id, itemId, value)}
              onItemGrowthRebateChange={(itemId, value) => onItemGrowthRebateChange(category.id, itemId, value)}
              onItemQuantityCommitmentChange={(itemId, value) => onItemQuantityCommitmentChange(category.id, itemId, value)}
              onSearchChange={(value) => onCategorySearchChange(category.id, value)}
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
}