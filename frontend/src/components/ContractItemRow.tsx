import { Checkbox, TextField, Box, Typography, Tooltip, IconButton } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
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
  
  // Calculate normal margin (list price vs cost)
  const normalMargin = listPrice > 0 ? ((listPrice - cost) / listPrice) * 100 : 0;
  
  // Step 1: Apply discount
  const discountPercent = discountPercentage ? parseFloat(discountPercentage) / 100 : 0;
  const priceAfterDiscount = listPrice * (1 - discountPercent);
  
  // Step 2: Apply regular rebate
  const rebatePercent = rebatePercentage ? parseFloat(rebatePercentage) / 100 : 0;
  const priceAfterRebate = priceAfterDiscount * (1 - rebatePercent);
  
  // Step 3: Apply conditional rebate
  const conditionalRebatePercent = conditionalRebate ? parseFloat(conditionalRebate) / 100 : 0;
  const priceAfterConditionalRebate = priceAfterRebate * (1 - conditionalRebatePercent);
  
  // Step 4: Apply growth rebate (for display only, not in contract margin)
  const growthRebatePercent = growthRebate ? parseFloat(growthRebate) / 100 : 0;
  const priceAfterGrowthRebate = priceAfterConditionalRebate * (1 - growthRebatePercent);
  
  // Monthly quantity and commitment in dollars
  const monthlyQty = quantityCommitment ? parseFloat(quantityCommitment) : 0;
  const commitmentDollars = priceAfterDiscount * monthlyQty;
  
  // Calculate eaches (monthly qty * eaches per UOM)
  const eachesPerUom = item.eachesPerUnitOfMeasure || 1;
  const totalEaches = monthlyQty * eachesPerUom;
  
  // Net monthly revenue based on commitment, rebate, and conditional rebate
  const netMonthlyRevenue = priceAfterConditionalRebate * monthlyQty;
  
  // Contract margin calculation (does NOT include growth rebate)
  const contractMargin = priceAfterConditionalRebate > 0 
    ? ((priceAfterConditionalRebate - cost) / priceAfterConditionalRebate) * 100 
    : 0;
  
  // Growth margin calculation (INCLUDES growth rebate)
  const growthMargin = priceAfterGrowthRebate > 0
    ? ((priceAfterGrowthRebate - cost) / priceAfterGrowthRebate) * 100
    : 0;
  
  // Margin differences
  const contractMarginDifference = contractMargin - normalMargin;
  const growthMarginDifference = growthMargin - normalMargin;

  const itemTypeName = item.itemType?.shortName || item.itemType?.name || '';
  const uomName = item.unitOfMeasure?.shortName || item.unitOfMeasure?.name || '';

  // Format currency with commas
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format number with commas
  const formatNumber = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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
      
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 280 }}>
          {/* Row 1: ID/Name */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body1" fontWeight="medium">
                {item.id}: {item.name}
              </Typography>
              {item.description && (
                <Tooltip title={item.description} arrow>
                  <IconButton size="small" sx={{ p: 0.25 }}>
                    <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Row 2: Type, UOM on first line; List, Cost on second line */}
          <Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
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
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                List: ${formatCurrency(listPrice)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cost: ${formatCurrency(cost)}
              </Typography>
            </Box>
          </Box>

          {/* Row 3: Margin details */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Normal Margin: {normalMargin.toFixed(1)}%
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: getMarginColor(contractMargin),
                fontWeight: 'medium',
                display: 'block'
              }}
            >
              Contract Margin: {contractMargin.toFixed(1)}% ({contractMarginDifference >= 0 ? '+' : ''}{contractMarginDifference.toFixed(1)}%)
            </Typography>
          </Box>

          {/* Row 4: Net Monthly */}
          <Box>
            <Typography variant="caption" fontWeight="medium">
              Net Monthly: ${formatCurrency(netMonthlyRevenue)}
            </Typography>
          </Box>
        </Box>

        {/* Input columns */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* First row - Discount, Price After Discount, Monthly Usage, $ Commitment */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              <Tooltip title="Standard pricing discount" arrow>
                <IconButton size="small" sx={{ p: 0.25 }}>
                  <InfoIcon sx={{ fontSize: 16, color: 'action.active' }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
              → ${formatCurrency(priceAfterDiscount)}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TextField
                label="Monthly Usage"
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
              <Tooltip title="Expected monthly quantity usage for this item" arrow>
                <IconButton size="small" sx={{ p: 0.25 }}>
                  <InfoIcon sx={{ fontSize: 16, color: 'action.active' }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 160 }}>
              = ${formatCurrency(commitmentDollars)} ({formatNumber(totalEaches)} ea)
            </Typography>
          </Box>

          {/* Second row - Rebate %, Conditional Rebate % */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              <Tooltip title="Regular rebate: Applies to all purchases" arrow>
                <IconButton size="small" sx={{ p: 0.25 }}>
                  <InfoIcon sx={{ fontSize: 16, color: 'action.active' }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
              → ${formatCurrency(priceAfterRebate)}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              <Tooltip title="Conditional rebate: Applies to all previous purchases once commitment is hit" arrow>
                <IconButton size="small" sx={{ p: 0.25 }}>
                  <InfoIcon sx={{ fontSize: 16, color: 'action.active' }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
              → ${formatCurrency(priceAfterConditionalRebate)}
            </Typography>
          </Box>

          {/* Third row - Growth Rebate % and Growth Margin */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              <Tooltip title="Growth rebate: Applies to purchases after the commitment is hit, in addition to conditional rebate. Not applied to contract margin." arrow>
                <IconButton size="small" sx={{ p: 0.25 }}>
                  <InfoIcon sx={{ fontSize: 16, color: 'action.active' }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
              → ${formatCurrency(priceAfterGrowthRebate)}
            </Typography>

            <Box sx={{ minWidth: 140 }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
              >
                Growth Margin: {growthMargin.toFixed(1)}% ({growthMarginDifference >= 0 ? '+' : ''}{growthMarginDifference.toFixed(1)}%)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}