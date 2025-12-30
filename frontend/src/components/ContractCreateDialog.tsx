import { useState, useMemo } from 'react';
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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { Account, ContractStatus } from '../types';

interface ContractCreateDialogProps {
  open: boolean;
  accounts: Account[];
  contractStatuses: ContractStatus[];
  onClose: () => void;
  onSave: (contractData: {
    accountId: number;
    contractStatusId: number;
    termLengthMonths: number;
  }) => Promise<boolean>;
}

export default function ContractCreateDialog({
  open,
  accounts,
  contractStatuses,
  onClose,
  onSave,
}: ContractCreateDialogProps) {
  const [accountId, setAccountId] = useState<number | ''>('');
  const [termLengthMonths, setTermLengthMonths] = useState('');
  const [saving, setSaving] = useState(false);

  // Find the "Draft" status using useMemo
  const draftStatusId = useMemo(() => {
    const draftStatus = contractStatuses.find(
      status => status.name.toLowerCase() === 'draft'
    );
    return draftStatus?.id ?? null;
  }, [contractStatuses]);

  const handleClose = () => {
    setAccountId('');
    setTermLengthMonths('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!draftStatusId) {
      alert('Draft status not found. Please create a "Draft" contract status first.');
      return;
    }
    
    setSaving(true);
    const success = await onSave({
      accountId: accountId as number,
      contractStatusId: draftStatusId,
      termLengthMonths: parseInt(termLengthMonths),
    });
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create New Contract Draft
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={saving}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Account</InputLabel>
            <Select
              value={accountId}
              label="Account"
              onChange={(e) => setAccountId(e.target.value as number)}
              disabled={saving}
            >
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Term Length (Months)"
            type="number"
            fullWidth
            variant="outlined"
            value={termLengthMonths}
            onChange={(e) => setTermLengthMonths(e.target.value)}
            disabled={saving}
            required
            inputProps={{ min: 1, step: 1 }}
            helperText="Contract duration in months"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving || !accountId || !termLengthMonths || !draftStatusId}
        >
          Create Draft
        </Button>
      </DialogActions>
    </Dialog>
  );
}