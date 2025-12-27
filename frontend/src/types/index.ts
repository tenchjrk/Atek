export interface Account {
  id: number;
  name: string;
  parentAccountId?: number | null;
  parentAccount?: Account | null;
  childAccounts?: Account[];
}

export interface Vendor {
  id: number;
  name: string;
}