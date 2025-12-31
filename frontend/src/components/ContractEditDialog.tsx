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
import type { Contract, Account, Vendor, ContractStatus, ContractType } from '../types';

interface ContractEditDialogProps {
  open: boolean;
  contract: Contract | null;
  accounts: Account[];
  vendors: Vendor[];
  contractStatuses: ContractStatus[];
  contractTypes: ContractType[];
  onClose: () => void;
  onSave: (contractData: {
    id: number;
    accountId: number;
    vendorId: number;
    name: string;
    description: string;
    contractStatusId: number;
    contractTypeId: number;
    termLengthMonths: number;
  }) => Promise<boolean>;
}

export default function ContractEditDialog({
  open,
  contract,
  accounts,
  vendors,
  contractStatuses,
  contractTypes,
  onClose,
  onSave,
}: ContractEditDialogProps) {
  const [accountId, setAccountId] = useState<number | ''>('');
  const [vendorId, setVendorId] = useState<number | ''>('');
  const [contractTypeId, setContractTypeId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contractStatusId, setContractStatusId] = useState<number | ''>('');
  const [termLengthMonths, setTermLengthMonths] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (contract) {
      setAccountId(contract.accountId);
      setVendorId(contract.vendorId);
      setContractTypeId(contract.contractTypeId);
      setName(contract.name);
      setDescription(contract.description || '');
      setContractStatusId(contract.contractStatusId);
      setTermLengthMonths(contract.termLengthMonths.toString());
    }
  };

  const handleClose = () => {
    setAccountId('');
    setVendorId('');
    setContractTypeId('');
    setName('');
    setDescription('');
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
      vendorId: vendorId as number,
      name,
      description,
      contractStatusId: contractStatusId as number,
      contractTypeId: contractTypeId as number,
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
            autoFocus
            label="Contract Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            required
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
          disabled={saving || !accountId || !vendorId || !contractTypeId || !name || !contractStatusId || !termLengthMonths}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}