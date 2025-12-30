import { useState } from "react";
import { Box, Button, Alert, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { accountTypeApi } from "../services/api";
import { useCrud } from "../hooks/useCrud";
import { useSortSimple } from "../hooks/useSortSimple";
import type { AccountType } from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import AccountTypeCreateDialog from "../components/AccountTypeCreateDialog";
import AccountTypeEditDialog from "../components/AccountTypeEditDialog";
import SortControlsSimple from "../components/SortControlsSimple";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AccountTypes() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<AccountType>(accountTypeApi);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAccountType, setEditingAccountType] = useState<AccountType | null>(null);
  const [deletingAccountTypeId, setDeletingAccountTypeId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Apply sorting
  const { sortedItems, sortField, sortOrder, handleSortChange } = useSortSimple(items);

  const handleCreate = async (name: string) => {
    return await createItem({ name });
  };

  const handleEdit = (accountType: AccountType) => {
    setEditingAccountType(accountType);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: number, name: string) => {
    return await updateItem(id, { id, name });
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
    const accountType = items.find((at) => at.id === deletingAccountTypeId);
    return accountType?.name || "this account type";
  };

  const renderAccountTypeSecondary = (accountType: AccountType) => {
    return `ID: ${accountType.id}`;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate("/accounts")} size='large'>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader
            title='Account Type Management'
            subtitle='Manage account type classifications'
          />
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Account Type
        </Button>
      </Box>

      <SortControlsSimple
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        showNameField={true}
        showTypeField={false}
      />

      <EntityList
        title='Account Types'
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage='No account types yet. Create your first account type above.'
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
        title='Delete Account Type'
        message={
          deleteError ? (
            <Box>
              <Alert severity='error' sx={{ mb: 2 }}>
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