import React, { useRef } from 'react';
import { 
  Building2, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Wallet, 
  TrendingUp,
  Package
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { MainTabType } from './Sidebar';

interface NavbarProps {
  currentTab: MainTabType;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab }) => {
  const { 
    companySettings, 
    treasuries, 
    items, 
    currentUser, 
    resetToDefaultData, 
    exportDatabaseJSON, 
    importDatabaseJSON 
  } = useERP();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabTitles: Record<MainTabType, string> = {
    warehouses_items: 'إدارة المخازن والأصناف والمستودعات',
    customers: 'إدارة العملاء والفواتير وسندات القبض',
    suppliers: 'إدارة الموردين وفواتير الشراء وسندات الدفع',
    treasuries: 'إدارة الخزائن النقدية والبنوك والمحافظ الإلكترونية',
    expenses_revenues: 'إدارة بنود وحركات المصروفات والإيرادات',
    partners: 'إدارة الشركاء وجاري الشركاء والحصص المالية',
    users_company: 'صلاحيات المستخدمين وبيانات المنشأة والطباعة'
  };

  const totalTreasuryBalance = treasuries.reduce((sum, t) => sum + (t.balance || 0), 0);
  const totalStockUnits = items.reduce((sum, item) => {
    return sum + Object.values(item.stockByWarehouse || {}).reduce((a, b) => a + (b || 0), 0);
  }, 0);

  const handleExport = () => {
    const json = exportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alradwan_erp_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJSON(content);
      if (success) {
        alert('تم استيراد قاعدة البيانات بنجاح!');
      } else {
        alert('حدث خطأ في قراءة ملف النسخة الاحتياطية.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between no-print z-10 shrink-0">
      
      {/* Active Tab Title & Company Name */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">
              {tabTitles[currentTab]}
            </h2>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              المرحلة الأولى
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            المنشأة: <span className="text-slate-700 font-semibold">{companySettings.name}</span>
          </p>
        </div>
      </div>

      {/* KPI Badges & Action Buttons */}
      <div className="flex items-center gap-3">
        
        {/* KPI: Treasury Balance */}
        <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs">
          <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-emerald-600 font-medium">سيولة الخزائن والبنوك</div>
            <div className="font-mono font-bold">{new Intl.NumberFormat('ar-EG').format(totalTreasuryBalance)} ج.م</div>
          </div>
        </div>

        {/* KPI: Total Stock */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-800 text-xs">
          <div className="p-1 rounded-lg bg-amber-100 text-amber-700">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-amber-600 font-medium">إجمالي قطع المستودعات</div>
            <div className="font-mono font-bold">{new Intl.NumberFormat('ar-EG').format(totalStockUnits)} وحدة</div>
          </div>
        </div>

        {/* Database Actions */}
        <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="تصدير نسخة احتياطية من قاعدة البيانات بصيغة JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نسخة احتياطية</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="استيراد قاعدة بيانات من ملف JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">استيراد</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => {
              if (window.confirm('هل تريد إعادة تعيين كافة البيانات إلى البيانات التجريبية الافتراضية؟')) {
                resetToDefaultData();
              }
            }}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
            title="إعادة تعيين البيانات الافتراضية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {currentUser.fullName ? currentUser.fullName.charAt(0) : 'أ'}
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-slate-800 leading-none">{currentUser.fullName}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {currentUser.role === 'admin' ? 'مدير نظام كامل الصلاحيات' : 'محاسب'}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
};
