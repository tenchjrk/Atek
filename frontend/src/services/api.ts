import axios from 'axios';
import type { Account, Vendor, AccountType, VendorType, AccountAddress, VendorSegment, VendorRegion, VendorTerritory } from '../types';

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
export const vendorTypeApi = createCrudApi<VendorType>('vendorTypes');

export const accountAddressApi = {
  ...createCrudApi<AccountAddress>('accountAddresses'),
  getByAccountId: (accountId: number) => api.get<AccountAddress[]>(`/accountAddresses/account/${accountId}`),
};

export const vendorSegmentApi = {
  ...createCrudApi<VendorSegment>('vendorSegments'),
  getByVendorId: (vendorId: number) => api.get<VendorSegment[]>(`/vendorSegments/vendor/${vendorId}`),
};

export const vendorRegionApi = {
  ...createCrudApi<VendorRegion>('vendorRegions'),
  getBySegmentId: (segmentId: number) => api.get<VendorRegion[]>(`/vendorRegions/segment/${segmentId}`),
};

export const vendorTerritoryApi = {
  ...createCrudApi<VendorTerritory>('vendorTerritories'),
  getByRegionId: (regionId: number) => api.get<VendorTerritory[]>(`/vendorTerritories/region/${regionId}`),
};