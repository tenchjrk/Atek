import { useState } from 'react';
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
    contractNumber: string;
    contractStatusId: number;
    executionDate: string | null;
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
  const [contractNumber, setContractNumber] = useState('');
  const [contractStatusId, setContractStatusId] = useState<number | ''>('');
  const [executionDate, setExecutionDate] = useState('');
  const [termLengthMonths, setTermLengthMonths] = useState('');
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setAccountId('');
    setContractNumber('');
    setContractStatusId('');
    setExecutionDate('');
    setTermLengthMonths('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave({
      accountId: accountId as number,
      contractNumber,
      contractStatusId: contractStatusId as number,
      executionDate: executionDate || null,
      termLengthMonths: parseInt(termLengthMonths),
    });
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Add Contract
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
            label="Contract Number"
            type="text"
            fullWidth
            variant="outlined"
            value={contractNumber}
            onChange={(e) => setContractNumber(e.target.value)}
            disabled={saving}
            required
          />

          <FormControl fullWidth required>
            <InputLabel>Contract Status</InputLabel>
            <Select
              value={contractStatusId}
              label="Contract Status"
              onChange={(e) => setContractStatusId(e.target.value as number)}
              disabled={saving}
            >
              {contractStatuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Execution Date"
            type="date"
            fullWidth
            variant="outlined"
            value={executionDate}
            onChange={(e) => setExecutionDate(e.target.value)}
            disabled={saving}
            InputLabelProps={{ shrink: true }}
            helperText="Start date will be calculated as first day of next month after execution"
          />

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
            helperText="End date will be calculated as start date + term length"
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
          disabled={saving || !accountId || !contractNumber || !contractStatusId || !termLengthMonths}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}