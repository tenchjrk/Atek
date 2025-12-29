import { useState, useMemo } from 'react';

export type SimpleSortField = 'id' | 'type';
export type SortOrder = 'asc' | 'desc';

export function useSortSimple<T extends { id: number; type: string }>(items: T[]) {
  const [sortField, setSortField] = useState<SimpleSortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortField, sortOrder]);

  const handleSortChange = (field: SimpleSortField) => {
    if (field === sortField) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc for id, asc for type
      setSortField(field);
      setSortOrder(field === 'id' ? 'desc' : 'asc');
    }
  };

  return {
    sortedItems,
    sortField,
    sortOrder,
    handleSortChange,
  };
}