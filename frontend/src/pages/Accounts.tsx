import { useState } from 'react';
import { Box, Chip } from '@mui/material';
import { accountApi } from '../services/api';
import { useCrud } from '../hooks/useCrud';
import type { Account } from '../types';
import PageHeader from '../components/PageHeader';
import AccountCreateForm from '../components/AccountCreateForm';
import EntityList from '../components/EntityList';
import AccountEditDialog from '../components/AccountEditDialog';

export default function Accounts() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useCrud<Account>(accountApi);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleCreate = async (name: string, parentAccountId: number | null) => {
    return await createItem({ name, parentAccountId });
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, name: string, parentAccountId: number | null) => {
    return await updateItem(id, { id, name, parentAccountId });
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingAccount(null);
  };

  const renderAccountSecondary = (account: Account) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
      <span>ID: {account.id}</span>
      {account.parentAccount && (
        <Chip 
          label={`Child of: ${account.parentAccount.name}`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      )}
    </Box>
  );

  return (
    <Box>
      <PageHeader 
        title="Account Management" 
        subtitle="Manage your business customer accounts and hierarchies"
      />

      <AccountCreateForm
        accounts={items}
        onSubmit={handleCreate}
      />

      <EntityList
        title="Accounts"
        items={items}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={deleteItem}
        emptyMessage="No accounts yet. Create your first account above."
        renderSecondary={renderAccountSecondary}
      />

      <AccountEditDialog
        open={editDialogOpen}
        account={editingAccount}
        accounts={items}
        onClose={handleCloseDialog}
        onSave={handleUpdate}
      />
    </Box>
  );
}