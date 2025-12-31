import { useState, useMemo } from 'react';

export type SimplerSortField = 'id' | 'name';
export type SortOrder = 'asc' | 'desc';

export function useSortSimpler<T extends { id: number; name: string }>(items: T[]) {
  const [sortField, setSortField] = useState<SimplerSortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortField, sortOrder]);

  const handleSortChange = (field: SimplerSortField) => {
    if (field === sortField) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc for id, asc for name
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