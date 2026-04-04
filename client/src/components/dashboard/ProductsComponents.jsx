import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts, deleteProduct, getCategories } from '../../api';
import ConfirmationModal from '../common/ConfirmationModal';

const ProductsHeader = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-[12px] uppercase font-semibold tracking-[0.08em] text-[#6C757D] mb-2">
          Catalog Management
        </p>
        <h1 className="text-[28px] font-bold text-[#212529] mb-2">Products</h1>
        <p className="text-[14px] text-[#6C757D]">
          Manage your architectural hardware and materials inventory.
        </p>
      </div>
      <button 
        onClick={handleAddProduct}
        className="bg-[#000000] text-white px-6 py-2 rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
      >
        <MdAdd className="text-[18px]" />
        Add Product
      </button>
    </div>
  );
};

const SummaryCards = () => {
  const [stats, setStats] = useState({
    inventoryValue: '₹0.00',
    lowStockAlerts: 0,
    recentMovement: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getProducts({ limit: 1000 });
        if (response.products) {
          const totalValue = response.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
          const lowStockCount = response.products.filter(p => p.stock < 10).length;
          
          setStats({
            inventoryValue: `₹${totalValue.toFixed(2)}`,
            lowStockAlerts: lowStockCount,
            recentMovement: response.count || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: 'Inventory Value', value: stats.inventoryValue, icon: 'payments' },
    { label: 'Low Stock Alerts', value: stats.lowStockAlerts.toString(), icon: 'warning' },
    { label: 'Recent Movement', value: stats.recentMovement.toString(), icon: 'movement' },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#DEE2E6] p-5 shadow-md"
        >
          <p className="text-[12px] uppercase font-semibold text-[#6C757D] tracking-wide mb-2">
            {card.label}
          </p>
          <p className="text-[20px] font-bold text-[#212529]">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

const ProductsTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const limit = 10;

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          page: currentPage,
          limit: limit,
          search: searchTerm,
          category: categoryFilter,
        });

        if (response.products) {
          // Apply stock filter on client side
          let filteredProducts = response.products;
          if (stockFilter) {
            filteredProducts = filteredProducts.filter(product => {
              if (stockFilter === 'in-stock') return product.stock > 5;
              if (stockFilter === 'low-stock') return product.stock > 0 && product.stock <= 5;
              if (stockFilter === 'out-of-stock') return product.stock === 0;
              return true;
            });
          }
          setProducts(filteredProducts);
          setTotalCount(response.count || filteredProducts.length);
        } else {
          setProducts([]);
        }
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, stockFilter]);

  const getStatusColor = (stock) => {
    if (stock > 5) {
      return { bg: '#D4EDDA', text: '#155724', border: '#C3E6CB', status: 'IN STOCK' };
    } else if (stock > 0) {
      return { bg: '#FFF3CD', text: '#856404', border: '#FFEEBA', status: 'LOW STOCK' };
    } else {
      return { bg: '#F8D7DA', text: '#721C24', border: '#F5C6CB', status: 'OUT OF STOCK' };
    }
  };

  const handleEdit = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDelete = (productId) => {
    setDeleteProductId(productId);
    setIsDeleteConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteProductId) return;

    try {
      await deleteProduct(deleteProductId);
      // Remove product from list
      setProducts(products.filter(p => p.id !== deleteProductId));
      setTotalCount(totalCount - 1);
      setIsDeleteConfirmOpen(false);
      setDeleteProductId(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert(err.message || 'Failed to delete product');
      setIsDeleteConfirmOpen(false);
      setDeleteProductId(null);
    }
  };

  const onCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteProductId(null);
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-6 text-center">
        <p className="text-[#DC3545]">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Search & Filter Section */}
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000]"
            />
          </div>

          {/* Filter Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-[12px] font-semibold text-[#6C757D] uppercase mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] focus:outline-none focus:border-[#000000]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Status Filter */}
            <div>
              <label className="block text-[12px] font-semibold text-[#6C757D] uppercase mb-2">
                Stock Status
              </label>
              <select
                value={stockFilter}
                onChange={(e) => {
                  setStockFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] focus:outline-none focus:border-[#000000]"
              >
                <option value="">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategoryFilter('');
                  setStockFilter('');
                  setCurrentPage(0);
                }}
                className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] hover:bg-[#F8F9FA] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table Section */}
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F9FA] border-b-2 border-[#DEE2E6]">
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Category
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Price
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-right text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-[#6C757D]">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-[#6C757D]">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const statusInfo = getStatusColor(product.stock);
                return (
                  <tr
                    key={product.id}
                    className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors duration-100"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[14px] font-semibold text-[#212529]">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-mono text-[#212529]">{product.sku}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[14px] text-[#6C757D]">
                        {typeof product.category === 'object' ? product.category.name : product.category}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[14px] font-semibold text-[#212529]">{product.stock}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[14px] font-semibold text-[#212529]">₹{product.price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-block px-3 py-1 text-[11px] font-semibold rounded-full border"
                        style={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.text,
                          borderColor: statusInfo.border,
                        }}
                      >
                        {statusInfo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(product.id)}
                          className="text-black hover:text-[#0056b3] transition-colors"
                        >
                          <MdEdit className="text-[20px]" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-[#DC3545] hover:text-[#c82333] transition-colors"
                        >
                          <MdDelete className="text-[20px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-between">
        <span className="text-[13px] text-[#6C757D]">
          Showing {currentPage * limit + 1}–{Math.min((currentPage + 1) * limit, totalCount)} of {totalCount} results
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          {[...Array(Math.ceil(totalCount / limit)).keys()].slice(0, 3).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded text-[13px] transition-colors ${
                page === currentPage
                  ? 'bg-[#000000] text-white'
                  : 'border border-[#DEE2E6] hover:bg-white'
              }`}
            >
              {page + 1}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={(currentPage + 1) * limit >= totalCount}
            className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        isDangerous={true}
      />
      </div>
    </>
  );
};

export { ProductsHeader, SummaryCards, ProductsTable };