import React, { useState } from 'react';
import { 
  Truck, 
  ShoppingCart, 
  RotateCcw, 
  ArrowUpRight, 
  Plus, 
  Pencil, 
  Trash2, 
  Printer, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Building2
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { 
  Supplier, 
  PurchaseInvoice, 
  PaymentVoucher, 
  InvoiceItem, 
  AccountType, 
  PaymentMethod 
} from '../../types/erp';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { PrintViewModal } from '../common/PrintViewModal';

type SubTab = 'suppliers' | 'purchases' | 'purchase_returns' | 'payment_vouchers';

export const SuppliersTab: React.FC = () => {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    purchaseInvoices,
    addPurchaseInvoice,
    updatePurchaseInvoice,
    deletePurchaseInvoice,
    paymentVouchers,
    addPaymentVoucher,
    updatePaymentVoucher,
    deletePaymentVoucher,
    cities,
    items,
    warehouses,
    treasuries,
    getAccountOptions
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('suppliers');
  const [searchTerm, setSearchTerm] = useState('');

  // Print Modal
  const [printableDoc, setPrintableDoc] = useState<{
    kind: 'purchase_invoice' | 'payment_voucher';
    data: any;
  } | null>(null);

  // Supplier Modal
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState<{
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
    openingBalanceType: 'credit' | 'debit';
    openingBalance: number;
    notes: string;
  }>({
    code: '',
    name: '',
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
    openingBalanceType: 'credit',
    openingBalance: 0,
    notes: ''
  });

  // Purchase Invoice Modal
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'purchase' | 'purchase_return'>('purchase');
  const [editingInvoice, setEditingInvoice] = useState<PurchaseInvoice | null>(null);
  const [invoiceForm, setInvoiceForm] = useState<{
    date: string;
    supplierId: string;
    warehouseId: string;
    items: InvoiceItem[];
    paymentMethod: PaymentMethod;
    treasuryId: string;
    paidAmount: number;
    notes: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    supplierId: '',
    warehouseId: '',
    items: [],
    paymentMethod: 'bank',
    treasuryId: '',
    paidAmount: 0,
    notes: ''
  });

  // Payment Voucher Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentVoucher | null>(null);
  const [paymentForm, setPaymentForm] = useState<{
    date: string;
    accountType: AccountType;
    accountId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    treasuryId: string;
    paidTo: string;
    notes: string;
    referenceDoc: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    accountType: 'supplier',
    accountId: '',
    amount: 0,
    paymentMethod: 'cash',
    treasuryId: treasuries[0]?.id || '',
    paidTo: '',
    notes: '',
    referenceDoc: ''
  });

  // Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'supplier' | 'invoice' | 'payment';
    id: string;
    name: string;
  }>({
    isOpen: false,
    type: 'supplier',
    id: '',
    name: ''
  });

  // --- Handlers: Supplier ---
  const handleOpenSupplierModal = (sup?: Supplier) => {
    if (sup) {
      setEditingSupplier(sup);
      setSupplierForm({
        code: sup.code,
        name: sup.name,
        responsiblePerson: sup.responsiblePerson,
        responsiblePhone: sup.responsiblePhone,
        email: sup.email,
        fax: sup.fax,
        phone1: sup.phone1,
        phone2: sup.phone2,
        addressDetails: sup.addressDetails,
        cityId: sup.cityId,
        cityName: sup.cityName,
        governorateName: sup.governorateName,
        countryName: sup.countryName,
        openingBalanceType: sup.openingBalanceType,
        openingBalance: sup.openingBalance,
        notes: sup.notes || ''
      });
    } else {
      setEditingSupplier(null);
      const defaultCity = cities[0];
      setSupplierForm({
        code: `SUP-00${suppliers.length + 1}`,
        name: '',
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
        openingBalanceType: 'credit',
        openingBalance: 0,
        notes: ''
      });
    }
    setIsSupplierModalOpen(true);
  };

  // Requirement: "عند اختيار المدينة يتم جلب اسم المحافظة و الدولة المرتبطه بالمدينة"
  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find(c => c.id === cityId);
    if (selectedCity) {
      setSupplierForm(prev => ({
        ...prev,
        cityId: selectedCity.id,
        cityName: selectedCity.name,
        governorateName: selectedCity.governorateName,
        countryName: selectedCity.countryName
      }));
    }
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.code || !supplierForm.name) return;

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, supplierForm);
    } else {
      addSupplier(supplierForm);
    }
    setIsSupplierModalOpen(false);
  };

  // --- Handlers: Purchase Invoices ---
  const handleOpenInvoiceModal = (type: 'purchase' | 'purchase_return', inv?: PurchaseInvoice) => {
    setInvoiceType(type);
    if (inv) {
      setEditingInvoice(inv);
      setInvoiceForm({
        date: inv.date,
        supplierId: inv.supplierId,
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
        id: 'pline-' + Date.now(),
        itemId: defaultItem.id,
        itemCode: defaultItem.code,
        itemName: defaultItem.name,
        unitId: defaultItem.baseUnitId,
        unitName: defaultItem.baseUnitName,
        conversionFactor: 1,
        quantity: 1,
        unitPrice: defaultItem.costPrice,
        discount: 0,
        taxRate: 14,
        total: Math.round(defaultItem.costPrice * 1.14)
      } : {
        id: 'pline-1',
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
        supplierId: suppliers[0]?.id || '',
        warehouseId: warehouses[0]?.id || '',
        items: defaultItem ? [initialLine] : [],
        paymentMethod: 'bank',
        treasuryId: treasuries[0]?.id || '',
        paidAmount: defaultItem ? Math.round(defaultItem.costPrice * 1.14) : 0,
        notes: ''
      });
    }
    setIsInvoiceModalOpen(true);
  };

  const handleAddItemToInvoice = () => {
    const defaultItem = items[0];
    if (!defaultItem) return;
    const newLine: InvoiceItem = {
      id: 'pline-' + Date.now() + Math.random(),
      itemId: defaultItem.id,
      itemCode: defaultItem.code,
      itemName: defaultItem.name,
      unitId: defaultItem.baseUnitId,
      unitName: defaultItem.baseUnitName,
      conversionFactor: 1,
      quantity: 1,
      unitPrice: defaultItem.costPrice,
      discount: 0,
      taxRate: 14,
      total: Math.round(defaultItem.costPrice * 1.14)
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
            next.unitPrice = item.costPrice;
          }
        } else if (field === 'unitId') {
          const item = items.find(i => i.id === next.itemId);
          if (item) {
            if (val === item.baseUnitId) {
              next.unitId = item.baseUnitId;
              next.unitName = item.baseUnitName;
              next.conversionFactor = 1;
              next.unitPrice = item.costPrice;
            } else {
              const au = item.additionalUnits.find(u => u.unitId === val);
              if (au) {
                next.unitId = au.unitId;
                next.unitName = au.unitName;
                next.conversionFactor = au.conversionFactor;
                next.unitPrice = item.costPrice * au.conversionFactor;
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
    if (!invoiceForm.supplierId || invoiceForm.items.length === 0) {
      alert('يرجى اختيار المورد وإضافة بند واحد على الأقل للفاتورة.');
      return;
    }

    const supplier = suppliers.find(s => s.id === invoiceForm.supplierId);
    const warehouse = warehouses.find(w => w.id === invoiceForm.warehouseId);
    const treasury = treasuries.find(t => t.id === invoiceForm.treasuryId);
    const totals = calculateTotals();

    if (editingInvoice) {
      updatePurchaseInvoice(editingInvoice.id, {
        date: invoiceForm.date,
        supplierId: invoiceForm.supplierId,
        supplierName: supplier?.name || '',
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
      const newInv = addPurchaseInvoice({
        type: invoiceType,
        date: invoiceForm.date,
        supplierId: invoiceForm.supplierId,
        supplierName: supplier?.name || '',
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
      setPrintableDoc({ kind: 'purchase_invoice', data: newInv });
    }
    setIsInvoiceModalOpen(false);
  };

  // --- Handlers: Payment Vouchers ---
  // Requirement: "بحيث يمكن الدفع الي اي حساب سواء عملاء او موردين او مصروفات او ايرادات او موظفين او شركاء او جاري شركاء"
  const handleOpenPaymentModal = (v?: PaymentVoucher) => {
    if (v) {
      setEditingPayment(v);
      setPaymentForm({
        date: v.date,
        accountType: v.accountType,
        accountId: v.accountId,
        amount: v.amount,
        paymentMethod: v.paymentMethod,
        treasuryId: v.treasuryId,
        paidTo: v.paidTo || '',
        notes: v.notes,
        referenceDoc: v.referenceDoc || ''
      });
    } else {
      setEditingPayment(null);
      const defaultAccountOptions = getAccountOptions('supplier');
      setPaymentForm({
        date: new Date().toISOString().split('T')[0],
        accountType: 'supplier',
        accountId: defaultAccountOptions[0]?.id || '',
        amount: 2000,
        paymentMethod: 'cash',
        treasuryId: treasuries[0]?.id || '',
        paidTo: '',
        notes: '',
        referenceDoc: ''
      });
    }
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.accountId || paymentForm.amount <= 0) return;

    const accountOptions = getAccountOptions(paymentForm.accountType);
    const targetAccount = accountOptions.find(a => a.id === paymentForm.accountId);
    const treasury = treasuries.find(t => t.id === paymentForm.treasuryId);

    const typeNames: Record<AccountType, string> = {
      customer: 'رد مالي لعميل',
      supplier: 'موردين',
      expense: 'مصروفات تشغيلية',
      revenue: 'رد إيراد',
      employee: 'رواتب وسلف موظفين',
      partner: 'تخفيض رأس مال شريك',
      partner_current: 'مسحوبات جاري شريك'
    };

    if (editingPayment) {
      updatePaymentVoucher(editingPayment.id, {
        date: paymentForm.date,
        accountType: paymentForm.accountType,
        accountTypeName: typeNames[paymentForm.accountType],
        accountId: paymentForm.accountId,
        accountName: targetAccount?.name || '',
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        treasuryId: paymentForm.treasuryId,
        treasuryName: treasury?.name || '',
        paidTo: paymentForm.paidTo,
        notes: paymentForm.notes,
        referenceDoc: paymentForm.referenceDoc
      });
    } else {
      const newV = addPaymentVoucher({
        date: paymentForm.date,
        accountType: paymentForm.accountType,
        accountTypeName: typeNames[paymentForm.accountType],
        accountId: paymentForm.accountId,
        accountName: targetAccount?.name || '',
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        treasuryId: paymentForm.treasuryId,
        treasuryName: treasury?.name || '',
        paidTo: paymentForm.paidTo,
        notes: paymentForm.notes,
        referenceDoc: paymentForm.referenceDoc
      });
      setPrintableDoc({ kind: 'payment_voucher', data: newV });
    }
    setIsPaymentModalOpen(false);
  };

  // --- Handlers: Delete Confirm ---
  const confirmDelete = () => {
    if (deleteDialog.type === 'supplier') deleteSupplier(deleteDialog.id);
    if (deleteDialog.type === 'invoice') deletePurchaseInvoice(deleteDialog.id);
    if (deleteDialog.type === 'payment') deletePaymentVoucher(deleteDialog.id);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Sub-tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('suppliers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'suppliers'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>دليل الموردين ({suppliers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('purchases')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'purchases'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>فواتير المشتريات ({purchaseInvoices.filter(i => i.type === 'purchase').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('purchase_returns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'purchase_returns'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>مردود المشتريات ({purchaseInvoices.filter(i => i.type === 'purchase_return').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payment_vouchers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'payment_vouchers'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ArrowUpRight className="w-4 h-4 text-rose-400" />
          <span>سندات الدفع / الصرف (لكافة الحسابات) ({paymentVouchers.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: SUPPLIERS (دليل الموردين) */}
      {activeSubTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم المورد أو الكود أو المدينة..."
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={() => handleOpenSupplierModal()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مورد جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">كود المورد</th>
                    <th className="py-3 px-4">اسم المورد والشركة</th>
                    <th className="py-3 px-4">الشخص المسئول وهاتفه</th>
                    <th className="py-3 px-4">العنوان والموقع</th>
                    <th className="py-3 px-4">وسائل التواصل</th>
                    <th className="py-3 px-4">الرصيد الافتتاحي</th>
                    <th className="py-3 px-4">الرصيد الحالي المستحق</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuppliers.map(sup => (
                    <tr key={sup.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{sup.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{sup.name}</td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{sup.responsiblePerson || '-'}</div>
                        <div className="text-xs font-mono text-slate-500">{sup.responsiblePhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-700">{sup.cityName} - {sup.governorateName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{sup.addressDetails}</div>
                      </td>
                      <td className="py-3 px-4 text-xs space-y-0.5">
                        {sup.phone1 && <div className="font-mono text-slate-700">📞 {sup.phone1}</div>}
                        {sup.email && <div className="text-slate-500 truncate max-w-[150px]">✉️ {sup.email}</div>}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-slate-700">{new Intl.NumberFormat('ar-EG').format(sup.openingBalance)} ج.م</span>
                        <span className="text-[10px] text-slate-400 block">{sup.openingBalanceType === 'credit' ? 'دائن (له علينا)' : 'مدين (له)'}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-black text-rose-700">
                          {new Intl.NumberFormat('ar-EG').format(Math.abs(sup.currentBalance))} ج.م
                        </span>
                        <span className="text-[10px] block font-semibold text-slate-500">
                          {sup.currentBalance > 0 ? 'دائن (مستحق للمورد)' : 'متزن'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenSupplierModal(sup)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="تعديل بيانات المورد"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, type: 'supplier', id: sup.id, name: sup.name })}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="حذف المورد"
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

      {/* SUBTAB 2: PURCHASES & PURCHASE RETURNS */}
      {(activeSubTab === 'purchases' || activeSubTab === 'purchase_returns') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">
                {activeSubTab === 'purchases' ? 'فواتير المشتريات' : 'فواتير مردود المشتريات'}
              </h3>
              <p className="text-xs text-slate-500">إضافة وتعديل وحذف وطباعة وتصدير PDF مع تحديث مخزون المستودعات وحسابات الموردين</p>
            </div>

            <button
              onClick={() => handleOpenInvoiceModal(activeSubTab === 'purchases' ? 'purchase' : 'purchase_return')}
              className={`flex items-center gap-2 px-4 py-2.5 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer ${
                activeSubTab === 'purchases' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{activeSubTab === 'purchases' ? 'إنشاء فاتورة مشتريات جديدة' : 'إنشاء فاتورة مردود مشتريات'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">رقم الفاتورة</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">المورد</th>
                    <th className="py-3 px-4">مستودع الاستلام</th>
                    <th className="py-3 px-4">عدد الأصناف</th>
                    <th className="py-3 px-4">الصافي النهائي</th>
                    <th className="py-3 px-4">المدفوع</th>
                    <th className="py-3 px-4">المتبقي الآجل</th>
                    <th className="py-3 px-4 text-center">إجراءات وطباعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchaseInvoices
                    .filter(inv => inv.type === (activeSubTab === 'purchases' ? 'purchase' : 'purchase_return'))
                    .map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{inv.code}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{inv.date}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{inv.supplierName}</td>
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
                              onClick={() => setPrintableDoc({ kind: 'purchase_invoice', data: inv })}
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

      {/* SUBTAB 3: PAYMENT VOUCHERS (سندات الصرف والدفع لكافة الحسابات) */}
      {activeSubTab === 'payment_vouchers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">سندات الصرف والدفع المالي</h3>
              <p className="text-xs text-slate-500">
                إمكانية الصرف والدفع لأي حساب (موردين، عملاء، مصروفات، إيرادات، موظفين، شركاء، جاري شركاء) مع اختيار طريقة السداد
              </p>
            </div>

            <button
              onClick={() => handleOpenPaymentModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تحرير سند صرف / دفع جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">رقم السند</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">نوع الحساب المنصرف إليه</th>
                    <th className="py-3 px-4">اسم الحساب / المستفيد</th>
                    <th className="py-3 px-4">المبلغ المنصرف</th>
                    <th className="py-3 px-4">طريقة الدفع</th>
                    <th className="py-3 px-4">الخزينة / الحساب المسحوب منه</th>
                    <th className="py-3 px-4">البيان والملاحظات</th>
                    <th className="py-3 px-4 text-center">إجراءات وطباعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentVouchers.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-rose-700">{v.code}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{v.date}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-xs font-semibold">
                          {v.accountTypeName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{v.accountName}</td>
                      <td className="py-3 px-4 font-mono font-black text-rose-700 text-sm">
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
                            onClick={() => setPrintableDoc({ kind: 'payment_voucher', data: v })}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="طباعة السند"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>طباعة</span>
                          </button>
                          <button
                            onClick={() => handleOpenPaymentModal(v)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="تعديل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, type: 'payment', id: v.id, name: v.code })}
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

      {/* MODAL: SUPPLIER (إضافة / تعديل مورد مع الربط التلقائي للمدينة والمحافظة والدولة) */}
      <Modal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        title={editingSupplier ? 'تعديل بيانات المورد' : 'إضافة مورد جديد'}
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveSupplier} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كود المورد *</label>
              <input
                type="text"
                required
                value={supplierForm.code}
                onChange={e => setSupplierForm({ ...supplierForm, code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المورد / الشركة المصنعة *</label>
              <input
                type="text"
                required
                value={supplierForm.name}
                onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                placeholder="اسم المورد أو المصنع أو الوكيل"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الشخص المسئول</label>
              <input
                type="text"
                value={supplierForm.responsiblePerson}
                onChange={e => setSupplierForm({ ...supplierForm, responsiblePerson: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                placeholder="مسئول المبيعات أو المدير"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم هاتف المسئول</label>
              <input
                type="text"
                value={supplierForm.responsiblePhone}
                onChange={e => setSupplierForm({ ...supplierForm, responsiblePhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500"
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
                  value={supplierForm.phone1}
                  onChange={e => setSupplierForm({ ...supplierForm, phone1: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  placeholder="010XXXXXXXX"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">رقم الهاتف 2</label>
                <input
                  type="text"
                  value={supplierForm.phone2}
                  onChange={e => setSupplierForm({ ...supplierForm, phone2: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  placeholder="أرضي / إضافي"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={supplierForm.email}
                  onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  placeholder="supplier@domain.com"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">الفاكس</label>
                <input
                  type="text"
                  value={supplierForm.fax}
                  onChange={e => setSupplierForm({ ...supplierForm, fax: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Address with automatic Geo binding */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">العنوان والموقع الجغرافي</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                (جلب تلقائي للمحافظة والدولة عند اختيار المدينة)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">المدينة *</label>
                <select
                  value={supplierForm.cityId}
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
                  value={supplierForm.governorateName}
                  className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">الدولة (تلقائي)</label>
                <input
                  type="text"
                  readOnly
                  value={supplierForm.countryName}
                  className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 block mb-1">العنوان التفصيلي</label>
              <input
                type="text"
                value={supplierForm.addressDetails}
                onChange={e => setSupplierForm({ ...supplierForm, addressDetails: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                placeholder="المنطقة الصناعية، الشارع، المبنى"
              />
            </div>
          </div>

          {/* Opening Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نوع الرصيد الافتتاحي</label>
              <select
                value={supplierForm.openingBalanceType}
                onChange={e => setSupplierForm({ ...supplierForm, openingBalanceType: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="credit">دائن (رصيد مستحق للمورد في ذمتنا)</option>
                <option value="debit">مدين (دفعة مقدمة للمورد لصالحنا)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">قيمة الرصيد الافتتاحي (ج.م)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={supplierForm.openingBalance}
                onChange={e => setSupplierForm({ ...supplierForm, openingBalance: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSupplierModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ بيانات المورد
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: PURCHASE INVOICE & RETURNS */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title={invoiceType === 'purchase' ? 'تحرير فاتورة مشتريات' : 'تحرير فاتورة مردود مشتريات'}
        subtitle="تأثير فوري على زيادة المخزون بالمستودع المحدد وتحديث حساب المورد"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">المورد *</label>
              <select
                required
                value={invoiceForm.supplierId}
                onChange={e => setInvoiceForm({ ...invoiceForm, supplierId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="">اختر المورد...</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">مستودع الاستلام *</label>
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
              <span className="font-bold text-xs text-slate-700">بنود التوريد والمشتريات</span>
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
                      <label className="text-[10px] text-slate-500 block mb-0.5">سعر التكلفة (ج.م)</label>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">طريقة الدفع</label>
                      <select
                        value={invoiceForm.paymentMethod}
                        onChange={e => setInvoiceForm({ ...invoiceForm, paymentMethod: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="bank">تحويل بنكي / شيك</option>
                        <option value="cash">نقداً (خزينة)</option>
                        <option value="wallet">محفظة إلكترونية</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الحساب المسحوب منه</label>
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المسدد للمورد الآن (ج.م)</label>
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
                      placeholder="رقم فاتورة المورد الأصلية، شروط الضمان..."
                    />
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>إجمالي بنود الشراء:</span>
                      <span className="font-mono">{new Intl.NumberFormat('ar-EG').format(totals.subtotal)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-rose-400">
                      <span>إجمالي الخصم المكتسب:</span>
                      <span className="font-mono">-{new Intl.NumberFormat('ar-EG').format(totals.discountTotal)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>ضريبة القيمة المضافة:</span>
                      <span className="font-mono">+{new Intl.NumberFormat('ar-EG').format(totals.taxTotal)} ج.م</span>
                    </div>
                    <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-base text-white">
                      <span>الصافي النهائي للمشتريات:</span>
                      <span className="font-mono text-emerald-400 font-black">{new Intl.NumberFormat('ar-EG').format(totals.netTotal)} ج.م</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex justify-between text-rose-300 font-bold">
                    <span>المتبقي الآجل للمورد:</span>
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

      {/* MODAL: PAYMENT VOUCHER (سند دفع لكافة الحسابات) */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={editingPayment ? 'تعديل سند الصرف' : 'تحرير سند صرف / دفع مالي'}
        subtitle="يمكن الصرف والدفع لأي حساب سواء موردين أو مصروفات أو شركاء أو موظفين"
        maxWidth="2xl"
      >
        <form onSubmit={handleSavePayment} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ *</label>
              <input
                type="date"
                required
                value={paymentForm.date}
                onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحساب المنصرف إليه *</label>
              <select
                value={paymentForm.accountType}
                onChange={e => {
                  const newType = e.target.value as AccountType;
                  const opts = getAccountOptions(newType);
                  setPaymentForm({
                    ...paymentForm,
                    accountType: newType,
                    accountId: opts[0]?.id || ''
                  });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="supplier">موردين</option>
                <option value="customer">رد مالي لعميل</option>
                <option value="expense">مصروفات عمومية وتشغيلية</option>
                <option value="revenue">رد إيراد</option>
                <option value="employee">رواتب وسلف موظفين</option>
                <option value="partner">شركاء (تخفيض رأس مال)</option>
                <option value="partner_current">جاري شركاء (مسحوبات أرباح)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الحساب المستفيد *</label>
            <select
              required
              value={paymentForm.accountId}
              onChange={e => setPaymentForm({ ...paymentForm, accountId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {getAccountOptions(paymentForm.accountType).map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المنصرف (ج.م) *</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={paymentForm.amount}
                onChange={e => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-sm font-mono font-black text-rose-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">طريقة الدفع *</label>
              <select
                value={paymentForm.paymentMethod}
                onChange={e => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="cash">نقداً (خزينة)</option>
                <option value="bank">تحويل / شيك بنكي</option>
                <option value="wallet">محفظة إلكترونية</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الخزينة أو الحساب المسحوب منه *</label>
            <select
              required
              value={paymentForm.treasuryId}
              onChange={e => setPaymentForm({ ...paymentForm, treasuryId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {treasuries.map(tr => (
                <option key={tr.id} value={tr.id}>{tr.name} (رصيد متاح: {new Intl.NumberFormat('ar-EG').format(tr.balance)} ج.م)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المستلم / اسم الشخص</label>
              <input
                type="text"
                value={paymentForm.paidTo}
                onChange={e => setPaymentForm({ ...paymentForm, paidTo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                placeholder="اسم من استلم الدفعة"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم المستند المرجعي (فاتورة / إيصال)</label>
              <input
                type="text"
                value={paymentForm.referenceDoc}
                onChange={e => setPaymentForm({ ...paymentForm, referenceDoc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البيان وسبب الصرف</label>
            <textarea
              rows={2}
              value={paymentForm.notes}
              onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="وذلك عن سداد دفعة توريد..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ وطباعة السند
            </button>
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
        message={`هل أنت متأكد من حذف [${deleteDialog.name}]؟ سيتم إزالة السجل من قاعدة البيانات.`}
      />

    </div>
  );
};
