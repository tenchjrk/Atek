import { useMemo, useState } from "react";
import type { Item } from "../types";

export function useItemFilters(items: Item[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState<number[]>([]);
  const [segmentFilter, setSegmentFilter] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
  const [itemTypeFilter, setItemTypeFilter] = useState<number[]>([]);
  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = useState<number[]>([]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        item.id.toString().includes(searchTerm) ||
        item.name.toLowerCase().includes(search) ||
        item.shortName?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search);

      const matchesVendor =
        vendorFilter.length === 0 ||
        (item.itemCategory?.vendorSegment?.vendorId &&
          vendorFilter.includes(item.itemCategory.vendorSegment.vendorId));

      const matchesSegment =
        segmentFilter.length === 0 ||
        (item.itemCategory?.vendorSegmentId &&
          segmentFilter.includes(item.itemCategory.vendorSegmentId));

      const matchesCategory =
        categoryFilter.length === 0 ||
        categoryFilter.includes(item.itemCategoryId);

      const matchesItemType =
        itemTypeFilter.length === 0 ||
        (item.itemTypeId && itemTypeFilter.includes(item.itemTypeId));

      const matchesUnitOfMeasure =
        unitOfMeasureFilter.length === 0 ||
        (item.unitOfMeasureId &&
          unitOfMeasureFilter.includes(item.unitOfMeasureId));

      return (
        matchesSearch &&
        matchesVendor &&
        matchesSegment &&
        matchesCategory &&
        matchesItemType &&
        matchesUnitOfMeasure
      );
    });
  }, [
    items,
    searchTerm,
    vendorFilter,
    segmentFilter,
    categoryFilter,
    itemTypeFilter,
    unitOfMeasureFilter,
  ]);

  const activeFilterCount = [
    searchTerm ? 1 : 0,
    vendorFilter.length > 0 ? 1 : 0,
    segmentFilter.length > 0 ? 1 : 0,
    categoryFilter.length > 0 ? 1 : 0,
    itemTypeFilter.length > 0 ? 1 : 0,
    unitOfMeasureFilter.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearFilters = () => {
    setSearchTerm("");
    setVendorFilter([]);
    setSegmentFilter([]);
    setCategoryFilter([]);
    setItemTypeFilter([]);
    setUnitOfMeasureFilter([]);
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
