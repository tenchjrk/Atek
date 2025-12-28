import { useState, useMemo } from 'react';
import type { Vendor } from '../types';

export function useVendorFilters(vendors: Vendor[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [postalCodeFilter, setPostalCodeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [vendorTypeFilter, setVendorTypeFilter] = useState<number | null>(null);

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

      const matchesVendorType = vendorTypeFilter === null ||
        vendor.vendorTypeId === vendorTypeFilter;

      return matchesSearch && matchesCity && matchesState && matchesPostalCode && matchesCountry && matchesVendorType;
    });
  }, [vendors, searchTerm, cityFilter, stateFilter, postalCodeFilter, countryFilter, vendorTypeFilter]);

  const activeFilterCount = [
    cityFilter,
    stateFilter,
    postalCodeFilter,
    countryFilter,
  ].filter(Boolean).length + (vendorTypeFilter !== null ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setStateFilter('');
    setPostalCodeFilter('');
    setCountryFilter('');
    setVendorTypeFilter(null);
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
    vendorTypeFilter,
    setVendorTypeFilter,
    filteredVendors,
    activeFilterCount,
    clearFilters,
  };
}