import { useState, useMemo } from 'react';
import type { Contract } from '../types';

export function useContractFilters(contracts: Contract[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusIds, setSelectedStatusIds] = useState<number[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState<number[]>([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([]);

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

      // Vendor filter
      const matchesVendor = selectedVendorIds.length === 0 || 
        selectedVendorIds.includes(contract.vendorId);

      // Type filter
      const matchesType = selectedTypeIds.length === 0 || 
        (contract.contractTypeId && selectedTypeIds.includes(contract.contractTypeId));

      return matchesSearch && matchesStatus && matchesAccount && matchesVendor && matchesType;
    });
  }, [contracts, searchQuery, selectedStatusIds, selectedAccountIds, selectedVendorIds, selectedTypeIds]);

  const activeFilterCount = 
    (searchQuery ? 1 : 0) + 
    (selectedStatusIds.length > 0 ? 1 : 0) + 
    (selectedAccountIds.length > 0 ? 1 : 0) +
    (selectedVendorIds.length > 0 ? 1 : 0) +
    (selectedTypeIds.length > 0 ? 1 : 0);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusChange = (statusIds: number[]) => {
    setSelectedStatusIds(statusIds);
  };

  const handleAccountChange = (accountIds: number[]) => {
    setSelectedAccountIds(accountIds);
  };

  const handleVendorChange = (vendorIds: number[]) => {
    setSelectedVendorIds(vendorIds);
  };

  const handleTypeChange = (typeIds: number[]) => {
    setSelectedTypeIds(typeIds);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatusIds([]);
    setSelectedAccountIds([]);
    setSelectedVendorIds([]);
    setSelectedTypeIds([]);
  };

  return {
    filteredContracts,
    searchQuery,
    selectedStatusIds,
    selectedAccountIds,
    selectedVendorIds,
    selectedTypeIds,
    activeFilterCount,
    handleSearchChange,
    handleStatusChange,
    handleAccountChange,
    handleVendorChange,
    handleTypeChange,
    clearFilters,
  };
}