import React, { useState } from 'react';
import { 
  Boxes, 
  Warehouse as WarehouseIcon, 
  Ruler, 
  ArrowRightLeft, 
  Calculator, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  AlertCircle,
  CheckCircle,
  PackagePlus,
  RefreshCw
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Warehouse, Item, Unit, ItemUnit, WarehouseTransfer } from '../../types/erp';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

type SubTab = 'warehouses' | 'items' | 'units' | 'transfers' | 'average_cost';

export const WarehousesAndItemsTab: React.FC = () => {
  const { 
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
    transfers, 
    addWarehouseTransfer,
    recalculateAverageCost
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('items');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [warehouseForm, setWarehouseForm] = useState({
    code: '',
    name: '',
    manager: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [unitForm, setUnitForm] = useState({
    code: '',
    name: ''
  });

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemForm, setItemForm] = useState<{
    code: string;
    name: string;
    baseUnitId: string;
    additionalUnits: ItemUnit[];
    reorderLevel: number;
    costPrice: number;
    salePrice: number;
    category: string;
    notes: string;
    initialStock: Record<string, number>;
  }>({
    code: '',
    name: '',
    baseUnitId: units[0]?.id || '',
    additionalUnits: [],
    reorderLevel: 5,
    costPrice: 0,
    salePrice: 0,
    category: '',
    notes: '',
    initialStock: {}
  });

  // Transfer modal
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    date: new Date().toISOString().split('T')[0],
    fromWarehouseId: warehouses[0]?.id || '',
    toWarehouseId: warehouses[1]?.id || '',
    itemId: items[0]?.id || '',
    unitId: '',
    quantity: 1,
    notes: ''
  });

  // Cost recalculation log
  const [costRecalcLog, setCostRecalcLog] = useState<{ updatedCount: number; details: string[] } | null>(null);

  // Delete confirm
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'warehouse' | 'unit' | 'item';
    id: string;
    name: string;
  }>({
    isOpen: false,
    type: 'item',
    id: '',
    name: ''
  });

  // --- Handlers: Warehouse ---
  const handleOpenWarehouseModal = (wh?: Warehouse) => {
    if (wh) {
      setEditingWarehouse(wh);
      setWarehouseForm({
        code: wh.code,
        name: wh.name,
        manager: wh.manager,
        phone: wh.phone,
        address: wh.address || '',
        notes: wh.notes || ''
      });
    } else {
      setEditingWarehouse(null);
      setWarehouseForm({
        code: `WH-0${warehouses.length + 1}`,
        name: '',
        manager: '',
        phone: '',
        address: '',
        notes: ''
      });
    }
    setIsWarehouseModalOpen(true);
  };

  const handleSaveWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseForm.code || !warehouseForm.name) return;

    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, warehouseForm);
    } else {
      addWarehouse(warehouseForm);
    }
    setIsWarehouseModalOpen(false);
  };

  // --- Handlers: Unit ---
  const handleOpenUnitModal = (u?: Unit) => {
    if (u) {
      setEditingUnit(u);
      setUnitForm({ code: u.code, name: u.name });
    } else {
      setEditingUnit(null);
      setUnitForm({ code: `U-0${units.length + 1}`, name: '' });
    }
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitForm.name) return;
    if (editingUnit) {
      updateUnit(editingUnit.id, unitForm);
    } else {
      addUnit(unitForm);
    }
    setIsUnitModalOpen(false);
  };

  // --- Handlers: Item ---
  const handleOpenItemModal = (itm?: Item) => {
    if (itm) {
      setEditingItem(itm);
      setItemForm({
        code: itm.code,
        name: itm.name,
        baseUnitId: itm.baseUnitId,
        additionalUnits: [...itm.additionalUnits],
        reorderLevel: itm.reorderLevel,
        costPrice: itm.costPrice,
        salePrice: itm.salePrice,
        category: itm.category || '',
        notes: itm.notes || '',
        initialStock: { ...itm.stockByWarehouse }
      });
    } else {
      setEditingItem(null);
      const defaultStock: Record<string, number> = {};
      warehouses.forEach(wh => { defaultStock[wh.id] = 0; });
      setItemForm({
        code: `ITM-${100 + items.length + 1}`,
        name: '',
        baseUnitId: units[0]?.id || '',
        additionalUnits: [],
        reorderLevel: 10,
        costPrice: 0,
        salePrice: 0,
        category: '',
        notes: '',
        initialStock: defaultStock
      });
    }
    setIsItemModalOpen(true);
  };

  const handleAddAdditionalUnit = () => {
    const unselected = units.find(u => u.id !== itemForm.baseUnitId && !itemForm.additionalUnits.some(au => au.unitId === u.id));
    if (!unselected) {
      alert('لا توجد وحدات إضافية متاحة، أضف وحدات جديدة أولاً من تبويب الوحدات');
      return;
    }
    setItemForm(prev => ({
      ...prev,
      additionalUnits: [
        ...prev.additionalUnits,
        {
          unitId: unselected.id,
          unitName: unselected.name,
          conversionFactor: 10,
          salePrice: prev.salePrice * 10
        }
      ]
    }));
  };

  const handleRemoveAdditionalUnit = (index: number) => {
    setItemForm(prev => ({
      ...prev,
      additionalUnits: prev.additionalUnits.filter((_, i) => i !== index)
    }));
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.code || !itemForm.name || !itemForm.baseUnitId) return;

    const baseUnit = units.find(u => u.id === itemForm.baseUnitId);
    const baseUnitName = baseUnit ? baseUnit.name : 'قطعة';

    if (editingItem) {
      updateItem(editingItem.id, {
        code: itemForm.code,
        name: itemForm.name,
        baseUnitId: itemForm.baseUnitId,
        baseUnitName,
        additionalUnits: itemForm.additionalUnits,
        reorderLevel: Number(itemForm.reorderLevel),
        costPrice: Number(itemForm.costPrice),
        salePrice: Number(itemForm.salePrice),
        category: itemForm.category,
        notes: itemForm.notes,
        stockByWarehouse: itemForm.initialStock
      });
    } else {
      addItem({
        code: itemForm.code,
        name: itemForm.name,
        baseUnitId: itemForm.baseUnitId,
        baseUnitName,
        additionalUnits: itemForm.additionalUnits,
        reorderLevel: Number(itemForm.reorderLevel),
        costPrice: Number(itemForm.costPrice),
        salePrice: Number(itemForm.salePrice),
        averageCost: Number(itemForm.costPrice),
        category: itemForm.category,
        notes: itemForm.notes,
        stockByWarehouse: itemForm.initialStock
      });
    }
    setIsItemModalOpen(false);
  };

  // --- Handlers: Transfers ---
  const handleOpenTransferModal = () => {
    if (warehouses.length < 2) {
      alert('يجب وجود مستودعين على الأقل لإجراء عملية تحويل.');
      return;
    }
    const defaultItem = items[0];
    setTransferForm({
      date: new Date().toISOString().split('T')[0],
      fromWarehouseId: warehouses[0].id,
      toWarehouseId: warehouses[1].id,
      itemId: defaultItem ? defaultItem.id : '',
      unitId: defaultItem ? defaultItem.baseUnitId : '',
      quantity: 1,
      notes: ''
    });
    setIsTransferModalOpen(true);
  };

  const handleSaveTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferForm.fromWarehouseId === transferForm.toWarehouseId) {
      alert('لا يمكن التحويل لنفس المستودع! اختر مستودعاً مختلفاً.');
      return;
    }
    const item = items.find(i => i.id === transferForm.itemId);
    if (!item) return;

    const fromWh = warehouses.find(w => w.id === transferForm.fromWarehouseId);
    const toWh = warehouses.find(w => w.id === transferForm.toWarehouseId);
    if (!fromWh || !toWh) return;

    // Check available stock in source warehouse
    const currentStock = item.stockByWarehouse?.[transferForm.fromWarehouseId] || 0;
    if (currentStock < transferForm.quantity) {
      alert(`الرصيد المتاح في ${fromWh.name} هو ${currentStock} فقط! لا يمكن تحويل ${transferForm.quantity}.`);
      return;
    }

    // Cost price is current cost price of the item as requested:
    // "تحويلات مابين المخازن بسعر التكلفة الحالية للصنف"
    const unitCost = item.costPrice;
    const totalCost = unitCost * transferForm.quantity;

    const unit = units.find(u => u.id === transferForm.unitId) || { name: item.baseUnitName };

    addWarehouseTransfer({
      date: transferForm.date,
      fromWarehouseId: transferForm.fromWarehouseId,
      fromWarehouseName: fromWh.name,
      toWarehouseId: transferForm.toWarehouseId,
      toWarehouseName: toWh.name,
      itemId: item.id,
      itemName: item.name,
      unitId: transferForm.unitId || item.baseUnitId,
      unitName: unit.name,
      quantity: Number(transferForm.quantity),
      unitCost,
      totalCost,
      notes: transferForm.notes
    });

    setIsTransferModalOpen(false);
  };

  // --- Handlers: Weighted Average Cost ---
  const handleRecalculateCost = (itemId?: string) => {
    const result = recalculateAverageCost(itemId);
    setCostRecalcLog(result);
  };

  // --- Handlers: Delete Dialog ---
  const confirmDelete = () => {
    if (deleteDialog.type === 'warehouse') deleteWarehouse(deleteDialog.id);
    if (deleteDialog.type === 'unit') deleteUnit(deleteDialog.id);
    if (deleteDialog.type === 'item') deleteItem(deleteDialog.id);
  };

  // Filtered Items
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Sub-tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('items')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'items'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>الأصناف ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('warehouses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'warehouses'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <WarehouseIcon className="w-4 h-4" />
          <span>المستودعات والمخازن ({warehouses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('units')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'units'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>الوحدات والقياس ({units.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transfers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'transfers'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>تحويلات المخازن بسعر التكلفة ({transfers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('average_cost')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'average_cost'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>إعادة احتساب متوسط التكلفة</span>
        </button>
      </div>

      {/* SUBTAB 1: ITEMS (الأصناف) */}
      {activeSubTab === 'items' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بكود الصنف أو الاسم أو التصنيف..."
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={() => handleOpenItemModal()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة صنف جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">كود الصنف</th>
                    <th className="py-3 px-4">اسم الصنف والتصنيف</th>
                    <th className="py-3 px-4">الوحدة الأساسية</th>
                    <th className="py-3 px-4">الوحدات الإضافية والتحويل</th>
                    <th className="py-3 px-4">حد الطلب</th>
                    <th className="py-3 px-4">سعر التكلفة</th>
                    <th className="py-3 px-4">سعر البيع</th>
                    <th className="py-3 px-4">الرصيد الكلي</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map(item => {
                    const totalQty = Object.values(item.stockByWarehouse || {}).reduce((a, b) => a + (b || 0), 0);
                    const isLowStock = totalQty <= item.reorderLevel;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{item.code}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{item.name}</div>
                          {item.category && (
                            <span className="text-[11px] text-slate-400">{item.category}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                            {item.baseUnitName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.additionalUnits && item.additionalUnits.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {item.additionalUnits.map((au, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200">
                                  {au.unitName} = {au.conversionFactor} {item.baseUnitName}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">لا توجد</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{item.reorderLevel}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {new Intl.NumberFormat('ar-EG').format(item.costPrice)} ج.م
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                          {new Intl.NumberFormat('ar-EG').format(item.salePrice)} ج.م
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                              {totalQty} {item.baseUnitName}
                            </span>
                            {isLowStock && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold" title="الرصيد أقل من أو يساوي حد الطلب">
                                حد طلب
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {Object.entries(item.stockByWarehouse || {}).map(([whId, qty]) => {
                              const wh = warehouses.find(w => w.id === whId);
                              return qty > 0 ? `${wh?.name.split('-')[0] || ''}: ${qty} | ` : null;
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenItemModal(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="تعديل الصنف"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteDialog({ isOpen: true, type: 'item', id: item.id, name: item.name })}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="حذف الصنف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: WAREHOUSES (المستودعات) */}
      {activeSubTab === 'warehouses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">سجل المستودعات والمخازن</h3>
              <p className="text-xs text-slate-500">إدارة كافة مواقع التخزين، المسئولين، وأرقام الهواتف</p>
            </div>
            <button
              onClick={() => handleOpenWarehouseModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مستودع جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouses.map(wh => {
              // Calculate total items stored in this warehouse
              const warehouseItemsCount = items.reduce((acc, item) => acc + (item.stockByWarehouse?.[wh.id] || 0), 0);

              return (
                <div key={wh.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                        <WarehouseIcon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 font-mono font-bold text-xs text-slate-700">
                        {wh.code}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-800 mb-1">{wh.name}</h4>
                    {wh.address && <p className="text-xs text-slate-500 mb-3">{wh.address}</p>}

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>المسئول: <b className="text-slate-800">{wh.manager || 'غير محدد'}</b></div>
                      <div>رقم الهاتف: <span className="font-mono text-slate-800">{wh.phone || '-'}</span></div>
                      <div>إجمالي الرصيد بالمستودع: <b className="font-mono text-emerald-700">{warehouseItemsCount} قطعة</b></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenWarehouseModal(wh)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, type: 'warehouse', id: wh.id, name: wh.name })}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: UNITS (الوحدات) */}
      {activeSubTab === 'units' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">دليل وحدات القياس</h3>
              <p className="text-xs text-slate-500">الوحدات الأساسية والفرعية المستخدمة في الأصناف والتحويلات</p>
            </div>
            <button
              onClick={() => handleOpenUnitModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة وحدة جديدة</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden max-w-2xl">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">كود الوحدة</th>
                  <th className="py-3 px-4">اسم الوحدة</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {units.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{u.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{u.name}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenUnitModal(u)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, type: 'unit', id: u.id, name: u.name })}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
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
      )}

      {/* SUBTAB 4: WAREHOUSE TRANSFERS (التحويلات بسعر التكلفة) */}
      {activeSubTab === 'transfers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">حركات التحويل بين المستودعات</h3>
              <p className="text-xs text-slate-500">يتم تقييم التحويل تلقائياً بسعر التكلفة الحالية للصنف وتحديث الأرصدة</p>
            </div>
            <button
              onClick={handleOpenTransferModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>إجراء تحويل مخزني جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">رقم السند</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">من مستودع</th>
                    <th className="py-3 px-4">إلى مستودع</th>
                    <th className="py-3 px-4">الصنف المحول</th>
                    <th className="py-3 px-4">الوحدة والكمية</th>
                    <th className="py-3 px-4">سعر التكلفة الحالية</th>
                    <th className="py-3 px-4">إجمالي قيمة التحويل</th>
                    <th className="py-3 px-4">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        لا توجد تحويلات سابقة
                      </td>
                    </tr>
                  ) : (
                    transfers.map(tr => (
                      <tr key={tr.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{tr.code}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{tr.date}</td>
                        <td className="py-3 px-4 font-medium text-rose-700">{tr.fromWarehouseName}</td>
                        <td className="py-3 px-4 font-medium text-emerald-700">{tr.toWarehouseName}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{tr.itemName}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{tr.quantity} {tr.unitName}</td>
                        <td className="py-3 px-4 font-mono text-slate-700">{new Intl.NumberFormat('ar-EG').format(tr.unitCost)} ج.م</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800">{new Intl.NumberFormat('ar-EG').format(tr.totalCost)} ج.م</td>
                        <td className="py-3 px-4 text-slate-500 text-xs">{tr.notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: RECALCULATE AVERAGE COST (إعادة احتساب متوسط التكلفة) */}
      {activeSubTab === 'average_cost' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-l from-emerald-900 to-teal-800 text-white p-6 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-6 h-6 text-emerald-300" />
                  <h3 className="text-xl font-bold">إعادة احتساب متوسط التكلفة المرجح (Weighted Average Cost)</h3>
                </div>
                <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  يقوم النظام بإعادة حساب متوسط التكلفة لكل صنف بناءً على فواتير المشتريات ومردوداتها والأرصدة الافتتاحية طبقاً للمعايير المحاسبية المعتمدة.
                </p>
              </div>

              <button
                onClick={() => handleRecalculateCost()}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-900 font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
              >
                <RefreshCw className="w-5 h-5 text-emerald-600" />
                <span>إعادة احتساب لكافة الأصناف الآن</span>
              </button>
            </div>
          </div>

          {/* Feedback log */}
          {costRecalcLog && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>تم تحديث متوسط التكلفة بنجاح لـ {costRecalcLog.updatedCount} صنف</span>
              </div>
              <ul className="space-y-1 text-xs text-emerald-700 font-mono">
                {costRecalcLog.details.map((line, idx) => (
                  <li key={idx}>• {line}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Items Average Cost Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">جدول مقارنة تكلفة الأصناف الحالي ومتوسط التكلفة</h4>
            </div>
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">كود الصنف</th>
                  <th className="py-3 px-4">اسم الصنف</th>
                  <th className="py-3 px-4">الرصيد المتاح</th>
                  <th className="py-3 px-4">سعر التكلفة المسجل</th>
                  <th className="py-3 px-4">متوسط التكلفة المحتسب</th>
                  <th className="py-3 px-4">سعر البيع الحالي</th>
                  <th className="py-3 px-4 text-center">إجراء منفرد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => {
                  const totalQty = Object.values(item.stockByWarehouse || {}).reduce((a, b) => a + (b || 0), 0);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{item.code}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{totalQty} {item.baseUnitName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{new Intl.NumberFormat('ar-EG').format(item.costPrice)} ج.م</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        {new Intl.NumberFormat('ar-EG').format(item.averageCost || item.costPrice)} ج.م
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{new Intl.NumberFormat('ar-EG').format(item.salePrice)} ج.م</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleRecalculateCost(item.id)}
                          className="px-3 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          إعادة احتساب
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: WAREHOUSE (إضافة / تعديل مستودع) */}
      <Modal
        isOpen={isWarehouseModalOpen}
        onClose={() => setIsWarehouseModalOpen(false)}
        title={editingWarehouse ? 'تعديل بيانات المستودع' : 'إضافة مستودع جديد'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveWarehouse} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كود المخزن *</label>
              <input
                type="text"
                required
                value={warehouseForm.code}
                onChange={e => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المخزن *</label>
              <input
                type="text"
                required
                value={warehouseForm.name}
                onChange={e => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="مثال: المستودع المركزي"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المسئول عن المخزن</label>
              <input
                type="text"
                value={warehouseForm.manager}
                onChange={e => setWarehouseForm({ ...warehouseForm, manager: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="اسم أمين المخزن"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف</label>
              <input
                type="text"
                value={warehouseForm.phone}
                onChange={e => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                placeholder="010XXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">العنوان بالتفصيل</label>
            <input
              type="text"
              value={warehouseForm.address}
              onChange={e => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="المنطقة أو الحي أو الشارع"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات</label>
            <textarea
              rows={2}
              value={warehouseForm.notes}
              onChange={e => setWarehouseForm({ ...warehouseForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsWarehouseModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ المستودع
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: UNIT (إضافة / تعديل وحدة) */}
      <Modal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        title={editingUnit ? 'تعديل الوحدة' : 'إضافة وحدة قياس جديدة'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveUnit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كود الوحدة *</label>
            <input
              type="text"
              required
              value={unitForm.code}
              onChange={e => setUnitForm({ ...unitForm, code: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الوحدة *</label>
            <input
              type="text"
              required
              value={unitForm.name}
              onChange={e => setUnitForm({ ...unitForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="مثال: قطعة، كرتونة، دزينة، كيلو"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUnitModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ الوحدة
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ITEM (إضافة / تعديل صنف مع الوحدات المتعددة ومعامل التحويل) */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={editingItem ? 'تعديل بيانات الصنف' : 'إضافة صنف جديد'}
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveItem} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كود الصنف *</label>
              <input
                type="text"
                required
                value={itemForm.code}
                onChange={e => setItemForm({ ...itemForm, code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الصنف *</label>
              <input
                type="text"
                required
                value={itemForm.name}
                onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="اسم الصنف والموديل والمواصفات"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الوحدة الأساسية *</label>
              <select
                value={itemForm.baseUnitId}
                onChange={e => setItemForm({ ...itemForm, baseUnitId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف / المجموعة</label>
              <input
                type="text"
                value={itemForm.category}
                onChange={e => setItemForm({ ...itemForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="مثال: أجهزة، أدوات، شاشات"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">حد الطلب (الحد الأدنى)</label>
              <input
                type="number"
                min="0"
                value={itemForm.reorderLevel}
                onChange={e => setItemForm({ ...itemForm, reorderLevel: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">سعر التكلفة (ج.م) *</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={itemForm.costPrice}
                onChange={e => setItemForm({ ...itemForm, costPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">سعر البيع (ج.م) *</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={itemForm.salePrice}
                onChange={e => setItemForm({ ...itemForm, salePrice: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-emerald-700"
              />
            </div>
          </div>

          {/* Additional Units with Conversion Factor */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-800">وحدات إضافية للصنف مع معامل التحويل</span>
                <p className="text-[11px] text-slate-500">مثلاً: 1 كرتونة = 12 قطعة، وسعر بيع مخصص للكرتونة</p>
              </div>
              <button
                type="button"
                onClick={handleAddAdditionalUnit}
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة وحدة ثانية
              </button>
            </div>

            {itemForm.additionalUnits.map((au, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 items-center">
                <div>
                  <label className="text-[10px] text-slate-500 block">الوحدة</label>
                  <select
                    value={au.unitId}
                    onChange={e => {
                      const u = units.find(unit => unit.id === e.target.value);
                      const updated = [...itemForm.additionalUnits];
                      updated[idx].unitId = e.target.value;
                      updated[idx].unitName = u ? u.name : '';
                      setItemForm({ ...itemForm, additionalUnits: updated });
                    }}
                    className="w-full text-xs font-bold p-1 bg-slate-50 border border-slate-200 rounded"
                  >
                    {units.filter(u => u.id !== itemForm.baseUnitId).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">معامل التحويل (كم وحدة أساسية)</label>
                  <input
                    type="number"
                    min="1"
                    value={au.conversionFactor}
                    onChange={e => {
                      const updated = [...itemForm.additionalUnits];
                      updated[idx].conversionFactor = Number(e.target.value);
                      setItemForm({ ...itemForm, additionalUnits: updated });
                    }}
                    className="w-full text-xs font-mono font-bold p-1 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">سعر بيع هذه الوحدة (ج.م)</label>
                  <input
                    type="number"
                    min="0"
                    value={au.salePrice}
                    onChange={e => {
                      const updated = [...itemForm.additionalUnits];
                      updated[idx].salePrice = Number(e.target.value);
                      setItemForm({ ...itemForm, additionalUnits: updated });
                    }}
                    className="w-full text-xs font-mono font-bold p-1 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>
                <div className="text-left pt-3">
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalUnit(idx)}
                    className="text-rose-600 hover:text-rose-800 text-xs font-bold p-1"
                  >
                    حذف الوحدة
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Initial Stock By Warehouse */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-xs text-slate-800 block mb-2">الرصيد الافتتاحي في المستودعات (بالوحدة الأساسية)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {warehouses.map(wh => (
                <div key={wh.id}>
                  <label className="block text-[11px] text-slate-600 mb-1">{wh.name}</label>
                  <input
                    type="number"
                    min="0"
                    value={itemForm.initialStock[wh.id] || 0}
                    onChange={e => {
                      setItemForm({
                        ...itemForm,
                        initialStock: {
                          ...itemForm.initialStock,
                          [wh.id]: Number(e.target.value)
                        }
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsItemModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ بيانات الصنف
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: TRANSFER (تحويل مخزني بسعر التكلفة) */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="إجراء تحويل بين المستودعات"
        subtitle="يتم احتساب التحويل آلياً بسعر التكلفة الحالية للصنف"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTransfer} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ التحويل</label>
              <input
                type="date"
                required
                value={transferForm.date}
                onChange={e => setTransferForm({ ...transferForm, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الصنف المطلوب تحويله *</label>
              <select
                value={transferForm.itemId}
                onChange={e => setTransferForm({ ...transferForm, itemId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              >
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.name} ({item.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-rose-700 mb-1">من مستودع (المصدر) *</label>
              <select
                value={transferForm.fromWarehouseId}
                onChange={e => setTransferForm({ ...transferForm, fromWarehouseId: e.target.value })}
                className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-sm font-bold text-slate-800"
              >
                {warehouses.map(wh => (
                  <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-700 mb-1">إلى مستودع (الوجهة) *</label>
              <select
                value={transferForm.toWarehouseId}
                onChange={e => setTransferForm({ ...transferForm, toWarehouseId: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm font-bold text-slate-800"
              >
                {warehouses.map(wh => (
                  <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current cost price banner */}
          {(() => {
            const selectedItem = items.find(i => i.id === transferForm.itemId);
            const fromWhStock = selectedItem?.stockByWarehouse?.[transferForm.fromWarehouseId] || 0;
            const cost = selectedItem?.costPrice || 0;
            const total = cost * transferForm.quantity;

            return (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>الرصيد المتاح في المستودع المصدر:</span>
                  <span className="font-mono font-bold text-slate-900">{fromWhStock} {selectedItem?.baseUnitName}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>سعر التكلفة الحالية للقطعة:</span>
                  <span className="font-mono font-bold text-emerald-700">{new Intl.NumberFormat('ar-EG').format(cost)} ج.م</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-xs font-bold text-slate-800">
                  <span>إجمالي تكلفة التحويل:</span>
                  <span className="font-mono font-black text-emerald-700">{new Intl.NumberFormat('ar-EG').format(total)} ج.م</span>
                </div>
              </div>
            );
          })()}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الكمية المحولة (بالوحدة الأساسية) *</label>
            <input
              type="number"
              min="1"
              required
              value={transferForm.quantity}
              onChange={e => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات التحويل</label>
            <textarea
              rows={2}
              value={transferForm.notes}
              onChange={e => setTransferForm({ ...transferForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              placeholder="سبب التحويل أو رقم إذن الصرف..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              تنفيذ التحويل المخزني
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من رغبتك في حذف [${deleteDialog.name}]؟ سيتم إزالة العنصر وسجلاته من قاعدة البيانات.`}
      />

    </div>
  );
};
