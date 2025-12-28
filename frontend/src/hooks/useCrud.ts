import { useState, useEffect, useCallback } from 'react';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';

interface CrudApi<T> {
  getAll: () => Promise<AxiosResponse<T[]>>;
  getById: (id: number) => Promise<AxiosResponse<T>>;
  create: (item: Omit<T, 'id'>) => Promise<AxiosResponse<T>>;
  update: (id: number, item: T) => Promise<AxiosResponse<T>>;
  delete: (id: number) => Promise<AxiosResponse<void>>;
}

export function useCrud<T extends { id: number }>(api: CrudApi<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getAll();
      const sortedItems = response.data.sort((a, b) => b.id - a.id);
      setItems(sortedItems);
      setError(null);
    } catch (err) {
      setError('Error loading items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (item: Omit<T, 'id'>) => {
    try {
      await api.create(item);
      await fetchItems();
      return true;
    } catch (err) {
      console.error('Error creating item:', err);
      return false;
    }
  };

  const updateItem = async (id: number, item: T) => {
    try {
      await api.update(id, item);
      await fetchItems();
      return true;
    } catch (err) {
      console.error('Error updating item:', err);
      return false;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await api.delete(id);
      await fetchItems();
      return { success: true, error: null };
    } catch (err) {
      console.error('Error deleting item:', err);
      let errorMessage = 'Error deleting item';
      
      if (err instanceof AxiosError && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      // Don't set the general error state for delete errors
      // Return the error instead so it can be handled by the component
      return { success: false, error: errorMessage };
    }
  };

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refreshItems: fetchItems,
  };
}