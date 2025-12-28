import { useState, useMemo } from 'react';
import type { Vendor } from '../types';

export function useVendorFilters(vendors: Vendor[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [postalCodeFilter, setPostalCodeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        vendor.id.toString().includes(search) ||
        vendor.name.toLowerCase().includes(search);

      const matchesCity = cityFilter === '' ||
        (vendor.city?.toLowerCase().includes(cityFilter.toLowerCase()) ?? false);

      const matchesState = stateFilter === '' ||
        (vendor.state?.toLowerCase().includes(stateFilter.toLowerCase()) ?? false);

      const matchesPostalCode = postalCodeFilter === '' ||
        (vendor.postalCode?.toLowerCase().includes(postalCodeFilter.toLowerCase()) ?? false);

      const matchesCountry = countryFilter === '' ||
        (vendor.country?.toLowerCase().includes(countryFilter.toLowerCase()) ?? false);

      return matchesSearch && matchesCity && matchesState && matchesPostalCode && matchesCountry;
    });
  }, [vendors, searchTerm, cityFilter, stateFilter, postalCodeFilter, countryFilter]);

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
    filteredVendors,
    activeFilterCount,
    clearFilters,
  };
}