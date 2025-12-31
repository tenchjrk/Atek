export interface AccountType {
  id: number;
  name: string;
}

export interface VendorType {
  id: number;
  name: string;
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
  numberOfKiosks: number;
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

export interface UnitOfMeasure {
  id: number;
  name: string;
  shortName?: string | null;
  createdDate: string;
  lastModifiedDate: string;
}

export interface ItemType {
  id: number;
  name: string;
  shortName?: string | null;
  createdDate: string;
  lastModifiedDate: string;
}

export interface Item {
  id: number;
  itemCategoryId: number;
  name: string;
  shortName?: string | null;
  description?: string | null;
  listPrice: number;
  cost: number;
  eachesPerUnitOfMeasure: number;
  unitOfMeasureId: number;
  itemTypeId: number;
  createdDate: string;
  lastModifiedDate: string;
  itemCategory?: ItemCategory | null;
  unitOfMeasure?: UnitOfMeasure | null;
  itemType?: ItemType | null;
}

export interface ContractStatus {
  id: number;
  name: string;
}

export interface ContractType {
  id: number;
  name: string;
}

export interface Contract {
  id: number;
  accountId: number;
  vendorId: number;
  name: string;
  description?: string | null;
  contractStatusId: number;
  contractTypeId: number;  // Remove the ?
  executionDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  termLengthMonths: number;
  interestRate?: number | null;
  apr?: number | null;
  leaseType?: string | null;
  createdDate: string;
  lastModifiedDate: string;
  account?: Account | null;
  vendor?: Vendor | null;
  contractStatus?: ContractStatus | null;
  contractType?: ContractType | null;
}

export interface ContractItem {
  id: number;
  contractId: number;
  pricingLevel: string; // "Item", "Category", or "Segment"
  itemId?: number | null;
  itemCategoryId?: number | null;
  vendorSegmentId?: number | null;
  discountPercentage?: number | null;
  flatDiscountPrice?: number | null;
  rebatePercentage?: number | null;
  netRebatePrice?: number | null;
  commitmentQuantity?: number | null;
  commitmentDollars?: number | null;
  createdDate: string;
  lastModifiedDate: string;
  contract?: Contract | null;
  item?: Item | null;
  itemCategory?: ItemCategory | null;
  vendorSegment?: VendorSegment | null;
}