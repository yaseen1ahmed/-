export type AccountType = 
  | 'customer'
  | 'supplier'
  | 'expense'
  | 'revenue'
  | 'employee'
  | 'partner'
  | 'partner_current';

export type PaymentMethod = 'cash' | 'bank' | 'wallet';

export interface CompanySettings {
  name: string;
  activity: string;
  address: string;
  commercialRegister: string;
  taxNumber: string;
  phone1: string;
  phone2: string;
  email: string;
  logoUrl: string;
  printOptions: {
    showName: boolean;
    showLogo: boolean;
    showAddress: boolean;
    showCommercialRegister: boolean;
    showTaxNumber: boolean;
    showPhone: boolean;
    showTerms: boolean;
    termsNotes: string;
  };
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  manager: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface Unit {
  id: string;
  code: string;
  name: string;
}

export interface ItemUnit {
  unitId: string;
  unitName: string;
  conversionFactor: number; // e.g. 12 if 1 Carton = 12 Pieces
  salePrice: number;
  barcode?: string;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  baseUnitId: string;
  baseUnitName: string;
  additionalUnits: ItemUnit[];
  reorderLevel: number; // حد الطلب
  costPrice: number; // سعر التكلفة
  salePrice: number; // سعر البيع
  averageCost: number; // متوسط التكلفة
  category?: string;
  stockByWarehouse: Record<string, number>; // warehouseId -> quantity in base unit
  notes?: string;
}

export interface WarehouseTransfer {
  id: string;
  code: string;
  date: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  itemId: string;
  itemName: string;
  unitId: string;
  unitName: string;
  quantity: number;
  unitCost: number; // بسعر التكلفة الحالية
  totalCost: number;
  notes?: string;
}

export interface Country {
  id: string;
  code: string;
  name: string;
}

export interface Governorate {
  id: string;
  code: string;
  name: string;
  countryId: string;
  countryName: string;
}

export interface City {
  id: string;
  code: string;
  name: string;
  governorateId: string;
  governorateName: string;
  countryId: string;
  countryName: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  delegateName: string; // اسم المندوب
  responsiblePerson: string; // اسم الشخص المسئول
  responsiblePhone: string;
  email: string;
  fax: string;
  phone1: string;
  phone2: string;
  addressDetails: string;
  cityId: string;
  cityName: string;
  governorateName: string;
  countryName: string;
  openingBalanceType: 'debit' | 'credit'; // مدين (عليه) / دائن (له)
  openingBalance: number;
  currentBalance: number;
  notes?: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  responsiblePerson: string;
  responsiblePhone: string;
  email: string;
  fax: string;
  phone1: string;
  phone2: string;
  addressDetails: string;
  cityId: string;
  cityName: string;
  governorateName: string;
  countryName: string;
  openingBalanceType: 'debit' | 'credit'; // دائن (له) / مدين (عليه)
  openingBalance: number;
  currentBalance: number;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  unitId: string;
  unitName: string;
  conversionFactor: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number; // e.g. 14%
  total: number;
}

export interface SalesInvoice {
  id: string;
  code: string;
  type: 'sale' | 'sale_return'; // مبيعات / مردود مبيعات
  date: string;
  customerId: string;
  customerName: string;
  warehouseId: string;
  warehouseName: string;
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  netTotal: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  treasuryId?: string;
  treasuryName?: string;
  notes?: string;
}

export interface PurchaseInvoice {
  id: string;
  code: string;
  type: 'purchase' | 'purchase_return'; // مشتريات / مردود مشتريات
  date: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  netTotal: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  treasuryId?: string;
  treasuryName?: string;
  notes?: string;
}

export interface ReceiptVoucher {
  id: string;
  code: string;
  date: string;
  accountType: AccountType;
  accountTypeName: string;
  accountId: string;
  accountName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  treasuryId: string;
  treasuryName: string;
  receivedBy?: string;
  notes: string;
  referenceDoc?: string;
}

export interface PaymentVoucher {
  id: string;
  code: string;
  date: string;
  accountType: AccountType;
  accountTypeName: string;
  accountId: string;
  accountName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  treasuryId: string;
  treasuryName: string;
  paidTo?: string;
  notes: string;
  referenceDoc?: string;
}

export interface Treasury {
  id: string;
  code: string;
  name: string;
  type: 'cash' | 'bank' | 'wallet';
  balance: number;
  manager?: string; // للخزينة
  bankName?: string; // للبنك
  accountNumber?: string;
  bankBranch?: string;
  iban?: string;
  walletNumber?: string; // للمحفظة الإلكترونية
  providerName?: string; // فودافون كاش، اتصالات كاش، انستاباي، إلخ
  notes?: string;
}

export interface TreasuryTransfer {
  id: string;
  code: string;
  date: string;
  fromTreasuryId: string;
  fromTreasuryName: string;
  toTreasuryId: string;
  toTreasuryName: string;
  amount: number;
  notes?: string;
}

export interface ExpenseCategory {
  id: string;
  code: string;
  name: string;
}

export interface ExpenseTransaction {
  id: string;
  code: string;
  date: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  treasuryId: string;
  treasuryName: string;
  recipient?: string;
  notes: string;
}

export interface RevenueCategory {
  id: string;
  code: string;
  name: string;
}

export interface RevenueTransaction {
  id: string;
  code: string;
  date: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  treasuryId: string;
  treasuryName: string;
  payer?: string;
  notes: string;
}

export interface Partner {
  id: string;
  code: string;
  name: string;
  capital: number; // رأس المال
  sharePercentage: number; // نسبة الشراكة %
  phone: string;
  email?: string;
  notes?: string;
}

export interface PartnerCurrentMovement {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'profit_share' | 'capital_adjustment';
  amount: number;
  description: string;
  treasuryId?: string;
  treasuryName?: string;
}

export interface PartnerCurrentAccount {
  id: string;
  partnerId: string;
  partnerName: string;
  currentBalance: number; // موجب: له، سالب: عليه
  movements: PartnerCurrentMovement[];
}

export interface UserPermissionModule {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  print?: boolean;
}

export interface UserPermissions {
  warehouses: UserPermissionModule;
  items: UserPermissionModule;
  customers: UserPermissionModule;
  salesInvoices: UserPermissionModule;
  suppliers: UserPermissionModule;
  purchaseInvoices: UserPermissionModule;
  treasuries: UserPermissionModule;
  expenses: UserPermissionModule;
  revenues: UserPermissionModule;
  partners: UserPermissionModule;
  users: UserPermissionModule;
  settings: UserPermissionModule;
}

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'accountant' | 'warehouse_keeper' | 'cashier' | 'custom';
  email: string;
  phone: string;
  isActive: boolean;
  permissions: UserPermissions;
}
