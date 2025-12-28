import { useState } from 'react';
import { Box, Button, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { accountTypeApi } from '../services/api';
import { useCrud } from '../hooks/useCrud';
import type { AccountType } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import AccountTypeCreateDialog from '../components/AccountTypeCreateDialog';
import AccountTypeEditDialog from '../components/AccountTypeEditDialog';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AccountTypes() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useCrud<AccountType>(accountTypeApi);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAccountType, setEditingAccountType] = useState<AccountType | null>(null);
  const [deletingAccountTypeId, setDeletingAccountTypeId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCreate = async (type: string) => {
    return await createItem({ type });
  };

  const handleEdit = (accountType: AccountType) => {
    setEditingAccountType(accountType);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, type: string) => {
    return await updateItem(id, { id, type });
  };

  const handleDeleteClick = (id: number) => {
    setDeletingAccountTypeId(id);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingAccountTypeId !== null) {
      const result = await deleteItem(deletingAccountTypeId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingAccountTypeId(null);
        setDeleteError(null);
      } else {
        setDeleteError(result.error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingAccountTypeId(null);
    setDeleteError(null);
  };

  const getDeletingAccountTypeName = () => {
    const accountType = items.find(at => at.id === deletingAccountTypeId);
    return accountType?.type || 'this account type';
  };

  const renderAccountTypeSecondary = (accountType: AccountType) => {
    return `ID: ${accountType.id}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <PageHeader 
          title="Account Type Management" 
          subtitle="Manage account type classifications"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Account Type
        </Button>
      </Box>

      <EntityList
        title="Account Types"
        items={items}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="No account types yet. Create your first account type above."
        renderSecondary={renderAccountTypeSecondary}
      />

      <AccountTypeCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <AccountTypeEditDialog
        open={editDialogOpen}
        accountType={editingAccountType}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Account Type"
        message={
          deleteError ? (
            <Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingAccountTypeName()}"? This action cannot be undone.`
          )
        }
        confirmText={deleteError ? "OK" : "Delete"}
        cancelText={deleteError ? undefined : "Cancel"}
        confirmColor={deleteError ? "primary" : "error"}
        onConfirm={deleteError ? handleDeleteCancel : handleDeleteConfirm}
        onCancel={deleteError ? undefined : handleDeleteCancel}
      />
    </Box>
  );
}