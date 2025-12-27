import { useState } from 'react';
import { Box } from '@mui/material';
import { accountApi } from '../services/api';
import { useCrud } from '../hooks/useCrud';
import type { Account } from '../types';
import PageHeader from '../components/PageHeader';
import CreateForm from '../components/CreateForm';
import EntityList from '../components/EntityList';
import EditDialog from '../components/EditDialog';

export default function Accounts() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useCrud<Account>(accountApi);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleCreate = async (name: string) => {
    return await createItem({ name });
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, name: string) => {
    return await updateItem(id, { id, name });
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingAccount(null);
  };

  return (
    <Box>
      <PageHeader 
        title="Account Management" 
        subtitle="Manage your business customer accounts"
      />

      <CreateForm
        onSubmit={handleCreate}
        placeholder="Account Name"
        buttonText="Add Account"
      />

      <EntityList
        title="Accounts"
        items={items}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={deleteItem}
        emptyMessage="No accounts yet. Create your first account above."
      />

      <EditDialog
        open={editDialogOpen}
        item={editingAccount}
        onClose={handleCloseDialog}
        onSave={handleUpdate}
        title="Edit Account"
      />
    </Box>
  );
}