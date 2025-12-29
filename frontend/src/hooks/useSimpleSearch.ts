import { useState, useMemo } from 'react';

export function useSimpleSearch<T extends { name: string }>(items: T[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const search = searchTerm.toLowerCase();
      return searchTerm === '' || item.name.toLowerCase().includes(search);
    });
  }, [items, searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    clearSearch,
  };
}