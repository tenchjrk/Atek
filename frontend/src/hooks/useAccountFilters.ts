import { useState, useMemo } from 'react';
import type { Account } from '../types';

export function useAccountFilters(accounts: Account[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [postalCodeFilter, setPostalCodeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<number | null>(null);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      // Search filter (ID or name)
      const search = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        account.id.toString().includes(search) ||
        account.name.toLowerCase().includes(search);

      // City filter
      const matchesCity = cityFilter === '' ||
        (account.city?.toLowerCase().includes(cityFilter.toLowerCase()) ?? false);

      // State filter
      const matchesState = stateFilter === '' ||
        (account.state?.toLowerCase().includes(stateFilter.toLowerCase()) ?? false);

      // Postal code filter
      const matchesPostalCode = postalCodeFilter === '' ||
        (account.postalCode?.toLowerCase().includes(postalCodeFilter.toLowerCase()) ?? false);

      // Country filter
      const matchesCountry = countryFilter === '' ||
        (account.country?.toLowerCase().includes(countryFilter.toLowerCase()) ?? false);

      // Account type filter
      const matchesAccountType = accountTypeFilter === null ||
        account.accountTypeId === accountTypeFilter;

      return matchesSearch && matchesCity && matchesState && matchesPostalCode && matchesCountry && matchesAccountType;
    });
  }, [accounts, searchTerm, cityFilter, stateFilter, postalCodeFilter, countryFilter, accountTypeFilter]);

  const activeFilterCount = [
    cityFilter,
    stateFilter,
    postalCodeFilter,
    countryFilter,
  ].filter(Boolean).length + (accountTypeFilter !== null ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setStateFilter('');
    setPostalCodeFilter('');
    setCountryFilter('');
    setAccountTypeFilter(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    cityFilter,
    setCityFilter,
    stateFilter,
    setStateFilter,
    postalCodeFilter,
    setPostalCodeFilter,
    countryFilter,
    setCountryFilter,
    accountTypeFilter,
    setAccountTypeFilter,
    filteredAccounts,
    activeFilterCount,
    clearFilters,
  };
}