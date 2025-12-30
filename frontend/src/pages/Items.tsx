import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Chip } from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  itemApi,
  itemCategoryApi,
  unitOfMeasureApi,
  itemTypeApi,
} from "../services/api";
import { useSimpleSearch } from "../hooks/useSimpleSearch";
import { useSort } from "../hooks/useSort";
import type { Item, ItemCategory, UnitOfMeasure, ItemType } from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import SimpleSearchBar from "../components/SimpleSearchBar";
import SortControls from "../components/SortControls";
import ItemCreateDialog from "../components/ItemCreateDialog";
import ItemEditDialog from "../components/ItemEditDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDateShort } from "../utils/dateFormatter";

export default function Items() {
  const { vendorId, segmentId, categoryId } = useParams<{
    vendorId: string;
    segmentId: string;
    categoryId: string;
  }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<ItemCategory | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  // Apply search
  const { searchTerm, setSearchTerm, filteredItems } = useSimpleSearch(items);

  // Apply sorting to filtered items
  const { sortedItems, sortField, sortOrder, handleSortChange } =
    useSort(filteredItems);

  const fetchData = useCallback(async () => {
    if (!categoryId) return;

    try {
      setLoading(true);
      const [
        categoryResponse,
        itemsResponse,
        unitOfMeasuresResponse,
        itemTypesResponse,
      ] = await Promise.all([
        itemCategoryApi.getById(parseInt(categoryId)),
        itemApi.getByCategoryId(parseInt(categoryId)),
        unitOfMeasureApi.getAll(),
        itemTypeApi.getAll(),
      ]);

      setCategory(categoryResponse.data);
      setItems(itemsResponse.data);
      setUnitOfMeasures(unitOfMeasuresResponse.data);
      setItemTypes(itemTypesResponse.data);
      setError(null);
    } catch (err) {
      setError("Error loading data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (itemData: {
    itemCategoryId: number;
    name: string;
    shortName: string;
    description: string;
    listPrice: number;
    cost: number;
    eachesPerUnitOfMeasure: number;
    unitOfMeasureId: number;
    itemTypeId: number;
  }) => {
    try {
      await itemApi.create(itemData as Omit<Item, "id">);
      await fetchData();
      return true;
    } catch (err) {
      console.error("Error creating item:", err);
      return false;
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (itemData: {
    id: number;
    itemCategoryId: number;
    name: string;
    shortName: string;
    description: string;
    listPrice: number;
    cost: number;
    eachesPerUnitOfMeasure: number;
    unitOfMeasureId: number;
    itemTypeId: number;
  }) => {
    try {
      await itemApi.update(itemData.id, itemData as Item);
      await fetchData();
      return true;
    } catch (err) {
      console.error("Error updating item:", err);
      return false;
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingItemId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingItemId !== null) {
      try {
        await itemApi.delete(deletingItemId);
        await fetchData();
        setDeleteDialogOpen(false);
        setDeletingItemId(null);
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingItemId(null);
  };

  const getDeletingItemName = () => {
    const item = items.find((i) => i.id === deletingItemId);
    return item?.name || "this item";
  };

  const renderItemSecondary = (item: Item) => {
    return (
      <Box component='span'>
        <Box
          component='span'
          sx={{
            display: "block",
            fontSize: "0.875rem",
            color: "text.secondary",
            mt: 0.5,
          }}
        >
          {item.shortName && <span>Short Name: {item.shortName} • </span>}
          List: ${item.listPrice.toFixed(2)} • Cost: ${item.cost.toFixed(2)} •{" "}
          {item.eachesPerUnitOfMeasure} per {item.unitOfMeasure?.name}
        </Box>
        <Box
          component='span'
          sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}
        >
          {item.itemType && (
            <Chip
              label={item.itemType.name}
              size='small'
              color='primary'
              variant='outlined'
            />
          )}
          {item.unitOfMeasure && (
            <Chip
              label={item.unitOfMeasure.name}
              size='small'
              color='secondary'
              variant='outlined'
            />
          )}
        </Box>
        {item.description && (
          <Box
            component='span'
            sx={{
              display: "block",
              fontSize: "0.875rem",
              color: "text.secondary",
              mt: 0.5,
              fontStyle: "italic",
            }}
          >
            {item.description}
          </Box>
        )}
        <Box
          component='span'
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            display: "block",
            mt: 0.5,
          }}
        >
          ID: {item.id} • Created: {formatDateShort(item.createdDate)} •
          Modified: {formatDateShort(item.lastModifiedDate)}
        </Box>
      </Box>
    );
  };

  if (!vendorId || !segmentId || !categoryId) {
    return <Box>Invalid vendor, segment, or category ID</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton
          onClick={() =>
            navigate(`/vendors/${vendorId}/segments/${segmentId}/categories`)
          }
          size='large'
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader
            title={`Items in ${category?.name || "Category"}`}
            subtitle='Manage items and products in this category'
          />
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

      <SimpleSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder='Search items by name...'
      />

      <SortControls
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title='Items'
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage={
          searchTerm
            ? "No items match your search."
            : "No items yet. Add items to populate this category."
        }
        renderSecondary={renderItemSecondary}
      />

      <ItemCreateDialog
        open={createDialogOpen}
        categoryId={parseInt(categoryId)}
        categoryName={category?.name || ""}
        unitOfMeasures={unitOfMeasures}
        itemTypes={itemTypes}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <ItemEditDialog
        open={editDialogOpen}
        item={editingItem}
        categoryName={category?.name || ""}
        unitOfMeasures={unitOfMeasures}
        itemTypes={itemTypes}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Item'
        message={`Are you sure you want to delete "${getDeletingItemName()}"? This action cannot be undone.`}
        confirmText='Delete'
        cancelText='Cancel'
        confirmColor='error'
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}