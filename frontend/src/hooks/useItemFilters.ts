import { useMemo, useState } from 'react';
import type { Item } from '../types';

export function useItemFilters(items: Item[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState<number | ''>('');
  const [segmentFilter, setSegmentFilter] = useState<number | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [itemTypeFilter, setItemTypeFilter] = useState<number | ''>('');
  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = useState<number | ''>('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(search) ||
        item.shortName?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search);

      const matchesVendor = vendorFilter === '' || 
        item.itemCategory?.vendorSegment?.vendorId === vendorFilter;

      const matchesSegment = segmentFilter === '' || 
        item.itemCategory?.vendorSegmentId === segmentFilter;

      const matchesCategory = categoryFilter === '' || 
        item.itemCategoryId === categoryFilter;

      const matchesItemType = itemTypeFilter === '' || 
        item.itemTypeId === itemTypeFilter;

      const matchesUnitOfMeasure = unitOfMeasureFilter === '' || 
        item.unitOfMeasureId === unitOfMeasureFilter;

      return matchesSearch && matchesVendor && matchesSegment && 
             matchesCategory && matchesItemType && matchesUnitOfMeasure;
    });
  }, [items, searchTerm, vendorFilter, segmentFilter, categoryFilter, itemTypeFilter, unitOfMeasureFilter]);

  const activeFilterCount = [
    vendorFilter,
    segmentFilter,
    categoryFilter,
    itemTypeFilter,
    unitOfMeasureFilter,
  ].filter((f) => f !== '').length;

  const clearFilters = () => {
    setVendorFilter('');
    setSegmentFilter('');
    setCategoryFilter('');
    setItemTypeFilter('');
    setUnitOfMeasureFilter('');
  };

  return {
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
  };
}