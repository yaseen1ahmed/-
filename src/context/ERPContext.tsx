import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CompanySettings,
  Warehouse,
  Unit,
  Item,
  Country,
  Governorate,
  City,
  Customer,
  Supplier,
  Treasury,
  ExpenseCategory,
  RevenueCategory,
  Partner,
  PartnerCurrentAccount,
  SystemUser,
  SalesInvoice,
  PurchaseInvoice,
  ReceiptVoucher,
  PaymentVoucher,
  WarehouseTransfer,
  TreasuryTransfer,
  ExpenseTransaction,
  RevenueTransaction,
  AccountType,
  PaymentMethod
} from '../types/erp';
import {
  initialCompanySettings,
  initialWarehouses,
  initialUnits,
  initialItems,
  initialCountries,
  initialGovernorates,
  initialCities,
  initialCustomers,
  initialSuppliers,
  initialTreasuries,
  initialExpenseCategories,
  initialRevenueCategories,
  initialPartners,
  initialPartnerCurrentAccounts,
  initialUsers,
  initialSalesInvoices,
  initialPurchaseInvoices,
  initialReceiptVouchers,
  initialPaymentVouchers,
  initialWarehouseTransfers,
  initialExpenseTransactions,
  initialRevenueTransactions
} from '../data/initialData';

interface ERPContextType {
  companySettings: CompanySettings;
  updateCompanySettings: (settings: CompanySettings) => void;

  warehouses: Warehouse[];
  addWarehouse: (wh: Omit<Warehouse, 'id'>) => void;
  updateWarehouse: (id: string, wh: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;

  units: Unit[];
  addUnit: (u: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, u: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;

  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  recalculateAverageCost: (itemId?: string) => { updatedCount: number; details: string[] };

  transfers: WarehouseTransfer[];
  addWarehouseTransfer: (transfer: Omit<WarehouseTransfer, 'id' | 'code'>) => void;

  countries: Country[];
  addCountry: (country: Omit<Country, 'id'>) => void;
  updateCountry: (id: string, country: Partial<Country>) => void;
  deleteCountry: (id: string) => void;

  governorates: Governorate[];
  addGovernorate: (gov: Omit<Governorate, 'id'>) => void;
  updateGovernorate: (id: string, gov: Partial<Governorate>) => void;
  deleteGovernorate: (id: string) => void;

  cities: City[];
  addCity: (city: Omit<City, 'id'>) => void;
  updateCity: (id: string, city: Partial<City>) => void;
  deleteCity: (id: string) => void;

  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'currentBalance'>) => void;
  updateCustomer: (id: string, cust: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  suppliers: Supplier[];
  addSupplier: (sup: Omit<Supplier, 'id' | 'currentBalance'>) => void;
  updateSupplier: (id: string, sup: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  salesInvoices: SalesInvoice[];
  addSalesInvoice: (inv: Omit<SalesInvoice, 'id' | 'code'>) => SalesInvoice;
  updateSalesInvoice: (id: string, inv: Partial<SalesInvoice>) => void;
  deleteSalesInvoice: (id: string) => void;

  purchaseInvoices: PurchaseInvoice[];
  addPurchaseInvoice: (inv: Omit<PurchaseInvoice, 'id' | 'code'>) => PurchaseInvoice;
  updatePurchaseInvoice: (id: string, inv: Partial<PurchaseInvoice>) => void;
  deletePurchaseInvoice: (id: string) => void;

  receiptVouchers: ReceiptVoucher[];
  addReceiptVoucher: (v: Omit<ReceiptVoucher, 'id' | 'code'>) => ReceiptVoucher;
  updateReceiptVoucher: (id: string, v: Partial<ReceiptVoucher>) => void;
  deleteReceiptVoucher: (id: string) => void;

  paymentVouchers: PaymentVoucher[];
  addPaymentVoucher: (v: Omit<PaymentVoucher, 'id' | 'code'>) => PaymentVoucher;
  updatePaymentVoucher: (id: string, v: Partial<PaymentVoucher>) => void;
  deletePaymentVoucher: (id: string) => void;

  treasuries: Treasury[];
  addTreasury: (t: Omit<Treasury, 'id'>) => void;
  updateTreasury: (id: string, t: Partial<Treasury>) => void;
  deleteTreasury: (id: string) => void;
  treasuryTransfers: TreasuryTransfer[];
  addTreasuryTransfer: (t: Omit<TreasuryTransfer, 'id' | 'code'>) => void;

  expenseCategories: ExpenseCategory[];
  addExpenseCategory: (cat: Omit<ExpenseCategory, 'id'>) => void;
  updateExpenseCategory: (id: string, cat: Partial<ExpenseCategory>) => void;
  deleteExpenseCategory: (id: string) => void;
  expenseTransactions: ExpenseTransaction[];
  addExpenseTransaction: (t: Omit<ExpenseTransaction, 'id' | 'code'>) => void;

  revenueCategories: RevenueCategory[];
  addRevenueCategory: (cat: Omit<RevenueCategory, 'id'>) => void;
  updateRevenueCategory: (id: string, cat: Partial<RevenueCategory>) => void;
  deleteRevenueCategory: (id: string) => void;
  revenueTransactions: RevenueTransaction[];
  addRevenueTransaction: (t: Omit<RevenueTransaction, 'id' | 'code'>) => void;

  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id'>) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;

  partnerCurrentAccounts: PartnerCurrentAccount[];
  addPartnerMovement: (partnerId: string, movement: { type: 'deposit' | 'withdrawal' | 'profit_share' | 'capital_adjustment'; amount: number; description: string; treasuryId?: string }) => void;

  users: SystemUser[];
  currentUser: SystemUser;
  setCurrentUser: (user: SystemUser) => void;
  addUser: (u: Omit<SystemUser, 'id'>) => void;
  updateUser: (id: string, u: Partial<SystemUser>) => void;
  deleteUser: (id: string) => void;

  // Utilities
  resetToDefaultData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
  getAccountOptions: (type: AccountType) => Array<{ id: string; name: string }>;
}

const ERPContext = createContext<ERPContextType | null>(null);

const STORAGE_KEY = 'alradwan_erp_state_v1';

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_company');
    return saved ? JSON.parse(saved) : initialCompanySettings;
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_warehouses');
    return saved ? JSON.parse(saved) : initialWarehouses;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_units');
    return saved ? JSON.parse(saved) : initialUnits;
  });

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_items');
    return saved ? JSON.parse(saved) : initialItems;
  });

  const [transfers, setTransfers] = useState<WarehouseTransfer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_transfers');
    return saved ? JSON.parse(saved) : initialWarehouseTransfers;
  });

  const [countries, setCountries] = useState<Country[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_countries');
    return saved ? JSON.parse(saved) : initialCountries;
  });

  const [governorates, setGovernorates] = useState<Governorate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_governorates');
    return saved ? JSON.parse(saved) : initialGovernorates;
  });

  const [cities, setCities] = useState<City[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_cities');
    return saved ? JSON.parse(saved) : initialCities;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_sales_inv');
    return saved ? JSON.parse(saved) : initialSalesInvoices;
  });

  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_purch_inv');
    return saved ? JSON.parse(saved) : initialPurchaseInvoices;
  });

  const [receiptVouchers, setReceiptVouchers] = useState<ReceiptVoucher[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_receipts');
    return saved ? JSON.parse(saved) : initialReceiptVouchers;
  });

  const [paymentVouchers, setPaymentVouchers] = useState<PaymentVoucher[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_payments');
    return saved ? JSON.parse(saved) : initialPaymentVouchers;
  });

  const [treasuries, setTreasuries] = useState<Treasury[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_treasuries');
    return saved ? JSON.parse(saved) : initialTreasuries;
  });

  const [treasuryTransfers, setTreasuryTransfers] = useState<TreasuryTransfer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_treasury_transfers');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_exp_cats');
    return saved ? JSON.parse(saved) : initialExpenseCategories;
  });

  const [expenseTransactions, setExpenseTransactions] = useState<ExpenseTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_exp_tx');
    return saved ? JSON.parse(saved) : initialExpenseTransactions;
  });

  const [revenueCategories, setRevenueCategories] = useState<RevenueCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_rev_cats');
    return saved ? JSON.parse(saved) : initialRevenueCategories;
  });

  const [revenueTransactions, setRevenueTransactions] = useState<RevenueTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_rev_tx');
    return saved ? JSON.parse(saved) : initialRevenueTransactions;
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_partners');
    return saved ? JSON.parse(saved) : initialPartners;
  });

  const [partnerCurrentAccounts, setPartnerCurrentAccounts] = useState<PartnerCurrentAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_partner_accounts');
    return saved ? JSON.parse(saved) : initialPartnerCurrentAccounts;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<SystemUser>(() => users[0] || initialUsers[0]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_company', JSON.stringify(companySettings));
    localStorage.setItem(STORAGE_KEY + '_warehouses', JSON.stringify(warehouses));
    localStorage.setItem(STORAGE_KEY + '_units', JSON.stringify(units));
    localStorage.setItem(STORAGE_KEY + '_items', JSON.stringify(items));
    localStorage.setItem(STORAGE_KEY + '_transfers', JSON.stringify(transfers));
    localStorage.setItem(STORAGE_KEY + '_countries', JSON.stringify(countries));
    localStorage.setItem(STORAGE_KEY + '_governorates', JSON.stringify(governorates));
    localStorage.setItem(STORAGE_KEY + '_cities', JSON.stringify(cities));
    localStorage.setItem(STORAGE_KEY + '_customers', JSON.stringify(customers));
    localStorage.setItem(STORAGE_KEY + '_suppliers', JSON.stringify(suppliers));
    localStorage.setItem(STORAGE_KEY + '_sales_inv', JSON.stringify(salesInvoices));
    localStorage.setItem(STORAGE_KEY + '_purch_inv', JSON.stringify(purchaseInvoices));
    localStorage.setItem(STORAGE_KEY + '_receipts', JSON.stringify(receiptVouchers));
    localStorage.setItem(STORAGE_KEY + '_payments', JSON.stringify(paymentVouchers));
    localStorage.setItem(STORAGE_KEY + '_treasuries', JSON.stringify(treasuries));
    localStorage.setItem(STORAGE_KEY + '_treasury_transfers', JSON.stringify(treasuryTransfers));
    localStorage.setItem(STORAGE_KEY + '_exp_cats', JSON.stringify(expenseCategories));
    localStorage.setItem(STORAGE_KEY + '_exp_tx', JSON.stringify(expenseTransactions));
    localStorage.setItem(STORAGE_KEY + '_rev_cats', JSON.stringify(revenueCategories));
    localStorage.setItem(STORAGE_KEY + '_rev_tx', JSON.stringify(revenueTransactions));
    localStorage.setItem(STORAGE_KEY + '_partners', JSON.stringify(partners));
    localStorage.setItem(STORAGE_KEY + '_partner_accounts', JSON.stringify(partnerCurrentAccounts));
    localStorage.setItem(STORAGE_KEY + '_users', JSON.stringify(users));
  }, [
    companySettings, warehouses, units, items, transfers,
    countries, governorates, cities, customers, suppliers,
    salesInvoices, purchaseInvoices, receiptVouchers, paymentVouchers,
    treasuries, treasuryTransfers, expenseCategories, expenseTransactions,
    revenueCategories, revenueTransactions, partners, partnerCurrentAccounts, users
  ]);

  // Company Settings
  const updateCompanySettings = (settings: CompanySettings) => {
    setCompanySettings(settings);
  };

  // Warehouses
  const addWarehouse = (wh: Omit<Warehouse, 'id'>) => {
    const newWh: Warehouse = { ...wh, id: 'wh-' + Date.now() };
    setWarehouses(prev => [...prev, newWh]);
  };

  const updateWarehouse = (id: string, wh: Partial<Warehouse>) => {
    setWarehouses(prev => prev.map(item => item.id === id ? { ...item, ...wh } : item));
  };

  const deleteWarehouse = (id: string) => {
    setWarehouses(prev => prev.filter(item => item.id !== id));
  };

  // Units
  const addUnit = (u: Omit<Unit, 'id'>) => {
    const newUnit: Unit = { ...u, id: 'u-' + Date.now() };
    setUnits(prev => [...prev, newUnit]);
  };

  const updateUnit = (id: string, u: Partial<Unit>) => {
    setUnits(prev => prev.map(item => item.id === id ? { ...item, ...u } : item));
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(item => item.id !== id));
  };

  // Items
  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem: Item = {
      ...item,
      id: 'itm-' + Date.now(),
      averageCost: item.averageCost || item.costPrice
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updated: Partial<Item>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Recalculate Weighted Average Cost for items
  // Formula: Weighted average based on purchases history and initial stock
  const recalculateAverageCost = (itemId?: string) => {
    const logs: string[] = [];
    let count = 0;

    setItems(prevItems => {
      return prevItems.map(item => {
        if (itemId && item.id !== itemId) return item;

        // Find all purchases of this item
        let totalQty = 0;
        let totalCostValue = 0;

        // Include current stock at current cost price as baseline
        const currentStockTotal = Object.values(item.stockByWarehouse || {}).reduce((a, b) => a + (b || 0), 0);
        if (currentStockTotal > 0) {
          totalQty += currentStockTotal;
          totalCostValue += currentStockTotal * (item.costPrice || 0);
        }

        // Add from purchase invoices
        purchaseInvoices.forEach(inv => {
          inv.items.forEach(line => {
            if (line.itemId === item.id) {
              const baseQty = line.quantity * (line.conversionFactor || 1);
              if (inv.type === 'purchase') {
                totalQty += baseQty;
                totalCostValue += baseQty * line.unitPrice;
              } else if (inv.type === 'purchase_return') {
                totalQty -= baseQty;
                totalCostValue -= baseQty * line.unitPrice;
              }
            }
          });
        });

        const newAvg = totalQty > 0 ? Math.round((totalCostValue / totalQty) * 100) / 100 : item.costPrice;
        logs.push(`تم تحديث متوسط تكلفة [${item.name}]: من ${item.averageCost || item.costPrice} إلى ${newAvg} ج.م`);
        count++;

        return {
          ...item,
          averageCost: newAvg
        };
      });
    });

    return { updatedCount: count, details: logs };
  };

  // Warehouse Transfer: transfer stock at current cost price
  const addWarehouseTransfer = (transfer: Omit<WarehouseTransfer, 'id' | 'code'>) => {
    const code = `TRN-${new Date().getFullYear()}-${String(transfers.length + 1).padStart(3, '0')}`;
    const newTransfer: WarehouseTransfer = {
      ...transfer,
      id: 'wt-' + Date.now(),
      code
    };

    // Update item stock between warehouses
    setItems(prev => {
      return prev.map(item => {
        if (item.id === transfer.itemId) {
          const baseQty = transfer.quantity; // in base units
          const currentStocks = { ...(item.stockByWarehouse || {}) };
          const fromStock = (currentStocks[transfer.fromWarehouseId] || 0) - baseQty;
          const toStock = (currentStocks[transfer.toWarehouseId] || 0) + baseQty;
          return {
            ...item,
            stockByWarehouse: {
              ...currentStocks,
              [transfer.fromWarehouseId]: Math.max(0, fromStock),
              [transfer.toWarehouseId]: toStock
            }
          };
        }
        return item;
      });
    });

    setTransfers(prev => [newTransfer, ...prev]);
  };

  // Geography: Countries, Governorates, Cities
  const addCountry = (country: Omit<Country, 'id'>) => {
    const newCountry: Country = { ...country, id: 'c-' + Date.now() };
    setCountries(prev => [...prev, newCountry]);
  };

  const updateCountry = (id: string, country: Partial<Country>) => {
    setCountries(prev => prev.map(c => c.id === id ? { ...c, ...country } : c));
  };

  const deleteCountry = (id: string) => {
    setCountries(prev => prev.filter(c => c.id !== id));
  };

  const addGovernorate = (gov: Omit<Governorate, 'id'>) => {
    const newGov: Governorate = { ...gov, id: 'g-' + Date.now() };
    setGovernorates(prev => [...prev, newGov]);
  };

  const updateGovernorate = (id: string, gov: Partial<Governorate>) => {
    setGovernorates(prev => prev.map(g => g.id === id ? { ...g, ...gov } : g));
  };

  const deleteGovernorate = (id: string) => {
    setGovernorates(prev => prev.filter(g => g.id !== id));
  };

  const addCity = (city: Omit<City, 'id'>) => {
    const newCity: City = { ...city, id: 'ct-' + Date.now() };
    setCities(prev => [...prev, newCity]);
  };

  const updateCity = (id: string, city: Partial<City>) => {
    setCities(prev => prev.map(c => c.id === id ? { ...c, ...city } : c));
  };

  const deleteCity = (id: string) => {
    setCities(prev => prev.filter(c => c.id !== id));
  };

  // Customers
  const addCustomer = (cust: Omit<Customer, 'id' | 'currentBalance'>) => {
    const newCustomer: Customer = {
      ...cust,
      id: 'cust-' + Date.now(),
      currentBalance: cust.openingBalanceType === 'debit' ? cust.openingBalance : -cust.openingBalance
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, cust: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...cust } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Suppliers
  const addSupplier = (sup: Omit<Supplier, 'id' | 'currentBalance'>) => {
    const newSupplier: Supplier = {
      ...sup,
      id: 'sup-' + Date.now(),
      currentBalance: sup.openingBalanceType === 'credit' ? sup.openingBalance : -sup.openingBalance
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, sup: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...sup } : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // Sales Invoices & Sales Returns
  const addSalesInvoice = (inv: Omit<SalesInvoice, 'id' | 'code'>) => {
    const prefix = inv.type === 'sale' ? 'INV' : 'RET-INV';
    const code = `${prefix}-${new Date().getFullYear()}-${String(salesInvoices.length + 1).padStart(3, '0')}`;
    const newInv: SalesInvoice = {
      ...inv,
      id: 'sinv-' + Date.now(),
      code
    };

    // Update customer balance: for sale: + remainingAmount (debit). For return: - remainingAmount
    setCustomers(prev => prev.map(cust => {
      if (cust.id === inv.customerId) {
        const delta = inv.type === 'sale' ? inv.remainingAmount : -inv.remainingAmount;
        return { ...cust, currentBalance: cust.currentBalance + delta };
      }
      return cust;
    }));

    // Deduct / restore stock in warehouse
    setItems(prev => prev.map(item => {
      const line = inv.items.find(l => l.itemId === item.id);
      if (line) {
        const baseQty = line.quantity * (line.conversionFactor || 1);
        const currentWhStock = (item.stockByWarehouse?.[inv.warehouseId] || 0);
        const newStock = inv.type === 'sale' 
          ? Math.max(0, currentWhStock - baseQty) 
          : currentWhStock + baseQty;
        return {
          ...item,
          stockByWarehouse: {
            ...item.stockByWarehouse,
            [inv.warehouseId]: newStock
          }
        };
      }
      return item;
    }));

    // If paid amount > 0, update treasury balance
    if (inv.paidAmount > 0 && inv.treasuryId) {
      setTreasuries(prev => prev.map(tr => {
        if (tr.id === inv.treasuryId) {
          const delta = inv.type === 'sale' ? inv.paidAmount : -inv.paidAmount;
          return { ...tr, balance: tr.balance + delta };
        }
        return tr;
      }));
    }

    setSalesInvoices(prev => [newInv, ...prev]);
    return newInv;
  };

  const updateSalesInvoice = (id: string, inv: Partial<SalesInvoice>) => {
    setSalesInvoices(prev => prev.map(item => item.id === id ? { ...item, ...inv } : item));
  };

  const deleteSalesInvoice = (id: string) => {
    setSalesInvoices(prev => prev.filter(item => item.id !== id));
  };

  // Purchase Invoices & Purchase Returns
  const addPurchaseInvoice = (inv: Omit<PurchaseInvoice, 'id' | 'code'>) => {
    const prefix = inv.type === 'purchase' ? 'PUR' : 'RET-PUR';
    const code = `${prefix}-${new Date().getFullYear()}-${String(purchaseInvoices.length + 1).padStart(3, '0')}`;
    const newInv: PurchaseInvoice = {
      ...inv,
      id: 'pinv-' + Date.now(),
      code
    };

    // Update supplier balance: for purchase: + remainingAmount (credit). For return: - remainingAmount
    setSuppliers(prev => prev.map(sup => {
      if (sup.id === inv.supplierId) {
        const delta = inv.type === 'purchase' ? inv.remainingAmount : -inv.remainingAmount;
        return { ...sup, currentBalance: sup.currentBalance + delta };
      }
      return sup;
    }));

    // Add / deduct stock in warehouse
    setItems(prev => prev.map(item => {
      const line = inv.items.find(l => l.itemId === item.id);
      if (line) {
        const baseQty = line.quantity * (line.conversionFactor || 1);
        const currentWhStock = (item.stockByWarehouse?.[inv.warehouseId] || 0);
        const newStock = inv.type === 'purchase' 
          ? currentWhStock + baseQty 
          : Math.max(0, currentWhStock - baseQty);
        return {
          ...item,
          stockByWarehouse: {
            ...item.stockByWarehouse,
            [inv.warehouseId]: newStock
          }
        };
      }
      return item;
    }));

    // If paid amount > 0, deduct from treasury
    if (inv.paidAmount > 0 && inv.treasuryId) {
      setTreasuries(prev => prev.map(tr => {
        if (tr.id === inv.treasuryId) {
          const delta = inv.type === 'purchase' ? -inv.paidAmount : inv.paidAmount;
          return { ...tr, balance: tr.balance + delta };
        }
        return tr;
      }));
    }

    setPurchaseInvoices(prev => [newInv, ...prev]);
    return newInv;
  };

  const updatePurchaseInvoice = (id: string, inv: Partial<PurchaseInvoice>) => {
    setPurchaseInvoices(prev => prev.map(item => item.id === id ? { ...item, ...inv } : item));
  };

  const deletePurchaseInvoice = (id: string) => {
    setPurchaseInvoices(prev => prev.filter(item => item.id !== id));
  };

  // Receipt Vouchers (سند قبض) - can receive from ANY account
  const addReceiptVoucher = (v: Omit<ReceiptVoucher, 'id' | 'code'>) => {
    const code = `RCV-${new Date().getFullYear()}-${String(receiptVouchers.length + 1).padStart(3, '0')}`;
    const newV: ReceiptVoucher = {
      ...v,
      id: 'rec-' + Date.now(),
      code
    };

    // Add to treasury balance
    setTreasuries(prev => prev.map(tr => {
      if (tr.id === v.treasuryId) {
        return { ...tr, balance: tr.balance + v.amount };
      }
      return tr;
    }));

    // Impact on account:
    if (v.accountType === 'customer') {
      setCustomers(prev => prev.map(c => c.id === v.accountId ? { ...c, currentBalance: c.currentBalance - v.amount } : c));
    } else if (v.accountType === 'supplier') {
      setSuppliers(prev => prev.map(s => s.id === v.accountId ? { ...s, currentBalance: s.currentBalance - v.amount } : s));
    } else if (v.accountType === 'partner_current' || v.accountType === 'partner') {
      // Partner deposited money -> increases his balance
      setPartnerCurrentAccounts(prev => prev.map(pca => {
        if (pca.partnerId === v.accountId || pca.id === v.accountId) {
          return {
            ...pca,
            currentBalance: pca.currentBalance + v.amount,
            movements: [
              {
                id: 'pcm-' + Date.now(),
                date: v.date,
                type: 'deposit',
                amount: v.amount,
                description: `سند قبض ${code}: ${v.notes || 'إيداع نقدي'}`,
                treasuryId: v.treasuryId,
                treasuryName: v.treasuryName
              },
              ...pca.movements
            ]
          };
        }
        return pca;
      }));
    }

    setReceiptVouchers(prev => [newV, ...prev]);
    return newV;
  };

  const updateReceiptVoucher = (id: string, v: Partial<ReceiptVoucher>) => {
    setReceiptVouchers(prev => prev.map(item => item.id === id ? { ...item, ...v } : item));
  };

  const deleteReceiptVoucher = (id: string) => {
    setReceiptVouchers(prev => prev.filter(item => item.id !== id));
  };

  // Payment Vouchers (سند دفع / صرف) - can pay to ANY account
  const addPaymentVoucher = (v: Omit<PaymentVoucher, 'id' | 'code'>) => {
    const code = `PAY-${new Date().getFullYear()}-${String(paymentVouchers.length + 1).padStart(3, '0')}`;
    const newV: PaymentVoucher = {
      ...v,
      id: 'pay-' + Date.now(),
      code
    };

    // Deduct from treasury balance
    setTreasuries(prev => prev.map(tr => {
      if (tr.id === v.treasuryId) {
        return { ...tr, balance: tr.balance - v.amount };
      }
      return tr;
    }));

    // Impact on account:
    if (v.accountType === 'supplier') {
      setSuppliers(prev => prev.map(s => s.id === v.accountId ? { ...s, currentBalance: s.currentBalance - v.amount } : s));
    } else if (v.accountType === 'customer') {
      setCustomers(prev => prev.map(c => c.id === v.accountId ? { ...c, currentBalance: c.currentBalance + v.amount } : c));
    } else if (v.accountType === 'partner_current' || v.accountType === 'partner') {
      // Partner withdrew money -> decreases his balance
      setPartnerCurrentAccounts(prev => prev.map(pca => {
        if (pca.partnerId === v.accountId || pca.id === v.accountId) {
          return {
            ...pca,
            currentBalance: pca.currentBalance - v.amount,
            movements: [
              {
                id: 'pcm-' + Date.now(),
                date: v.date,
                type: 'withdrawal',
                amount: v.amount,
                description: `سند دفع ${code}: ${v.notes || 'مسحوبات شريك'}`,
                treasuryId: v.treasuryId,
                treasuryName: v.treasuryName
              },
              ...pca.movements
            ]
          };
        }
        return pca;
      }));
    }

    setPaymentVouchers(prev => [newV, ...prev]);
    return newV;
  };

  const updatePaymentVoucher = (id: string, v: Partial<PaymentVoucher>) => {
    setPaymentVouchers(prev => prev.map(item => item.id === id ? { ...item, ...v } : item));
  };

  const deletePaymentVoucher = (id: string) => {
    setPaymentVouchers(prev => prev.filter(item => item.id !== id));
  };

  // Treasuries & Transfers
  const addTreasury = (t: Omit<Treasury, 'id'>) => {
    const newT: Treasury = { ...t, id: 'tr-' + Date.now() };
    setTreasuries(prev => [...prev, newT]);
  };

  const updateTreasury = (id: string, t: Partial<Treasury>) => {
    setTreasuries(prev => prev.map(item => item.id === id ? { ...item, ...t } : item));
  };

  const deleteTreasury = (id: string) => {
    setTreasuries(prev => prev.filter(item => item.id !== id));
  };

  const addTreasuryTransfer = (t: Omit<TreasuryTransfer, 'id' | 'code'>) => {
    const code = `TRF-${new Date().getFullYear()}-${String(treasuryTransfers.length + 1).padStart(3, '0')}`;
    const newTrf: TreasuryTransfer = {
      ...t,
      id: 'tt-' + Date.now(),
      code
    };

    setTreasuries(prev => prev.map(tr => {
      if (tr.id === t.fromTreasuryId) {
        return { ...tr, balance: tr.balance - t.amount };
      }
      if (tr.id === t.toTreasuryId) {
        return { ...tr, balance: tr.balance + t.amount };
      }
      return tr;
    }));

    setTreasuryTransfers(prev => [newTrf, ...prev]);
  };

  // Expenses
  const addExpenseCategory = (cat: Omit<ExpenseCategory, 'id'>) => {
    const newCat: ExpenseCategory = { ...cat, id: 'exp-c-' + Date.now() };
    setExpenseCategories(prev => [...prev, newCat]);
  };

  const updateExpenseCategory = (id: string, cat: Partial<ExpenseCategory>) => {
    setExpenseCategories(prev => prev.map(item => item.id === id ? { ...item, ...cat } : item));
  };

  const deleteExpenseCategory = (id: string) => {
    setExpenseCategories(prev => prev.filter(item => item.id !== id));
  };

  const addExpenseTransaction = (t: Omit<ExpenseTransaction, 'id' | 'code'>) => {
    const code = `EXP-${new Date().getFullYear()}-${String(expenseTransactions.length + 1).padStart(3, '0')}`;
    const newExp: ExpenseTransaction = { ...t, id: 'et-' + Date.now(), code };
    
    // Deduct from treasury
    setTreasuries(prev => prev.map(tr => tr.id === t.treasuryId ? { ...tr, balance: tr.balance - t.amount } : tr));
    setExpenseTransactions(prev => [newExp, ...prev]);
  };

  // Revenues
  const addRevenueCategory = (cat: Omit<RevenueCategory, 'id'>) => {
    const newCat: RevenueCategory = { ...cat, id: 'rev-c-' + Date.now() };
    setRevenueCategories(prev => [...prev, newCat]);
  };

  const updateRevenueCategory = (id: string, cat: Partial<RevenueCategory>) => {
    setRevenueCategories(prev => prev.map(item => item.id === id ? { ...item, ...cat } : item));
  };

  const deleteRevenueCategory = (id: string) => {
    setRevenueCategories(prev => prev.filter(item => item.id !== id));
  };

  const addRevenueTransaction = (t: Omit<RevenueTransaction, 'id' | 'code'>) => {
    const code = `REV-${new Date().getFullYear()}-${String(revenueTransactions.length + 1).padStart(3, '0')}`;
    const newRev: RevenueTransaction = { ...t, id: 'rt-' + Date.now(), code };
    
    // Add to treasury
    setTreasuries(prev => prev.map(tr => tr.id === t.treasuryId ? { ...tr, balance: tr.balance + t.amount } : tr));
    setRevenueTransactions(prev => [newRev, ...prev]);
  };

  // PARTNERS & PARTNER CURRENT ACCOUNTS
  // Mandatory requirement:
  // "وعند الاضافة يتم اضافه اسم الشريك الي جاري الشركاء وكذلك عند التعديل علي اسم الشريك يتم تعديله في جاري الشركاء"
  const addPartner = (partnerData: Omit<Partner, 'id'>) => {
    const partnerId = 'prt-' + Date.now();
    const newPartner: Partner = {
      ...partnerData,
      id: partnerId
    };

    // Automatically create partner current account
    const newCurrentAccount: PartnerCurrentAccount = {
      id: 'pca-' + Date.now(),
      partnerId: partnerId,
      partnerName: partnerData.name,
      currentBalance: 0,
      movements: [
        {
          id: 'pcm-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          type: 'capital_adjustment',
          amount: partnerData.capital,
          description: `إثبات رأس مال الشريك الافتتاحي (${partnerData.sharePercentage}%)`
        }
      ]
    };

    setPartners(prev => [...prev, newPartner]);
    setPartnerCurrentAccounts(prev => [...prev, newCurrentAccount]);
  };

  const updatePartner = (id: string, partnerData: Partial<Partner>) => {
    setPartners(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...partnerData };
      }
      return p;
    }));

    // If partner name was changed, sync to partnerCurrentAccounts automatically!
    if (partnerData.name) {
      setPartnerCurrentAccounts(prev => prev.map(pca => {
        if (pca.partnerId === id) {
          return { ...pca, partnerName: partnerData.name! };
        }
        return pca;
      }));
    }
  };

  const deletePartner = (id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    setPartnerCurrentAccounts(prev => prev.filter(pca => pca.partnerId !== id));
  };

  const addPartnerMovement = (
    partnerId: string,
    movement: { type: 'deposit' | 'withdrawal' | 'profit_share' | 'capital_adjustment'; amount: number; description: string; treasuryId?: string }
  ) => {
    const treasury = treasuries.find(t => t.id === movement.treasuryId);
    setPartnerCurrentAccounts(prev => prev.map(pca => {
      if (pca.partnerId === partnerId || pca.id === partnerId) {
        let delta = 0;
        if (movement.type === 'deposit' || movement.type === 'profit_share' || movement.type === 'capital_adjustment') {
          delta = movement.amount;
        } else {
          delta = -movement.amount;
        }

        const newMov = {
          id: 'pcm-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          type: movement.type,
          amount: movement.amount,
          description: movement.description,
          treasuryId: movement.treasuryId,
          treasuryName: treasury?.name
        };

        return {
          ...pca,
          currentBalance: pca.currentBalance + delta,
          movements: [newMov, ...pca.movements]
        };
      }
      return pca;
    }));

    // If treasury involved, update balance
    if (movement.treasuryId) {
      setTreasuries(prev => prev.map(tr => {
        if (tr.id === movement.treasuryId) {
          const delta = movement.type === 'deposit' ? movement.amount : -movement.amount;
          return { ...tr, balance: tr.balance + delta };
        }
        return tr;
      }));
    }
  };

  // Users & Permissions
  const addUser = (u: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = { ...u, id: 'usr-' + Date.now() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, u: Partial<SystemUser>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...u } : user));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...u }));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // Account selector helper
  const getAccountOptions = (type: AccountType): Array<{ id: string; name: string }> => {
    switch (type) {
      case 'customer':
        return customers.map(c => ({ id: c.id, name: `${c.name} (${c.code})` }));
      case 'supplier':
        return suppliers.map(s => ({ id: s.id, name: `${s.name} (${s.code})` }));
      case 'expense':
        return expenseCategories.map(e => ({ id: e.id, name: `${e.name} (${e.code})` }));
      case 'revenue':
        return revenueCategories.map(r => ({ id: r.id, name: `${r.name} (${r.code})` }));
      case 'partner':
      case 'partner_current':
        return partners.map(p => ({ id: p.id, name: `الشريك: ${p.name} (نسبة ${p.sharePercentage}%)` }));
      case 'employee':
        return [
          { id: 'emp-1', name: 'م. أحمد الشريف (مدير المستودع)' },
          { id: 'emp-2', name: 'أ. خالد محي الدين (أمين الخزينة)' },
          { id: 'emp-3', name: 'أ. طارق السعيد (مندوب مبيعات)' },
          { id: 'emp-4', name: 'أ. سارة مجدي (كاشير المعرض)' }
        ];
      default:
        return [];
    }
  };

  // Database Backup / Reset
  const resetToDefaultData = () => {
    setCompanySettings(initialCompanySettings);
    setWarehouses(initialWarehouses);
    setUnits(initialUnits);
    setItems(initialItems);
    setTransfers(initialWarehouseTransfers);
    setCountries(initialCountries);
    setGovernorates(initialGovernorates);
    setCities(initialCities);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setSalesInvoices(initialSalesInvoices);
    setPurchaseInvoices(initialPurchaseInvoices);
    setReceiptVouchers(initialReceiptVouchers);
    setPaymentVouchers(initialPaymentVouchers);
    setTreasuries(initialTreasuries);
    setTreasuryTransfers([]);
    setExpenseCategories(initialExpenseCategories);
    setExpenseTransactions(initialExpenseTransactions);
    setRevenueCategories(initialRevenueCategories);
    setRevenueTransactions(initialRevenueTransactions);
    setPartners(initialPartners);
    setPartnerCurrentAccounts(initialPartnerCurrentAccounts);
    setUsers(initialUsers);
    localStorage.clear();
  };

  const exportDatabaseJSON = () => {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      companySettings,
      warehouses,
      units,
      items,
      transfers,
      countries,
      governorates,
      cities,
      customers,
      suppliers,
      salesInvoices,
      purchaseInvoices,
      receiptVouchers,
      paymentVouchers,
      treasuries,
      treasuryTransfers,
      expenseCategories,
      expenseTransactions,
      revenueCategories,
      revenueTransactions,
      partners,
      partnerCurrentAccounts,
      users
    };
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.companySettings) setCompanySettings(data.companySettings);
      if (data.warehouses) setWarehouses(data.warehouses);
      if (data.units) setUnits(data.units);
      if (data.items) setItems(data.items);
      if (data.transfers) setTransfers(data.transfers);
      if (data.countries) setCountries(data.countries);
      if (data.governorates) setGovernorates(data.governorates);
      if (data.cities) setCities(data.cities);
      if (data.customers) setCustomers(data.customers);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.salesInvoices) setSalesInvoices(data.salesInvoices);
      if (data.purchaseInvoices) setPurchaseInvoices(data.purchaseInvoices);
      if (data.receiptVouchers) setReceiptVouchers(data.receiptVouchers);
      if (data.paymentVouchers) setPaymentVouchers(data.paymentVouchers);
      if (data.treasuries) setTreasuries(data.treasuries);
      if (data.treasuryTransfers) setTreasuryTransfers(data.treasuryTransfers);
      if (data.expenseCategories) setExpenseCategories(data.expenseCategories);
      if (data.expenseTransactions) setExpenseTransactions(data.expenseTransactions);
      if (data.revenueCategories) setRevenueCategories(data.revenueCategories);
      if (data.revenueTransactions) setRevenueTransactions(data.revenueTransactions);
      if (data.partners) setPartners(data.partners);
      if (data.partnerCurrentAccounts) setPartnerCurrentAccounts(data.partnerCurrentAccounts);
      if (data.users) setUsers(data.users);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ERPContext.Provider
      value={{
        companySettings,
        updateCompanySettings,
        warehouses,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        units,
        addUnit,
        updateUnit,
        deleteUnit,
        items,
        addItem,
        updateItem,
        deleteItem,
        recalculateAverageCost,
        transfers,
        addWarehouseTransfer,
        countries,
        addCountry,
        updateCountry,
        deleteCountry,
        governorates,
        addGovernorate,
        updateGovernorate,
        deleteGovernorate,
        cities,
        addCity,
        updateCity,
        deleteCity,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        salesInvoices,
        addSalesInvoice,
        updateSalesInvoice,
        deleteSalesInvoice,
        purchaseInvoices,
        addPurchaseInvoice,
        updatePurchaseInvoice,
        deletePurchaseInvoice,
        receiptVouchers,
        addReceiptVoucher,
        updateReceiptVoucher,
        deleteReceiptVoucher,
        paymentVouchers,
        addPaymentVoucher,
        updatePaymentVoucher,
        deletePaymentVoucher,
        treasuries,
        addTreasury,
        updateTreasury,
        deleteTreasury,
        treasuryTransfers,
        addTreasuryTransfer,
        expenseCategories,
        addExpenseCategory,
        updateExpenseCategory,
        deleteExpenseCategory,
        expenseTransactions,
        addExpenseTransaction,
        revenueCategories,
        addRevenueCategory,
        updateRevenueCategory,
        deleteRevenueCategory,
        revenueTransactions,
        addRevenueTransaction,
        partners,
        addPartner,
        updatePartner,
        deletePartner,
        partnerCurrentAccounts,
        addPartnerMovement,
        users,
        currentUser,
        setCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        resetToDefaultData,
        exportDatabaseJSON,
        importDatabaseJSON,
        getAccountOptions
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
