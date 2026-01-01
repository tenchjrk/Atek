import { useState, useEffect, useMemo } from "react";
import { Box, Button, Chip, Stack, Alert } from "@mui/material";
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { contractItemApi, contractApi, itemApi, itemCategoryApi, vendorSegmentApi } from "../services/api";
import { useCrud } from "../hooks/useCrud";
import type { ContractItem, Contract, Item, ItemCategory, VendorSegment } from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import ContractItemCreateDialog from "../components/ContractItemCreateDialog";
import ContractItemEditDialog from "../components/ContractItemEditDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDateShort } from "../utils/dateFormatter";

export default function ContractItems() {
  const navigate = useNavigate();
  const { contractId } = useParams<{ contractId: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [contractLoading, setContractLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>([]);
  const [vendorSegments, setVendorSegments] = useState<VendorSegment[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContractItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  // Create a stable API object using useMemo
  const contractItemApiForContract = useMemo(() => ({
    getAll: () => contractItemApi.getByContractId(Number(contractId)),
    getById: contractItemApi.getById,
    create: contractItemApi.create,
    update: contractItemApi.update,
    delete: contractItemApi.delete,
  }), [contractId]);

  // Fetch contract items for this specific contract
  const { items: contractItems, loading, error, createItem, updateItem, deleteItem } = useCrud<ContractItem>(contractItemApiForContract);

  // Fetch contract details and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractResponse, itemsResponse, categoriesResponse, segmentsResponse] = await Promise.all([
          contractApi.getById(Number(contractId)),
          itemApi.getAll(),
          itemCategoryApi.getAll(),
          vendorSegmentApi.getAll(),
        ]);
        setContract(contractResponse.data);
        setItems(itemsResponse.data);
        setItemCategories(categoriesResponse.data);
        setVendorSegments(segmentsResponse.data);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setContractLoading(false);
      }
    };
    fetchData();
  }, [contractId]);

  const handleCreate = async (contractItemData: {
    contractId: number;
    pricingLevel: string;
    itemId?: number | null;
    itemCategoryId?: number | null;
    vendorSegmentId?: number | null;
    discountPercentage?: number | null;
    flatDiscountPrice?: number | null;
    rebatePercentage?: number | null;
    commitmentQuantity?: number | null;
    commitmentDollars?: number | null;
  }) => {
    return await createItem(contractItemData as Omit<ContractItem, 'id'>);
  };

  const handleEdit = (item: ContractItem) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (contractItemData: {
    id: number;
    contractId: number;
    pricingLevel: string;
    itemId?: number | null;
    itemCategoryId?: number | null;
    vendorSegmentId?: number | null;
    discountPercentage?: number | null;
    flatDiscountPrice?: number | null;
    rebatePercentage?: number | null;
    commitmentQuantity?: number | null;
    commitmentDollars?: number | null;
  }) => {
    return await updateItem(contractItemData.id, contractItemData as ContractItem);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingItemId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingItemId !== null) {
      const result = await deleteItem(deletingItemId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingItemId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingItemId(null);
  };

  const getItemName = (item: ContractItem): string => {
    if (item.pricingLevel === "Item" && item.item) {
      return item.item.name;
    }
    if (item.pricingLevel === "Category" && item.itemCategory) {
      return item.itemCategory.name;
    }
    if (item.pricingLevel === "Segment" && item.vendorSegment) {
      return item.vendorSegment.name;
    }
    return `${item.pricingLevel} #${item.id}`;
  };

  const renderItemSecondary = (item: ContractItem) => {
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
          <Chip
            label={item.pricingLevel}
            size='small'
            color='primary'
            variant='outlined'
          />
          {item.discountPercentage && (
            <Chip
              label={`Discount: ${item.discountPercentage}%`}
              size='small'
              color='success'
              variant='outlined'
            />
          )}
          {item.flatDiscountPrice && (
            <Chip
              label={`Price: $${item.flatDiscountPrice.toFixed(2)}`}
              size='small'
              color='success'
              variant='outlined'
            />
          )}
          {item.rebatePercentage && (
            <Chip
              label={`Rebate: ${item.rebatePercentage}%`}
              size='small'
              color='info'
              variant='outlined'
            />
          )}
        </Box>
        {(item.commitmentQuantity || item.commitmentDollars) && (
          <Box
            sx={{
              fontSize: "0.875rem",
              color: "text.secondary",
              display: "block",
            }}
          >
            Commitment:{" "}
            {item.commitmentQuantity && `${item.commitmentQuantity} units`}
            {item.commitmentQuantity && item.commitmentDollars && " • "}
            {item.commitmentDollars && `$${item.commitmentDollars.toFixed(2)}`}
          </Box>
        )}
        <Box
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            display: "block",
          }}
        >
          Created: {formatDateShort(item.createdDate)} • Modified:{" "}
          {formatDateShort(item.lastModifiedDate)}
        </Box>
      </Stack>
    );
  };

  if (contractLoading) {
    return <Box>Loading contract...</Box>;
  }

  if (!contract) {
    return (
      <Alert severity="error">
        Contract not found. <Button onClick={() => navigate("/contracts")}>Back to Contracts</Button>
      </Alert>
    );
  }

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
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/contracts")}
            sx={{ mb: 2 }}
          >
            Back to Contracts
          </Button>
          <PageHeader
            title={`Contract Items: ${contract.name}`}
            subtitle={`Manage pricing items for this contract`}
          />
          <Box sx={{ mt: 1 }}>
            <Chip label={contract.vendor?.name || "Unknown Vendor"} color="secondary" sx={{ mr: 1 }} />
            <Chip label={contract.account?.name || "Unknown Account"} color="info" sx={{ mr: 1 }} />
            <Chip label={contract.contractStatus?.name || "Unknown Status"} color="primary" />
          </Box>
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Item
        </Button>
      </Box>

      <EntityList
        title='Contract Items'
        items={contractItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage='No items yet. Add your first pricing item above.'
        renderSecondary={renderItemSecondary}
        getItemName={getItemName}
      />

      <ContractItemCreateDialog
        open={createDialogOpen}
        contractId={Number(contractId)}
        items={items}
        itemCategories={itemCategories}
        vendorSegments={vendorSegments}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <ContractItemEditDialog
        open={editDialogOpen}
        contractItem={editingItem}
        items={items}
        itemCategories={itemCategories}
        vendorSegments={vendorSegments}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Contract Item'
        message='Are you sure you want to delete this contract item? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
        confirmColor='error'
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}