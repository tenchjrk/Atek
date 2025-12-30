import { useState, useEffect } from 'react';
import { Box, Chip, Autocomplete, TextField, Button, } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  itemApi, 
  vendorApi, 
  vendorSegmentApi, 
  itemCategoryApi, 
  itemTypeApi, 
  unitOfMeasureApi 
} from '../services/api';
import { useItemFilters } from '../hooks/useItemFilters';
import { useSort } from '../hooks/useSort';
import type { Item, Vendor, VendorSegment, ItemCategory, ItemType, UnitOfMeasure } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import ItemFilters from '../components/ItemFilters';
import SortControls from '../components/SortControls';
import QuickAddItemDialog from '../components/QuickAddItemDialog';
import QuickEditItemDialog from '../components/QuickEditItemDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateShort } from '../utils/dateFormatter';

export default function AllItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [segments, setSegments] = useState<VendorSegment[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [quickAddDialogOpen, setQuickAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const {
    vendorFilter,
    setVendorFilter,
    segmentFilter,
    setSegmentFilter,
    categoryFilter,
    setCategoryFilter,
    itemTypeFilter,
    setItemTypeFilter,
    unitOfMeasureFilter,
    setUnitOfMeasureFilter,
    filteredItems,
    activeFilterCount,
    clearFilters,
  } = useItemFilters(items);

  // Filter by selected items OR search term
  const searchFilteredItems = filteredItems.filter(item => {
    if (selectedItems.length > 0) {
      return selectedItems.some(selected => selected.id === item.id);
    }
    return true;
  });

  // Apply sorting to filtered items
  const { sortedItems, sortField, sortOrder, handleSortChange } = useSort(searchFilteredItems);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        itemsResponse,
        vendorsResponse,
        segmentsResponse,
        categoriesResponse,
        itemTypesResponse,
        unitOfMeasuresResponse,
      ] = await Promise.all([
        itemApi.getAll(),
        vendorApi.getAll(),
        vendorSegmentApi.getAll(),
        itemCategoryApi.getAll(),
        itemTypeApi.getAll(),
        unitOfMeasureApi.getAll(),
      ]);

      setItems(itemsResponse.data);
      setVendors(vendorsResponse.data);
      setSegments(segmentsResponse.data);
      setCategories(categoriesResponse.data);
      setItemTypes(itemTypesResponse.data);
      setUnitOfMeasures(unitOfMeasuresResponse.data);
      setError(null);
    } catch (err) {
      setError('Error loading items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      console.error('Error updating item:', err);
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
        console.error('Error deleting item:', err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingItemId(null);
  };

  const getDeletingItemName = () => {
    const item = items.find(i => i.id === deletingItemId);
    return item?.name || 'this item';
  };

  const handleQuickAdd = async (itemData: {
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
      await itemApi.create(itemData as Omit<Item, 'id'>);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error creating item:', err);
      return false;
    }
  };

  const renderItemSecondary = (item: Item) => {
    return (
      <Box component="span">
        <Box component="span" sx={{ display: 'block', fontSize: '0.875rem', color: 'text.secondary', mt: 0.5 }}>
          {item.shortName && <span>Short Name: {item.shortName} • </span>}
          List: ${item.listPrice.toFixed(2)} • Cost: ${item.cost.toFixed(2)} • {item.eachesPerUnitOfMeasure} per {item.unitOfMeasure?.name}
        </Box>
        <Box component="span" sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
          {item.itemCategory && (
            <Chip label={item.itemCategory.name} size="small" color="info" variant="outlined" />
          )}
          {item.itemType && (
            <Chip label={item.itemType.name} size="small" color="primary" variant="outlined" />
          )}
          {item.unitOfMeasure && (
            <Chip label={item.unitOfMeasure.name} size="small" color="secondary" variant="outlined" />
          )}
        </Box>
        {item.description && (
          <Box component="span" sx={{ display: 'block', fontSize: '0.875rem', color: 'text.secondary', mt: 0.5, fontStyle: 'italic' }}>
            {item.description}
          </Box>
        )}
        <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block', mt: 0.5 }}>
          ID: {item.id} • Created: {formatDateShort(item.createdDate)} • Modified: {formatDateShort(item.lastModifiedDate)}
        </Box>
      </Box>
    );
  };

  const totalActiveFilters = activeFilterCount + (selectedItems.length > 0 ? 1 : 0);

  const handleClearAllFilters = () => {
    clearFilters();
    setSelectedItems([]);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <PageHeader 
          title="All Items" 
          subtitle="Browse and manage all items across all vendors"
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/unit-of-measures')}
            sx={{ mt: 1 }}
          >
            Manage UOMs
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/item-types')}
            sx={{ mt: 1 }}
          >
            Manage Types
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setQuickAddDialogOpen(true)}
            sx={{ mt: 1 }}
          >
            Add Item
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Autocomplete
          multiple
          options={items}
          value={selectedItems}
          onChange={(_, newValue) => setSelectedItems(newValue)}
          getOptionLabel={(option) => option.name}
          filterOptions={(options, { inputValue }) => {
            const searchLower = inputValue.toLowerCase();
            return options.filter(option => 
              option.name.toLowerCase().includes(searchLower) ||
              option.shortName?.toLowerCase().includes(searchLower) ||
              option.description?.toLowerCase().includes(searchLower)
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={selectedItems.length === 0 ? 'Search items by name, short name, or description...' : ''}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.name}
                {...getTagProps({ index })}
                size="small"
              />
            ))
          }
          renderOption={(props, option) => (
            <li {...props}>
              <Box>
                <Box sx={{ fontWeight: 500 }}>{option.name}</Box>
                {option.shortName && (
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {option.shortName}
                  </Box>
                )}
              </Box>
            </li>
          )}
        />
      </Box>

      <ItemFilters
        vendorFilter={vendorFilter}
        onVendorFilterChange={setVendorFilter}
        segmentFilter={segmentFilter}
        onSegmentFilterChange={setSegmentFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        itemTypeFilter={itemTypeFilter}
        onItemTypeFilterChange={setItemTypeFilter}
        unitOfMeasureFilter={unitOfMeasureFilter}
        onUnitOfMeasureFilterChange={setUnitOfMeasureFilter}
        vendors={vendors}
        segments={segments}
        categories={categories}
        itemTypes={itemTypes}
        unitOfMeasures={unitOfMeasures}
        onClearFilters={handleClearAllFilters}
        activeFilterCount={totalActiveFilters}
      />

      <SortControls
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title="All Items"
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage={
          totalActiveFilters > 0
            ? 'No items match your search or filters.'
            : 'No items yet. Items are created within vendor categories.'
        }
        renderSecondary={renderItemSecondary}
      />

      <QuickAddItemDialog
        open={quickAddDialogOpen}
        vendors={vendors}
        segments={segments}
        categories={categories}
        unitOfMeasures={unitOfMeasures}
        itemTypes={itemTypes}
        onClose={() => setQuickAddDialogOpen(false)}
        onSave={handleQuickAdd}
      />

      <QuickEditItemDialog
        open={editDialogOpen}
        item={editingItem}
        vendors={vendors}
        segments={segments}
        categories={categories}
        unitOfMeasures={unitOfMeasures}
        itemTypes={itemTypes}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Item"
        message={`Are you sure you want to delete "${getDeletingItemName()}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}