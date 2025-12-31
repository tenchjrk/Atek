import { useState, useMemo } from 'react';
import type { Contract } from '../types';

export type ContractSortField = 'id' | 'name' | 'status' | 'termLength' | 'lastModifiedDate';
export type SortOrder = 'asc' | 'desc';

export function useContractSort(contracts: Contract[]) {
  const [sortField, setSortField] = useState<ContractSortField>('lastModifiedDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedItems = useMemo(() => {
    const sorted = [...contracts].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = (a.contractStatus?.name || '').localeCompare(b.contractStatus?.name || '');
          break;
        case 'termLength':
          comparison = a.termLengthMonths - b.termLengthMonths;
          break;
        case 'lastModifiedDate':
          comparison = new Date(a.lastModifiedDate).getTime() - new Date(b.lastModifiedDate).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [contracts, sortField, sortOrder]);

  const handleSortChange = (field: ContractSortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'id' || field === 'lastModifiedDate' || field === 'termLength' ? 'desc' : 'asc');
    }
  };

  return {
    sortedItems,
    sortField,
    sortOrder,
    handleSortChange,
  };
}