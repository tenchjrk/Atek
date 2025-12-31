import { useState } from "react";
import { Box, Button, Alert, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { contractStatusApi } from "../services/api";
import { useCrud } from "../hooks/useCrud";
import { useSortSimpler } from "../hooks/useSortSimpler";
import type { ContractStatus } from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import ContractStatusCreateDialog from "../components/ContractStatusCreateDialog";
import ContractStatusEditDialog from "../components/ContractStatusEditDialog";
import SortControlsSimpler from "../components/SortControlsSimpler";
import ConfirmDialog from "../components/ConfirmDialog";

export default function ContractStatuses() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<ContractStatus>(contractStatusApi);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingContractStatus, setEditingContractStatus] = useState<ContractStatus | null>(null);
  const [deletingContractStatusId, setDeletingContractStatusId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Apply sorting
  const { sortedItems, sortField, sortOrder, handleSortChange } = useSortSimpler(items);

  const handleCreate = async (name: string) => {
    return await createItem({ name });
  };

  const handleEdit = (contractStatus: ContractStatus) => {
    setEditingContractStatus(contractStatus);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, name: string) => {
    return await updateItem(id, { id, name });
  };

  const handleDeleteClick = (id: number) => {
    setDeletingContractStatusId(id);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingContractStatusId !== null) {
      const result = await deleteItem(deletingContractStatusId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingContractStatusId(null);
        setDeleteError(null);
      } else {
        setDeleteError(result.error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingContractStatusId(null);
    setDeleteError(null);
  };

  const getDeletingContractStatusName = () => {
    const contractStatus = items.find((cs) => cs.id === deletingContractStatusId);
    return contractStatus?.name || "this contract status";
  };

  const renderContractStatusSecondary = (contractStatus: ContractStatus) => {
    return `ID: ${contractStatus.id}`;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate("/contracts")} size='large'>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader
            title='Contract Status Management'
            subtitle='Manage contract status classifications'
          />
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Contract Status
        </Button>
      </Box>

      <SortControlsSimpler
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title='Contract Statuses'
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage='No contract statuses yet. Create your first contract status above.'
        renderSecondary={renderContractStatusSecondary}
      />

      <ContractStatusCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <ContractStatusEditDialog
        open={editDialogOpen}
        contractStatus={editingContractStatus}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Contract Status'
        message={
          deleteError ? (
            <Box>
              <Alert severity='error' sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingContractStatusName()}"? This action cannot be undone.`
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