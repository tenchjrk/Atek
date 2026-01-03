import { Checkbox, TextField, Box, Typography } from '@mui/material';
import type { Item } from '../types';

interface ContractItemRowProps {
  item: Item;
  selected: boolean;
  discountPercentage: string;
  rebatePercentage: string;
  conditionalRebate: string;
  growthRebate: string;
  quantityCommitment: string;
  isInherited: boolean;
  onToggle: () => void;
  onDiscountChange: (value: string) => void;
  onRebateChange: (value: string) => void;
  onConditionalRebateChange: (value: string) => void;
  onGrowthRebateChange: (value: string) => void;
  onQuantityCommitmentChange: (value: string) => void;
}

export default function ContractItemRow({
  item,
  selected,
  discountPercentage,
  rebatePercentage,
  conditionalRebate,
  growthRebate,
  quantityCommitment,
  isInherited,
  onToggle,
  onDiscountChange,
  onRebateChange,
  onConditionalRebateChange,
  onGrowthRebateChange,
  onQuantityCommitmentChange,
}: ContractItemRowProps) {
  // Calculate prices
  const listPrice = item.listPrice || 0;
  const cost = item.cost || 0;
  
  // Step 1: Apply discount
  const discountPercent = discountPercentage ? parseFloat(discountPercentage) / 100 : 0;
  const priceAfterDiscount = listPrice * (1 - discountPercent);
  
  // Step 2: Apply regular rebate
  const rebatePercent = rebatePercentage ? parseFloat(rebatePercentage) / 100 : 0;
  const priceAfterRebate = priceAfterDiscount * (1 - rebatePercent);
  
  // Step 3: Apply conditional rebate
  const conditionalRebatePercent = conditionalRebate ? parseFloat(conditionalRebate) / 100 : 0;
  const priceAfterConditionalRebate = priceAfterRebate * (1 - conditionalRebatePercent);
  
  // Step 4: Apply growth rebate (for display only, not in margin)
  const growthRebatePercent = growthRebate ? parseFloat(growthRebate) / 100 : 0;
  const priceAfterGrowthRebate = priceAfterConditionalRebate * (1 - growthRebatePercent);
  
  // Quantity and commitment in dollars
  const qty = quantityCommitment ? parseFloat(quantityCommitment) : 0;
  const commitmentDollars = priceAfterDiscount * qty;
  
  // Net revenue based on commitment, rebate, and conditional rebate
  const netRevenue = priceAfterConditionalRebate * qty;
  
  // Net margin calculation (does NOT include growth rebate)
  const netMargin = priceAfterConditionalRebate > 0 
    ? ((priceAfterConditionalRebate - cost) / priceAfterConditionalRebate) * 100 
    : 0;

  const itemTypeName = item.itemType?.shortName || item.itemType?.name || '';
  const uomName = item.unitOfMeasure?.shortName || item.unitOfMeasure?.name || '';

  // Format currency with commas
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get margin color based on value
  const getMarginColor = (margin: number) => {
    if (margin >= 80) return 'success.main'; // Green
    if (margin >= 70) return 'warning.main'; // Yellow
    return 'error.main'; // Red
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        borderBottom: 1,
        borderColor: 'divider',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Checkbox
        checked={selected}
        onChange={onToggle}
        sx={{ mr: 2 }}
      />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* First row - ID/Name/Type/UOM, List Price, Discount, Price After Discount, Annual Usage, $ Commitment, Rebate % */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ minWidth: 280 }}>
            <Typography variant="body1" fontWeight="medium">
              {item.id}: {item.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              {itemTypeName && (
                <Typography variant="caption" color="text.secondary">
                  Type: {itemTypeName}
                </Typography>
              )}
              
              {uomName && (
                <Typography variant="caption" color="text.secondary">
                  UOM: {uomName} ({item.eachesPerUnitOfMeasure} ea)
                </Typography>
              )}
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
            List: ${formatCurrency(listPrice)}
          </Typography>
          
          <TextField
            label="Discount %"
            type="number"
            size="small"
            value={discountPercentage}
            onChange={(e) => onDiscountChange(e.target.value)}
            disabled={!selected}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            sx={{ 
              width: 120,
              '& input': {
                fontStyle: isInherited ? 'italic' : 'normal',
                color: isInherited ? 'text.secondary' : 'text.primary',
              }
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
            → ${formatCurrency(priceAfterDiscount)}
          </Typography>

          <TextField
            label="Annual Usage"
            type="number"
            size="small"
            value={quantityCommitment}
            onChange={(e) => onQuantityCommitmentChange(e.target.value)}
            disabled={!selected}
            inputProps={{ min: 0, step: 1 }}
            sx={{ 
              width: 140,
              '& input': {
                fontStyle: isInherited ? 'italic' : 'normal',
                color: isInherited ? 'text.secondary' : 'text.primary',
              }
            }}
          />

          {qty > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
              = ${formatCurrency(commitmentDollars)}
            </Typography>
          )}

          <TextField
            label="Rebate %"
            type="number"
            size="small"
            value={rebatePercentage}
            onChange={(e) => onRebateChange(e.target.value)}
            disabled={!selected}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            sx={{ 
              width: 120,
              '& input': {
                fontStyle: isInherited ? 'italic' : 'normal',
                color: isInherited ? 'text.secondary' : 'text.primary',
              }
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
            → ${formatCurrency(priceAfterRebate)}
          </Typography>
        </Box>

        {/* Second row - Description, Conditional Rebate %, Net Revenue $, Growth Rebate %, Margin */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 0 }}>
          <Box sx={{ minWidth: 280 }}>
            {item.description && (
              <Typography variant="caption" color="text.secondary">
                {item.description}
              </Typography>
            )}
          </Box>

          <TextField
            label="Conditional Reb %"
            type="number"
            size="small"
            value={conditionalRebate}
            onChange={(e) => onConditionalRebateChange(e.target.value)}
            disabled={!selected}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            sx={{ 
              width: 140,
              '& input': {
                fontStyle: isInherited ? 'italic' : 'normal',
                color: isInherited ? 'text.secondary' : 'text.primary',
              }
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
            → ${formatCurrency(priceAfterConditionalRebate)}
          </Typography>

          {qty > 0 && (
            <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 140 }}>
              Net: ${formatCurrency(netRevenue)}
            </Typography>
          )}

          <TextField
            label="Growth Reb %"
            type="number"
            size="small"
            value={growthRebate}
            onChange={(e) => onGrowthRebateChange(e.target.value)}
            disabled={!selected}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            sx={{ 
              width: 120,
              '& input': {
                fontStyle: isInherited ? 'italic' : 'normal',
                color: isInherited ? 'text.secondary' : 'text.primary',
              }
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
            → ${formatCurrency(priceAfterGrowthRebate)}
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              minWidth: 100,
              color: getMarginColor(netMargin),
              fontWeight: 'medium'
            }}
          >
            {netMargin.toFixed(1)}% margin
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}