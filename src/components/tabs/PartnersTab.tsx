import React, { useState } from 'react';
import { 
  Handshake, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  PieChart,
  UserCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Partner, PartnerCurrentAccount } from '../../types/erp';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

type SubTab = 'partners' | 'current_accounts';

export const PartnersTab: React.FC = () => {
  const {
    partners,
    addPartner,
    updatePartner,
    deletePartner,
    partnerCurrentAccounts,
    addPartnerMovement,
    treasuries
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('partners');
  const [searchTerm, setSearchTerm] = useState('');

  // Partner Modal
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partnerForm, setPartnerForm] = useState({
    code: '',
    name: '',
    capital: 100000,
    sharePercentage: 50,
    phone: '',
    email: '',
    notes: ''
  });

  // Partner Movement Modal (إيداع / مسحوبات / توزيع أرباح)
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0]?.id || '');
  const [movementForm, setMovementForm] = useState<{
    type: 'deposit' | 'withdrawal' | 'profit_share' | 'capital_adjustment';
    amount: number;
    description: string;
    treasuryId: string;
  }>({
    type: 'deposit',
    amount: 10000,
    description: '',
    treasuryId: treasuries[0]?.id || ''
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

  // --- Handlers: Partner ---
  const handleOpenPartnerModal = (p?: Partner) => {
    if (p) {
      setEditingPartner(p);
      setPartnerForm({
        code: p.code,
        name: p.name,
        capital: p.capital,
        sharePercentage: p.sharePercentage,
        phone: p.phone,
        email: p.email || '',
        notes: p.notes || ''
      });
    } else {
      setEditingPartner(null);
      setPartnerForm({
        code: `PRT-0${partners.length + 1}`,
        name: '',
        capital: 500000,
        sharePercentage: 50,
        phone: '',
        email: '',
        notes: ''
      });
    }
    setIsPartnerModalOpen(true);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.code || !partnerForm.name) return;

    if (editingPartner) {
      updatePartner(editingPartner.id, {
        code: partnerForm.code,
        name: partnerForm.name,
        capital: Number(partnerForm.capital),
        sharePercentage: Number(partnerForm.sharePercentage),
        phone: partnerForm.phone,
        email: partnerForm.email,
        notes: partnerForm.notes
      });
    } else {
      addPartner({
        code: partnerForm.code,
        name: partnerForm.name,
        capital: Number(partnerForm.capital),
        sharePercentage: Number(partnerForm.sharePercentage),
        phone: partnerForm.phone,
        email: partnerForm.email,
        notes: partnerForm.notes
      });
    }
    setIsPartnerModalOpen(false);
  };

  // --- Handlers: Partner Movement ---
  const handleOpenMovementModal = (partnerId?: string) => {
    if (partnerId) setSelectedPartnerId(partnerId);
    else if (partners.length > 0) setSelectedPartnerId(partners[0].id);

    setMovementForm({
      type: 'withdrawal',
      amount: 5000,
      description: 'مسحوبات شخصية دورية',
      treasuryId: treasuries[0]?.id || ''
    });
    setIsMovementModalOpen(true);
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (movementForm.amount <= 0 || !selectedPartnerId) return;

    addPartnerMovement(selectedPartnerId, movementForm);
    setIsMovementModalOpen(false);
  };

  const totalCapital = partners.reduce((sum, p) => sum + p.capital, 0);
  const totalPercentage = partners.reduce((sum, p) => sum + p.sharePercentage, 0);

  return (
    <div className="space-y-6">

      {/* Synchronized Rule Notification Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-indigo-950">نظام الربط الآلي لجاري الشركاء مفعل</h4>
            <p className="text-xs text-indigo-700 mt-0.5">
              عند إضافة شريك جديد يتم إنشاء حسابه الجاري فورياً، وعند تعديل اسم الشريك يتم تحديثه تلقائياً في جاري الشركاء وسجل الحركات.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 font-mono text-xs">
          <span className="px-3 py-1 bg-white rounded-lg border border-indigo-200 text-indigo-900 font-bold">
            إجمالي رأس المال: {new Intl.NumberFormat('ar-EG').format(totalCapital)} ج.م
          </span>
          <span className="px-3 py-1 bg-white rounded-lg border border-indigo-200 text-indigo-900 font-bold">
            مجموع الحصص: {totalPercentage}%
          </span>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('partners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'partners'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Handshake className="w-4 h-4" />
          <span>سجل الشركاء ورؤوس الأموال ({partners.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('current_accounts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'current_accounts'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>جاري الشركاء والمسحوبات والإيداعات ({partnerCurrentAccounts.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: PARTNERS */}
      {activeSubTab === 'partners' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">بيانات الشركاء والحصص</h3>
              <p className="text-xs text-slate-500">إدارة الشركاء ونسب الملكية وحصص رأس المال وتفاصيل الاتصال</p>
            </div>

            <button
              onClick={() => handleOpenPartnerModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة شريك جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.map(p => {
              const currentAcc = partnerCurrentAccounts.find(pca => pca.partnerId === p.id);

              return (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
                        <Handshake className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 font-bold text-xs text-indigo-800 border border-indigo-200">
                          نسبة الشراكة: {p.sharePercentage}%
                        </span>
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                          {p.code}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-lg text-slate-900 mb-1">{p.name}</h4>
                    {p.notes && <p className="text-xs text-slate-500 mb-3">{p.notes}</p>}

                    <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">رأس المال المكتتب به:</span>
                        <span className="font-mono font-bold text-slate-800">{new Intl.NumberFormat('ar-EG').format(p.capital)} ج.م</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">رقم الهاتف:</span>
                        <span className="font-mono font-bold text-slate-800">{p.phone || '-'}</span>
                      </div>
                      {p.email && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">البريد:</span>
                          <span className="text-slate-700">{p.email}</span>
                        </div>
                      )}
                      <div className="border-t border-slate-200 pt-2 flex justify-between">
                        <span className="text-slate-700 font-semibold">رصيد الحساب الجاري الحالي:</span>
                        <span className={`font-mono font-black ${
                          (currentAcc?.currentBalance || 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}>
                          {new Intl.NumberFormat('ar-EG').format(Math.abs(currentAcc?.currentBalance || 0))} ج.م
                          <span className="text-[10px] mr-1 font-normal text-slate-500">
                            {(currentAcc?.currentBalance || 0) >= 0 ? '(له في المنشأة)' : '(عليه للمنشأة)'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenMovementModal(p.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>حركة جاري (سحب/إيداع)</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenPartnerModal(p)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: p.id, name: p.name })}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PARTNERS CURRENT ACCOUNTS */}
      {activeSubTab === 'current_accounts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">حسابات جاري الشركاء</h3>
              <p className="text-xs text-slate-500">متابعة المسحوبات الشخصية، الإيداعات الإضافية، وتوزيعات الأرباح لكل شريك</p>
            </div>

            <button
              onClick={() => handleOpenMovementModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل حركة جديدة لجاري شريك</span>
            </button>
          </div>

          <div className="space-y-6">
            {partnerCurrentAccounts.map(pca => (
              <div key={pca.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block mb-0.5">اسم الشريك (مرتبط آلياً):</span>
                    <h4 className="text-base font-black text-slate-900">{pca.partnerName}</h4>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-slate-500 block">صافي رصيد جاري الشريك:</span>
                    <span className={`text-lg font-black font-mono ${
                      pca.currentBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {new Intl.NumberFormat('ar-EG').format(Math.abs(pca.currentBalance))} ج.م
                      <span className="text-xs mr-1 font-semibold text-slate-600">
                        {pca.currentBalance >= 0 ? '(دائن - له رصيد)' : '(مدين - مسحوبات عليه)'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">التاريخ</th>
                        <th className="py-2.5 px-3">نوع الحركة</th>
                        <th className="py-2.5 px-3">المبلغ</th>
                        <th className="py-2.5 px-3">الخزينة / الحساب المالي</th>
                        <th className="py-2.5 px-3">البيان والتفاصيل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pca.movements.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-400">لا توجد حركات مسجلة بعد</td>
                        </tr>
                      ) : (
                        pca.movements.map(m => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono text-slate-600">{m.date}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                m.type === 'deposit' || m.type === 'capital_adjustment'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : m.type === 'profit_share'
                                  ? 'bg-blue-50 text-blue-800'
                                  : 'bg-rose-50 text-rose-800'
                              }`}>
                                {m.type === 'deposit' ? 'إيداع نقدية' :
                                 m.type === 'withdrawal' ? 'مسحوبات شريك' :
                                 m.type === 'profit_share' ? 'توزيع أرباح' : 'إثبات رأس مال'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-black text-slate-900">
                              {new Intl.NumberFormat('ar-EG').format(m.amount)} ج.م
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{m.treasuryName || 'قيد دفتري'}</td>
                            <td className="py-2.5 px-3 text-slate-700 font-medium">{m.description}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: PARTNER (إضافة / تعديل شريك) */}
      <Modal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        title={editingPartner ? 'تعديل بيانات الشريك' : 'إضافة شريك جديد'}
        subtitle="عند حفظ الاسم يتم تحديثه تلقائياً في جاري الشركاء"
        maxWidth="lg"
      >
        <form onSubmit={handleSavePartner} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كود الشريك *</label>
              <input
                type="text"
                required
                value={partnerForm.code}
                onChange={e => setPartnerForm({ ...partnerForm, code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الشريك بالكامل *</label>
              <input
                type="text"
                required
                value={partnerForm.name}
                onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                placeholder="اسم الشريك الثلاثي"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">حصة رأس المال (ج.م) *</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={partnerForm.capital}
                onChange={e => setPartnerForm({ ...partnerForm, capital: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-indigo-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نسبة الشراكة والأرباح (%) *</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={partnerForm.sharePercentage}
                onChange={e => setPartnerForm({ ...partnerForm, sharePercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف *</label>
              <input
                type="text"
                required
                value={partnerForm.phone}
                onChange={e => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                placeholder="010XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={partnerForm.email}
                onChange={e => setPartnerForm({ ...partnerForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات وشروط عقد الشراكة</label>
            <textarea
              rows={2}
              value={partnerForm.notes}
              onChange={e => setPartnerForm({ ...partnerForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPartnerModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ الشريك
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: PARTNER CURRENT MOVEMENT */}
      <Modal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        title="تسجيل حركة على جاري الشريك"
        subtitle="مسحوبات أرباح، إيداعات نقدية، أو توزيعات دورية"
        maxWidth="md"
      >
        <form onSubmit={handleSaveMovement} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الشريك *</label>
            <select
              value={selectedPartnerId}
              onChange={e => setSelectedPartnerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.name} (نسبة {p.sharePercentage}%)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحركة *</label>
              <select
                value={movementForm.type}
                onChange={e => setMovementForm({ ...movementForm, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="withdrawal">مسحوبات شخصية (عليه)</option>
                <option value="deposit">إيداع نقدية في الشركة (له)</option>
                <option value="profit_share">إثبات نصيب أرباح (له)</option>
                <option value="capital_adjustment">تعديل حصة رأس المال</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ (ج.م) *</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={movementForm.amount}
                onChange={e => setMovementForm({ ...movementForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-black text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الخزينة / الحساب المالي المرتبط</label>
            <select
              value={movementForm.treasuryId}
              onChange={e => setMovementForm({ ...movementForm, treasuryId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="">(قيد دفتري بدون صرف من الخزينة)</option>
              {treasuries.map(tr => (
                <option key={tr.id} value={tr.id}>{tr.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البيان والسبب</label>
            <input
              type="text"
              required
              value={movementForm.description}
              onChange={e => setMovementForm({ ...movementForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="وذلك عن مسحوبات شخصية لشهر فبراير..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsMovementModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ الحركة
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={() => deletePartner(deleteDialog.id)}
        title="تأكيد حذف الشريك"
        message={`هل أنت متأكد من حذف الشريك [${deleteDialog.name}]؟ سيتم حذف بياناته وحسابه الجاري من النظام.`}
      />

    </div>
  );
};
