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
import type { Contract, Account, ContractStatus } from '../types';

interface ContractEditDialogProps {
  open: boolean;
  contract: Contract | null;
  accounts: Account[];
  contractStatuses: ContractStatus[];
  onClose: () => void;
  onSave: (contractData: {
    id: number;
    accountId: number;
    contractStatusId: number;
    termLengthMonths: number;
  }) => Promise<boolean>;
}

export default function ContractEditDialog({
  open,
  contract,
  accounts,
  contractStatuses,
  onClose,
  onSave,
}: ContractEditDialogProps) {
  const [accountId, setAccountId] = useState<number | ''>('');
  const [contractStatusId, setContractStatusId] = useState<number | ''>('');
  const [termLengthMonths, setTermLengthMonths] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (contract) {
      setAccountId(contract.accountId);
      setContractStatusId(contract.contractStatusId);
      setTermLengthMonths(contract.termLengthMonths.toString());
    }
  };

  const handleClose = () => {
    setAccountId('');
    setContractStatusId('');
    setTermLengthMonths('');
    setSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!contract) return;
    setSaving(true);
    const success = await onSave({
      id: contract.id,
      accountId: accountId as number,
      contractStatusId: contractStatusId as number,
      termLengthMonths: parseInt(termLengthMonths),
    });
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionProps={{
        onEnter: handleOpen,
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Contract
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
          disabled={saving || !accountId || !contractStatusId || !termLengthMonths}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}