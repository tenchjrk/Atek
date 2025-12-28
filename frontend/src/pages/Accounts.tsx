import { useState } from 'react';
import { Box, Chip, Stack, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { accountApi } from '../services/api';
import { useCrud } from '../hooks/useCrud';
import { useAccountFilters } from '../hooks/useAccountFilters';
import type { Account } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import AccountEditDialog from '../components/AccountEditDialog';
import AccountCreateDialog from '../components/AccountCreateDialog';
import AccountFilters from '../components/AccountFilters';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateShort } from '../utils/dateFormatter';

export default function Accounts() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useCrud<Account>(accountApi);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    cityFilter,
    setCityFilter,
    stateFilter,
    setStateFilter,
    postalCodeFilter,
    setPostalCodeFilter,
    countryFilter,
    setCountryFilter,
    filteredAccounts,
    activeFilterCount,
    clearFilters,
  } = useAccountFilters(items);

  const handleCreate = async (accountData: {
    name: string;
    parentAccountId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    const success = await createItem(accountData as Omit<Account, 'id'>);
    return success;
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (accountData: {
    id: number;
    name: string;
    parentAccountId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    return await updateItem(accountData.id, accountData as Account);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingAccountId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingAccountId !== null) {
      await deleteItem(deletingAccountId);
      setDeleteDialogOpen(false);
      setDeletingAccountId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingAccountId(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingAccount(null);
  };

  const getDeletingAccountName = () => {
    const account = items.find(a => a.id === deletingAccountId);
    return account?.name || 'this account';
  };

  const renderAccountSecondary = (account: Account) => {
    // Build full address string
    const addressLine1 = account.addressLine1;
    const addressLine2 = account.addressLine2;
    const cityStateZip = [
      account.city,
      account.state,
      account.postalCode,
    ].filter(Boolean).join(', ');
    const country = account.country;

    const hasAddress = addressLine1 || addressLine2 || cityStateZip || country;

    return (
      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem' }}>ID: {account.id}</span>
          {account.parentAccount && (
            <Chip 
              label={`Child of: ${account.parentAccount.name}`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
        {hasAddress && (
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            📍 
            {addressLine1 && <span> {addressLine1}</span>}
            {addressLine2 && <span>, {addressLine2}</span>}
            {(addressLine1 || addressLine2) && cityStateZip && <span>,</span>}
            {cityStateZip && <span> {cityStateZip}</span>}
            {country && <span>, {country}</span>}
          </Box>
        )}
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          Created: {formatDateShort(account.createdDate)} • Modified: {formatDateShort(account.lastModifiedDate)}
        </Box>
      </Stack>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <PageHeader 
          title="Account Management" 
          subtitle="Manage your business customer accounts and hierarchies"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Account
        </Button>
      </Box>

      <AccountFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        postalCodeFilter={postalCodeFilter}
        onPostalCodeFilterChange={setPostalCodeFilter}
        countryFilter={countryFilter}
        onCountryFilterChange={setCountryFilter}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />

      <EntityList
        title="Accounts"
        items={filteredAccounts}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage={
          activeFilterCount > 0 || searchTerm
            ? 'No accounts match your search or filters.'
            : 'No accounts yet. Create your first account above.'
        }
        renderSecondary={renderAccountSecondary}
      />

      <AccountCreateDialog
        open={createDialogOpen}
        accounts={items}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <AccountEditDialog
        open={editDialogOpen}
        account={editingAccount}
        accounts={items}
        onClose={handleCloseEditDialog}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Account"
        message={`Are you sure you want to delete "${getDeletingAccountName()}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}