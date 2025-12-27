import { useState } from 'react';
import { Box } from '@mui/material';
import { vendorApi } from '../services/api';
import { useCrud } from '../hooks/useCrud';
import type { Vendor } from '../types';
import PageHeader from '../components/PageHeader';
import CreateForm from '../components/CreateForm';
import EntityList from '../components/EntityList';
import EditDialog from '../components/EditDialog';

export default function Vendors() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useCrud<Vendor>(vendorApi);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const handleCreate = async (name: string) => {
    return await createItem({ name });
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, name: string) => {
    return await updateItem(id, { id, name });
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingVendor(null);
  };

  return (
    <Box>
      <PageHeader 
        title="Vendor Management" 
        subtitle="Manage your supplier and vendor relationships"
      />

      <CreateForm
        onSubmit={handleCreate}
        placeholder="Vendor Name"
        buttonText="Add Vendor"
      />

      <EntityList
        title="Vendors"
        items={items}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={deleteItem}
        emptyMessage="No vendors yet. Create your first vendor above."
      />

      <EditDialog
        open={editDialogOpen}
        item={editingVendor}
        onClose={handleCloseDialog}
        onSave={handleUpdate}
        title="Edit Vendor"
      />
    </Box>
  );
}