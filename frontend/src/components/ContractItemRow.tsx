import { Checkbox, TextField, Box, Typography } from '@mui/material';
import type { Item } from '../types';

interface ContractItemRowProps {
  item: Item;
  selected: boolean;
  discountPercentage: string;
  rebatePercentage: string;
  isInherited: boolean;
  onToggle: () => void;
  onDiscountChange: (value: string) => void;
  onRebateChange: (value: string) => void;
}

export default function ContractItemRow({
  item,
  selected,
  discountPercentage,
  rebatePercentage,
  isInherited,
  onToggle,
  onDiscountChange,
  onRebateChange,
}: ContractItemRowProps) {
  // Calculate prices
  const listPrice = item.listPrice || 0;
  const cost = item.cost || 0;
  const discountPercent = discountPercentage ? parseFloat(discountPercentage) / 100 : 0;
  const priceAfterDiscount = listPrice * (1 - discountPercent);
  const rebatePercent = rebatePercentage ? parseFloat(rebatePercentage) / 100 : 0;
  const netPriceAfterRebate = priceAfterDiscount * (1 - rebatePercent);
  const netMargin = netPriceAfterRebate > 0 ? ((netPriceAfterRebate - cost) / netPriceAfterRebate) * 100 : 0;

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
      
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
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
          → ${formatCurrency(netPriceAfterRebate)}
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
  );
}