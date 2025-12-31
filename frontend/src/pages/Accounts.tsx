import { useState, useEffect } from "react";
import { Box, Chip, Stack, Button, Alert } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { accountApi, accountTypeApi } from "../services/api";
import { useCrud } from "../hooks/useCrud";
import { useAccountFilters } from "../hooks/useAccountFilters";
import { useSortSimple } from "../hooks/useSortSimple";
import type { Account, AccountType } from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import AccountEditDialog from "../components/AccountEditDialog";
import AccountCreateDialog from "../components/AccountCreateDialog";
import AccountFilters from "../components/AccountFilters";
import SortControlsSimple from "../components/SortControlsSimple";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDateShort } from "../utils/dateFormatter";
import { useNavigate } from "react-router-dom";

export default function Accounts() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<Account>(accountApi);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    cityFilter,
    setCityFilter,
    stateFilter,
    setStateFilter,
    postalCodeFilter,
    setPostalCodeFilter,
    countryFilter,
    setCountryFilter,
    accountTypeFilter,
    setAccountTypeFilter,
    filteredAccounts,
    activeFilterCount,
    clearFilters,
  } = useAccountFilters(items);

  // Apply sorting to filtered accounts
  const { sortedItems, sortField, sortOrder, handleSortChange } =
    useSortSimple(filteredAccounts);

  // Fetch account types
  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const response = await accountTypeApi.getAll();
        setAccountTypes(response.data);
      } catch (err) {
        console.error("Error loading account types:", err);
      }
    };
    fetchAccountTypes();
  }, []);

  const handleCreate = async (accountData: {
    name: string;
    dunsNumber: string;
    ein: string;
    parentAccountId: number | null;
    accountTypeId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    const success = await createItem(accountData as Omit<Account, "id">);
    return success;
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (accountData: {
    id: number;
    name: string;
    dunsNumber: string;
    ein: string;
    parentAccountId: number | null;
    accountTypeId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    return await updateItem(accountData.id, accountData as Account);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingAccountId(id);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingAccountId !== null) {
      const result = await deleteItem(deletingAccountId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingAccountId(null);
        setDeleteError(null);
      } else {
        setDeleteError(result.error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingAccountId(null);
    setDeleteError(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingAccount(null);
  };

  const getDeletingAccountName = () => {
    const account = items.find((a) => a.id === deletingAccountId);
    return account?.name || "this account";
  };

  const renderAccountSecondary = (account: Account) => {
    const addressLine1 = account.addressLine1;
    const addressLine2 = account.addressLine2;
    const cityStateZip = [account.city, account.state, account.postalCode]
      .filter(Boolean)
      .join(", ");
    const country = account.country;

    const hasAddress = addressLine1 || addressLine2 || cityStateZip || country;

    return (
      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.875rem" }}>ID: {account.id}</span>
          {account.dunsNumber && (
            <span style={{ fontSize: "0.875rem" }}>
              • DUNS: {account.dunsNumber}
            </span>
          )}
          {account.ein && (
            <span style={{ fontSize: "0.875rem" }}>• EIN: {account.ein}</span>
          )}
          {account.accountType && (
            <Chip
              label={account.accountType.name}
              size='small'
              color='secondary'
              variant='outlined'
            />
          )}
          {account.parentAccount && (
            <Chip
              label={`Child of: ${account.parentAccount.name}`}
              size='small'
              color='primary'
              variant='outlined'
            />
          )}
        </Box>
        {hasAddress && (
          <Box
            sx={{
              fontSize: "0.875rem",
              color: "text.secondary",
              display: "block",
            }}
          >
            📍
            {addressLine1 && <span> {addressLine1}</span>}
            {addressLine2 && <span>, {addressLine2}</span>}
            {(addressLine1 || addressLine2) && cityStateZip && <span>,</span>}
            {cityStateZip && <span> {cityStateZip}</span>}
            {country && <span>, {country}</span>}
          </Box>
        )}
        <Box
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            display: "block",
          }}
        >
          Created: {formatDateShort(account.createdDate)} • Modified:{" "}
          {formatDateShort(account.lastModifiedDate)}
        </Box>
      </Stack>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <PageHeader
          title='Account Management'
          subtitle='Manage your business customer accounts and hierarchies'
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant='outlined'
            onClick={() => navigate("/account-types")}
            sx={{ mt: 1 }}
          >
            Manage Types
          </Button>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ mt: 1 }}
          >
            Add Account
          </Button>
        </Box>
      </Box>
      <AccountFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        postalCodeFilter={postalCodeFilter}
        onPostalCodeFilterChange={setPostalCodeFilter}
        countryFilter={countryFilter}
        onCountryFilterChange={setCountryFilter}
        accountTypeFilter={accountTypeFilter}
        onAccountTypeFilterChange={setAccountTypeFilter}
        accountTypes={accountTypes}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />
      <SortControlsSimple
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <EntityList
        title='Accounts'
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage={
          activeFilterCount > 0 || searchTerm
            ? "No accounts match your search or filters."
            : "No accounts yet. Create your first account above."
        }
        renderSecondary={renderAccountSecondary}
        customActions={(account) => (
          <Button
            size='small'
            variant='outlined'
            onClick={() =>
              (window.location.href = `/accounts/${account.id}/addresses`)
            }
          >
            Manage Addresses
          </Button>
        )}
      />
      <AccountCreateDialog
        open={createDialogOpen}
        accounts={items}
        accountTypes={accountTypes}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />
      <AccountEditDialog
        open={editDialogOpen}
        account={editingAccount}
        accounts={items}
        accountTypes={accountTypes}
        onClose={handleCloseEditDialog}
        onSave={handleUpdate}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Account'
        message={
          deleteError ? (
            <Box>
              <Alert severity='error' sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingAccountName()}"? This action cannot be undone.`
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