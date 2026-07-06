import { useEffect, useMemo, useState } from 'react';
import {
  MdArrowBack,
  MdClose,
  MdDownload,
  MdPrint,
  MdReceiptLong,
  MdSearch,
  MdVisibility,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { formatCurrency } from '../../constants/pos';
import { getBillingHistory } from '../../api';

const PAGE_SIZE = 10;

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const formatPlainAmount = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

const getInvoiceNumber = (order) => order?.invoiceNumber || order?.orderNumber || 'N/A';

const getProductNames = (items = []) =>
  items.map((item) => item.productName || item.product?.name || 'Product').join(', ');

const getProductQuantities = (items = []) =>
  items.map((item) => `${item.productName || item.product?.name || 'Product'} x ${item.quantity}`).join(', ');

const buildInvoiceHtml = (order) => {
  const rows = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td>${item.productName || item.product?.name || 'Product'}</td>
          <td>${item.quantity}</td>
          <td>${formatPlainAmount(item.unitPrice)}</td>
          <td>${formatPlainAmount(item.subtotal || item.quantity * item.unitPrice)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <title>Invoice ${getInvoiceNumber(order)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #212529; margin: 32px; }
          .header { display: flex; justify-content: space-between; border-bottom: 1px solid #DEE2E6; padding-bottom: 16px; margin-bottom: 24px; }
          h1 { margin: 0; font-size: 28px; }
          .muted { color: #6C757D; font-size: 13px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
          .box { border: 1px solid #DEE2E6; padding: 14px; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border-bottom: 1px solid #DEE2E6; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #F8F9FA; color: #6C757D; text-transform: uppercase; font-size: 11px; }
          .totals { width: 320px; margin-left: auto; margin-top: 24px; }
          .totals div { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #DEE2E6; }
          .grand { font-weight: 700; font-size: 16px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Invoice</h1>
            <p class="muted">${getInvoiceNumber(order)}</p>
          </div>
          <div>
            <p><strong>Billing Date</strong></p>
            <p class="muted">${formatDate(order.billingDate || order.createdAt)}</p>
          </div>
        </div>
        <div class="grid">
          <div class="box">
            <p><strong>Customer</strong></p>
            <p>${order.customerName || 'Walk-in Customer'}</p>
            <p class="muted">${order.customerPhone || ''}</p>
            <p class="muted">${order.customerEmail || ''}</p>
          </div>
          <div class="box">
            <p><strong>Payment</strong></p>
            <p>${order.paymentMethod || 'N/A'} / ${order.paymentStatus || 'N/A'}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="totals">
          <div><span>Subtotal</span><span>${formatPlainAmount(order.subtotal)}</span></div>
          <div><span>GST</span><span>${formatPlainAmount(order.tax)}</span></div>
          <div><span>Discount</span><span>${formatPlainAmount(order.discount)}</span></div>
          <div class="grand"><span>Grand Total</span><span>${formatPlainAmount(order.total)}</span></div>
        </div>
      </body>
    </html>
  `;
};

const BillingHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: PAGE_SIZE });
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    paymentStatus: '',
    paymentMethod: '',
    sort: 'newest',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const query = useMemo(
    () => ({
      ...filters,
      page: pagination.page,
      limit: PAGE_SIZE,
    }),
    [filters, pagination.page]
  );

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getBillingHistory(query);
        setOrders(response.data || []);
        setPagination(response.pagination || { total: 0, page: 1, pages: 1, limit: PAGE_SIZE });
      } catch (err) {
        setError(err.message || 'Failed to load billing history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [query]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const changePage = (page) => {
    if (page < 1 || page > pagination.pages) return;
    setPagination((current) => ({ ...current, page }));
  };

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    printWindow.document.write(buildInvoiceHtml(order));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadPdf = (order) => {
    const doc = new jsPDF();
    const invoiceNumber = getInvoiceNumber(order);

    doc.setFontSize(20);
    doc.text('Invoice', 14, 18);
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${invoiceNumber}`, 14, 28);
    doc.text(`Billing Date: ${formatDate(order.billingDate || order.createdAt)}`, 14, 34);
    doc.text(`Customer: ${order.customerName || 'Walk-in Customer'}`, 14, 44);
    doc.text(`Payment: ${order.paymentMethod || 'N/A'} / ${order.paymentStatus || 'N/A'}`, 14, 50);

    autoTable(doc, {
      startY: 60,
      head: [['Product', 'Quantity', 'Price', 'Subtotal']],
      body: (order.items || []).map((item) => [
        item.productName || item.product?.name || 'Product',
        item.quantity,
        formatPlainAmount(item.unitPrice),
        formatPlainAmount(item.subtotal || item.quantity * item.unitPrice),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [33, 37, 41] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ${formatPlainAmount(order.subtotal)}`, 140, finalY);
    doc.text(`GST: ${formatPlainAmount(order.tax)}`, 140, finalY + 7);
    doc.text(`Discount: ${formatPlainAmount(order.discount)}`, 140, finalY + 14);
    doc.setFontSize(12);
    doc.text(`Grand Total: ${formatPlainAmount(order.total)}`, 140, finalY + 24);
    doc.save(`${invoiceNumber}.pdf`);
  };

  const pageNumbers = Array.from({ length: pagination.pages || 1 }, (_, index) => index + 1);

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[260px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <button
              onClick={() => navigate('/billing')}
              className="flex items-center gap-2 text-[#212529] hover:text-[#000000] text-[14px] font-semibold mb-4 transition-colors"
            >
              <MdArrowBack className="text-[18px]" />
              Back to Billing
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">Billing History</h1>
            <p className="text-[14px] text-[#6C757D]">
              Completed orders from the existing Orders collection.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#DEE2E6] p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                  Search
                </label>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#6C757D]" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(event) => updateFilter('search', event.target.value)}
                    placeholder="Invoice number or customer name"
                    className="w-full h-[42px] pl-10 pr-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <FilterInput label="Date" type="date" value={filters.date} onChange={(value) => updateFilter('date', value)} />
              <FilterSelect
                label="Payment Status"
                value={filters.paymentStatus}
                onChange={(value) => updateFilter('paymentStatus', value)}
                options={[
                  ['paid', 'Paid'],
                  ['pending', 'Pending'],
                  ['failed', 'Failed'],
                  ['refunded', 'Refunded'],
                ]}
              />
              <FilterSelect
                label="Payment Method"
                value={filters.paymentMethod}
                onChange={(value) => updateFilter('paymentMethod', value)}
                options={[
                  ['online', 'Online'],
                  ['cash', 'Cash'],
                ]}
              />
              <FilterSelect
                label="Sort"
                value={filters.sort}
                onChange={(value) => updateFilter('sort', value)}
                options={[
                  ['newest', 'Newest First'],
                  ['oldest', 'Oldest First'],
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center justify-between gap-4">
              <h2 className="text-[16px] font-semibold text-[#212529]">Completed Bills</h2>
              <span className="text-[12px] text-[#6C757D]">{pagination.total} records</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-[14px] text-[#6C757D]">Loading billing history...</div>
            ) : error ? (
              <div className="p-8 text-center text-[14px] text-[#DC3545]">{error}</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <MdReceiptLong className="text-[36px] text-[#ADB5BD] mx-auto mb-3" />
                <p className="text-[14px] text-[#6C757D]">No Billing History Found</p>
              </div>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full min-w-[1200px]">
                    <thead className="bg-[#F8F9FA] border-b border-[#DEE2E6]">
                      <tr>
                        {[
                          'Invoice Number',
                          'Customer Name',
                          'Product Names',
                          'Product Quantity',
                          'Subtotal',
                          'GST',
                          'Discount',
                          'Total Amount',
                          'Payment Method',
                          'Payment Status',
                          'Billing Date',
                          'Actions',
                        ].map((heading) => (
                          <th key={heading} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D]">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DEE2E6]">
                      {orders.map((order) => (
                        <HistoryRow
                          key={order._id}
                          order={order}
                          onView={setSelectedInvoice}
                          onPrint={handlePrint}
                          onDownload={handleDownloadPdf}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="lg:hidden divide-y divide-[#DEE2E6]">
                  {orders.map((order) => (
                    <div key={order._id} className="p-4 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[14px] font-semibold text-[#212529]">{getInvoiceNumber(order)}</p>
                          <p className="text-[12px] text-[#6C757D]">{order.customerName || 'Walk-in Customer'}</p>
                        </div>
                        <p className="text-[14px] font-bold text-[#212529]">{formatCurrency(order.total || 0)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[12px]">
                        <Info label="Products" value={getProductNames(order.items)} />
                        <Info label="Quantity" value={getProductQuantities(order.items)} />
                        <Info label="Payment" value={`${order.paymentMethod || 'N/A'} / ${order.paymentStatus || 'N/A'}`} />
                        <Info label="Date" value={formatDate(order.billingDate || order.createdAt)} />
                      </div>
                      <RowActions order={order} onView={setSelectedInvoice} onPrint={handlePrint} onDownload={handleDownloadPdf} />
                    </div>
                  ))}
                </div>

                <div className="px-4 sm:px-6 py-4 border-t border-[#DEE2E6] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[12px] text-[#6C757D]">
                    Page {pagination.page} of {pagination.pages || 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changePage(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="h-9 px-3 border border-[#DEE2E6] rounded-lg text-[13px] font-semibold text-[#212529] disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`h-9 min-w-9 px-3 rounded-lg text-[13px] font-semibold ${
                          page === pagination.page
                            ? 'bg-[#000000] text-white'
                            : 'border border-[#DEE2E6] text-[#212529]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => changePage(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="h-9 px-3 border border-[#DEE2E6] rounded-lg text-[13px] font-semibold text-[#212529] disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPrint={handlePrint}
          onDownload={handleDownloadPdf}
        />
      )}
    </div>
  );
};

const FilterInput = ({ label, type, value, onChange }) => (
  <div>
    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full h-[42px] px-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] focus:outline-none focus:border-black"
    />
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full h-[42px] px-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] focus:outline-none focus:border-black"
    >
      <option value="">All</option>
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  </div>
);

const HistoryRow = ({ order, onView, onPrint, onDownload }) => (
  <tr className="hover:bg-[#F8F9FA] transition-colors">
    <td className="px-4 py-4 text-[13px] font-semibold text-[#212529]">{getInvoiceNumber(order)}</td>
    <td className="px-4 py-4 text-[13px] text-[#212529]">{order.customerName || 'Walk-in Customer'}</td>
    <td className="px-4 py-4 text-[13px] text-[#6C757D] max-w-[220px] truncate">{getProductNames(order.items)}</td>
    <td className="px-4 py-4 text-[13px] text-[#6C757D] max-w-[220px] truncate">{getProductQuantities(order.items)}</td>
    <td className="px-4 py-4 text-[13px] text-[#212529]">{formatCurrency(order.subtotal || 0)}</td>
    <td className="px-4 py-4 text-[13px] text-[#212529]">{formatCurrency(order.tax || 0)}</td>
    <td className="px-4 py-4 text-[13px] text-[#212529]">{formatCurrency(order.discount || 0)}</td>
    <td className="px-4 py-4 text-[13px] font-bold text-[#212529]">{formatCurrency(order.total || 0)}</td>
    <td className="px-4 py-4 text-[13px] text-[#212529] capitalize">{order.paymentMethod || 'N/A'}</td>
    <td className="px-4 py-4 text-[13px] text-[#212529] capitalize">{order.paymentStatus || 'N/A'}</td>
    <td className="px-4 py-4 text-[13px] text-[#6C757D]">{formatDate(order.billingDate || order.createdAt)}</td>
    <td className="px-4 py-4">
      <RowActions order={order} onView={onView} onPrint={onPrint} onDownload={onDownload} compact />
    </td>
  </tr>
);

const RowActions = ({ order, onView, onPrint, onDownload, compact = false }) => (
  <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`}>
    <button
      onClick={() => onView(order)}
      title="View Invoice"
      className="h-9 w-9 flex items-center justify-center border border-[#DEE2E6] rounded-lg text-[#212529] hover:bg-[#F8F9FA]"
    >
      <MdVisibility className="text-[18px]" />
    </button>
    <button
      onClick={() => onPrint(order)}
      title="Print Invoice"
      className="h-9 w-9 flex items-center justify-center border border-[#DEE2E6] rounded-lg text-[#212529] hover:bg-[#F8F9FA]"
    >
      <MdPrint className="text-[18px]" />
    </button>
    <button
      onClick={() => onDownload(order)}
      title="Download PDF"
      className="h-9 w-9 flex items-center justify-center bg-[#000000] rounded-lg text-white hover:bg-[#1A1A1A]"
    >
      <MdDownload className="text-[18px]" />
    </button>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D] mb-1">{label}</p>
    <p className="text-[12px] text-[#212529] break-words">{value || 'N/A'}</p>
  </div>
);

const InvoiceModal = ({ order, onClose, onPrint, onDownload }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg border border-[#DEE2E6] w-full max-w-[900px] max-h-[90vh] overflow-y-auto">
      <div className="px-5 py-4 border-b border-[#DEE2E6] flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#212529]">Invoice Details</h2>
          <p className="text-[13px] text-[#6C757D]">{getInvoiceNumber(order)}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F8F9FA]">
          <MdClose className="text-[20px] text-[#212529]" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Info label="Invoice Number" value={getInvoiceNumber(order)} />
          <Info label="Customer" value={order.customerName || 'Walk-in Customer'} />
          <Info label="Billing Date" value={formatDate(order.billingDate || order.createdAt)} />
          <Info label="Payment Status" value={order.paymentStatus || 'N/A'} />
          <Info label="Payment Method" value={order.paymentMethod || 'N/A'} />
          <Info label="Grand Total" value={formatCurrency(order.total || 0)} />
        </div>

        <div className="border border-[#DEE2E6] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#F8F9FA] border-b border-[#DEE2E6]">
            <h3 className="text-[14px] font-semibold text-[#212529]">Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D]">Product</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D]">Quantity</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D]">Price</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D]">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE2E6]">
                {(order.items || []).map((item) => (
                  <tr key={`${item.product || item.productName}-${item.quantity}`}>
                    <td className="px-4 py-3 text-[13px] text-[#212529]">{item.productName || item.product?.name || 'Product'}</td>
                    <td className="px-4 py-3 text-[13px] text-[#212529]">{item.quantity}</td>
                    <td className="px-4 py-3 text-[13px] text-[#212529]">{formatCurrency(item.unitPrice || 0)}</td>
                    <td className="px-4 py-3 text-[13px] text-[#212529]">{formatCurrency(item.subtotal || item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg p-4 ml-auto max-w-[360px] space-y-3">
          <SummaryLine label="Subtotal" value={formatCurrency(order.subtotal || 0)} />
          <SummaryLine label="GST" value={formatCurrency(order.tax || 0)} />
          <SummaryLine label="Discount" value={formatCurrency(order.discount || 0)} />
          <div className="pt-3 border-t border-[#DEE2E6]">
            <SummaryLine label="Grand Total" value={formatCurrency(order.total || 0)} strong />
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-[#DEE2E6] flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={() => onPrint(order)}
          className="h-10 px-4 border border-[#DEE2E6] rounded-lg text-[13px] font-semibold text-[#212529] hover:bg-[#F8F9FA] flex items-center justify-center gap-2"
        >
          <MdPrint className="text-[18px]" />
          Print Invoice
        </button>
        <button
          onClick={() => onDownload(order)}
          className="h-10 px-4 bg-[#000000] rounded-lg text-[13px] font-semibold text-white hover:bg-[#1A1A1A] flex items-center justify-center gap-2"
        >
          <MdDownload className="text-[18px]" />
          Download PDF
        </button>
      </div>
    </div>
  </div>
);

const SummaryLine = ({ label, value, strong = false }) => (
  <div className="flex items-center justify-between gap-4">
    <span className={`text-[13px] ${strong ? 'font-bold text-[#212529]' : 'text-[#6C757D]'}`}>{label}</span>
    <span className={`text-[13px] ${strong ? 'font-bold text-[#000000]' : 'font-semibold text-[#212529]'}`}>{value}</span>
  </div>
);

export default BillingHistoryPage;
