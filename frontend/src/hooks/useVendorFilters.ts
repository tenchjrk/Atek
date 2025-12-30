import { useState, useMemo } from 'react';
import type { Vendor } from '../types';

export function useVendorFilters(vendors: Vendor[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [postalCodeFilter, setPostalCodeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [vendorTypeFilter, setVendorTypeFilter] = useState<number[]>([]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      // Search filter (ID or name)
      const search = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        vendor.id.toString().includes(search) ||
        vendor.name.toLowerCase().includes(search);

      // City filter
      const matchesCity = cityFilter === '' ||
        (vendor.city?.toLowerCase().includes(cityFilter.toLowerCase()) ?? false);

      // State filter
      const matchesState = stateFilter === '' ||
        (vendor.state?.toLowerCase().includes(stateFilter.toLowerCase()) ?? false);

      // Postal code filter
      const matchesPostalCode = postalCodeFilter === '' ||
        (vendor.postalCode?.toLowerCase().includes(postalCodeFilter.toLowerCase()) ?? false);

      // Country filter
      const matchesCountry = countryFilter === '' ||
        (vendor.country?.toLowerCase().includes(countryFilter.toLowerCase()) ?? false);

      // Vendor type filter
      const matchesVendorType = vendorTypeFilter.length === 0 ||
        (vendor.vendorTypeId && vendorTypeFilter.includes(vendor.vendorTypeId));

      return matchesSearch && matchesCity && matchesState && matchesPostalCode && matchesCountry && matchesVendorType;
    });
  }, [vendors, searchTerm, cityFilter, stateFilter, postalCodeFilter, countryFilter, vendorTypeFilter]);

  const activeFilterCount = [
    cityFilter,
    stateFilter,
    postalCodeFilter,
    countryFilter,
  ].filter(Boolean).length + (vendorTypeFilter.length > 0 ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setStateFilter('');
    setPostalCodeFilter('');
    setCountryFilter('');
    setVendorTypeFilter([]);
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