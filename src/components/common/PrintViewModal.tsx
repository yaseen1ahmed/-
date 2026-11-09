import React from 'react';
import { Printer, Download, X, Building2, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { SalesInvoice, PurchaseInvoice, ReceiptVoucher, PaymentVoucher } from '../../types/erp';

type PrintableDoc = 
  | { kind: 'sales_invoice'; data: SalesInvoice }
  | { kind: 'purchase_invoice'; data: PurchaseInvoice }
  | { kind: 'receipt_voucher'; data: ReceiptVoucher }
  | { kind: 'payment_voucher'; data: PaymentVoucher };

interface PrintViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: PrintableDoc | null;
}

export const PrintViewModal: React.FC<PrintViewModalProps> = ({
  isOpen,
  onClose,
  documentData
}) => {
  const { companySettings } = useERP();

  if (!isOpen || !documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const { printOptions } = companySettings;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="fixed inset-0 no-print" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden z-10 print-container">
        
        {/* Action Toolbar (Hidden during print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">معاينة الطباعة وتصدير PDF</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              طباعة فورية
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="يمكنك حفظ الصفحة كـ PDF من شاشة الطباعة باختيار Save as PDF"
            >
              <Download className="w-4 h-4" />
              حفظ كـ PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 bg-white text-slate-900 text-sm font-['Cairo',sans-serif]">
          
          {/* Header based on Company Settings Checkboxes */}
          <div className="border-b-2 border-slate-800 pb-6 mb-6">
            <div className="flex flex-row items-center justify-between gap-6">
              
              <div className="flex-1 text-right">
                {printOptions.showName && (
                  <h1 className="text-2xl font-black text-slate-900 mb-1">{companySettings.name}</h1>
                )}
                <p className="text-xs text-slate-600 mb-2 font-medium">{companySettings.activity}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                  {printOptions.showAddress && (
                    <span>📍 {companySettings.address}</span>
                  )}
                  {printOptions.showPhone && (
                    <span>📞 {companySettings.phone1} {companySettings.phone2 && `/ ${companySettings.phone2}`}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                  {printOptions.showCommercialRegister && (
                    <span className="font-semibold">{companySettings.commercialRegister}</span>
                  )}
                  {printOptions.showTaxNumber && (
                    <span className="font-semibold text-emerald-800">{companySettings.taxNumber}</span>
                  )}
                </div>
              </div>

              {/* Logo if configured and enabled */}
              {printOptions.showLogo && (
                <div className="w-24 h-24 shrink-0 flex items-center justify-center border border-slate-200 rounded-xl bg-slate-50 p-2">
                  {companySettings.logoUrl ? (
                    <img
                      src={companySettings.logoUrl}
                      alt="شعار المنشأة"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Building2 className="w-10 h-10 text-emerald-600" />
                      <span className="text-[10px] font-bold text-slate-500 mt-1">الرضوان ERP</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* INVOICE TEMPLATE */}
          {(documentData.kind === 'sales_invoice' || documentData.kind === 'purchase_invoice') && (
            <div>
              {/* Document Title Badge */}
              <div className="flex items-center justify-between bg-slate-100 p-4 rounded-xl mb-6 border border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-800">
                    {documentData.kind === 'sales_invoice' 
                      ? (documentData.data.type === 'sale' ? 'فاتورة مبيعات ضريبية' : 'فاتورة مردود مبيعات')
                      : (documentData.data.type === 'purchase' ? 'فاتورة مشتريات' : 'فاتورة مردود مشتريات')
                    }
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">رقم السجل: <span className="font-mono font-bold text-slate-800">{documentData.data.code}</span></p>
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-500">تاريخ الإصدار</div>
                  <div className="text-sm font-bold text-slate-800 font-mono">{documentData.data.date}</div>
                </div>
              </div>

              {/* Party Information */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">
                    {documentData.kind === 'sales_invoice' ? 'بيانات العميل:' : 'بيانات المورد:'}
                  </span>
                  <div className="font-bold text-sm text-slate-800">
                    {documentData.kind === 'sales_invoice' ? documentData.data.customerName : documentData.data.supplierName}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">المستودع المصدر:</span>
                  <div className="font-bold text-sm text-slate-800">{documentData.data.warehouseName}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">كود الصنف</th>
                      <th className="py-2.5 px-3">اسم الصنف والبيان</th>
                      <th className="py-2.5 px-3 text-center">الوحدة</th>
                      <th className="py-2.5 px-3 text-center">الكمية</th>
                      <th className="py-2.5 px-3 text-left">سعر الوحدة</th>
                      <th className="py-2.5 px-3 text-left">الخصم</th>
                      <th className="py-2.5 px-3 text-left">ض.ق.م</th>
                      <th className="py-2.5 px-3 text-left">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {documentData.data.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{item.itemCode}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.itemName}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{item.unitName}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-left font-mono">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2.5 px-3 text-left font-mono text-rose-600">{formatCurrency(item.discount || 0)}</td>
                        <td className="py-2.5 px-3 text-left font-mono">{item.taxRate}%</td>
                        <td className="py-2.5 px-3 text-left font-bold font-mono text-slate-900">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="flex flex-row justify-between items-start gap-6 mb-8">
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-700 mb-1">طريقة الدفع والحساب:</div>
                  <div className="text-slate-600">
                    طريقة السداد: {documentData.data.paymentMethod === 'cash' ? 'نقداً' : documentData.data.paymentMethod === 'bank' ? 'تحويل بنكي' : 'محفظة إلكترونية'}
                    {documentData.data.treasuryName && ` - (${documentData.data.treasuryName})`}
                  </div>
                  {documentData.data.notes && (
                    <div className="mt-2 text-slate-600 italic">ملاحظات: {documentData.data.notes}</div>
                  )}
                </div>

                <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>إجمالي الأصناف قبل الخصم:</span>
                    <span className="font-mono font-medium">{formatCurrency(documentData.data.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>إجمالي الخصومات:</span>
                    <span className="font-mono font-medium">-{formatCurrency(documentData.data.discountTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>ضريبة القيمة المضافة:</span>
                    <span className="font-mono font-medium">+{formatCurrency(documentData.data.taxTotal)}</span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                    <span>الصافي النهائي:</span>
                    <span className="font-mono text-emerald-700 font-black">{formatCurrency(documentData.data.netTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium pt-1">
                    <span>المبلغ المسدد:</span>
                    <span className="font-mono">{formatCurrency(documentData.data.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-bold border-t border-dashed border-slate-300 pt-1">
                    <span>المتبقي الآجل:</span>
                    <span className="font-mono">{formatCurrency(documentData.data.remainingAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VOUCHER TEMPLATE (RECEIPT OR PAYMENT) */}
          {(documentData.kind === 'receipt_voucher' || documentData.kind === 'payment_voucher') && (
            <div className="max-w-2xl mx-auto my-4 border-2 border-slate-800 rounded-2xl p-6 bg-slate-50/40">
              <div className="text-center pb-4 border-b border-slate-300 mb-6">
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-black mb-2 ${
                  documentData.kind === 'receipt_voucher' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {documentData.kind === 'receipt_voucher' ? 'سند قبض نقدية / بنكي' : 'سند صرف ودفع نقدية / بنكي'}
                </span>
                <div className="text-xs text-slate-500 font-mono">رقم السند: <b className="text-slate-800">{documentData.data.code}</b> | التاريخ: <b className="text-slate-800">{documentData.data.date}</b></div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium">المبلغ المستحق:</span>
                  <span className="font-mono text-xl font-black text-slate-900">{formatCurrency(documentData.data.amount)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-400 block mb-1">
                      {documentData.kind === 'receipt_voucher' ? 'تم استلام المبلغ من حساب:' : 'تم صرف المبلغ إلى حساب:'}
                    </span>
                    <span className="font-bold text-slate-800">{documentData.data.accountName}</span>
                    <span className="text-xs text-slate-500 block mt-0.5">({documentData.data.accountTypeName})</span>
                  </div>
                  
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-400 block mb-1">
                      {documentData.kind === 'receipt_voucher' ? 'الحساب المستلم (الخزينة/البنك):' : 'الحساب المسحوب منه:'}
                    </span>
                    <span className="font-bold text-slate-800">{documentData.data.treasuryName}</span>
                    <span className="text-xs text-slate-500 block mt-0.5">طريقة الدفع: {
                      documentData.data.paymentMethod === 'cash' ? 'نقداً' :
                      documentData.data.paymentMethod === 'bank' ? 'بنك' : 'محفظة إلكترونية'
                    }</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-400 block mb-1">وذلك عن (البيان):</span>
                  <p className="text-slate-800 font-medium">{documentData.data.notes || 'تسوية حساب مالي'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Terms and Notes Footer if enabled */}
          {printOptions.showTerms && printOptions.termsNotes && (
            <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 text-center leading-relaxed">
              <p>{printOptions.termsNotes}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs text-slate-700">
            <div>
              <div className="font-bold mb-8">المستلم / العميل</div>
              <div className="border-t border-slate-400 mx-6 pt-1">التوقيع</div>
            </div>
            <div>
              <div className="font-bold mb-8">أمين الخزينة / المستودع</div>
              <div className="border-t border-slate-400 mx-6 pt-1">التوقيع</div>
            </div>
            <div>
              <div className="font-bold mb-8">المدير المالي / الاعتماد</div>
              <div className="border-t border-slate-400 mx-6 pt-1">التوقيع والختم</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
