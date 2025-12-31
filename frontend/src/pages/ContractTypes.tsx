import { useState } from "react";
import { Box, Button, Alert, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { contractTypeApi } from "../services/api";
import { useCrud } from "../hooks/useCrud";
import { useSortSimpler } from "../hooks/useSortSimpler";
import type { ContractType } from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import ContractTypeCreateDialog from "../components/ContractTypeCreateDialog";
import ContractTypeEditDialog from "../components/ContractTypeEditDialog";
import SortControlsSimpler from "../components/SortControlsSimpler";
import ConfirmDialog from "../components/ConfirmDialog";

export default function ContractTypes() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<ContractType>(contractTypeApi);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingContractType, setEditingContractType] = useState<ContractType | null>(null);
  const [deletingContractTypeId, setDeletingContractTypeId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Apply sorting
  const { sortedItems, sortField, sortOrder, handleSortChange } = useSortSimpler(items);

  const handleCreate = async (name: string) => {
    return await createItem({ name });
  };

  const handleEdit = (contractType: ContractType) => {
    setEditingContractType(contractType);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, name: string) => {
    return await updateItem(id, { id, name });
  };

  const handleDeleteClick = (id: number) => {
    setDeletingContractTypeId(id);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingContractTypeId !== null) {
      const result = await deleteItem(deletingContractTypeId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingContractTypeId(null);
        setDeleteError(null);
      } else {
        setDeleteError(result.error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingContractTypeId(null);
    setDeleteError(null);
  };

  const getDeletingContractTypeName = () => {
    const contractType = items.find((ct) => ct.id === deletingContractTypeId);
    return contractType?.name || "this contract type";
  };

  const renderContractTypeSecondary = (contractType: ContractType) => {
    return `ID: ${contractType.id}`;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate("/contracts")} size='large'>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader
            title='Contract Type Management'
            subtitle='Manage contract type classifications'
          />
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Contract Type
        </Button>
      </Box>

      <SortControlsSimpler
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title='Contract Types'
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage='No contract types yet. Create your first contract type above.'
        renderSecondary={renderContractTypeSecondary}
      />

      <ContractTypeCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <ContractTypeEditDialog
        open={editDialogOpen}
        contractType={editingContractType}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Contract Type'
        message={
          deleteError ? (
            <Box>
              <Alert severity='error' sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingContractTypeName()}"? This action cannot be undone.`
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