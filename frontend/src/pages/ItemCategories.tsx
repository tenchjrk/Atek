import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, IconButton } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { itemCategoryApi, vendorSegmentApi } from '../services/api';
import { useSimpleSearch } from '../hooks/useSimpleSearch';
import { useSortSimple } from '../hooks/useSortSimple';
import type { ItemCategory, VendorSegment } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import SimpleSearchBar from '../components/SimpleSearchBar';
import SortControlsSimple from '../components/SortControlsSimple';
import ItemCategoryCreateDialog from '../components/ItemCategoryCreateDialog';
import ItemCategoryEditDialog from '../components/ItemCategoryEditDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateShort } from '../utils/dateFormatter';

export default function ItemCategories() {
  const { vendorId, segmentId } = useParams<{ vendorId: string; segmentId: string }>();
  const navigate = useNavigate();
  const [segment, setSegment] = useState<VendorSegment | null>(null);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ItemCategory | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

  // Apply search
  const { searchTerm, setSearchTerm, filteredItems } = useSimpleSearch(categories);

  // Apply sorting to filtered categories
  const { sortedItems, sortField, sortOrder, handleSortChange } = useSortSimple(filteredItems);

  const fetchData = useCallback(async () => {
    if (!segmentId) return;
    
    try {
      setLoading(true);
      const [segmentResponse, categoriesResponse] = await Promise.all([
        vendorSegmentApi.getById(parseInt(segmentId)),
        itemCategoryApi.getBySegmentId(parseInt(segmentId)),
      ]);
      
      setSegment(segmentResponse.data);
      setCategories(categoriesResponse.data);
      setError(null);
    } catch (err) {
      setError('Error loading data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [segmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (categoryData: { vendorSegmentId: number; name: string }) => {
    try {
      await itemCategoryApi.create(categoryData as Omit<ItemCategory, 'id'>);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error creating category:', err);
      return false;
    }
  };

  const handleEdit = (category: ItemCategory) => {
    setEditingCategory(category);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (categoryData: { id: number; vendorSegmentId: number; name: string }) => {
    try {
      await itemCategoryApi.update(categoryData.id, categoryData as ItemCategory);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error updating category:', err);
      return false;
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingCategoryId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingCategoryId !== null) {
      try {
        await itemCategoryApi.delete(deletingCategoryId);
        await fetchData();
        setDeleteDialogOpen(false);
        setDeletingCategoryId(null);
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingCategoryId(null);
  };

  const getDeletingCategoryName = () => {
    const category = categories.find(c => c.id === deletingCategoryId);
    return category?.name || 'this category';
  };

  const renderCategorySecondary = (category: ItemCategory) => {
    return (
      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
        ID: {category.id} • Created: {formatDateShort(category.createdDate)} • Modified: {formatDateShort(category.lastModifiedDate)}
      </Box>
    );
  };

  if (!vendorId || !segmentId) {
    return <Box>Invalid vendor or segment ID</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(`/vendors/${vendorId}/segments`)} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader
            title={`Item Categories in ${segment?.name || 'Segment'}`}
            subtitle="Manage product and service categories for this segment"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Category
        </Button>
      </Box>

      <SimpleSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search categories by name..."
      />

      <SortControlsSimple
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title="Item Categories"
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage={
          searchTerm
            ? 'No categories match your search.'
            : 'No item categories yet. Add categories to classify products and services in this segment.'
        }
        renderSecondary={renderCategorySecondary}
      />

      <ItemCategoryCreateDialog
        open={createDialogOpen}
        segmentId={parseInt(segmentId)}
        segmentName={segment?.name || ''}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <ItemCategoryEditDialog
        open={editDialogOpen}
        category={editingCategory}
        segmentName={segment?.name || ''}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Item Category"
        message={`Are you sure you want to delete "${getDeletingCategoryName()}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}