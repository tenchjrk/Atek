import { useState } from "react";
import { Box, Chip, Stack } from "@mui/material";
import { accountApi } from "../services/api";
import { useCrud } from "../hooks/useCrud";
import type { Account } from "../types";
import PageHeader from "../components/PageHeader";
import AccountCreateForm from "../components/AccountCreateForm";
import EntityList from "../components/EntityList";
import AccountEditDialog from "../components/AccountEditDialog";
import { formatDateShort } from "../utils/dateFormatter";

export default function Accounts() {
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<Account>(accountApi);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleCreate = async (accountData: {
    name: string;
    parentAccountId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    // Cast to the type expected by createItem - dates will be set by backend
    return await createItem(accountData as Omit<Account, "id">);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (accountData: {
    id: number;
    name: string;
    parentAccountId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    // Cast to Account type - dates will be updated by backend
    return await updateItem(accountData.id, accountData as Account);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingAccount(null);
  };

  const renderAccountSecondary = (account: Account) => {
    // Build full address string
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
          <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            📍
            {addressLine1 && <span> {addressLine1}</span>}
            {addressLine2 && <span>, {addressLine2}</span>}
            {(addressLine1 || addressLine2) && cityStateZip && <span>,</span>}
            {cityStateZip && <span> {cityStateZip}</span>}
            {country && <span>, {country}</span>}
          </Box>
        )}
        <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
          Created: {formatDateShort(account.createdDate)} • Modified:{" "}
          {formatDateShort(account.lastModifiedDate)}
        </Box>
      </Stack>
    );
  };

  return (
    <Box>
      <PageHeader
        title='Account Management'
        subtitle='Manage your business customer accounts and hierarchies'
      />

      <AccountCreateForm accounts={items} onSubmit={handleCreate} />

      <EntityList
        title='Accounts'
        items={items}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={deleteItem}
        emptyMessage='No accounts yet. Create your first account above.'
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
