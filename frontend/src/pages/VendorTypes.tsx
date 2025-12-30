import { useState } from 'react';
import { Box, Button, Alert, IconButton } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { vendorTypeApi } from '../services/api';
import { useCrud } from '../hooks/useCrud';
import { useSortSimple } from '../hooks/useSortSimple';
import type { VendorType } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import VendorTypeCreateDialog from '../components/VendorTypeCreateDialog';
import VendorTypeEditDialog from '../components/VendorTypeEditDialog';
import SortControlsSimple from '../components/SortControlsSimple';
import ConfirmDialog from '../components/ConfirmDialog';

export default function VendorTypes() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } = useCrud<VendorType>(vendorTypeApi);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingVendorType, setEditingVendorType] = useState<VendorType | null>(null);
  const [deletingVendorTypeId, setDeletingVendorTypeId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Apply sorting
  const { sortedItems, sortField, sortOrder, handleSortChange } = useSortSimple(items);

  const handleCreate = async (type: string) => {
    return await createItem({ type });
  };

  const handleEdit = (vendorType: VendorType) => {
    setEditingVendorType(vendorType);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, type: string) => {
    return await updateItem(id, { id, type });
  };

  const handleDeleteClick = (id: number) => {
    setDeletingVendorTypeId(id);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingVendorTypeId !== null) {
      const result = await deleteItem(deletingVendorTypeId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingVendorTypeId(null);
        setDeleteError(null);
      } else {
        setDeleteError(result.error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingVendorTypeId(null);
    setDeleteError(null);
  };

  const getDeletingVendorTypeName = () => {
    const vendorType = items.find(vt => vt.id === deletingVendorTypeId);
    return vendorType?.type || 'this vendor type';
  };

  const renderVendorTypeSecondary = (vendorType: VendorType) => {
    return `ID: ${vendorType.id}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/vendors')} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader 
            title="Vendor Type Management" 
            subtitle="Manage vendor type classifications"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Vendor Type
        </Button>
      </Box>

      <SortControlsSimple
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        showNameField={false}
        showTypeField={true}
      />

      <EntityList
        title="Vendor Types"
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="No vendor types yet. Create your first vendor type above."
        renderSecondary={renderVendorTypeSecondary}
      />

      <VendorTypeCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <VendorTypeEditDialog
        open={editDialogOpen}
        vendorType={editingVendorType}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Vendor Type"
        message={
          deleteError ? (
            <Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingVendorTypeName()}"? This action cannot be undone.`
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