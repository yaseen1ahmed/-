import {
  CompanySettings,
  Warehouse,
  Unit,
  Item,
  Country,
  Governorate,
  City,
  Customer,
  Supplier,
  Treasury,
  ExpenseCategory,
  RevenueCategory,
  Partner,
  PartnerCurrentAccount,
  SystemUser,
  SalesInvoice,
  PurchaseInvoice,
  ReceiptVoucher,
  PaymentVoucher,
  WarehouseTransfer,
  ExpenseTransaction,
  RevenueTransaction
} from '../types/erp';

export const initialCompanySettings: CompanySettings = {
  name: 'مجموعة الرضوان للتجارة والتوزيع',
  activity: 'تجارة وتوريد الأجهزة الإلكترونية والمعدات الكهربائية وقطع الغيار',
  address: 'شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديدة، مصر',
  commercialRegister: 'س.ت: 184592 - سجل تجاري القاهرة',
  taxNumber: 'ب.ض: 429-873-102 (مصلحة الضرائب المصرية)',
  phone1: '01012345678',
  phone2: '0226789123',
  email: 'info@alradwan-erp.com',
  logoUrl: '',
  printOptions: {
    showName: true,
    showLogo: true,
    showAddress: true,
    showCommercialRegister: true,
    showTaxNumber: true,
    showPhone: true,
    showTerms: true,
    termsNotes: 'البضاعة المباعة ترد وتستبدل خلال 14 يوماً من تاريخ الفاتورة بالحالة الأصلية للغلاف. الأسعار تشمل ضريبة القيمة المضافة ما لم يذكر خلاف ذلك.'
  }
};

export const initialWarehouses: Warehouse[] = [
  {
    id: 'wh-1',
    code: 'WH-01',
    name: 'المستودع الرئيسي - القاهرة',
    manager: 'م. أحمد الشريف',
    phone: '01123456780',
    address: 'المنطقة الصناعية - مدينة نصر',
    notes: 'المستودع المركزي لجميع التوريدات'
  },
  {
    id: 'wh-2',
    code: 'WH-02',
    name: 'مستودع العاشر من رمضان',
    manager: 'أ. محمود عبد الرحمن',
    phone: '01234567891',
    address: 'المنطقة الصناعية B4 - العاشر من رمضان',
    notes: 'مستودع البضائع الكبيرة والأجهزة'
  },
  {
    id: 'wh-3',
    code: 'WH-03',
    name: 'مستودع فرع الإسكندرية',
    manager: 'أ. حسن مصطفى',
    phone: '01098765432',
    address: 'شارع فؤاد - محطة الرمل - الإسكندرية',
    notes: 'مستودع التوزيع لفرع الساحل والدلتا'
  }
];

export const initialUnits: Unit[] = [
  { id: 'u-1', code: 'U-01', name: 'قطعة' },
  { id: 'u-2', code: 'U-02', name: 'كرتونة' },
  { id: 'u-3', code: 'U-03', name: 'دزينة (12 قطعة)' },
  { id: 'u-4', code: 'U-04', name: 'طقم' },
  { id: 'u-5', code: 'U-05', name: 'متر' },
  { id: 'u-6', code: 'U-06', name: 'كيلو' }
];

export const initialItems: Item[] = [
  {
    id: 'item-1',
    code: 'ITM-101',
    name: 'شاشة سامسونج 55 بوصة Smart 4K UHD',
    baseUnitId: 'u-1',
    baseUnitName: 'قطعة',
    additionalUnits: [
      { unitId: 'u-2', unitName: 'كرتونة', conversionFactor: 5, salePrice: 62000, barcode: '6221010001015' }
    ],
    reorderLevel: 10,
    costPrice: 10500,
    salePrice: 12800,
    averageCost: 10500,
    category: 'شاشات وأجهزة منزلية',
    stockByWarehouse: {
      'wh-1': 35,
      'wh-2': 20,
      'wh-3': 12
    },
    notes: 'ضمان الوكيل سنتين'
  },
  {
    id: 'item-2',
    code: 'ITM-102',
    name: 'كابل شاحن أصلي Type-C سريع 65W',
    baseUnitId: 'u-1',
    baseUnitName: 'قطعة',
    additionalUnits: [
      { unitId: 'u-3', unitName: 'دزينة (12 قطعة)', conversionFactor: 12, salePrice: 1600, barcode: '6221020001022' },
      { unitId: 'u-2', unitName: 'كرتونة', conversionFactor: 120, salePrice: 15000, barcode: '6221020001029' }
    ],
    reorderLevel: 50,
    costPrice: 95,
    salePrice: 150,
    averageCost: 95,
    category: 'إكسسوارات وهواتف',
    stockByWarehouse: {
      'wh-1': 240,
      'wh-2': 180,
      'wh-3': 60
    },
    notes: 'مقاوم للقطع وطول 1.5 متر'
  },
  {
    id: 'item-3',
    code: 'ITM-103',
    name: 'طابعة ليزر HP LaserJet Pro متعددة الوظائف',
    baseUnitId: 'u-1',
    baseUnitName: 'قطعة',
    additionalUnits: [],
    reorderLevel: 5,
    costPrice: 7200,
    salePrice: 8900,
    averageCost: 7200,
    category: 'معدات مكتبية وطابعات',
    stockByWarehouse: {
      'wh-1': 14,
      'wh-2': 8,
      'wh-3': 4
    },
    notes: 'تدعم الاتصال اللاسلكي Wi-Fi'
  },
  {
    id: 'item-4',
    code: 'ITM-104',
    name: 'محول طاقة وموزع كهرباء ذكي 6 مخارج',
    baseUnitId: 'u-1',
    baseUnitName: 'قطعة',
    additionalUnits: [
      { unitId: 'u-2', unitName: 'كرتونة', conversionFactor: 20, salePrice: 8800, barcode: '6221040001041' }
    ],
    reorderLevel: 25,
    costPrice: 340,
    salePrice: 470,
    averageCost: 340,
    category: 'تجهيزات كهربائية',
    stockByWarehouse: {
      'wh-1': 65,
      'wh-2': 40,
      'wh-3': 15
    },
    notes: 'حماية كاملة ضد ارتفاع الجهد والحرارة'
  }
];

export const initialCountries: Country[] = [
  { id: 'c-1', code: 'EG', name: 'جمهورية مصر العربية' },
  { id: 'c-2', code: 'SA', name: 'المملكة العربية السعودية' },
  { id: 'c-3', code: 'AE', name: 'الإمارات العربية المتحدة' }
];

export const initialGovernorates: Governorate[] = [
  { id: 'g-1', code: 'CAI', name: 'محافظة القاهرة', countryId: 'c-1', countryName: 'جمهورية مصر العربية' },
  { id: 'g-2', code: 'GIZ', name: 'محافظة الجيزة', countryId: 'c-1', countryName: 'جمهورية مصر العربية' },
  { id: 'g-3', code: 'ALX', name: 'محافظة الإسكندرية', countryId: 'c-1', countryName: 'جمهورية مصر العربية' },
  { id: 'g-4', code: 'SHR', name: 'محافظة الشرقية', countryId: 'c-1', countryName: 'جمهورية مصر العربية' },
  { id: 'g-5', code: 'RIY', name: 'منطقة الرياض', countryId: 'c-2', countryName: 'المملكة العربية السعودية' }
];

export const initialCities: City[] = [
  { id: 'ct-1', code: 'CT-01', name: 'مدينة نصر', governorateId: 'g-1', governorateName: 'محافظة القاهرة', countryId: 'c-1', countryName: 'جمهورية مصر العربية' },
  { id: 'ct-2', code: 'CT-02', name: 'المعادي', governorateId: 'g-1', governorateName: 'محافظة القاهرة', countryId: 'c-1', countryName: 'جمهورية مصر العربية' },
  { id: 'ct-3', code: 'CT-03', name: 'الدقي والمهندسين', governorateId: 'g-2', governorateName: 'محافظة الجيزة', countryId: 'c-1', countryName: 'جمهورية مصر العربية' },
  { id: 'ct-4', code: 'CT-04', name: 'مدينة السادس من أكتوبر', governorateId: 'g-2', governorateName: 'محافظة الجيزة', countryId: 'c-1', countryName: 'جمهورية مصر العربية' },
  { id: 'ct-5', code: 'CT-05', name: 'سموحة ومحرم بك', governorateId: 'g-3', governorateName: 'محافظة الإسكندرية', countryId: 'c-1', countryName: 'جمهورية مصر العربية' },
  { id: 'ct-6', code: 'CT-06', name: 'العاشر من رمضان', governorateId: 'g-4', governorateName: 'محافظة الشرقية', countryId: 'c-1', countryName: 'جمهورية مصر العربية' }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    code: 'CUST-001',
    name: 'شركة الأمل للتوريدات والمقاولات',
    delegateName: 'كابتن طارق السعيد',
    responsiblePerson: 'م. حسام الدين نبيل',
    responsiblePhone: '01001122334',
    email: 'info@alamal-group.eg',
    fax: '0224156789',
    phone1: '01001122334',
    phone2: '01122334455',
    addressDetails: 'عمارة 14 شارع مكرم عبيد - الدور الرابع',
    cityId: 'ct-1',
    cityName: 'مدينة نصر',
    governorateName: 'محافظة القاهرة',
    countryName: 'جمهورية مصر العربية',
    openingBalanceType: 'debit',
    openingBalance: 45000,
    currentBalance: 57800,
    notes: 'عميل مميز فئة أ - سداد آجل 30 يوم'
  },
  {
    id: 'cust-2',
    code: 'CUST-002',
    name: 'مؤسسة الفارس لتجارة الإلكترونيات',
    delegateName: 'أ. وائل حمدي',
    responsiblePerson: 'أ. فارس منصور',
    responsiblePhone: '01223344556',
    email: 'alfares.stores@gmail.com',
    fax: '',
    phone1: '01223344556',
    phone2: '0233445566',
    addressDetails: 'ميدان المساحة - برج الأطباء',
    cityId: 'ct-3',
    cityName: 'الدقي والمهندسين',
    governorateName: 'محافظة الجيزة',
    countryName: 'جمهورية مصر العربية',
    openingBalanceType: 'debit',
    openingBalance: 12000,
    currentBalance: 12000,
    notes: 'سداد بشيكات أو تحويلات بنكية'
  },
  {
    id: 'cust-3',
    code: 'CUST-003',
    name: 'سوبر سنتر النور للتوزيع',
    delegateName: 'أ. ماجد فكري',
    responsiblePerson: 'الحاج أنور عبد الفتاح',
    responsiblePhone: '01556677889',
    email: 'alnoor.center@yahoo.com',
    fax: '',
    phone1: '01556677889',
    phone2: '034298112',
    addressDetails: 'شارع فوزي معاذ - عمارة الأندلس',
    cityId: 'ct-5',
    cityName: 'سموحة ومحرم بك',
    governorateName: 'محافظة الإسكندرية',
    countryName: 'جمهورية مصر العربية',
    openingBalanceType: 'credit',
    openingBalance: 5000,
    currentBalance: -2500,
    notes: 'رصيد دائن لصالح العميل'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    code: 'SUP-001',
    name: 'المصرية الدولية لتكنولوجيا الأجهزة',
    responsiblePerson: 'م. أيمن زكريا',
    responsiblePhone: '01055566778',
    email: 'sales@egy-tech.com',
    fax: '0227986543',
    phone1: '01055566778',
    phone2: '0227986540',
    addressDetails: 'القطعة 18 - المنطقة الصناعية الثالثة',
    cityId: 'ct-4',
    cityName: 'مدينة السادس من أكتوبر',
    governorateName: 'محافظة الجيزة',
    countryName: 'جمهورية مصر العربية',
    openingBalanceType: 'credit',
    openingBalance: 85000,
    currentBalance: 85000,
    notes: 'مورد الشاشات والأجهزة الإلكترونية'
  },
  {
    id: 'sup-2',
    code: 'SUP-002',
    name: 'مصنع الشرق الأوسط للمستلزمات الكهربائية',
    responsiblePerson: 'أ. سامح عبد الصبور',
    responsiblePhone: '01199887766',
    email: 'info@middle-east-elec.com',
    fax: '',
    phone1: '01199887766',
    phone2: '01599887766',
    addressDetails: 'طريق مصر الإسماعيلية الصحراوي',
    cityId: 'ct-6',
    cityName: 'العاشر من رمضان',
    governorateName: 'محافظة الشرقية',
    countryName: 'جمهورية مصر العربية',
    openingBalanceType: 'credit',
    openingBalance: 24000,
    currentBalance: 31000,
    notes: 'مورد التجهيزات والمحولات الكهربائية'
  }
];

export const initialTreasuries: Treasury[] = [
  {
    id: 'tr-1',
    code: 'TRS-01',
    name: 'الخزينة الرئيسية - الإدارة المالية',
    type: 'cash',
    balance: 145000,
    manager: 'أ. خالد محي الدين',
    notes: 'خزينة الفرع الرئيسي بالقاهرة'
  },
  {
    id: 'tr-2',
    code: 'TRS-02',
    name: 'خزينة مبيعات معرض التجمع',
    type: 'cash',
    balance: 38200,
    manager: 'أ. سارة مجدي',
    notes: 'نقدية الصندوق اليومي'
  },
  {
    id: 'tr-3',
    code: 'BNK-01',
    name: 'البنك الأهلي المصري (حساب جاري شركات)',
    type: 'bank',
    balance: 620000,
    bankName: 'البنك الأهلي المصري',
    accountNumber: '10984432109844',
    bankBranch: 'فرع شارع التسعين',
    iban: 'EG440003010984432109844000101',
    notes: 'الحساب الرئيسي للتحويلات والفواتير'
  },
  {
    id: 'tr-4',
    code: 'BNK-02',
    name: 'بنك مصر (حساب استثماري)',
    type: 'bank',
    balance: 315000,
    bankName: 'بنك مصر',
    accountNumber: '20853311902233',
    bankBranch: 'فرع مدينة نصر',
    iban: 'EG550002020853311902233000202',
    notes: 'حساب الاعتمادات وخطابات الضمان'
  },
  {
    id: 'tr-5',
    code: 'WAL-01',
    name: 'محفظة فودافون كاش مبيعات سريعة',
    type: 'wallet',
    balance: 19500,
    walletNumber: '01099887711',
    providerName: 'فودافون كاش (Vodafone Cash)',
    notes: 'لاستقبال دفعات العملاء الفورية'
  },
  {
    id: 'tr-6',
    code: 'WAL-02',
    name: 'حساب انستاباي InstaPay الرضوان',
    type: 'wallet',
    balance: 42000,
    walletNumber: 'alradwan@instapay',
    providerName: 'InstaPay شبكة المدفوعات اللحظية',
    notes: 'معرف الدفع اللحظي للشركات'
  }
];

export const initialExpenseCategories: ExpenseCategory[] = [
  { id: 'exp-c-1', code: 'EXP-CAT-01', name: 'إيجارات مقرات ومستودعات' },
  { id: 'exp-c-2', code: 'EXP-CAT-02', name: 'فواتير مرافق (كهرباء ومياه وغاز)' },
  { id: 'exp-c-3', code: 'EXP-CAT-03', name: 'رواتب وأجور ومكافآت العاملين' },
  { id: 'exp-c-4', code: 'EXP-CAT-04', name: 'مصاريف نقل وشحن وبنزين' },
  { id: 'exp-c-5', code: 'EXP-CAT-05', name: 'صيانة وتجهيزات وضيافة' },
  { id: 'exp-c-6', code: 'EXP-CAT-06', name: 'دعاية وتسويق وإعلانات' }
];

export const initialRevenueCategories: RevenueCategory[] = [
  { id: 'rev-c-1', code: 'REV-CAT-01', name: 'إيرادات خدمات الشحن والتركيب' },
  { id: 'rev-c-2', code: 'REV-CAT-02', name: 'عوائد استشارات ودعم فني' },
  { id: 'rev-c-3', code: 'REV-CAT-03', name: 'إيرادات بيع مخلفات تغليف وكرتون' },
  { id: 'rev-c-4', code: 'REV-CAT-04', name: 'أرباح فروق عملة وفائدة' }
];

export const initialPartners: Partner[] = [
  {
    id: 'prt-1',
    code: 'PRT-01',
    name: 'الحاج أحمد الرضوان',
    capital: 1500000,
    sharePercentage: 60,
    phone: '01000000001',
    email: 'radwan@alradwan-erp.com',
    notes: 'الشريك المؤسس والمدير التنفيذي'
  },
  {
    id: 'prt-2',
    code: 'PRT-02',
    name: 'الأستاذ محمود إبراهيم النجار',
    capital: 1000000,
    sharePercentage: 40,
    phone: '01000000002',
    email: 'elnaggar@alradwan-erp.com',
    notes: 'شريك ممول ومدير مالي'
  }
];

export const initialPartnerCurrentAccounts: PartnerCurrentAccount[] = [
  {
    id: 'pca-1',
    partnerId: 'prt-1',
    partnerName: 'الحاج أحمد الرضوان',
    currentBalance: 75000,
    movements: [
      {
        id: 'pcm-1',
        date: '2026-01-15',
        type: 'deposit',
        amount: 100000,
        description: 'إيداع نقدي لدعم سيولة شراء بضائع',
        treasuryId: 'tr-1',
        treasuryName: 'الخزينة الرئيسية - الإدارة المالية'
      },
      {
        id: 'pcm-2',
        date: '2026-02-01',
        type: 'withdrawal',
        amount: 25000,
        description: 'مسحوبات شخصية دورية',
        treasuryId: 'tr-1',
        treasuryName: 'الخزينة الرئيسية - الإدارة المالية'
      }
    ]
  },
  {
    id: 'pca-2',
    partnerId: 'prt-2',
    partnerName: 'الأستاذ محمود إبراهيم النجار',
    currentBalance: 40000,
    movements: [
      {
        id: 'pcm-3',
        date: '2026-01-20',
        type: 'deposit',
        amount: 60000,
        description: 'تحويل بنكي لدعم التوسعات',
        treasuryId: 'tr-3',
        treasuryName: 'البنك الأهلي المصري (حساب جاري شركات)'
      },
      {
        id: 'pcm-4',
        date: '2026-02-10',
        type: 'withdrawal',
        amount: 20000,
        description: 'مسحوبات أرباح نقدية',
        treasuryId: 'tr-1',
        treasuryName: 'الخزينة الرئيسية - الإدارة المالية'
      }
    ]
  }
];

export const initialUsers: SystemUser[] = [
  {
    id: 'usr-1',
    username: 'admin',
    fullName: 'أحمد الرضوان (المدير العام)',
    role: 'admin',
    email: 'admin@alradwan-erp.com',
    phone: '01012345678',
    isActive: true,
    permissions: {
      warehouses: { view: true, add: true, edit: true, delete: true },
      items: { view: true, add: true, edit: true, delete: true },
      customers: { view: true, add: true, edit: true, delete: true },
      salesInvoices: { view: true, add: true, edit: true, delete: true, print: true },
      suppliers: { view: true, add: true, edit: true, delete: true },
      purchaseInvoices: { view: true, add: true, edit: true, delete: true, print: true },
      treasuries: { view: true, add: true, edit: true, delete: true },
      expenses: { view: true, add: true, edit: true, delete: true },
      revenues: { view: true, add: true, edit: true, delete: true },
      partners: { view: true, add: true, edit: true, delete: true },
      users: { view: true, add: true, edit: true, delete: true },
      settings: { view: true, add: true, edit: true, delete: true }
    }
  },
  {
    id: 'usr-2',
    username: 'accountant',
    fullName: 'ياسر المنشاوي (رئيس الحسابات)',
    role: 'accountant',
    email: 'accounts@alradwan-erp.com',
    phone: '01144556677',
    isActive: true,
    permissions: {
      warehouses: { view: true, add: false, edit: false, delete: false },
      items: { view: true, add: true, edit: true, delete: false },
      customers: { view: true, add: true, edit: true, delete: false },
      salesInvoices: { view: true, add: true, edit: true, delete: false, print: true },
      suppliers: { view: true, add: true, edit: true, delete: false },
      purchaseInvoices: { view: true, add: true, edit: true, delete: false, print: true },
      treasuries: { view: true, add: true, edit: true, delete: false },
      expenses: { view: true, add: true, edit: true, delete: false },
      revenues: { view: true, add: true, edit: true, delete: false },
      partners: { view: true, add: false, edit: false, delete: false },
      users: { view: false, add: false, edit: false, delete: false },
      settings: { view: true, add: false, edit: false, delete: false }
    }
  }
];

export const initialSalesInvoices: SalesInvoice[] = [
  {
    id: 'sinv-1',
    code: 'INV-2026-001',
    type: 'sale',
    date: '2026-02-18',
    customerId: 'cust-1',
    customerName: 'شركة الأمل للتوريدات والمقاولات',
    warehouseId: 'wh-1',
    warehouseName: 'المستودع الرئيسي - القاهرة',
    items: [
      {
        id: 'sitem-1',
        itemId: 'item-1',
        itemCode: 'ITM-101',
        itemName: 'شاشة سامسونج 55 بوصة Smart 4K UHD',
        unitId: 'u-1',
        unitName: 'قطعة',
        conversionFactor: 1,
        quantity: 2,
        unitPrice: 12800,
        discount: 600,
        taxRate: 14,
        total: 28500
      },
      {
        id: 'sitem-2',
        itemId: 'item-2',
        itemCode: 'ITM-102',
        itemName: 'كابل شاحن أصلي Type-C سريع 65W',
        unitId: 'u-3',
        unitName: 'دزينة (12 قطعة)',
        conversionFactor: 12,
        quantity: 3,
        unitPrice: 1600,
        discount: 100,
        taxRate: 14,
        total: 5358
      }
    ],
    subtotal: 30400,
    discountTotal: 700,
    taxTotal: 4158,
    netTotal: 33858,
    paidAmount: 21058,
    remainingAmount: 12800,
    paymentMethod: 'bank',
    treasuryId: 'tr-3',
    treasuryName: 'البنك الأهلي المصري (حساب جاري شركات)',
    notes: 'دفعة أولى بالتحويل البنكي والمتبقي آجل 30 يوم'
  }
];

export const initialPurchaseInvoices: PurchaseInvoice[] = [
  {
    id: 'pinv-1',
    code: 'PUR-2026-001',
    type: 'purchase',
    date: '2026-02-10',
    supplierId: 'sup-1',
    supplierName: 'المصرية الدولية لتكنولوجيا الأجهزة',
    warehouseId: 'wh-1',
    warehouseName: 'المستودع الرئيسي - القاهرة',
    items: [
      {
        id: 'pitem-1',
        itemId: 'item-1',
        itemCode: 'ITM-101',
        itemName: 'شاشة سامسونج 55 بوصة Smart 4K UHD',
        unitId: 'u-1',
        unitName: 'قطعة',
        conversionFactor: 1,
        quantity: 10,
        unitPrice: 10500,
        discount: 2000,
        taxRate: 14,
        total: 117420
      }
    ],
    subtotal: 105000,
    discountTotal: 2000,
    taxTotal: 14420,
    netTotal: 117420,
    paidAmount: 117420,
    remainingAmount: 0,
    paymentMethod: 'bank',
    treasuryId: 'tr-3',
    treasuryName: 'البنك الأهلي المصري (حساب جاري شركات)',
    notes: 'تم السداد بالكامل بشيك بنكي مسحوب'
  }
];

export const initialReceiptVouchers: ReceiptVoucher[] = [
  {
    id: 'rec-1',
    code: 'RCV-2026-001',
    date: '2026-02-20',
    accountType: 'customer',
    accountTypeName: 'عملاء',
    accountId: 'cust-1',
    accountName: 'شركة الأمل للتوريدات والمقاولات',
    amount: 15000,
    paymentMethod: 'bank',
    treasuryId: 'tr-3',
    treasuryName: 'البنك الأهلي المصري (حساب جاري شركات)',
    receivedBy: 'أحمد الرضوان',
    notes: 'دفعة من حساب فاتورة INV-2026-001',
    referenceDoc: 'INV-2026-001'
  },
  {
    id: 'rec-2',
    code: 'RCV-2026-002',
    date: '2026-02-22',
    accountType: 'revenue',
    accountTypeName: 'إيرادات أخرى',
    accountId: 'rev-c-1',
    accountName: 'إيرادات خدمات الشحن والتركيب',
    amount: 3200,
    paymentMethod: 'cash',
    treasuryId: 'tr-1',
    treasuryName: 'الخزينة الرئيسية - الإدارة المالية',
    receivedBy: 'خالد محي الدين',
    notes: 'تحصيل نولون شحن أجهزة لمشروع العاصمة',
    referenceDoc: ''
  }
];

export const initialPaymentVouchers: PaymentVoucher[] = [
  {
    id: 'pay-1',
    code: 'PAY-2026-001',
    date: '2026-02-15',
    accountType: 'supplier',
    accountTypeName: 'موردين',
    accountId: 'sup-2',
    accountName: 'مصنع الشرق الأوسط للمستلزمات الكهربائية',
    amount: 14000,
    paymentMethod: 'wallet',
    treasuryId: 'tr-6',
    treasuryName: 'حساب انستاباي InstaPay الرضوان',
    paidTo: 'أ. سامح عبد الصبور',
    notes: 'سداد دفعة تحت الحساب لتوريد كابلات',
    referenceDoc: ''
  },
  {
    id: 'pay-2',
    code: 'PAY-2026-002',
    date: '2026-02-21',
    accountType: 'expense',
    accountTypeName: 'مصروفات',
    accountId: 'exp-c-2',
    accountName: 'فواتير مرافق (كهرباء ومياه وغاز)',
    amount: 4600,
    paymentMethod: 'cash',
    treasuryId: 'tr-1',
    treasuryName: 'الخزينة الرئيسية - الإدارة المالية',
    paidTo: 'شركة كهرباء شمال القاهرة',
    notes: 'سداد فاتورة كهرباء المستودع الرئيسي عن شهر يناير',
    referenceDoc: 'وصل سداد 84920'
  }
];

export const initialWarehouseTransfers: WarehouseTransfer[] = [
  {
    id: 'wt-1',
    code: 'TRN-2026-001',
    date: '2026-02-12',
    fromWarehouseId: 'wh-1',
    fromWarehouseName: 'المستودع الرئيسي - القاهرة',
    toWarehouseId: 'wh-3',
    toWarehouseName: 'مستودع فرع الإسكندرية',
    itemId: 'item-2',
    itemName: 'كابل شاحن أصلي Type-C سريع 65W',
    unitId: 'u-1',
    unitName: 'قطعة',
    quantity: 40,
    unitCost: 95,
    totalCost: 3800,
    notes: 'تغذية فرع الإسكندرية لتلبية طلبات التجزئة'
  }
];

export const initialExpenseTransactions: ExpenseTransaction[] = [
  {
    id: 'et-1',
    code: 'EXP-TR-001',
    date: '2026-02-16',
    categoryId: 'exp-c-1',
    categoryName: 'إيجارات مقرات ومستودعات',
    amount: 18000,
    treasuryId: 'tr-1',
    treasuryName: 'الخزينة الرئيسية - الإدارة المالية',
    recipient: 'الحاج فؤاد المنوفي (مالك العقار)',
    notes: 'إيجار شهر فبراير للمقر الإداري'
  }
];

export const initialRevenueTransactions: RevenueTransaction[] = [
  {
    id: 'rt-1',
    code: 'REV-TR-001',
    date: '2026-02-19',
    categoryId: 'rev-c-1',
    categoryName: 'إيرادات خدمات الشحن والتركيب',
    amount: 2500,
    treasuryId: 'tr-2',
    treasuryName: 'خزينة مبيعات معرض التجمع',
    payer: 'عميل نقدي',
    notes: 'رسوم نقل وتركيب شاشات'
  }
];
