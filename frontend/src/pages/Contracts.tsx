import { useState, useEffect, useMemo } from "react";
import { Box, Button, Chip, Stack } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  contractApi,
  accountApi,
  vendorApi,
  contractStatusApi,
  contractTypeApi,
} from "../services/api";
import { useCrud } from "../hooks/useCrud";
import { useContractSort } from "../hooks/useContractSort";
import { useContractFilters } from "../hooks/useContractFilters";
import type {
  Contract,
  Account,
  Vendor,
  ContractStatus,
  ContractType,
} from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import ContractSortControls from "../components/ContractSortControls";
import ContractFilters from "../components/ContractFilters";
import ContractCreateDialog from "../components/ContractCreateDialog";
import ContractEditDialog from "../components/ContractEditDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDateShort } from "../utils/dateFormatter";

export default function Contracts() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<Contract>(contractApi);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [contractStatuses, setContractStatuses] = useState<ContractStatus[]>(
    []
  );
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [deletingContractId, setDeletingContractId] = useState<number | null>(
    null
  );

  // Apply filtering
  const {
    filteredContracts,
    searchQuery,
    selectedStatusIds,
    selectedAccountIds,
    selectedVendorIds,
    selectedTypeIds,
    activeFilterCount,
    handleSearchChange,
    handleStatusChange,
    handleAccountChange,
    handleVendorChange,
    handleTypeChange,
    clearFilters,
  } = useContractFilters(items);

  // Apply sorting to filtered results
  const { sortedItems, sortField, sortOrder, handleSortChange } =
    useContractSort(filteredContracts);

  // Get available statuses for the filter
  const availableStatuses = useMemo(() => {
    const statusMap = new Map<number, ContractStatus>();
    items.forEach((contract) => {
      if (contract.contractStatus) {
        statusMap.set(contract.contractStatus.id, contract.contractStatus);
      }
    });
    return Array.from(statusMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [items]);

  // Get available accounts for the filter
  const availableAccounts = useMemo(() => {
    const accountMap = new Map<number, Account>();
    items.forEach((contract) => {
      if (contract.account) {
        accountMap.set(contract.account.id, contract.account);
      }
    });
    return Array.from(accountMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [items]);

  // Get available vendors for the filter
  const availableVendors = useMemo(() => {
    const vendorMap = new Map<number, Vendor>();
    items.forEach((contract) => {
      if (contract.vendor) {
        vendorMap.set(contract.vendor.id, contract.vendor);
      }
    });
    return Array.from(vendorMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [items]);

  // Get available types for the filter
  const availableTypes = useMemo(() => {
    const typeMap = new Map<number, ContractType>();
    items.forEach((contract) => {
      if (contract.contractType) {
        typeMap.set(contract.contractType.id, contract.contractType);
      }
    });
    return Array.from(typeMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [items]);

  // Fetch accounts, vendors, contract statuses, and contract types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          accountsResponse,
          vendorsResponse,
          statusesResponse,
          typesResponse,
        ] = await Promise.all([
          accountApi.getAll(),
          vendorApi.getAll(),
          contractStatusApi.getAll(),
          contractTypeApi.getAll(),
        ]);
        setAccounts(accountsResponse.data);
        setVendors(vendorsResponse.data);
        setContractStatuses(statusesResponse.data);
        setContractTypes(typesResponse.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (contractData: {
    accountId: number;
    vendorId: number;
    name: string;
    description: string;
    contractStatusId: number;
    contractTypeId: number;
    termLengthMonths: number;
  }) => {
    return await createItem(contractData as Omit<Contract, "id">);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (contractData: {
    id: number;
    accountId: number;
    vendorId: number;
    name: string;
    description: string;
    contractStatusId: number;
    contractTypeId: number;
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
    return contract ? contract.name : "this contract";
  };

  const renderContractSecondary = (contract: Contract) => {
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
          <span style={{ fontSize: "0.875rem" }}>ID: {contract.id}</span>
          {contract.vendor && (
            <Chip
              label={contract.vendor.name}
              size='small'
              color='secondary'
              variant='outlined'
            />
          )}

          {contract.account && (
            <Chip
              label={contract.account.name}
              size='small'
              color='info'
              variant='outlined'
            />
          )}

          {contract.contractType && (
            <Chip
              label={contract.contractType.name}
              size='small'
              color='default'
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
        {contract.description && (
          <Box
            sx={{
              fontSize: "0.875rem",
              color: "text.secondary",
              display: "block",
              fontStyle: "italic",
            }}
          >
            {contract.description}
          </Box>
        )}
        <Box
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
            variant='outlined'
            onClick={() => navigate("/contract-types")}
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
            New Contract
          </Button>
        </Box>
      </Box>

      <ContractFilters
        searchQuery={searchQuery}
        selectedStatusIds={selectedStatusIds}
        selectedAccountIds={selectedAccountIds}
        selectedVendorIds={selectedVendorIds}
        selectedTypeIds={selectedTypeIds}
        availableStatuses={availableStatuses}
        availableAccounts={availableAccounts}
        availableVendors={availableVendors}
        availableTypes={availableTypes}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onAccountChange={handleAccountChange}
        onVendorChange={handleVendorChange}
        onTypeChange={handleTypeChange}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />

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
        getItemName={(item) => item.name}
        customActions={(contract) => (
          <Button
            size='small'
            variant='outlined'
            onClick={() => navigate(`/contracts/${contract.id}/items`)}
          >
            Manage Items
          </Button>
        )}
      />

      <ContractCreateDialog
        open={createDialogOpen}
        accounts={accounts}
        vendors={vendors}
        contractStatuses={contractStatuses}
        contractTypes={contractTypes}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <ContractEditDialog
        open={editDialogOpen}
        contract={editingContract}
        accounts={accounts}
        vendors={vendors}
        contractStatuses={contractStatuses}
        contractTypes={contractTypes}
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