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
import type { Account, Vendor, ContractStatus, ContractType } from '../types';

interface ContractCreateDialogProps {
  open: boolean;
  accounts: Account[];
  vendors: Vendor[];
  contractStatuses: ContractStatus[];
  contractTypes: ContractType[];
  onClose: () => void;
  onSave: (contractData: {
    accountId: number;
    vendorId: number;
    name: string;
    description: string;
    contractStatusId: number;
    contractTypeId: number;
    termLengthMonths: number;
  }) => Promise<boolean>;
}

export default function ContractCreateDialog({
  open,
  accounts,
  vendors,
  contractStatuses,
  contractTypes,
  onClose,
  onSave,
}: ContractCreateDialogProps) {
  const [accountId, setAccountId] = useState<number | ''>('');
  const [vendorId, setVendorId] = useState<number | ''>('');
  const [contractTypeId, setContractTypeId] = useState<number | ''>('');
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
    setVendorId('');
    setContractTypeId('');
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
      vendorId: vendorId as number,
      name,
      description,
      contractStatusId: draftStatusId,
      contractTypeId: contractTypeId as number,
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

          <FormControl fullWidth required>
            <InputLabel>Contract Type</InputLabel>
            <Select
              value={contractTypeId}
              label="Contract Type"
              onChange={(e) => setContractTypeId(e.target.value as number)}
              disabled={saving}
            >
              {contractTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Vendor</InputLabel>
            <Select
              value={vendorId}
              label="Vendor"
              onChange={(e) => setVendorId(e.target.value as number)}
              disabled={saving}
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving || !accountId || !vendorId || !contractTypeId || !name || !termLengthMonths || !draftStatusId}
        >
          Create Draft
        </Button>
      </DialogActions>
    </Dialog>
  );
}