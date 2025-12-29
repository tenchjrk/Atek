import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Stack, IconButton } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { accountAddressApi, accountApi } from '../services/api';
import type { AccountAddress, Account } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import AccountAddressCreateDialog from '../components/AccountAddressCreateDialog';
import AccountAddressEditDialog from '../components/AccountAddressEditDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateShort } from '../utils/dateFormatter';

export default function AccountAddresses() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [addresses, setAddresses] = useState<AccountAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AccountAddress | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!accountId) return;
    
    try {
      setLoading(true);
      const [accountResponse, addressesResponse] = await Promise.all([
        accountApi.getById(parseInt(accountId)),
        accountAddressApi.getByAccountId(parseInt(accountId)),
      ]);
      
      setAccount(accountResponse.data);
      setAddresses(addressesResponse.data);
      setError(null);
    } catch (err) {
      setError('Error loading data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (addressData: {
    accountId: number;
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isShipping: boolean;
    isBilling: boolean;
  }) => {
    try {
      await accountAddressApi.create(addressData as Omit<AccountAddress, 'id'>);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error creating address:', err);
      return false;
    }
  };

  const handleEdit = (address: AccountAddress) => {
    setEditingAddress(address);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (addressData: {
    id: number;
    accountId: number;
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isShipping: boolean;
    isBilling: boolean;
  }) => {
    try {
      await accountAddressApi.update(addressData.id, addressData as AccountAddress);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error updating address:', err);
      return false;
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingAddressId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingAddressId !== null) {
      try {
        await accountAddressApi.delete(deletingAddressId);
        await fetchData();
        setDeleteDialogOpen(false);
        setDeletingAddressId(null);
      } catch (err) {
        console.error('Error deleting address:', err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingAddressId(null);
  };

  const getDeletingAddressName = () => {
    const address = addresses.find(a => a.id === deletingAddressId);
    return address?.name || 'this address';
  };

  const renderAddressSecondary = (address: AccountAddress) => {
    const cityStateZip = [address.city, address.state, address.postalCode].filter(Boolean).join(', ');

    return (
      <Stack spacing={0.5} sx={{ mt: 0.5 }} component="span">
        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem' }}>ID: {address.id}</span>
          {address.isShipping && (
            <Chip label="Shipping" size="small" color="primary" variant="outlined" />
          )}
          {address.isBilling && (
            <Chip label="Billing" size="small" color="secondary" variant="outlined" />
          )}
        </Box>
        <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary', display: 'block' }}>
          📍 {address.addressLine1}
          {address.addressLine2 && <span>, {address.addressLine2}</span>}
          {cityStateZip && <span>, {cityStateZip}</span>}
          {address.country && <span>, {address.country}</span>}
        </Box>
        <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
          Created: {formatDateShort(address.createdDate)} • Modified: {formatDateShort(address.lastModifiedDate)}
        </Box>
      </Stack>
    );
  };

  if (!accountId) {
    return <Box>Invalid account ID</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/accounts')} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader
            title={`Addresses for ${account?.name || 'Account'}`}
            subtitle="Manage additional operational addresses for this account"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Address
        </Button>
      </Box>

      <EntityList
        title="Addresses"
        items={addresses}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="No additional addresses yet. Add addresses for warehouses, branches, or other facilities."
        renderSecondary={renderAddressSecondary}
        getItemName={(address) => address.name || `${address.addressLine1}, ${address.city}`}
      />

      <AccountAddressCreateDialog
        open={createDialogOpen}
        accountId={parseInt(accountId)}
        accountName={account?.name || ''}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <AccountAddressEditDialog
        open={editDialogOpen}
        accountAddress={editingAddress}
        accountName={account?.name || ''}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Address"
        message={`Are you sure you want to delete "${getDeletingAddressName()}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}