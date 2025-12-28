export interface AccountType {
  id: number;
  type: string;
}

export interface Account {
  id: number;
  name: string;
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
}