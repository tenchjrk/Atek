import { useState, useMemo } from 'react';

export type SortField = 'id' | 'name' | 'lastModifiedDate' | 'listPrice' | 'cost';
export type SortOrder = 'asc' | 'desc';

export function useSort<T extends { id: number; name: string; lastModifiedDate: string } & Partial<{ listPrice: number; cost: number }>>(items: T[]) {
  const [sortField, setSortField] = useState<SortField>('lastModifiedDate');
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
        case 'lastModifiedDate':
          comparison = new Date(a.lastModifiedDate).getTime() - new Date(b.lastModifiedDate).getTime();
          break;
        case 'listPrice':
          comparison = (a.listPrice ?? 0) - (b.listPrice ?? 0);
          break;
        case 'cost':
          comparison = (a.cost ?? 0) - (b.cost ?? 0);
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
      // New field, default to desc for dates/prices, asc for others
      setSortField(field);
      setSortOrder(field === 'lastModifiedDate' || field === 'id' || field === 'listPrice' || field === 'cost' ? 'desc' : 'asc');
    }
  };

  return {
    sortedItems,
    sortField,
    sortOrder,
    handleSortChange,
  };
}