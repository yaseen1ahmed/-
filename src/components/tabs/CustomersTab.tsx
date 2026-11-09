import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  FileText, 
  RotateCcw, 
  ArrowDownLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Printer, 
  Search, 
  Globe2, 
  Building,
  Phone,
  Mail,
  Receipt
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { 
  Customer, 
  Country, 
  Governorate, 
  City, 
  SalesInvoice, 
  ReceiptVoucher, 
  InvoiceItem,
  AccountType,
  PaymentMethod
} from '../../types/erp';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { PrintViewModal } from '../common/PrintViewModal';

type SubTab = 'customers' | 'geo' | 'sales_invoices' | 'sales_returns' | 'receipt_vouchers';

export const CustomersTab: React.FC = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
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
    salesInvoices,
    addSalesInvoice,
    updateSalesInvoice,
    deleteSalesInvoice,
    receiptVouchers,
    addReceiptVoucher,
    updateReceiptVoucher,
    deleteReceiptVoucher,
    items,
    warehouses,
    treasuries,
    getAccountOptions
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('customers');
  const [searchTerm, setSearchTerm] = useState('');

  // Print Modal
  const [printableDoc, setPrintableDoc] = useState<{
    kind: 'sales_invoice' | 'receipt_voucher';
    data: any;
  } | null>(null);

  // --- Modals State ---
  // Customer Modal
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState<{
    code: string;
    name: string;
    delegateName: string;
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
    openingBalanceType: 'debit' | 'credit';
    openingBalance: number;
    notes: string;
  }>({
    code: '',
    name: '',
    delegateName: '',
    responsiblePerson: '',
    responsiblePhone: '',
    email: '',
    fax: '',
    phone1: '',
    phone2: '',
    addressDetails: '',
    cityId: '',
    cityName: '',
    governorateName: '',
    countryName: '',
    openingBalanceType: 'debit',
    openingBalance: 0,
    notes: ''
  });

  // Country Modal
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [countryForm, setCountryForm] = useState({ code: '', name: '' });

  // Governorate Modal
  const [isGovModalOpen, setIsGovModalOpen] = useState(false);
  const [editingGov, setEditingGov] = useState<Governorate | null>(null);
  const [govForm, setGovForm] = useState({ code: '', name: '', countryId: '' });

  // City Modal
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [cityForm, setCityForm] = useState({ code: '', name: '', governorateId: '' });

  // Sales Invoice Modal (Sales / Return)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'sale' | 'sale_return'>('sale');
  const [editingInvoice, setEditingInvoice] = useState<SalesInvoice | null>(null);
  const [invoiceForm, setInvoiceForm] = useState<{
    date: string;
    customerId: string;
    warehouseId: string;
    items: InvoiceItem[];
    paymentMethod: PaymentMethod;
    treasuryId: string;
    paidAmount: number;
    notes: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    warehouseId: '',
    items: [],
    paymentMethod: 'cash',
    treasuryId: '',
    paidAmount: 0,
    notes: ''
  });

  // Receipt Voucher Modal
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<ReceiptVoucher | null>(null);
  const [receiptForm, setReceiptForm] = useState<{
    date: string;
    accountType: AccountType;
    accountId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    treasuryId: string;
    receivedBy: string;
    notes: string;
    referenceDoc: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    accountType: 'customer',
    accountId: '',
    amount: 0,
    paymentMethod: 'cash',
    treasuryId: treasuries[0]?.id || '',
    receivedBy: '',
    notes: '',
    referenceDoc: ''
  });

  // Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'customer' | 'invoice' | 'receipt' | 'country' | 'gov' | 'city';
    id: string;
    name: string;
  }>({
    isOpen: false,
    type: 'customer',
    id: '',
    name: ''
  });

  // --- Handlers: Customers ---
  const handleOpenCustomerModal = (cust?: Customer) => {
    if (cust) {
      setEditingCustomer(cust);
      setCustomerForm({
        code: cust.code,
        name: cust.name,
        delegateName: cust.delegateName,
        responsiblePerson: cust.responsiblePerson,
        responsiblePhone: cust.responsiblePhone,
        email: cust.email,
        fax: cust.fax,
        phone1: cust.phone1,
        phone2: cust.phone2,
        addressDetails: cust.addressDetails,
        cityId: cust.cityId,
        cityName: cust.cityName,
        governorateName: cust.governorateName,
        countryName: cust.countryName,
        openingBalanceType: cust.openingBalanceType,
        openingBalance: cust.openingBalance,
        notes: cust.notes || ''
      });
    } else {
      setEditingCustomer(null);
      const defaultCity = cities[0];
      setCustomerForm({
        code: `CUST-00${customers.length + 1}`,
        name: '',
        delegateName: '',
        responsiblePerson: '',
        responsiblePhone: '',
        email: '',
        fax: '',
        phone1: '',
        phone2: '',
        addressDetails: '',
        cityId: defaultCity ? defaultCity.id : '',
        cityName: defaultCity ? defaultCity.name : '',
        governorateName: defaultCity ? defaultCity.governorateName : '',
        countryName: defaultCity ? defaultCity.countryName : '',
        openingBalanceType: 'debit',
        openingBalance: 0,
        notes: ''
      });
    }
    setIsCustomerModalOpen(true);
  };

  // Requirement: "عند اختيار المدينة يتم جلب اسم المحافظة و الدولة المرتبطه بالمدينة"
  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find(c => c.id === cityId);
    if (selectedCity) {
      setCustomerForm(prev => ({
        ...prev,
        cityId: selectedCity.id,
        cityName: selectedCity.name,
        governorateName: selectedCity.governorateName,
        countryName: selectedCity.countryName
      }));
    }
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.code || !customerForm.name) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerForm);
    } else {
      addCustomer(customerForm);
    }
    setIsCustomerModalOpen(false);
  };

  // --- Handlers: Invoices (Sales / Sales Return) ---
  const handleOpenInvoiceModal = (type: 'sale' | 'sale_return', inv?: SalesInvoice) => {
    setInvoiceType(type);
    if (inv) {
      setEditingInvoice(inv);
      setInvoiceForm({
        date: inv.date,
        customerId: inv.customerId,
        warehouseId: inv.warehouseId,
        items: [...inv.items],
        paymentMethod: inv.paymentMethod,
        treasuryId: inv.treasuryId || treasuries[0]?.id || '',
        paidAmount: inv.paidAmount,
        notes: inv.notes || ''
      });
    } else {
      setEditingInvoice(null);
      const defaultItem = items[0];
      const initialLine: InvoiceItem = defaultItem ? {
        id: 'item-line-' + Date.now(),
        itemId: defaultItem.id,
        itemCode: defaultItem.code,
        itemName: defaultItem.name,
        unitId: defaultItem.baseUnitId,
        unitName: defaultItem.baseUnitName,
        conversionFactor: 1,
        quantity: 1,
        unitPrice: defaultItem.salePrice,
        discount: 0,
        taxRate: 14,
        total: Math.round(defaultItem.salePrice * 1.14)
      } : {
        id: 'item-line-1',
        itemId: '',
        itemCode: '',
        itemName: '',
        unitId: '',
        unitName: '',
        conversionFactor: 1,
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 14,
        total: 0
      };

      setInvoiceForm({
        date: new Date().toISOString().split('T')[0],
        customerId: customers[0]?.id || '',
        warehouseId: warehouses[0]?.id || '',
        items: defaultItem ? [initialLine] : [],
        paymentMethod: 'cash',
        treasuryId: treasuries[0]?.id || '',
        paidAmount: defaultItem ? Math.round(defaultItem.salePrice * 1.14) : 0,
        notes: ''
      });
    }
    setIsInvoiceModalOpen(true);
  };

  const handleAddItemToInvoice = () => {
    const defaultItem = items[0];
    if (!defaultItem) return;
    const newLine: InvoiceItem = {
      id: 'line-' + Date.now() + Math.random(),
      itemId: defaultItem.id,
      itemCode: defaultItem.code,
      itemName: defaultItem.name,
      unitId: defaultItem.baseUnitId,
      unitName: defaultItem.baseUnitName,
      conversionFactor: 1,
      quantity: 1,
      unitPrice: defaultItem.salePrice,
      discount: 0,
      taxRate: 14,
      total: Math.round(defaultItem.salePrice * 1.14)
    };
    setInvoiceForm(prev => ({ ...prev, items: [...prev.items, newLine] }));
  };

  const handleRemoveInvoiceItem = (id: string) => {
    setInvoiceForm(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const handleInvoiceItemChange = (
    id: string,
    field: 'itemId' | 'unitId' | 'quantity' | 'unitPrice' | 'discount' | 'taxRate',
    val: any
  ) => {
    setInvoiceForm(prev => {
      const updated = prev.items.map(line => {
        if (line.id !== id) return line;

        const next = { ...line };
        if (field === 'itemId') {
          const item = items.find(i => i.id === val);
          if (item) {
            next.itemId = item.id;
            next.itemCode = item.code;
            next.itemName = item.name;
            next.unitId = item.baseUnitId;
            next.unitName = item.baseUnitName;
            next.conversionFactor = 1;
            next.unitPrice = item.salePrice;
          }
        } else if (field === 'unitId') {
          const item = items.find(i => i.id === next.itemId);
          if (item) {
            if (val === item.baseUnitId) {
              next.unitId = item.baseUnitId;
              next.unitName = item.baseUnitName;
              next.conversionFactor = 1;
              next.unitPrice = item.salePrice;
            } else {
              const au = item.additionalUnits.find(u => u.unitId === val);
              if (au) {
                next.unitId = au.unitId;
                next.unitName = au.unitName;
                next.conversionFactor = au.conversionFactor;
                next.unitPrice = au.salePrice;
              }
            }
          }
        } else if (field === 'quantity') {
          next.quantity = Math.max(1, Number(val));
        } else if (field === 'unitPrice') {
          next.unitPrice = Number(val);
        } else if (field === 'discount') {
          next.discount = Number(val);
        } else if (field === 'taxRate') {
          next.taxRate = Number(val);
        }

        const baseTotal = (next.quantity * next.unitPrice) - (next.discount || 0);
        const taxVal = baseTotal * (next.taxRate / 100);
        next.total = Math.round((baseTotal + taxVal) * 100) / 100;
        return next;
      });

      return { ...prev, items: updated };
    });
  };

  // Calculate Invoice Totals
  const calculateTotals = () => {
    const subtotal = invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discountTotal = invoiceForm.items.reduce((sum, item) => sum + (item.discount || 0), 0);
    const taxTotal = invoiceForm.items.reduce((sum, item) => {
      const base = (item.quantity * item.unitPrice) - (item.discount || 0);
      return sum + (base * (item.taxRate / 100));
    }, 0);
    const netTotal = Math.round((subtotal - discountTotal + taxTotal) * 100) / 100;
    const remainingAmount = Math.max(0, Math.round((netTotal - invoiceForm.paidAmount) * 100) / 100);

    return { subtotal, discountTotal, taxTotal, netTotal, remainingAmount };
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.customerId || invoiceForm.items.length === 0) {
      alert('يرجى اختيار العميل وإضافة بند واحد على الأقل للفاتورة.');
      return;
    }

    const customer = customers.find(c => c.id === invoiceForm.customerId);
    const warehouse = warehouses.find(w => w.id === invoiceForm.warehouseId);
    const treasury = treasuries.find(t => t.id === invoiceForm.treasuryId);
    const totals = calculateTotals();

    if (editingInvoice) {
      updateSalesInvoice(editingInvoice.id, {
        date: invoiceForm.date,
        customerId: invoiceForm.customerId,
        customerName: customer?.name || '',
        warehouseId: invoiceForm.warehouseId,
        warehouseName: warehouse?.name || '',
        items: invoiceForm.items,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        netTotal: totals.netTotal,
        paidAmount: Number(invoiceForm.paidAmount),
        remainingAmount: totals.remainingAmount,
        paymentMethod: invoiceForm.paymentMethod,
        treasuryId: invoiceForm.treasuryId,
        treasuryName: treasury?.name,
        notes: invoiceForm.notes
      });
    } else {
      const newInv = addSalesInvoice({
        type: invoiceType,
        date: invoiceForm.date,
        customerId: invoiceForm.customerId,
        customerName: customer?.name || '',
        warehouseId: invoiceForm.warehouseId,
        warehouseName: warehouse?.name || '',
        items: invoiceForm.items,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        netTotal: totals.netTotal,
        paidAmount: Number(invoiceForm.paidAmount),
        remainingAmount: totals.remainingAmount,
        paymentMethod: invoiceForm.paymentMethod,
        treasuryId: invoiceForm.treasuryId,
        treasuryName: treasury?.name,
        notes: invoiceForm.notes
      });
      // Offer instant print preview
      setPrintableDoc({ kind: 'sales_invoice', data: newInv });
    }
    setIsInvoiceModalOpen(false);
  };

  // --- Handlers: Receipt Vouchers ---
  // Requirement: "بحيث يمكن القبض من اي حساب سواء عملاء او موردين او مصروفات او ايرادات او موظفين او شركاء او جاري شركاء"
  const handleOpenReceiptModal = (v?: ReceiptVoucher) => {
    if (v) {
      setEditingReceipt(v);
      setReceiptForm({
        date: v.date,
        accountType: v.accountType,
        accountId: v.accountId,
        amount: v.amount,
        paymentMethod: v.paymentMethod,
        treasuryId: v.treasuryId,
        receivedBy: v.receivedBy || '',
        notes: v.notes,
        referenceDoc: v.referenceDoc || ''
      });
    } else {
      setEditingReceipt(null);
      const defaultAccountOptions = getAccountOptions('customer');
      setReceiptForm({
        date: new Date().toISOString().split('T')[0],
        accountType: 'customer',
        accountId: defaultAccountOptions[0]?.id || '',
        amount: 1000,
        paymentMethod: 'cash',
        treasuryId: treasuries[0]?.id || '',
        receivedBy: '',
        notes: '',
        referenceDoc: ''
      });
    }
    setIsReceiptModalOpen(true);
  };

  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptForm.accountId || receiptForm.amount <= 0) return;

    const accountOptions = getAccountOptions(receiptForm.accountType);
    const targetAccount = accountOptions.find(a => a.id === receiptForm.accountId);
    const treasury = treasuries.find(t => t.id === receiptForm.treasuryId);

    const typeNames: Record<AccountType, string> = {
      customer: 'عملاء',
      supplier: 'موردين',
      expense: 'مصروفات (استرداد)',
      revenue: 'إيرادات',
      employee: 'عهد موظفين',
      partner: 'شركاء (إيداع رأس مال)',
      partner_current: 'جاري شركاء (إيداع)'
    };

    if (editingReceipt) {
      updateReceiptVoucher(editingReceipt.id, {
        date: receiptForm.date,
        accountType: receiptForm.accountType,
        accountTypeName: typeNames[receiptForm.accountType],
        accountId: receiptForm.accountId,
        accountName: targetAccount?.name || '',
        amount: Number(receiptForm.amount),
        paymentMethod: receiptForm.paymentMethod,
        treasuryId: receiptForm.treasuryId,
        treasuryName: treasury?.name || '',
        receivedBy: receiptForm.receivedBy,
        notes: receiptForm.notes,
        referenceDoc: receiptForm.referenceDoc
      });
    } else {
      const newV = addReceiptVoucher({
        date: receiptForm.date,
        accountType: receiptForm.accountType,
        accountTypeName: typeNames[receiptForm.accountType],
        accountId: receiptForm.accountId,
        accountName: targetAccount?.name || '',
        amount: Number(receiptForm.amount),
        paymentMethod: receiptForm.paymentMethod,
        treasuryId: receiptForm.treasuryId,
        treasuryName: treasury?.name || '',
        receivedBy: receiptForm.receivedBy,
        notes: receiptForm.notes,
        referenceDoc: receiptForm.referenceDoc
      });
      setPrintableDoc({ kind: 'receipt_voucher', data: newV });
    }
    setIsReceiptModalOpen(false);
  };

  // --- Handlers: Delete Confirm ---
  const confirmDelete = () => {
    if (deleteDialog.type === 'customer') deleteCustomer(deleteDialog.id);
    if (deleteDialog.type === 'invoice') deleteSalesInvoice(deleteDialog.id);
    if (deleteDialog.type === 'receipt') deleteReceiptVoucher(deleteDialog.id);
    if (deleteDialog.type === 'country') deleteCountry(deleteDialog.id);
    if (deleteDialog.type === 'gov') deleteGovernorate(deleteDialog.id);
    if (deleteDialog.type === 'city') deleteCity(deleteDialog.id);
  };

  // Filtered customers
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Sub-tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('customers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'customers'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>دليل العملاء ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sales_invoices')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'sales_invoices'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>فواتير المبيعات ({salesInvoices.filter(i => i.type === 'sale').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sales_returns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'sales_returns'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>مردود المبيعات ({salesInvoices.filter(i => i.type === 'sale_return').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('receipt_vouchers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'receipt_vouchers'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          <span>سندات القبض (كافة الحسابات) ({receiptVouchers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('geo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'geo'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>المناطق (الدول والمحافظات والمدن)</span>
        </button>
      </div>

      {/* SUBTAB 1: CUSTOMERS (دليل العملاء) */}
      {activeSubTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو الكود أو المدينة..."
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => handleOpenCustomerModal()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عميل جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">كود العميل</th>
                    <th className="py-3 px-4">اسم العميل والمندوب</th>
                    <th className="py-3 px-4">الشخص المسئول وهاتفه</th>
                    <th className="py-3 px-4">العنوان والمنطقة</th>
                    <th className="py-3 px-4">وسائل التواصل</th>
                    <th className="py-3 px-4">الرصيد الافتتاحي</th>
                    <th className="py-3 px-4">الرصيد الحالي</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{cust.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{cust.name}</div>
                        {cust.delegateName && (
                          <div className="text-[11px] text-blue-600 font-medium">مندوب: {cust.delegateName}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{cust.responsiblePerson || '-'}</div>
                        <div className="text-xs font-mono text-slate-500">{cust.responsiblePhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-700">{cust.cityName} - {cust.governorateName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{cust.addressDetails}</div>
                      </td>
                      <td className="py-3 px-4 text-xs space-y-0.5">
                        {cust.phone1 && <div className="font-mono text-slate-700">📞 {cust.phone1}</div>}
                        {cust.email && <div className="text-slate-500 truncate max-w-[150px]">✉️ {cust.email}</div>}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-slate-700">{new Intl.NumberFormat('ar-EG').format(cust.openingBalance)} ج.م</span>
                        <span className="text-[10px] text-slate-400 block">{cust.openingBalanceType === 'debit' ? 'مدين (عليه)' : 'دائن (له)'}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className={`font-black ${cust.currentBalance > 0 ? 'text-rose-600' : cust.currentBalance < 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                          {new Intl.NumberFormat('ar-EG').format(Math.abs(cust.currentBalance))} ج.م
                        </span>
                        <span className="text-[10px] block font-semibold text-slate-500">
                          {cust.currentBalance > 0 ? 'مدين (مستحق عليه)' : cust.currentBalance < 0 ? 'دائن (له رصيد)' : 'متزن'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenCustomerModal(cust)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="تعديل بيانات العميل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, type: 'customer', id: cust.id, name: cust.name })}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="حذف العميل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SALES INVOICES & SALES RETURNS */}
      {(activeSubTab === 'sales_invoices' || activeSubTab === 'sales_returns') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">
                {activeSubTab === 'sales_invoices' ? 'فواتير المبيعات' : 'فواتير مردود المبيعات'}
              </h3>
              <p className="text-xs text-slate-500">إضافة وتعديل وحذف وطباعة وتصدير PDF مع تحديث المخزن والأرصدة فورياً</p>
            </div>

            <button
              onClick={() => handleOpenInvoiceModal(activeSubTab === 'sales_invoices' ? 'sale' : 'sale_return')}
              className={`flex items-center gap-2 px-4 py-2.5 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer ${
                activeSubTab === 'sales_invoices' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{activeSubTab === 'sales_invoices' ? 'إنشاء فاتورة مبيعات جديدة' : 'إنشاء فاتورة مردود مبيعات'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">رقم الفاتورة</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">العميل</th>
                    <th className="py-3 px-4">المستودع المصدر</th>
                    <th className="py-3 px-4">عدد الأصناف</th>
                    <th className="py-3 px-4">الصافي النهائي</th>
                    <th className="py-3 px-4">المسدد</th>
                    <th className="py-3 px-4">المتبقي الآجل</th>
                    <th className="py-3 px-4 text-center">إجراءات وطباعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesInvoices
                    .filter(inv => inv.type === (activeSubTab === 'sales_invoices' ? 'sale' : 'sale_return'))
                    .map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{inv.code}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{inv.date}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{inv.customerName}</td>
                        <td className="py-3 px-4 text-slate-600">{inv.warehouseName}</td>
                        <td className="py-3 px-4 font-mono">{inv.items.length} بنود</td>
                        <td className="py-3 px-4 font-mono font-black text-slate-900">
                          {new Intl.NumberFormat('ar-EG').format(inv.netTotal)} ج.م
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                          {new Intl.NumberFormat('ar-EG').format(inv.paidAmount)} ج.م
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-600">
                          {new Intl.NumberFormat('ar-EG').format(inv.remainingAmount)} ج.م
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setPrintableDoc({ kind: 'sales_invoice', data: inv })}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              title="طباعة وتصدير PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>طباعة / PDF</span>
                            </button>
                            <button
                              onClick={() => handleOpenInvoiceModal(inv.type, inv)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="تعديل"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteDialog({ isOpen: true, type: 'invoice', id: inv.id, name: inv.code })}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: RECEIPT VOUCHERS (سندات القبض من كافة الحسابات) */}
      {activeSubTab === 'receipt_vouchers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">سندات القبض المالي</h3>
              <p className="text-xs text-slate-500">
                إمكانية القبض من أي حساب (عملاء، موردين، مصروفات، إيرادات، موظفين، شركاء، جاري شركاء) مع اختيار طريقة السداد
              </p>
            </div>

            <button
              onClick={() => handleOpenReceiptModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تحرير سند قبض جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">رقم السند</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">نوع الحساب المقبوض منه</th>
                    <th className="py-3 px-4">اسم الحساب / الشخص</th>
                    <th className="py-3 px-4">المبلغ المقبوض</th>
                    <th className="py-3 px-4">طريقة القبض</th>
                    <th className="py-3 px-4">الخزينة / البنك المستلم</th>
                    <th className="py-3 px-4">البيان والملاحظات</th>
                    <th className="py-3 px-4 text-center">إجراءات وطباعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receiptVouchers.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{v.code}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{v.date}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-xs font-semibold">
                          {v.accountTypeName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{v.accountName}</td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-700 text-sm">
                        {new Intl.NumberFormat('ar-EG').format(v.amount)} ج.م
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold">
                        {v.paymentMethod === 'cash' ? '💵 نقداً' : v.paymentMethod === 'bank' ? '🏦 تحويل بنكي' : '📱 محفظة إلكترونية'}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{v.treasuryName}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs truncate max-w-xs">{v.notes || '-'}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setPrintableDoc({ kind: 'receipt_voucher', data: v })}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="طباعة السند"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>طباعة</span>
                          </button>
                          <button
                            onClick={() => handleOpenReceiptModal(v)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="تعديل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, type: 'receipt', id: v.id, name: v.code })}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: GEOGRAPHY (الدول والمحافظات والمدن) */}
      {activeSubTab === 'geo' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Countries */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-600" />
                الدول ({countries.length})
              </h4>
              <button
                onClick={() => {
                  setEditingCountry(null);
                  setCountryForm({ code: `C-0${countries.length + 1}`, name: '' });
                  setIsCountryModalOpen(true);
                }}
                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold"
              >
                + إضافة دولة
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {countries.map(c => (
                <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{c.name}</span>
                    <span className="font-mono text-slate-400 mr-2">({c.code})</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingCountry(c);
                        setCountryForm({ code: c.code, name: c.name });
                        setIsCountryModalOpen(true);
                      }}
                      className="p-1 text-blue-600"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, type: 'country', id: c.id, name: c.name })}
                      className="p-1 text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governorates */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                المحافظات ({governorates.length})
              </h4>
              <button
                onClick={() => {
                  setEditingGov(null);
                  setGovForm({ code: `G-0${governorates.length + 1}`, name: '', countryId: countries[0]?.id || '' });
                  setIsGovModalOpen(true);
                }}
                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold"
              >
                + إضافة محافظة
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {governorates.map(g => (
                <div key={g.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{g.name}</div>
                    <div className="text-[10px] text-slate-400">{g.countryName} ({g.code})</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingGov(g);
                        setGovForm({ code: g.code, name: g.name, countryId: g.countryId });
                        setIsGovModalOpen(true);
                      }}
                      className="p-1 text-blue-600"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, type: 'gov', id: g.id, name: g.name })}
                      className="p-1 text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                المدن والمراكز ({cities.length})
              </h4>
              <button
                onClick={() => {
                  setEditingCity(null);
                  setCityForm({ code: `CT-0${cities.length + 1}`, name: '', governorateId: governorates[0]?.id || '' });
                  setIsCityModalOpen(true);
                }}
                className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold"
              >
                + إضافة مدينة
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {cities.map(ct => (
                <div key={ct.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{ct.name}</div>
                    <div className="text-[10px] text-slate-400">{ct.governorateName} - {ct.countryName}</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingCity(ct);
                        setCityForm({ code: ct.code, name: ct.name, governorateId: ct.governorateId });
                        setIsCityModalOpen(true);
                      }}
                      className="p-1 text-blue-600"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, type: 'city', id: ct.id, name: ct.name })}
                      className="p-1 text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL: CUSTOMER (إضافة / تعديل عميل مع الربط التلقائي للمدينة والمحافظة والدولة) */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title={editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كود العميل *</label>
              <input
                type="text"
                required
                value={customerForm.code}
                onChange={e => setCustomerForm({ ...customerForm, code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم العميل / المؤسسة *</label>
              <input
                type="text"
                required
                value={customerForm.name}
                onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: شركة الأمل للمقاولات والتوريدات"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المندوب</label>
              <input
                type="text"
                value={customerForm.delegateName}
                onChange={e => setCustomerForm({ ...customerForm, delegateName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="اسم مندوب المبيعات التابع له"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الشخص المسئول</label>
              <input
                type="text"
                value={customerForm.responsiblePerson}
                onChange={e => setCustomerForm({ ...customerForm, responsiblePerson: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="المدير أو المشتريات"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم هاتف المسئول</label>
              <input
                type="text"
                value={customerForm.responsiblePhone}
                onChange={e => setCustomerForm({ ...customerForm, responsiblePhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500"
                placeholder="010XXXXXXXX"
              />
            </div>
          </div>

          {/* Communications */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">وسائل التواصل والاتصال</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">رقم الهاتف 1 *</label>
                <input
                  type="text"
                  required
                  value={customerForm.phone1}
                  onChange={e => setCustomerForm({ ...customerForm, phone1: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  placeholder="010XXXXXXXX"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">رقم الهاتف 2</label>
                <input
                  type="text"
                  value={customerForm.phone2}
                  onChange={e => setCustomerForm({ ...customerForm, phone2: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  placeholder="هاتف أرضي أو آخر"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  placeholder="info@example.com"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">الفاكس</label>
                <input
                  type="text"
                  value={customerForm.fax}
                  onChange={e => setCustomerForm({ ...customerForm, fax: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Address with automatic Geo binding */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">العنوان والموقع الجغرافي</span>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                (جلب تلقائي للمحافظة والدولة عند اختيار المدينة)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">المدينة *</label>
                <select
                  value={customerForm.cityId}
                  onChange={e => handleCityChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="">اختر المدينة...</option>
                  {cities.map(ct => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">المحافظة (تلقائي)</label>
                <input
                  type="text"
                  readOnly
                  value={customerForm.governorateName}
                  className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">الدولة (تلقائي)</label>
                <input
                  type="text"
                  readOnly
                  value={customerForm.countryName}
                  className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 block mb-1">العنوان التفصيلي</label>
              <input
                type="text"
                value={customerForm.addressDetails}
                onChange={e => setCustomerForm({ ...customerForm, addressDetails: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                placeholder="الشارع، رقم المبنى، الدور، علامة مميزة"
              />
            </div>
          </div>

          {/* Opening Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نوع الرصيد الافتتاحي</label>
              <select
                value={customerForm.openingBalanceType}
                onChange={e => setCustomerForm({ ...customerForm, openingBalanceType: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="debit">مدين (مستحق على العميل لصالحنا)</option>
                <option value="credit">دائن (رصيد مدفوع مقدماً للعميل لدينا)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">قيمة الرصيد الافتتاحي (ج.م)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={customerForm.openingBalance}
                onChange={e => setCustomerForm({ ...customerForm, openingBalance: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-blue-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ بيانات العميل
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: SALES INVOICE & RETURNS */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title={invoiceType === 'sale' ? 'تحرير فاتورة مبيعات' : 'تحرير فاتورة مردود مبيعات'}
        subtitle="تأثير فوري على أرصدة الأصناف بالمخازن وحساب العميل والخزينة"
        maxWidth="5xl"
      >
        <form onSubmit={handleSaveInvoice} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ *</label>
              <input
                type="date"
                required
                value={invoiceForm.date}
                onChange={e => setInvoiceForm({ ...invoiceForm, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العميل *</label>
              <select
                required
                value={invoiceForm.customerId}
                onChange={e => setInvoiceForm({ ...invoiceForm, customerId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="">اختر العميل...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المستودع المصدر *</label>
              <select
                required
                value={invoiceForm.warehouseId}
                onChange={e => setInvoiceForm({ ...invoiceForm, warehouseId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {warehouses.map(wh => (
                  <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
              <span className="font-bold text-xs text-slate-700">بنود الفاتورة</span>
              <button
                type="button"
                onClick={handleAddItemToInvoice}
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة بند آخر
              </button>
            </div>

            <div className="p-3 overflow-x-auto space-y-2">
              {invoiceForm.items.map((line, idx) => {
                const currentItem = items.find(i => i.id === line.itemId);
                const availableUnits = currentItem ? [
                  { id: currentItem.baseUnitId, name: currentItem.baseUnitName },
                  ...currentItem.additionalUnits.map(au => ({ id: au.unitId, name: au.unitName }))
                ] : [];

                return (
                  <div key={line.id} className="grid grid-cols-12 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 items-center text-xs">
                    <div className="col-span-4">
                      <label className="text-[10px] text-slate-500 block mb-0.5">الصنف</label>
                      <select
                        value={line.itemId}
                        onChange={e => handleInvoiceItemChange(line.id, 'itemId', e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-semibold"
                      >
                        {items.map(i => (
                          <option key={i.id} value={i.id}>{i.name} ({i.code})</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">الوحدة</label>
                      <select
                        value={line.unitId}
                        onChange={e => handleInvoiceItemChange(line.id, 'unitId', e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                      >
                        {availableUnits.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="text-[10px] text-slate-500 block mb-0.5">الكمية</label>
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={e => handleInvoiceItemChange(line.id, 'quantity', e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">السعر (ج.م)</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={line.unitPrice}
                        onChange={e => handleInvoiceItemChange(line.id, 'unitPrice', e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="text-[10px] text-slate-500 block mb-0.5">خصم</label>
                      <input
                        type="number"
                        min="0"
                        value={line.discount}
                        onChange={e => handleInvoiceItemChange(line.id, 'discount', e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-rose-600"
                      />
                    </div>

                    <div className="col-span-1 text-left">
                      <label className="text-[10px] text-slate-500 block mb-0.5">الإجمالي</label>
                      <span className="font-mono font-bold text-slate-800 text-[11px]">{line.total}</span>
                    </div>

                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveInvoiceItem(line.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="حذف البند"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Financial Summary */}
          {(() => {
            const totals = calculateTotals();

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">طريقة السداد</label>
                      <select
                        value={invoiceForm.paymentMethod}
                        onChange={e => setInvoiceForm({ ...invoiceForm, paymentMethod: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="cash">نقداً (خزينة)</option>
                        <option value="bank">تحويل بنكي</option>
                        <option value="wallet">محفظة إلكترونية</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الخزينة / الحساب</label>
                      <select
                        value={invoiceForm.treasuryId}
                        onChange={e => setInvoiceForm({ ...invoiceForm, treasuryId: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        {treasuries.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المسدد الآن (ج.م)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={invoiceForm.paidAmount}
                      onChange={e => setInvoiceForm({ ...invoiceForm, paidAmount: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات الفاتورة</label>
                    <input
                      type="text"
                      value={invoiceForm.notes}
                      onChange={e => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      placeholder="رقم أمر التوريد، شروط خاصة..."
                    />
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>إجمالي البنود:</span>
                      <span className="font-mono">{new Intl.NumberFormat('ar-EG').format(totals.subtotal)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-rose-400">
                      <span>إجمالي الخصم:</span>
                      <span className="font-mono">-{new Intl.NumberFormat('ar-EG').format(totals.discountTotal)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>ضريبة القيمة المضافة (14%):</span>
                      <span className="font-mono">+{new Intl.NumberFormat('ar-EG').format(totals.taxTotal)} ج.م</span>
                    </div>
                    <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-base text-white">
                      <span>الصافي النهائي:</span>
                      <span className="font-mono text-emerald-400 font-black">{new Intl.NumberFormat('ar-EG').format(totals.netTotal)} ج.م</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex justify-between text-rose-300 font-bold">
                    <span>المتبقي الآجل على العميل:</span>
                    <span className="font-mono text-sm">{new Intl.NumberFormat('ar-EG').format(totals.remainingAmount)} ج.م</span>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ وطباعة الفاتورة
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: RECEIPT VOUCHER (سند قبض من أي حساب) */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title={editingReceipt ? 'تعديل سند القبض' : 'تحرير سند قبض مالي'}
        subtitle="يمكن استلام النقدية من أي حساب وإيداعها في الخزينة أو البنك أو المحفظة"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveReceipt} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ *</label>
              <input
                type="date"
                required
                value={receiptForm.date}
                onChange={e => setReceiptForm({ ...receiptForm, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحساب المقبوض منه *</label>
              <select
                value={receiptForm.accountType}
                onChange={e => {
                  const newType = e.target.value as AccountType;
                  const opts = getAccountOptions(newType);
                  setReceiptForm({
                    ...receiptForm,
                    accountType: newType,
                    accountId: opts[0]?.id || ''
                  });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="customer">عملاء</option>
                <option value="supplier">موردين</option>
                <option value="expense">استرداد مصروف</option>
                <option value="revenue">إيرادات أخرى</option>
                <option value="employee">عهد موظفين</option>
                <option value="partner">شركاء (إيداع رأس مال)</option>
                <option value="partner_current">جاري شركاء (إيداع شريك)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الحساب المقبوض منه *</label>
            <select
              required
              value={receiptForm.accountId}
              onChange={e => setReceiptForm({ ...receiptForm, accountId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {getAccountOptions(receiptForm.accountType).map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المقبوض (ج.م) *</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={receiptForm.amount}
                onChange={e => setReceiptForm({ ...receiptForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm font-mono font-black text-emerald-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">طريقة القبض *</label>
              <select
                value={receiptForm.paymentMethod}
                onChange={e => setReceiptForm({ ...receiptForm, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="cash">نقداً (خزينة)</option>
                <option value="bank">تحويل / إيداع بنكي</option>
                <option value="wallet">محفظة إلكترونية</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الخزينة أو البنك المستلم *</label>
            <select
              required
              value={receiptForm.treasuryId}
              onChange={e => setReceiptForm({ ...receiptForm, treasuryId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {treasuries.map(tr => (
                <option key={tr.id} value={tr.id}>{tr.name} (رصيد: {new Intl.NumberFormat('ar-EG').format(tr.balance)} ج.م)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المستلم / أمين الصندوق</label>
              <input
                type="text"
                value={receiptForm.receivedBy}
                onChange={e => setReceiptForm({ ...receiptForm, receivedBy: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                placeholder="اسم من استلم المبلغ"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم المستند المرجعي (فاتورة / شيك)</label>
              <input
                type="text"
                value={receiptForm.referenceDoc}
                onChange={e => setReceiptForm({ ...receiptForm, referenceDoc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البيان وسبب القبض</label>
            <textarea
              rows={2}
              value={receiptForm.notes}
              onChange={e => setReceiptForm({ ...receiptForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="وذلك عن سداد دفعة من الحساب..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsReceiptModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ وطباعة السند
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: COUNTRY */}
      <Modal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        title={editingCountry ? 'تعديل الدولة' : 'إضافة دولة جديدة'}
        maxWidth="sm"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          if (editingCountry) {
            updateCountry(editingCountry.id, countryForm);
          } else {
            addCountry(countryForm);
          }
          setIsCountryModalOpen(false);
        }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كود الدولة *</label>
            <input
              type="text"
              required
              value={countryForm.code}
              onChange={e => setCountryForm({ ...countryForm, code: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الدولة *</label>
            <input
              type="text"
              required
              value={countryForm.name}
              onChange={e => setCountryForm({ ...countryForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="مثال: جمهورية مصر العربية"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsCountryModalOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs">إلغاء</button>
            <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">حفظ</button>
          </div>
        </form>
      </Modal>

      {/* MODAL: GOVERNORATE */}
      <Modal
        isOpen={isGovModalOpen}
        onClose={() => setIsGovModalOpen(false)}
        title={editingGov ? 'تعديل المحافظة' : 'إضافة محافظة جديدة'}
        maxWidth="sm"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const country = countries.find(c => c.id === govForm.countryId);
          if (editingGov) {
            updateGovernorate(editingGov.id, { ...govForm, countryName: country?.name || '' });
          } else {
            addGovernorate({ ...govForm, countryName: country?.name || '' });
          }
          setIsGovModalOpen(false);
        }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الدولة *</label>
            <select
              value={govForm.countryId}
              onChange={e => setGovForm({ ...govForm, countryId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كود المحافظة *</label>
            <input
              type="text"
              required
              value={govForm.code}
              onChange={e => setGovForm({ ...govForm, code: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم المحافظة *</label>
            <input
              type="text"
              required
              value={govForm.name}
              onChange={e => setGovForm({ ...govForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsGovModalOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs">إلغاء</button>
            <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">حفظ</button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CITY */}
      <Modal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        title={editingCity ? 'تعديل المدينة' : 'إضافة مدينة جديدة'}
        maxWidth="sm"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const gov = governorates.find(g => g.id === cityForm.governorateId);
          if (editingCity) {
            updateCity(editingCity.id, {
              ...cityForm,
              governorateName: gov?.name || '',
              countryId: gov?.countryId || '',
              countryName: gov?.countryName || ''
            });
          } else {
            addCity({
              ...cityForm,
              governorateName: gov?.name || '',
              countryId: gov?.countryId || '',
              countryName: gov?.countryName || ''
            });
          }
          setIsCityModalOpen(false);
        }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المحافظة *</label>
            <select
              value={cityForm.governorateId}
              onChange={e => setCityForm({ ...cityForm, governorateId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              {governorates.map(g => <option key={g.id} value={g.id}>{g.name} ({g.countryName})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كود المدينة *</label>
            <input
              type="text"
              required
              value={cityForm.code}
              onChange={e => setCityForm({ ...cityForm, code: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم المدينة *</label>
            <input
              type="text"
              required
              value={cityForm.name}
              onChange={e => setCityForm({ ...cityForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsCityModalOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs">إلغاء</button>
            <button type="submit" className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold">حفظ</button>
          </div>
        </form>
      </Modal>

      {/* PRINT VIEW MODAL */}
      <PrintViewModal
        isOpen={Boolean(printableDoc)}
        onClose={() => setPrintableDoc(null)}
        documentData={printableDoc}
      />

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف [${deleteDialog.name}]؟ سيتم حذف كافة السجلات التابعة له.`}
      />

    </div>
  );
};
