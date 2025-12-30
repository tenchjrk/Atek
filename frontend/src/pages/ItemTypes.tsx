import { useState } from 'react';
import { Box, Button, Alert, IconButton } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { itemTypeApi } from '../services/api';
import { useCrud } from '../hooks/useCrud';
import { useSortSimple } from '../hooks/useSortSimple';
import type { ItemType } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import ItemTypeCreateDialog from '../components/ItemTypeCreateDialog';
import ItemTypeEditDialog from '../components/ItemTypeEditDialog';
import SortControlsSimple from '../components/SortControlsSimple';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateShort } from '../utils/dateFormatter';

export default function ItemTypes() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<ItemType>(itemTypeApi);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItemType, setEditingItemType] = useState<ItemType | null>(null);
  const [deletingItemTypeId, setDeletingItemTypeId] = useState<number | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Apply sorting
  const { sortedItems, sortField, sortOrder, handleSortChange } =
    useSortSimple(items);

  const handleCreate = async (name: string, shortName: string) => {
    return await createItem({ name, shortName } as Omit<ItemType, "id">);
  };

  const handleEdit = (itemType: ItemType) => {
    setEditingItemType(itemType);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, name: string, shortName: string) => {
    return await updateItem(id, { id, name, shortName } as ItemType);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingItemTypeId(id);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingItemTypeId !== null) {
      const result = await deleteItem(deletingItemTypeId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingItemTypeId(null);
        setDeleteError(null);
      } else {
        setDeleteError(result.error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingItemTypeId(null);
    setDeleteError(null);
  };

  const getDeletingItemTypeName = () => {
    const itemType = items.find((it) => it.id === deletingItemTypeId);
    return itemType?.name || "this item type";
  };

  const renderItemTypeSecondary = (itemType: ItemType) => {
    return (
      <Box
        component='span'
        sx={{ fontSize: "0.75rem", color: "text.secondary", display: "block" }}
      >
        ID: {itemType.id}
        {itemType.shortName && <span> • Short Name: {itemType.shortName}</span>}
        {" • "}Created: {formatDateShort(itemType.createdDate)} • Modified:{" "}
        {formatDateShort(itemType.lastModifiedDate)}
      </Box>
    );
  };

 return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader 
            title="Item Type Management" 
            subtitle="Manage item type classifications"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Item Type
        </Button>
      </Box>

      <SortControlsSimple
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title='Item Types'
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage='No item types yet. Create your first item type above.'
        renderSecondary={renderItemTypeSecondary}
      />

      <ItemTypeCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <ItemTypeEditDialog
        open={editDialogOpen}
        itemType={editingItemType}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Item Type'
        message={
          deleteError ? (
            <Box>
              <Alert severity='error' sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingItemTypeName()}"? This action cannot be undone.`
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
