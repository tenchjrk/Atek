import axios from 'axios';
import type { Account, Vendor, AccountType } from '../types';

const API_BASE_URL = 'http://localhost:5245/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Generic CRUD operations
const createCrudApi = <T extends { id: number }>(endpoint: string) => ({
  getAll: () => api.get<T[]>(`/${endpoint}`),
  getById: (id: number) => api.get<T>(`/${endpoint}/${id}`),
  create: (item: Omit<T, 'id'>) => api.post<T>(`/${endpoint}`, item),
  update: (id: number, item: T) => api.put<T>(`/${endpoint}/${id}`, item),
  delete: (id: number) => api.delete(`/${endpoint}/${id}`),
});

export const accountApi = createCrudApi<Account>('accounts');
export const vendorApi = createCrudApi<Vendor>('vendors');
export const accountTypeApi = createCrudApi<AccountType>('accountTypes');