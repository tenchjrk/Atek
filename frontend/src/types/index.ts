export interface AccountType {
  id: number;
  type: string;
}

export interface VendorType {
  id: number;
  type: string;
}

export interface Account {
  id: number;
  name: string;
  dunsNumber: string;
  ein: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  createdDate: string;
  lastModifiedDate: string;
  parentAccountId?: number | null;
  parentAccount?: Account | null;
  childAccounts?: Account[];
  accountTypeId?: number | null;
  accountType?: AccountType | null;
}

export interface Vendor {
  id: number;
  name: string;
  dunsNumber: string;
  ein: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  createdDate: string;
  lastModifiedDate: string;
  parentVendorId?: number | null;
  parentVendor?: Vendor | null;
  childVendors?: Vendor[];
  vendorTypeId?: number | null;
  vendorType?: VendorType | null;
}

export interface AccountAddress {
  id: number;
  accountId: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isShipping: boolean;
  isBilling: boolean;
  name?: string | null;
  createdDate: string;
  lastModifiedDate: string;
  account?: Account | null;
}

export interface VendorSegment {
  id: number;
  vendorId: number;
  name: string;
  createdDate: string;
  lastModifiedDate: string;
  vendor?: Vendor | null;
}

export interface VendorRegion {
  id: number;
  vendorSegmentId: number;
  name: string;
  createdDate: string;
  lastModifiedDate: string;
  vendorSegment?: VendorSegment | null;
}

export interface VendorTerritory {
  id: number;
  vendorRegionId: number;
  name: string;
  createdDate: string;
  lastModifiedDate: string;
  vendorRegion?: VendorRegion | null;
}

export interface ItemCategory {
  id: number;
  vendorSegmentId: number;
  name: string;
  shortName?: string | null;
  createdDate: string;
  lastModifiedDate: string;
  vendorSegment?: VendorSegment | null;
}
