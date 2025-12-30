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
    name: string;
    description: string;
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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
    setName('');
    setDescription('');
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
      name,
      description,
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
            autoFocus
            label="Contract Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            required
            helperText="Give this contract a descriptive name"
          />

          <TextField
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
            helperText="Optional notes about this contract"
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
          disabled={saving || !accountId || !name || !termLengthMonths || !draftStatusId}
        >
          Create Draft
        </Button>
      </DialogActions>
    </Dialog>
  );
}