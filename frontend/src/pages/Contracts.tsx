import { useState, useEffect } from "react";
import { Box, Button, Chip, Stack } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { contractApi, accountApi, contractStatusApi } from "../services/api";
import { useCrud } from "../hooks/useCrud";
import { useContractSort } from "../hooks/useContractSort";
import type { Contract, Account, ContractStatus } from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import ContractSortControls from "../components/ContractSortControls";
import ContractCreateDialog from "../components/ContractCreateDialog";
import ContractEditDialog from "../components/ContractEditDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDateShort } from "../utils/dateFormatter";

export default function Contracts() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<Contract>(contractApi);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contractStatuses, setContractStatuses] = useState<ContractStatus[]>(
    []
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [deletingContractId, setDeletingContractId] = useState<number | null>(
    null
  );

  // Apply sorting
  const { sortedItems, sortField, sortOrder, handleSortChange } =
    useContractSort(items);

  // Fetch accounts and contract statuses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsResponse, statusesResponse] = await Promise.all([
          accountApi.getAll(),
          contractStatusApi.getAll(),
        ]);
        setAccounts(accountsResponse.data);
        setContractStatuses(statusesResponse.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

const handleCreate = async (contractData: {
  accountId: number;
  contractNumber: string;
  contractStatusId: number;
  executionDate: string | null;
  termLengthMonths: number;
}) => {
  return await createItem(contractData as Omit<Contract, 'id'>);
};
  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setEditDialogOpen(true);
  };

const handleUpdate = async (contractData: {
  id: number;
  accountId: number;
  contractNumber: string;
  contractStatusId: number;
  executionDate: string | null;
  termLengthMonths: number;
}) => {
  return await updateItem(contractData.id, contractData as Contract);
};

  const handleDeleteClick = (id: number) => {
    setDeletingContractId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingContractId !== null) {
      const result = await deleteItem(deletingContractId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingContractId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingContractId(null);
  };

  const getDeletingContractName = () => {
    const contract = items.find((c) => c.id === deletingContractId);
    return contract?.contractNumber || "this contract";
  };

  const renderContractSecondary = (contract: Contract) => {
    return (
      <Stack spacing={0.5} sx={{ mt: 0.5 }} component='span'>
        <Box
          component='span'
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.875rem" }}>ID: {contract.id}</span>
          {contract.account && (
            <Chip
              label={contract.account.name}
              size='small'
              color='info'
              variant='outlined'
            />
          )}
          {contract.contractStatus && (
            <Chip
              label={contract.contractStatus.name}
              size='small'
              color='primary'
              variant='outlined'
            />
          )}
        </Box>
        <Box
          component='span'
          sx={{
            fontSize: "0.875rem",
            color: "text.secondary",
            display: "block",
          }}
        >
          Term: {contract.termLengthMonths} months
          {contract.startDate &&
            ` • Start: ${formatDateShort(contract.startDate)}`}
          {contract.endDate && ` • End: ${formatDateShort(contract.endDate)}`}
        </Box>
        <Box
          component='span'
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            display: "block",
          }}
        >
          Created: {formatDateShort(contract.createdDate)} • Modified:{" "}
          {formatDateShort(contract.lastModifiedDate)}
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
          title='Contract Management'
          subtitle='Manage your customer contracts and agreements'
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant='outlined'
            onClick={() => navigate("/contract-statuses")}
            sx={{ mt: 1 }}
          >
            Manage Statuses
          </Button>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ mt: 1 }}
          >
            Add Contract
          </Button>
        </Box>
      </Box>

      <ContractSortControls
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title='Contracts'
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage='No contracts yet. Create your first contract above.'
        renderSecondary={renderContractSecondary}
        getItemName={(item) => item.contractNumber}
      />

      <ContractCreateDialog
        open={createDialogOpen}
        accounts={accounts}
        contractStatuses={contractStatuses}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <ContractEditDialog
        open={editDialogOpen}
        contract={editingContract}
        accounts={accounts}
        contractStatuses={contractStatuses}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Contract'
        message={`Are you sure you want to delete "${getDeletingContractName()}"? This action cannot be undone.`}
        confirmText='Delete'
        cancelText='Cancel'
        confirmColor='error'
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}
