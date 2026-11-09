import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Upload, 
  Check, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Lock,
  Printer,
  Sparkles,
  Phone,
  FileText
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { SystemUser, UserPermissions, CompanySettings } from '../../types/erp';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

type SubTab = 'company' | 'users';

export const UsersAndCompanyTab: React.FC = () => {
  const {
    companySettings,
    updateCompanySettings,
    users,
    currentUser,
    setCurrentUser,
    addUser,
    updateUser,
    deleteUser
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('company');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Company Form state
  const [companyForm, setCompanyForm] = useState<CompanySettings>(companySettings);

  // User Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userForm, setUserForm] = useState<{
    username: string;
    fullName: string;
    role: 'admin' | 'accountant' | 'warehouse_keeper' | 'cashier' | 'custom';
    email: string;
    phone: string;
    isActive: boolean;
    permissions: UserPermissions;
  }>({
    username: '',
    fullName: '',
    role: 'accountant',
    email: '',
    phone: '',
    isActive: true,
    permissions: {
      warehouses: { view: true, add: false, edit: false, delete: false },
      items: { view: true, add: false, edit: false, delete: false },
      customers: { view: true, add: true, edit: true, delete: false },
      salesInvoices: { view: true, add: true, edit: true, delete: false, print: true },
      suppliers: { view: true, add: false, edit: false, delete: false },
      purchaseInvoices: { view: true, add: false, edit: false, delete: false, print: true },
      treasuries: { view: true, add: false, edit: false, delete: false },
      expenses: { view: true, add: true, edit: false, delete: false },
      revenues: { view: true, add: true, edit: false, delete: false },
      partners: { view: false, add: false, edit: false, delete: false },
      users: { view: false, add: false, edit: false, delete: false },
      settings: { view: false, add: false, edit: false, delete: false }
    }
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

  // Logo upload preview helper
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCompanyForm(prev => ({ ...prev, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(companyForm);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // --- Handlers: User ---
  const handleOpenUserModal = (u?: SystemUser) => {
    if (u) {
      setEditingUser(u);
      setUserForm({
        username: u.username,
        fullName: u.fullName,
        role: u.role,
        email: u.email,
        phone: u.phone,
        isActive: u.isActive,
        permissions: JSON.parse(JSON.stringify(u.permissions))
      });
    } else {
      setEditingUser(null);
      setUserForm({
        username: '',
        fullName: '',
        role: 'accountant',
        email: '',
        phone: '',
        isActive: true,
        permissions: {
          warehouses: { view: true, add: false, edit: false, delete: false },
          items: { view: true, add: false, edit: false, delete: false },
          customers: { view: true, add: true, edit: true, delete: false },
          salesInvoices: { view: true, add: true, edit: true, delete: false, print: true },
          suppliers: { view: true, add: false, edit: false, delete: false },
          purchaseInvoices: { view: true, add: false, edit: false, delete: false, print: true },
          treasuries: { view: true, add: false, edit: false, delete: false },
          expenses: { view: true, add: true, edit: false, delete: false },
          revenues: { view: true, add: true, edit: false, delete: false },
          partners: { view: false, add: false, edit: false, delete: false },
          users: { view: false, add: false, edit: false, delete: false },
          settings: { view: false, add: false, edit: false, delete: false }
        }
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.username || !userForm.fullName) return;

    if (editingUser) {
      updateUser(editingUser.id, userForm);
    } else {
      addUser(userForm);
    }
    setIsUserModalOpen(false);
  };

  const handlePermissionToggle = (moduleKey: keyof UserPermissions, permKey: 'view' | 'add' | 'edit' | 'delete' | 'print') => {
    setUserForm(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleKey]: {
          ...prev.permissions[moduleKey],
          [permKey]: !prev.permissions[moduleKey][permKey]
        }
      }
    }));
  };

  const moduleLabels: Record<keyof UserPermissions, string> = {
    warehouses: 'المستودعات والمخازن',
    items: 'الأصناف ودليل الأسعار',
    customers: 'العملاء والمناطق',
    salesInvoices: 'فواتير المبيعات ومردوداتها',
    suppliers: 'الموردين',
    purchaseInvoices: 'فواتير المشتريات ومردوداتها',
    treasuries: 'الخزائن والبنوك والمحافظ',
    expenses: 'المصروفات',
    revenues: 'الإيرادات',
    partners: 'الشركاء وجاري الشركاء',
    users: 'إدارة المستخدمين',
    settings: 'بيانات المنشأة وإعدادات النظام'
  };

  return (
    <div className="space-y-6">

      {/* Sub-tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('company')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'company'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>بيانات المنشأة والترويسة المطبوعة</span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>مستخدمو النظام ومصفوفة الصلاحيات ({users.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: COMPANY SETTINGS & PRINT TOGGLES */}
      {activeSubTab === 'company' && (
        <form onSubmit={handleSaveCompanySettings} className="space-y-6">
          
          {saveSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>تم حفظ وتحديث بيانات المنشأة وخيارات الفواتير بنجاح!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Data fields */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                بيانات المنشأة الرسمية والنشاط
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم المنشأة / الشركة *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.name}
                    onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">نشاط المنشأة التجاري</label>
                  <input
                    type="text"
                    value={companyForm.activity}
                    onChange={e => setCompanyForm({ ...companyForm, activity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                    placeholder="مثال: تجارة وتوزيع الأجهزة الكهربائية والمعدات"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم السجل التجاري (س.ت) *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.commercialRegister}
                    onChange={e => setCompanyForm({ ...companyForm, commercialRegister: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    placeholder="س.ت: 104820"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الرقم الضريبي (ب.ض) *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.taxNumber}
                    onChange={e => setCompanyForm({ ...companyForm, taxNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    placeholder="ب.ض: 429-873-102"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف 1 *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.phone1}
                    onChange={e => setCompanyForm({ ...companyForm, phone1: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف 2</label>
                  <input
                    type="text"
                    value={companyForm.phone2}
                    onChange={e => setCompanyForm({ ...companyForm, phone2: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">عنوان المقر الرئيسي *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.address}
                    onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات وشروط الفاتورة الافتراضية</label>
                  <textarea
                    rows={2}
                    value={companyForm.printOptions.termsNotes}
                    onChange={e => setCompanyForm({
                      ...companyForm,
                      printOptions: {
                        ...companyForm.printOptions,
                        termsNotes: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="شروط الاسترجاع والضمان..."
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Logo & Print Options Checkboxes */}
            <div className="space-y-6">
              
              {/* Logo Upload Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-slate-800">شعار المنشأة (لوجو)</h4>
                
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  {companyForm.logoUrl ? (
                    <div className="relative group mb-2">
                      <img
                        src={companyForm.logoUrl}
                        alt="Logo Preview"
                        className="w-24 h-24 object-contain rounded-lg border border-slate-200 bg-white p-1"
                      />
                      <button
                        type="button"
                        onClick={() => setCompanyForm({ ...companyForm, logoUrl: '' })}
                        className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full text-xs shadow-xs cursor-pointer"
                        title="إزالة اللوجو"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">لم يتم اختيار شعار بعد</p>
                    </div>
                  )}

                  <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors">
                    <Upload className="w-3.5 h-3.5 inline ml-1.5" />
                    <span>رفع صورة اللوجو</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Requirement Checkboxes:
                  "مع امكانية اختيار اي من هذه التفاصيل تظهر في الفواتير و التقارير" */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Printer className="w-4 h-4 text-teal-600" />
                  <h4 className="font-bold text-sm text-slate-800">بيانات الظهور في الفواتير والتقارير</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  حدد العناصر التي ترغب في طباعتها وظهورها بترويسة الفواتير وسندات القبض والصرف الرسمية:
                </p>

                <div className="space-y-2.5 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={companyForm.printOptions.showName}
                      onChange={e => setCompanyForm({
                        ...companyForm,
                        printOptions: { ...companyForm.printOptions, showName: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span>إظهار اسم المنشأة والنشاط بالترويسة</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={companyForm.printOptions.showLogo}
                      onChange={e => setCompanyForm({
                        ...companyForm,
                        printOptions: { ...companyForm.printOptions, showLogo: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span>إظهار شعار المنشأة (اللوجو)</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={companyForm.printOptions.showAddress}
                      onChange={e => setCompanyForm({
                        ...companyForm,
                        printOptions: { ...companyForm.printOptions, showAddress: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span>إظهار عنوان المقر والمستودع</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={companyForm.printOptions.showCommercialRegister}
                      onChange={e => setCompanyForm({
                        ...companyForm,
                        printOptions: { ...companyForm.printOptions, showCommercialRegister: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span>إظهار رقم السجل التجاري</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={companyForm.printOptions.showTaxNumber}
                      onChange={e => setCompanyForm({
                        ...companyForm,
                        printOptions: { ...companyForm.printOptions, showTaxNumber: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span>إظهار الرقم الضريبي (القيمة المضافة)</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={companyForm.printOptions.showPhone}
                      onChange={e => setCompanyForm({
                        ...companyForm,
                        printOptions: { ...companyForm.printOptions, showPhone: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span>إظهار أرقام الهواتف والفاكس</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={companyForm.printOptions.showTerms}
                      onChange={e => setCompanyForm({
                        ...companyForm,
                        printOptions: { ...companyForm.printOptions, showTerms: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span>إظهار شروط وملاحظات الاسترجاع بأسفل الفاتورة</span>
                  </label>
                </div>
              </div>

            </div>

          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>حفظ بيانات المنشأة وخيارات الطباعة</span>
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB 2: USERS AND PERMISSIONS */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">مستخدمو النظام ومصفوفة الصلاحيات</h3>
              <p className="text-xs text-slate-500">
                إضافة مستخدمين جدد وتخصيص صلاحيات دقيقة لكل شاشة (عرض، إضافة، تعديل، حذف، طباعة)
              </p>
            </div>

            <button
              onClick={() => handleOpenUserModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مستخدم جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">اسم المستخدم</th>
                  <th className="py-3 px-4">الاسم الكامل</th>
                  <th className="py-3 px-4">الدور الوظيفي</th>
                  <th className="py-3 px-4">بيانات الاتصال</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">إجراءات الصلاحيات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{u.username}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{u.fullName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'accountant' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role === 'admin' ? 'مدير نظام كامل' :
                         u.role === 'accountant' ? 'محاسب مالي' :
                         u.role === 'warehouse_keeper' ? 'أمين مستودع' : 'كاشير مبيعات'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-600">
                      <div>{u.phone}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        نشط
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenUserModal(u)}
                          className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>تعديل الصلاحيات</span>
                        </button>
                        {users.length > 1 && (
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, id: u.id, name: u.fullName })}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: USER & PERMISSION MATRIX */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingUser ? `تعديل صلاحيات المستخدم: ${editingUser.fullName}` : 'إضافة مستخدم جديد وتحديد الصلاحيات'}
        subtitle="حدد أدق صلاحيات الوصول لكل شاشة في النظام"
        maxWidth="4xl"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المستخدم (تسجيل الدخول) *</label>
              <input
                type="text"
                required
                value={userForm.username}
                onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم بالكامل *</label>
              <input
                type="text"
                required
                value={userForm.fullName}
                onChange={e => setUserForm({ ...userForm, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الدور الوظيفي</label>
              <select
                value={userForm.role}
                onChange={e => setUserForm({ ...userForm, role: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="admin">مدير نظام كامل الصلاحيات</option>
                <option value="accountant">محاسب</option>
                <option value="warehouse_keeper">أمين مخزن</option>
                <option value="cashier">كاشير</option>
                <option value="custom">مخصص</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف</label>
              <input
                type="text"
                value={userForm.phone}
                onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={userForm.email}
                onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* PERMISSIONS MATRIX TABLE */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-800">
              مصفوفة الصلاحيات الدقيقة لكل شاشة وتبويب
            </div>

            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">التبويب / الشاشة</th>
                  <th className="py-2.5 px-3 text-center">عرض واستعلام</th>
                  <th className="py-2.5 px-3 text-center">إضافة جديدة</th>
                  <th className="py-2.5 px-3 text-center">تعديل</th>
                  <th className="py-2.5 px-3 text-center">حذف</th>
                  <th className="py-2.5 px-3 text-center">طباعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Object.keys(userForm.permissions) as Array<keyof UserPermissions>).map(key => {
                  const perm = userForm.permissions[key];

                  return (
                    <tr key={key} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-800">{moduleLabels[key]}</td>
                      
                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.view}
                          onChange={() => handlePermissionToggle(key, 'view')}
                          className="w-4 h-4 rounded text-teal-600 cursor-pointer"
                        />
                      </td>

                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.add}
                          onChange={() => handlePermissionToggle(key, 'add')}
                          className="w-4 h-4 rounded text-teal-600 cursor-pointer"
                        />
                      </td>

                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.edit}
                          onChange={() => handlePermissionToggle(key, 'edit')}
                          className="w-4 h-4 rounded text-teal-600 cursor-pointer"
                        />
                      </td>

                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.delete}
                          onChange={() => handlePermissionToggle(key, 'delete')}
                          className="w-4 h-4 rounded text-teal-600 cursor-pointer"
                        />
                      </td>

                      <td className="py-2 px-3 text-center">
                        {'print' in perm ? (
                          <input
                            type="checkbox"
                            checked={Boolean(perm.print)}
                            onChange={() => handlePermissionToggle(key, 'print')}
                            className="w-4 h-4 rounded text-teal-600 cursor-pointer"
                          />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
            >
              حفظ المستخدم والصلاحيات
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={() => deleteUser(deleteDialog.id)}
        title="تأكيد حذف المستخدم"
        message={`هل أنت متأكد من حذف المستخدم [${deleteDialog.name}]؟`}
      />

    </div>
  );
};
