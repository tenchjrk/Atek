import { useState, useMemo } from 'react';

export type SortField = 'id' | 'name' | 'lastModified';
export type SortOrder = 'asc' | 'desc';

export function useSort<T extends { id: number; name: string; lastModifiedDate: string }>(items: T[]) {
  const [sortField, setSortField] = useState<SortField>('lastModified');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

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
        case 'lastModified':
          comparison = new Date(a.lastModifiedDate).getTime() - new Date(b.lastModifiedDate).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortField, sortOrder]);

  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc for lastModified, asc for others
      setSortField(field);
      setSortOrder(field === 'lastModified' ? 'desc' : 'asc');
    }
  };

  return {
    sortedItems,
    sortField,
    sortOrder,
    handleSortChange,
  };
}