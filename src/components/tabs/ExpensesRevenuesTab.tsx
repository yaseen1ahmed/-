import React, { useState } from 'react';
import { 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { 
  ExpenseCategory, 
  RevenueCategory, 
  ExpenseTransaction, 
  RevenueTransaction 
} from '../../types/erp';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

type SubTab = 'expenses' | 'revenues' | 'categories';

export const ExpensesRevenuesTab: React.FC = () => {
  const {
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
    treasuries
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('expenses');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    categoryId: expenseCategories[0]?.id || '',
    amount: 500,
    treasuryId: treasuries[0]?.id || '',
    recipient: '',
    notes: ''
  });

  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [revenueForm, setRevenueForm] = useState({
    date: new Date().toISOString().split('T')[0],
    categoryId: revenueCategories[0]?.id || '',
    amount: 1000,
    treasuryId: treasuries[0]?.id || '',
    payer: '',
    notes: ''
  });

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryType, setCategoryType] = useState<'expense' | 'revenue'>('expense');
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | RevenueCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({ code: '', name: '' });

  // Delete Confirm
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'expense_cat' | 'revenue_cat';
    id: string;
    name: string;
  }>({
    isOpen: false,
    type: 'expense_cat',
    id: '',
    name: ''
  });

  // --- Handlers: Expense ---
  const handleOpenExpenseModal = () => {
    setExpenseForm({
      date: new Date().toISOString().split('T')[0],
      categoryId: expenseCategories[0]?.id || '',
      amount: 500,
      treasuryId: treasuries[0]?.id || '',
      recipient: '',
      notes: ''
    });
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseForm.amount <= 0 || !expenseForm.categoryId) return;

    const cat = expenseCategories.find(c => c.id === expenseForm.categoryId);
    const treasury = treasuries.find(t => t.id === expenseForm.treasuryId);

    addExpenseTransaction({
      date: expenseForm.date,
      categoryId: expenseForm.categoryId,
      categoryName: cat?.name || 'مصروف عام',
      amount: Number(expenseForm.amount),
      treasuryId: expenseForm.treasuryId,
      treasuryName: treasury?.name || 'الخزينة الرئيسية',
      recipient: expenseForm.recipient,
      notes: expenseForm.notes
    });

    setIsExpenseModalOpen(false);
  };

  // --- Handlers: Revenue ---
  const handleOpenRevenueModal = () => {
    setRevenueForm({
      date: new Date().toISOString().split('T')[0],
      categoryId: revenueCategories[0]?.id || '',
      amount: 1000,
      treasuryId: treasuries[0]?.id || '',
      payer: '',
      notes: ''
    });
    setIsRevenueModalOpen(true);
  };

  const handleSaveRevenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (revenueForm.amount <= 0 || !revenueForm.categoryId) return;

    const cat = revenueCategories.find(c => c.id === revenueForm.categoryId);
    const treasury = treasuries.find(t => t.id === revenueForm.treasuryId);

    addRevenueTransaction({
      date: revenueForm.date,
      categoryId: revenueForm.categoryId,
      categoryName: cat?.name || 'إيراد متنوع',
      amount: Number(revenueForm.amount),
      treasuryId: revenueForm.treasuryId,
      treasuryName: treasury?.name || 'الخزينة الرئيسية',
      payer: revenueForm.payer,
      notes: revenueForm.notes
    });

    setIsRevenueModalOpen(false);
  };

  // --- Handlers: Categories ---
  const handleOpenCategoryModal = (type: 'expense' | 'revenue', cat?: ExpenseCategory | RevenueCategory) => {
    setCategoryType(type);
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ code: cat.code, name: cat.name });
    } else {
      setEditingCategory(null);
      const prefix = type === 'expense' ? 'EXP-CAT' : 'REV-CAT';
      const count = (type === 'expense' ? expenseCategories.length : revenueCategories.length) + 1;
      setCategoryForm({ code: `${prefix}-0${count}`, name: '' });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.code || !categoryForm.name) return;

    if (categoryType === 'expense') {
      if (editingCategory) {
        updateExpenseCategory(editingCategory.id, categoryForm);
      } else {
        addExpenseCategory(categoryForm);
      }
    } else {
      if (editingCategory) {
        updateRevenueCategory(editingCategory.id, categoryForm);
      } else {
        addRevenueCategory(categoryForm);
      }
    }
    setIsCategoryModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteDialog.type === 'expense_cat') deleteExpenseCategory(deleteDialog.id);
    if (deleteDialog.type === 'revenue_cat') deleteRevenueCategory(deleteDialog.id);
  };

  // Summaries
  const totalExpenses = expenseTransactions.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenues = revenueTransactions.reduce((sum, r) => sum + r.amount, 0);
  const netOperatingIncome = totalRevenues - totalExpenses;

  return (
    <div className="space-y-6">

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-100">إجمالي المصروفات المسجلة</span>
            <TrendingDown className="w-5 h-5 text-rose-200" />
          </div>
          <div className="text-2xl font-black font-mono">
            {new Intl.NumberFormat('ar-EG').format(totalExpenses)} ج.م
          </div>
          <p className="text-[11px] text-rose-200 mt-1">
            {expenseTransactions.length} حركة مصروفات
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-100">إجمالي الإيرادات المتنوعة</span>
            <TrendingUp className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-2xl font-black font-mono">
            {new Intl.NumberFormat('ar-EG').format(totalRevenues)} ج.م
          </div>
          <p className="text-[11px] text-emerald-200 mt-1">
            {revenueTransactions.length} حركة إيرادات
          </p>
        </div>

        <div className={`p-5 rounded-2xl shadow-xs text-white ${
          netOperatingIncome >= 0 ? 'bg-gradient-to-r from-blue-600 to-cyan-700' : 'bg-gradient-to-r from-amber-600 to-rose-700'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white/90">صافي الفرق (إيرادات - مصروفات)</span>
            <Receipt className="w-5 h-5 text-white/80" />
          </div>
          <div className="text-2xl font-black font-mono">
            {new Intl.NumberFormat('ar-EG').format(netOperatingIncome)} ج.م
          </div>
          <p className="text-[11px] text-white/80 mt-1">
            {netOperatingIncome >= 0 ? 'فائض إيجابي' : 'عجز في التشغيل'}
          </p>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'expenses'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>حركات المصروفات ({expenseTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('revenues')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'revenues'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>حركات الإيرادات ({revenueTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'categories'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>دليل بنود المصروفات والإيرادات</span>
        </button>
      </div>

      {/* SUBTAB 1: EXPENSES */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">سجل حركات المصروفات</h3>
              <p className="text-xs text-slate-500">إضافة وتعديل المصروفات التشغيلية والعمومية وخصمها من الخزائن</p>
            </div>
            <button
              onClick={handleOpenExpenseModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مصروف جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">رقم السند</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">بند المصروف</th>
                    <th className="py-3 px-4">المبلغ</th>
                    <th className="py-3 px-4">الخزينة المسحوب منها</th>
                    <th className="py-3 px-4">المستلم</th>
                    <th className="py-3 px-4">البيان والملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenseTransactions.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-rose-700">{exp.code}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{exp.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{exp.categoryName}</td>
                      <td className="py-3 px-4 font-mono font-black text-rose-700">
                        {new Intl.NumberFormat('ar-EG').format(exp.amount)} ج.م
                      </td>
                      <td className="py-3 px-4 text-slate-700">{exp.treasuryName}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{exp.recipient || '-'}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{exp.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: REVENUES */}
      {activeSubTab === 'revenues' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">سجل حركات الإيرادات</h3>
              <p className="text-xs text-slate-500">إضافة وتعديل إيرادات النشاط المتنوعة وتغذية الخزائن والحسابات</p>
            </div>
            <button
              onClick={handleOpenRevenueModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة إيراد جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">رقم السند</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">بند الإيراد</th>
                    <th className="py-3 px-4">المبلغ</th>
                    <th className="py-3 px-4">الخزينة المودع فيها</th>
                    <th className="py-3 px-4">الدافع / المصدر</th>
                    <th className="py-3 px-4">البيان والملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {revenueTransactions.map(rev => (
                    <tr key={rev.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{rev.code}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{rev.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{rev.categoryName}</td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-700">
                        {new Intl.NumberFormat('ar-EG').format(rev.amount)} ج.م
                      </td>
                      <td className="py-3 px-4 text-slate-700">{rev.treasuryName}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{rev.payer || '-'}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{rev.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CATEGORIES */}
      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Expense Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                بنود ومجموعات المصروفات ({expenseCategories.length})
              </h4>
              <button
                onClick={() => handleOpenCategoryModal('expense')}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold"
              >
                + إضافة بند مصروف
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {expenseCategories.map(cat => (
                <div key={cat.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{cat.name}</span>
                    <span className="font-mono text-slate-400 mr-2 font-semibold">({cat.code})</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenCategoryModal('expense', cat)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, type: 'expense_cat', id: cat.id, name: cat.name })}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                بنود ومجموعات الإيرادات ({revenueCategories.length})
              </h4>
              <button
                onClick={() => handleOpenCategoryModal('revenue')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold"
              >
                + إضافة بند إيراد
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {revenueCategories.map(cat => (
                <div key={cat.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{cat.name}</span>
                    <span className="font-mono text-slate-400 mr-2 font-semibold">({cat.code})</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenCategoryModal('revenue', cat)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, type: 'revenue_cat', id: cat.id, name: cat.name })}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
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

      {/* MODAL: ADD EXPENSE */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="إضافة وتسجيل مصروف جديد"
        subtitle="يتم خصم المبلغ فوراً من رصيد الخزينة أو البنك المحدد"
        maxWidth="md"
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ *</label>
              <input
                type="date"
                required
                value={expenseForm.date}
                onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">بند المصروف *</label>
              <select
                required
                value={expenseForm.categoryId}
                onChange={e => setExpenseForm({ ...expenseForm, categoryId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {expenseCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">قيمة المصروف (ج.م) *</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={expenseForm.amount}
                onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-sm font-mono font-black text-rose-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الخزينة المسحوب منها *</label>
              <select
                value={expenseForm.treasuryId}
                onChange={e => setExpenseForm({ ...expenseForm, treasuryId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {treasuries.map(tr => (
                  <option key={tr.id} value={tr.id}>{tr.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المستلم / اسم الجهة</label>
            <input
              type="text"
              value={expenseForm.recipient}
              onChange={e => setExpenseForm({ ...expenseForm, recipient: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="مثال: شركة الكهرباء، الفني، الموظف"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البيان والتفاصيل</label>
            <textarea
              rows={2}
              value={expenseForm.notes}
              onChange={e => setExpenseForm({ ...expenseForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="شرح سبب المصروف وتفاصيل الفاتورة"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              تسجيل المصروف
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD REVENUE */}
      <Modal
        isOpen={isRevenueModalOpen}
        onClose={() => setIsRevenueModalOpen(false)}
        title="إضافة وتسجيل إيراد جديد"
        subtitle="يتم إيداع المبلغ فوراً في رصيد الخزينة أو البنك المحدد"
        maxWidth="md"
      >
        <form onSubmit={handleSaveRevenue} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ *</label>
              <input
                type="date"
                required
                value={revenueForm.date}
                onChange={e => setRevenueForm({ ...revenueForm, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">بند الإيراد *</label>
              <select
                required
                value={revenueForm.categoryId}
                onChange={e => setRevenueForm({ ...revenueForm, categoryId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {revenueCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">قيمة الإيراد (ج.م) *</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={revenueForm.amount}
                onChange={e => setRevenueForm({ ...revenueForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm font-mono font-black text-emerald-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الخزينة المودع فيها *</label>
              <select
                value={revenueForm.treasuryId}
                onChange={e => setRevenueForm({ ...revenueForm, treasuryId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {treasuries.map(tr => (
                  <option key={tr.id} value={tr.id}>{tr.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المصدر / الدافع</label>
            <input
              type="text"
              value={revenueForm.payer}
              onChange={e => setRevenueForm({ ...revenueForm, payer: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="اسم العميل أو الجهة الدافعة"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البيان والتفاصيل</label>
            <textarea
              rows={2}
              value={revenueForm.notes}
              onChange={e => setRevenueForm({ ...revenueForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="تفاصيل خدمة أو عمولة أو بيع مخلفات..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRevenueModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              تسجيل الإيراد
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CATEGORY */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={
          editingCategory
            ? `تعديل ${categoryType === 'expense' ? 'بند المصروف' : 'بند الإيراد'}`
            : `إضافة ${categoryType === 'expense' ? 'بند مصروف جديد' : 'بند إيراد جديد'}`
        }
        maxWidth="sm"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كود البند *</label>
            <input
              type="text"
              required
              value={categoryForm.code}
              onChange={e => setCategoryForm({ ...categoryForm, code: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم البند *</label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder={categoryType === 'expense' ? 'مثال: صيانة سيارات' : 'مثال: أرباح استثمار'}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs">إلغاء</button>
            <button type="submit" className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold">حفظ البند</button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف البند [${deleteDialog.name}]؟`}
      />

    </div>
  );
};
