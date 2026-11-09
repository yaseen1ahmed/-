import React, { useState } from 'react';
import { 
  WalletCards, 
  Landmark, 
  Smartphone, 
  ArrowRightLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Wallet,
  CheckCircle,
  Building
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Treasury, TreasuryTransfer } from '../../types/erp';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

type SubTab = 'all' | 'cash' | 'banks' | 'wallets' | 'transfers';

export const TreasuriesTab: React.FC = () => {
  const {
    treasuries,
    addTreasury,
    updateTreasury,
    deleteTreasury,
    treasuryTransfers,
    addTreasuryTransfer
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isTreasuryModalOpen, setIsTreasuryModalOpen] = useState(false);
  const [treasuryTypeToCreate, setTreasuryTypeToCreate] = useState<'cash' | 'bank' | 'wallet'>('cash');
  const [editingTreasury, setEditingTreasury] = useState<Treasury | null>(null);
  const [treasuryForm, setTreasuryForm] = useState<{
    code: string;
    name: string;
    type: 'cash' | 'bank' | 'wallet';
    balance: number;
    manager: string;
    bankName: string;
    accountNumber: string;
    bankBranch: string;
    iban: string;
    walletNumber: string;
    providerName: string;
    notes: string;
  }>({
    code: '',
    name: '',
    type: 'cash',
    balance: 0,
    manager: '',
    bankName: '',
    accountNumber: '',
    bankBranch: '',
    iban: '',
    walletNumber: '',
    providerName: '',
    notes: ''
  });

  // Transfer modal
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    date: new Date().toISOString().split('T')[0],
    fromTreasuryId: treasuries[0]?.id || '',
    toTreasuryId: treasuries[1]?.id || '',
    amount: 1000,
    notes: ''
  });

  // Delete Confirm
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  }>({
    isOpen: false,
    id: '',
    name: ''
  });

  // --- Handlers: Treasuries ---
  const handleOpenTreasuryModal = (type: 'cash' | 'bank' | 'wallet', tr?: Treasury) => {
    setTreasuryTypeToCreate(type);
    if (tr) {
      setEditingTreasury(tr);
      setTreasuryForm({
        code: tr.code,
        name: tr.name,
        type: tr.type,
        balance: tr.balance,
        manager: tr.manager || '',
        bankName: tr.bankName || '',
        accountNumber: tr.accountNumber || '',
        bankBranch: tr.bankBranch || '',
        iban: tr.iban || '',
        walletNumber: tr.walletNumber || '',
        providerName: tr.providerName || '',
        notes: tr.notes || ''
      });
    } else {
      setEditingTreasury(null);
      const prefix = type === 'cash' ? 'TRS' : type === 'bank' ? 'BNK' : 'WAL';
      const count = treasuries.filter(t => t.type === type).length + 1;
      setTreasuryForm({
        code: `${prefix}-0${count}`,
        name: '',
        type,
        balance: 0,
        manager: '',
        bankName: '',
        accountNumber: '',
        bankBranch: '',
        iban: '',
        walletNumber: '',
        providerName: '',
        notes: ''
      });
    }
    setIsTreasuryModalOpen(true);
  };

  const handleSaveTreasury = (e: React.FormEvent) => {
    e.preventDefault();
    if (!treasuryForm.code || !treasuryForm.name) return;

    if (editingTreasury) {
      updateTreasury(editingTreasury.id, {
        code: treasuryForm.code,
        name: treasuryForm.name,
        type: treasuryForm.type,
        balance: Number(treasuryForm.balance),
        manager: treasuryForm.manager,
        bankName: treasuryForm.bankName,
        accountNumber: treasuryForm.accountNumber,
        bankBranch: treasuryForm.bankBranch,
        iban: treasuryForm.iban,
        walletNumber: treasuryForm.walletNumber,
        providerName: treasuryForm.providerName,
        notes: treasuryForm.notes
      });
    } else {
      addTreasury({
        code: treasuryForm.code,
        name: treasuryForm.name,
        type: treasuryForm.type,
        balance: Number(treasuryForm.balance),
        manager: treasuryForm.manager,
        bankName: treasuryForm.bankName,
        accountNumber: treasuryForm.accountNumber,
        bankBranch: treasuryForm.bankBranch,
        iban: treasuryForm.iban,
        walletNumber: treasuryForm.walletNumber,
        providerName: treasuryForm.providerName,
        notes: treasuryForm.notes
      });
    }
    setIsTreasuryModalOpen(false);
  };

  // --- Handlers: Transfers between accounts ---
  const handleOpenTransferModal = () => {
    if (treasuries.length < 2) {
      alert('يجب وجود حسابين ماليين على الأقل للتحويل بينهما.');
      return;
    }
    setTransferForm({
      date: new Date().toISOString().split('T')[0],
      fromTreasuryId: treasuries[0]?.id || '',
      toTreasuryId: treasuries[1]?.id || '',
      amount: 1000,
      notes: ''
    });
    setIsTransferModalOpen(true);
  };

  const handleSaveTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferForm.fromTreasuryId === transferForm.toTreasuryId) {
      alert('لا يمكن التحويل لنفس الحساب! اختر حسابين مختلفين.');
      return;
    }
    const fromTr = treasuries.find(t => t.id === transferForm.fromTreasuryId);
    const toTr = treasuries.find(t => t.id === transferForm.toTreasuryId);
    if (!fromTr || !toTr) return;

    if (fromTr.balance < transferForm.amount) {
      alert(`الرصيد المتاح في ${fromTr.name} هو ${fromTr.balance} ج.م فقط! لا يمكن تحويل ${transferForm.amount} ج.م.`);
      return;
    }

    addTreasuryTransfer({
      date: transferForm.date,
      fromTreasuryId: transferForm.fromTreasuryId,
      fromTreasuryName: fromTr.name,
      toTreasuryId: transferForm.toTreasuryId,
      toTreasuryName: toTr.name,
      amount: Number(transferForm.amount),
      notes: transferForm.notes
    });

    setIsTransferModalOpen(false);
  };

  // Filtered Treasuries
  const filteredTreasuries = treasuries.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeSubTab === 'cash') return matchesSearch && t.type === 'cash';
    if (activeSubTab === 'banks') return matchesSearch && t.type === 'bank';
    if (activeSubTab === 'wallets') return matchesSearch && t.type === 'wallet';
    return matchesSearch;
  });

  const totalCash = treasuries.filter(t => t.type === 'cash').reduce((sum, t) => sum + t.balance, 0);
  const totalBanks = treasuries.filter(t => t.type === 'bank').reduce((sum, t) => sum + t.balance, 0);
  const totalWallets = treasuries.filter(t => t.type === 'wallet').reduce((sum, t) => sum + t.balance, 0);

  return (
    <div className="space-y-6">

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-100">الخزائن النقدية (الكاش)</span>
            <Wallet className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-2xl font-black font-mono">
            {new Intl.NumberFormat('ar-EG').format(totalCash)} ج.م
          </div>
          <p className="text-[11px] text-emerald-200 mt-1">
            {treasuries.filter(t => t.type === 'cash').length} خزائن مسجلة
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-100">الحسابات البنكية</span>
            <Landmark className="w-5 h-5 text-blue-200" />
          </div>
          <div className="text-2xl font-black font-mono">
            {new Intl.NumberFormat('ar-EG').format(totalBanks)} ج.م
          </div>
          <p className="text-[11px] text-blue-200 mt-1">
            {treasuries.filter(t => t.type === 'bank').length} حسابات بنكية
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-violet-800 text-white p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-100">المحافظ الإلكترونية (انستاباي / كاش)</span>
            <Smartphone className="w-5 h-5 text-purple-200" />
          </div>
          <div className="text-2xl font-black font-mono">
            {new Intl.NumberFormat('ar-EG').format(totalWallets)} ج.م
          </div>
          <p className="text-[11px] text-purple-200 mt-1">
            {treasuries.filter(t => t.type === 'wallet').length} محافظ نشطة
          </p>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'all'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <WalletCards className="w-4 h-4" />
          <span>كافة الحسابات ({treasuries.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cash')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'cash'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>الخزائن النقدية ({treasuries.filter(t => t.type === 'cash').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('banks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'banks'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>البنوك ({treasuries.filter(t => t.type === 'bank').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wallets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'wallets'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>المحافظ الإلكترونية ({treasuries.filter(t => t.type === 'wallet').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transfers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'transfers'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>التحويلات المالية بين الحسابات ({treasuryTransfers.length})</span>
        </button>
      </div>

      {/* SUBTAB: TREASURY LISTINGS */}
      {activeSubTab !== 'transfers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم الخزينة أو البنك أو الكود..."
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenTreasuryModal('cash')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ خزينة نقدية</span>
              </button>
              <button
                onClick={() => handleOpenTreasuryModal('bank')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ حساب بنكي</span>
              </button>
              <button
                onClick={() => handleOpenTreasuryModal('wallet')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ محفظة إلكترونية</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTreasuries.map(tr => {
              const Icon = tr.type === 'cash' ? Wallet : tr.type === 'bank' ? Landmark : Smartphone;
              const typeColor = tr.type === 'cash' ? 'text-emerald-600 bg-emerald-50' : tr.type === 'bank' ? 'text-blue-600 bg-blue-50' : 'text-purple-600 bg-purple-50';

              return (
                <div key={tr.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className={`p-2.5 rounded-xl ${typeColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {tr.code}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 mb-1">{tr.name}</h4>

                    <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      {tr.type === 'cash' && (
                        <div>المسئول: <b className="text-slate-800">{tr.manager || 'أمين الصندوق'}</b></div>
                      )}
                      {tr.type === 'bank' && (
                        <>
                          <div>رقم الحساب: <span className="font-mono font-bold text-slate-800">{tr.accountNumber || '-'}</span></div>
                          {tr.bankBranch && <div>الفرع: <span className="text-slate-700">{tr.bankBranch}</span></div>}
                          {tr.iban && <div className="text-[10px] font-mono text-slate-500 truncate">IBAN: {tr.iban}</div>}
                        </>
                      )}
                      {tr.type === 'wallet' && (
                        <>
                          <div>المزود: <b className="text-slate-800">{tr.providerName || 'محفظة رقمية'}</b></div>
                          <div>الرقم / المعرف: <span className="font-mono font-bold text-purple-700">{tr.walletNumber}</span></div>
                        </>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between pt-2">
                      <span className="text-xs text-slate-500">الرصيد الحالي:</span>
                      <span className="text-lg font-black font-mono text-emerald-700">
                        {new Intl.NumberFormat('ar-EG').format(tr.balance)} ج.م
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenTreasuryModal(tr.type, tr)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, id: tr.id, name: tr.name })}
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

      {/* SUBTAB: TRANSFERS BETWEEN FINANCIAL ACCOUNTS */}
      {activeSubTab === 'transfers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">حركات التحويل المالي</h3>
              <p className="text-xs text-slate-500">تحويلات فورية ما بين الخزائن النقدية، الحسابات البنكية، والمحافظ الإلكترونية</p>
            </div>
            <button
              onClick={handleOpenTransferModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>إجراء تحويل مالي جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">رقم السند</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">من حساب (المصدر)</th>
                    <th className="py-3 px-4">إلى حساب (الوجهة)</th>
                    <th className="py-3 px-4">المبلغ المحول</th>
                    <th className="py-3 px-4">البيان والملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {treasuryTransfers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        لا توجد تحويلات مالية مسجلة بعد
                      </td>
                    </tr>
                  ) : (
                    treasuryTransfers.map(trf => (
                      <tr key={trf.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{trf.code}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{trf.date}</td>
                        <td className="py-3 px-4 font-semibold text-rose-700">{trf.fromTreasuryName}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">{trf.toTreasuryName}</td>
                        <td className="py-3 px-4 font-mono font-black text-slate-900">
                          {new Intl.NumberFormat('ar-EG').format(trf.amount)} ج.م
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs">{trf.notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TREASURY (خزينة أو بنك أو محفظة) */}
      <Modal
        isOpen={isTreasuryModalOpen}
        onClose={() => setIsTreasuryModalOpen(false)}
        title={
          editingTreasury ? `تعديل ${treasuryTypeToCreate === 'cash' ? 'الخزينة' : treasuryTypeToCreate === 'bank' ? 'البنك' : 'المحفظة'}`
          : `إضافة ${treasuryTypeToCreate === 'cash' ? 'خزينة نقدية جديدة' : treasuryTypeToCreate === 'bank' ? 'حساب بنكي جديد' : 'محفظة إلكترونية جديدة'}`
        }
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTreasury} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كود الحساب *</label>
              <input
                type="text"
                required
                value={treasuryForm.code}
                onChange={e => setTreasuryForm({ ...treasuryForm, code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الحساب / الخزينة *</label>
              <input
                type="text"
                required
                value={treasuryForm.name}
                onChange={e => setTreasuryForm({ ...treasuryForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                placeholder={treasuryTypeToCreate === 'cash' ? 'خزينة الفرع الرئيسي' : treasuryTypeToCreate === 'bank' ? 'البنك التجاري الدولي CIB' : 'فودافون كاش مبيعات'}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الرصيد الافتتاحي (ج.م) *</label>
            <input
              type="number"
              step="any"
              required
              value={treasuryForm.balance}
              onChange={e => setTreasuryForm({ ...treasuryForm, balance: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-emerald-700"
            />
          </div>

          {/* Cash Specific */}
          {treasuryTypeToCreate === 'cash' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المسئول عن الخزينة (أمين الصندوق)</label>
              <input
                type="text"
                value={treasuryForm.manager}
                onChange={e => setTreasuryForm({ ...treasuryForm, manager: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                placeholder="اسم أمين الخزينة"
              />
            </div>
          )}

          {/* Bank Specific */}
          {treasuryTypeToCreate === 'bank' && (
            <div className="space-y-3 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-blue-900 block">تفاصيل الحساب البنكي</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">اسم البنك</label>
                  <input
                    type="text"
                    value={treasuryForm.bankName}
                    onChange={e => setTreasuryForm({ ...treasuryForm, bankName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    placeholder="مثال: البنك الأهلي المصري"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">الفرع</label>
                  <input
                    type="text"
                    value={treasuryForm.bankBranch}
                    onChange={e => setTreasuryForm({ ...treasuryForm, bankBranch: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    placeholder="فرع المهندسين"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">رقم الحساب</label>
                  <input
                    type="text"
                    value={treasuryForm.accountNumber}
                    onChange={e => setTreasuryForm({ ...treasuryForm, accountNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">رقم الآيبان IBAN</label>
                  <input
                    type="text"
                    value={treasuryForm.iban}
                    onChange={e => setTreasuryForm({ ...treasuryForm, iban: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    placeholder="EG..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wallet Specific */}
          {treasuryTypeToCreate === 'wallet' && (
            <div className="space-y-3 bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
              <span className="text-xs font-bold text-purple-900 block">تفاصيل المحفظة الرقمية</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">مزود الخدمة</label>
                  <input
                    type="text"
                    value={treasuryForm.providerName}
                    onChange={e => setTreasuryForm({ ...treasuryForm, providerName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    placeholder="فودافون كاش، اورانج، انستاباي"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">رقم الهاتف أو المعرف (IPA)</label>
                  <input
                    type="text"
                    value={treasuryForm.walletNumber}
                    onChange={e => setTreasuryForm({ ...treasuryForm, walletNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    placeholder="010XXXXXXXX أو name@instapay"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات</label>
            <textarea
              rows={2}
              value={treasuryForm.notes}
              onChange={e => setTreasuryForm({ ...treasuryForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTreasuryModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ الحساب
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: TRANSFER BETWEEN TREASURIES */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="إجراء تحويل مالي بين الحسابات"
        subtitle="تحويل مباشر بين الخزائن النقدية والبنوك والمحافظ الإلكترونية"
        maxWidth="md"
      >
        <form onSubmit={handleSaveTransfer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ التحويل</label>
            <input
              type="date"
              required
              value={transferForm.date}
              onChange={e => setTransferForm({ ...transferForm, date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-700 mb-1">من حساب (المسحوب منه) *</label>
            <select
              value={transferForm.fromTreasuryId}
              onChange={e => setTransferForm({ ...transferForm, fromTreasuryId: e.target.value })}
              className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {treasuries.map(t => (
                <option key={t.id} value={t.id}>{t.name} (رصيد: {new Intl.NumberFormat('ar-EG').format(t.balance)} ج.م)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-700 mb-1">إلى حساب (المودع فيه) *</label>
            <select
              value={transferForm.toTreasuryId}
              onChange={e => setTransferForm({ ...transferForm, toTreasuryId: e.target.value })}
              className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {treasuries.map(t => (
                <option key={t.id} value={t.id}>{t.name} (رصيد: {new Intl.NumberFormat('ar-EG').format(t.balance)} ج.م)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المحول (ج.م) *</label>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={transferForm.amount}
              onChange={e => setTransferForm({ ...transferForm, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-black text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البيان / ملاحظات التحويل</label>
            <textarea
              rows={2}
              value={transferForm.notes}
              onChange={e => setTransferForm({ ...transferForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="تغذية نقدية للخزينة، إيداع مبيعات بالبنك..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              تنفيذ التحويل
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={() => deleteTreasury(deleteDialog.id)}
        title="تأكيد حذف الحساب المالي"
        message={`هل أنت متأكد من حذف الحساب [${deleteDialog.name}]؟ سيتم حذف بياناته من النظام.`}
      />

    </div>
  );
};
