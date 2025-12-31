import { useState, useMemo } from 'react';
import type { Contract } from '../types';

export function useContractFilters(contracts: Contract[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusIds, setSelectedStatusIds] = useState<number[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      // Search filter (id, name, or description)
      const matchesSearch = searchQuery === '' || 
        contract.id.toString().includes(searchQuery) ||
        contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contract.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      // Status filter
      const matchesStatus = selectedStatusIds.length === 0 || 
        selectedStatusIds.includes(contract.contractStatusId);

      // Account filter
      const matchesAccount = selectedAccountIds.length === 0 || 
        selectedAccountIds.includes(contract.accountId);

      return matchesSearch && matchesStatus && matchesAccount;
    });
  }, [contracts, searchQuery, selectedStatusIds, selectedAccountIds]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusChange = (statusIds: number[]) => {
    setSelectedStatusIds(statusIds);
  };

  const handleAccountChange = (accountIds: number[]) => {
    setSelectedAccountIds(accountIds);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatusIds([]);
    setSelectedAccountIds([]);
  };

  return {
    filteredContracts,
    searchQuery,
    selectedStatusIds,
    selectedAccountIds,
    handleSearchChange,
    handleStatusChange,
    handleAccountChange,
    clearFilters,
  };
}