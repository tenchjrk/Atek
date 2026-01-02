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
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1,
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
        <Typography sx={{ minWidth: 200 }}>
          {item.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
          List: ${item.listPrice?.toFixed(2) || '0.00'}
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
      </Box>
    </Box>
  );
}