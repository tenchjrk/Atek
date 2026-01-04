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
  conditionalRebate: string;
  growthRebate: string;
  quantityCommitment: string;
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
      conditionalRebate: string;
      growthRebate: string;
      quantityCommitment: string;
      isDirty: boolean;
      isInherited: boolean;
    }>;
  };
  segmentId: number;
  onToggleCategory: () => void;
  onCategoryPricingChange: (itemTypeId: number, discount: string, rebate: string, conditionalRebate: string, growthRebate: string, quantityCommitment: string) => void;
  onToggleItem: (itemId: number) => void;
  onItemDiscountChange: (itemId: number, value: string) => void;
  onItemRebateChange: (itemId: number, value: string) => void;
  onItemConditionalRebateChange: (itemId: number, value: string) => void;
  onItemGrowthRebateChange: (itemId: number, value: string) => void;
  onItemQuantityCommitmentChange: (itemId: number, value: string) => void;
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
  onItemConditionalRebateChange,
  onItemGrowthRebateChange,
  onItemQuantityCommitmentChange,
  onSearchChange,
}: CategoryAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const [hideDeselected, setHideDeselected] = useState(false);
  const [showWarning, setShowWarning] = useState<Record<number, boolean>>({});

  // Get margin color based on value
  const getMarginColor = (margin: number) => {
    if (margin >= 80) return 'success.main'; // Green
    if (margin >= 70) return 'warning.main'; // Yellow
    return 'error.main'; // Red
  };

  // Format currency with commas
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Toggle all items of a specific type in this category
  const toggleItemType = (itemTypeId: number) => {
    const itemsOfType = items.filter(item => item.itemTypeId === itemTypeId);
    const allOfTypeSelected = itemsOfType.every(item => categoryState.items[item.id]?.selected);

    // Toggle all items of this type
    itemsOfType.forEach(item => {
      const currentlySelected = categoryState.items[item.id]?.selected;
      if (currentlySelected === allOfTypeSelected) {
        onToggleItem(item.id);
      }
    });
  };

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

  // Calculate total margin for selected items by type (weighted by quantity commitment)
  const calculateTotalMarginByType = (itemTypeId: number) => {
    let totalCost = 0;
    let totalRevenue = 0;

    items.forEach(item => {
      if (item.itemTypeId !== itemTypeId) return;
      
      const itemState = categoryState.items[item.id];
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

    if (totalRevenue === 0) return 0;
    return ((totalRevenue - totalCost) / totalRevenue) * 100;
  };

  // Calculate total margin, total monthly revenue, and net monthly revenue (weighted by quantity commitment)
  const calculateTotalStats = () => {
    let totalCost = 0;
    let monthlyTotalRevenue = 0;
    let monthlyNetRevenue = 0;

    items.forEach(item => {
      const itemState = categoryState.items[item.id];
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

        // Monthly revenue (after discount, before rebates)
        monthlyTotalRevenue += priceAfterDiscount * quantity;
        
        // Monthly net revenue (after all rebates except growth)
        monthlyNetRevenue += netPricePerUnit * quantity;

        // Weight by quantity
        totalCost += cost * quantity;
      }
    });

    const margin = monthlyNetRevenue === 0 ? 0 : ((monthlyNetRevenue - totalCost) / monthlyNetRevenue) * 100;

    return { 
      margin, 
      monthlyTotalRevenue,
      monthlyNetRevenue
    };
  };

  const { 
    margin: totalMargin, 
    monthlyTotalRevenue,
    monthlyNetRevenue
  } = calculateTotalStats();

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {}}
      sx={{ ml: 4 }}
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
              onToggleCategory();
            }}
            onClick={(e) => e.stopPropagation()}
          />
          
          <Box sx={{ flex: 1 }}>
            <Typography>
              {category.name}
            </Typography>
            {selectedCount > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography 
                  variant="caption"
                  sx={{ 
                    color: getMarginColor(totalMargin),
                    fontWeight: 'medium'
                  }}
                >
                  Margin: {totalMargin.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monthly Total: ${formatCurrency(monthlyTotalRevenue)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monthly Net: ${formatCurrency(monthlyNetRevenue)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Pricing inputs for each item type - NO Quantity Commitment */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
          {itemTypes.map(itemType => {
            const typeName = itemType.shortName || itemType.name;
            const typeMargin = calculateTotalMarginByType(itemType.id);
            
            const itemsOfType = items.filter(item => item.itemTypeId === itemType.id);
            const selectedOfType = itemsOfType.filter(item => categoryState.items[item.id]?.selected).length;
            
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
                    value={categoryState.pricingByType[itemType.id]?.discountPercentage || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onCategoryPricingChange(
                        itemType.id,
                        e.target.value,
                        categoryState.pricingByType[itemType.id]?.rebatePercentage || '',
                        categoryState.pricingByType[itemType.id]?.conditionalRebate || '',
                        categoryState.pricingByType[itemType.id]?.growthRebate || '',
                        categoryState.pricingByType[itemType.id]?.quantityCommitment || ''
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
                    value={categoryState.pricingByType[itemType.id]?.rebatePercentage || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onCategoryPricingChange(
                        itemType.id,
                        categoryState.pricingByType[itemType.id]?.discountPercentage || '',
                        e.target.value,
                        categoryState.pricingByType[itemType.id]?.conditionalRebate || '',
                        categoryState.pricingByType[itemType.id]?.growthRebate || '',
                        categoryState.pricingByType[itemType.id]?.quantityCommitment || ''
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
                    value={categoryState.pricingByType[itemType.id]?.conditionalRebate || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onCategoryPricingChange(
                        itemType.id,
                        categoryState.pricingByType[itemType.id]?.discountPercentage || '',
                        categoryState.pricingByType[itemType.id]?.rebatePercentage || '',
                        e.target.value,
                        categoryState.pricingByType[itemType.id]?.growthRebate || '',
                        categoryState.pricingByType[itemType.id]?.quantityCommitment || ''
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
                    value={categoryState.pricingByType[itemType.id]?.growthRebate || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onCategoryPricingChange(
                        itemType.id,
                        categoryState.pricingByType[itemType.id]?.discountPercentage || '',
                        categoryState.pricingByType[itemType.id]?.rebatePercentage || '',
                        categoryState.pricingByType[itemType.id]?.conditionalRebate || '',
                        e.target.value,
                        categoryState.pricingByType[itemType.id]?.quantityCommitment || ''
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
                conditionalRebate={categoryState.items[item.id]?.conditionalRebate || ''}
                growthRebate={categoryState.items[item.id]?.growthRebate || ''}
                quantityCommitment={categoryState.items[item.id]?.quantityCommitment || ''}
                isInherited={categoryState.items[item.id]?.isInherited || false}
                onToggle={() => onToggleItem(item.id)}
                onDiscountChange={(value) => onItemDiscountChange(item.id, value)}
                onRebateChange={(value) => onItemRebateChange(item.id, value)}
                onConditionalRebateChange={(value) => onItemConditionalRebateChange(item.id, value)}
                onGrowthRebateChange={(value) => onItemGrowthRebateChange(item.id, value)}
                onQuantityCommitmentChange={(value) => onItemQuantityCommitmentChange(item.id, value)}
              />
            ))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}