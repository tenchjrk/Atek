import { useState } from 'react';
import { Box, Button, Alert, IconButton } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { unitOfMeasureApi } from '../services/api';
import { useCrud } from '../hooks/useCrud';
import { useSortSimple } from '../hooks/useSortSimple';
import type { UnitOfMeasure } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import UnitOfMeasureCreateDialog from '../components/UnitOfMeasureCreateDialog';
import UnitOfMeasureEditDialog from '../components/UnitOfMeasureEditDialog';
import SortControlsSimple from '../components/SortControlsSimple';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateShort } from '../utils/dateFormatter';

export default function UnitOfMeasures() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<UnitOfMeasure>(unitOfMeasureApi);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUnitOfMeasure, setEditingUnitOfMeasure] =
    useState<UnitOfMeasure | null>(null);
  const [deletingUnitOfMeasureId, setDeletingUnitOfMeasureId] = useState<
    number | null
  >(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Apply sorting
  const { sortedItems, sortField, sortOrder, handleSortChange } =
    useSortSimple(items);

  const handleCreate = async (name: string, shortName: string) => {
    return await createItem({ name, shortName } as Omit<UnitOfMeasure, "id">);
  };

  const handleEdit = (unitOfMeasure: UnitOfMeasure) => {
    setEditingUnitOfMeasure(unitOfMeasure);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, name: string, shortName: string) => {
    return await updateItem(id, { id, name, shortName } as UnitOfMeasure);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingUnitOfMeasureId(id);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingUnitOfMeasureId !== null) {
      const result = await deleteItem(deletingUnitOfMeasureId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingUnitOfMeasureId(null);
        setDeleteError(null);
      } else {
        setDeleteError(result.error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingUnitOfMeasureId(null);
    setDeleteError(null);
  };

  const getDeletingUnitOfMeasureName = () => {
    const unitOfMeasure = items.find(
      (uom) => uom.id === deletingUnitOfMeasureId
    );
    return unitOfMeasure?.name || "this unit of measure";
  };

  const renderUnitOfMeasureSecondary = (unitOfMeasure: UnitOfMeasure) => {
    return (
      <Box
        component='span'
        sx={{ fontSize: "0.75rem", color: "text.secondary", display: "block" }}
      >
        ID: {unitOfMeasure.id}
        {unitOfMeasure.shortName && (
          <span> • Short Name: {unitOfMeasure.shortName}</span>
        )}
        {" • "}Created: {formatDateShort(unitOfMeasure.createdDate)} • Modified:{" "}
        {formatDateShort(unitOfMeasure.lastModifiedDate)}
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
            title="Unit of Measure Management" 
            subtitle="Manage units of measure for items"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Unit of Measure
        </Button>
      </Box>

      <SortControlsSimple
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title='Units of Measure'
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage='No units of measure yet. Create your first unit of measure above.'
        renderSecondary={renderUnitOfMeasureSecondary}
      />

      <UnitOfMeasureCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <UnitOfMeasureEditDialog
        open={editDialogOpen}
        unitOfMeasure={editingUnitOfMeasure}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Unit of Measure'
        message={
          deleteError ? (
            <Box>
              <Alert severity='error' sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingUnitOfMeasureName()}"? This action cannot be undone.`
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
