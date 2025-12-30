import { useState, useEffect } from 'react';
import { Box, Chip, TextField, Button } from '@mui/material';
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

  const {
    searchTerm,
    setSearchTerm,
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

  // Apply sorting to filtered items
  const { sortedItems, sortField, sortOrder, handleSortChange } = useSort(filteredItems);

  useEffect(() => {
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

    fetchData();
  }, []);

  // Empty handlers for read-only view
  const handleEdit = () => {
    // Read-only page - no edit functionality
  };

  const handleDelete = () => {
    // Read-only page - no delete functionality
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
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder='Search items by name, short name, or description...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
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
        onDelete={handleDelete}
        emptyMessage={
          activeFilterCount > 0 || searchTerm
            ? 'No items match your search or filters.'
            : 'No items yet. Items are created within vendor categories.'
        }
        renderSecondary={renderItemSecondary}
      />
    </Box>
  );
}