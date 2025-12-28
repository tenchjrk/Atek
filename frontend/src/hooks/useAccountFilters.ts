import { useState, useMemo } from 'react';
import type { Account } from '../types';

export function useAccountFilters(accounts: Account[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [postalCodeFilter, setPostalCodeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

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

      return matchesSearch && matchesCity && matchesState && matchesPostalCode && matchesCountry;
    });
  }, [accounts, searchTerm, cityFilter, stateFilter, postalCodeFilter, countryFilter]);

  const activeFilterCount = [
    cityFilter,
    stateFilter,
    postalCodeFilter,
    countryFilter,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setStateFilter('');
    setPostalCodeFilter('');
    setCountryFilter('');
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
    filteredAccounts,
    activeFilterCount,
    clearFilters,
  };
}