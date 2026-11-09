import React from 'react';
import {
  Boxes,
  Users,
  Truck,
  WalletCards,
  Receipt,
  Handshake,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  Building2
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export type MainTabType = 
  | 'warehouses_items'
  | 'customers'
  | 'suppliers'
  | 'treasuries'
  | 'expenses_revenues'
  | 'partners'
  | 'users_company';

interface SidebarProps {
  currentTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse
}) => {
  const { 
    warehouses, 
    items, 
    customers, 
    suppliers, 
    treasuries, 
    partners 
  } = useERP();

  const navItems = [
    {
      id: 'warehouses_items' as MainTabType,
      title: 'المخازن والأصناف',
      subtitle: 'المستودعات، الأصناف، الوحدات، التحويلات، متوسط التكلفة',
      icon: Boxes,
      badge: `${items.length} صنف / ${warehouses.length} مخزن`,
      color: 'text-amber-500'
    },
    {
      id: 'customers' as MainTabType,
      title: 'إدارة العملاء',
      subtitle: 'العملاء، المناطق، فواتير المبيعات، سندات القبض',
      icon: Users,
      badge: `${customers.length} عميل`,
      color: 'text-blue-500'
    },
    {
      id: 'suppliers' as MainTabType,
      title: 'إدارة الموردين',
      subtitle: 'الموردين، فواتير الشراء والمردود، سندات الدفع',
      icon: Truck,
      badge: `${suppliers.length} مورد`,
      color: 'text-emerald-500'
    },
    {
      id: 'treasuries' as MainTabType,
      title: 'الخزائن والبنوك والمحافظ',
      subtitle: 'نقدية، بنوك، محافظ إلكترونية، تحويلات مالية',
      icon: WalletCards,
      badge: `${treasuries.length} حساب`,
      color: 'text-purple-500'
    },
    {
      id: 'expenses_revenues' as MainTabType,
      title: 'المصروفات والإيرادات',
      subtitle: 'بنود المصروفات، الإيرادات وسجلات الحركات',
      icon: Receipt,
      color: 'text-rose-500'
    },
    {
      id: 'partners' as MainTabType,
      title: 'الشركاء وجاري الشركاء',
      subtitle: 'الحصص، رأس المال، جاري الشريك، المسحوبات',
      icon: Handshake,
      badge: `${partners.length} شريك`,
      color: 'text-indigo-500'
    },
    {
      id: 'users_company' as MainTabType,
      title: 'المستخدمين وبيانات المنشأة',
      subtitle: 'الصلاحيات، بيانات الشركة، إعدادات الطباعة',
      icon: ShieldCheck,
      color: 'text-teal-500'
    }
  ];

  return (
    <aside 
      className={`relative bg-slate-900 text-slate-100 flex flex-col border-l border-slate-800 transition-all duration-300 z-20 no-print select-none ${
        isCollapsed ? 'w-20' : 'w-72 lg:w-80'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight truncate">
              <h1 className="font-black text-lg text-white tracking-wide">الرضوان للحسابات</h1>
              <p className="text-[11px] text-emerald-400 font-medium tracking-tight">نظام تخطيط الموارد ERP v1.0</p>
            </div>
          )}
        </div>

        {/* Toggle Collapse */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
        >
          {isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {!isCollapsed && (
          <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            المرحلة الأولى: البيانات الأساسية
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-right transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
              title={isCollapsed ? item.title : undefined}
            >
              <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-white/10 text-white' : 'bg-slate-800/50 ' + item.color}`}>
                <Icon className="w-5 h-5" />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate">{item.title}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {item.subtitle}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status / Facility Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>قاعدة البيانات المحلية: نشطة ومتصلة</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            وضع العمل: محلي دون انقطاع (Offline Ready)
          </div>
        </div>
      )}
    </aside>
  );
};
