import React, { useState } from 'react';
import { ERPProvider } from './context/ERPContext';
import { Sidebar, MainTabType } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { WarehousesAndItemsTab } from './components/tabs/WarehousesAndItemsTab';
import { CustomersTab } from './components/tabs/CustomersTab';
import { SuppliersTab } from './components/tabs/SuppliersTab';
import { TreasuriesTab } from './components/tabs/TreasuriesTab';
import { ExpensesRevenuesTab } from './components/tabs/ExpensesRevenuesTab';
import { PartnersTab } from './components/tabs/PartnersTab';
import { UsersAndCompanyTab } from './components/tabs/UsersAndCompanyTab';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<MainTabType>('warehouses_items');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-['Cairo',sans-serif] text-slate-800" dir="rtl">
      
      {/* RTL Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar currentTab={currentTab} />

        {/* Tab Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {currentTab === 'warehouses_items' && <WarehousesAndItemsTab />}
            {currentTab === 'customers' && <CustomersTab />}
            {currentTab === 'suppliers' && <SuppliersTab />}
            {currentTab === 'treasuries' && <TreasuriesTab />}
            {currentTab === 'expenses_revenues' && <ExpensesRevenuesTab />}
            {currentTab === 'partners' && <PartnersTab />}
            {currentTab === 'users_company' && <UsersAndCompanyTab />}

          </div>
        </main>

      </div>

    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <AppContent />
    </ERPProvider>
  );
}
