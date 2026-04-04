import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../../api';

const CategoriesHeader = ({ onAddClick, loading }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-[24px] font-bold text-[#212529] mb-2">Categories</h1>
        <p className="text-[12px] uppercase font-semibold tracking-[0.08em] text-[#6C757D]">
          MANAGE PRODUCT CLASSIFICATION
        </p>
      </div>
      <button 
        onClick={() => onAddClick()}
        className="bg-[#000000] text-white px-6 py-2 rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <MdAdd className="text-[18px]" />
        Add Category
      </button>
    </div>
  );
};

const CategoriesGrid = ({ showAddForm, setShowAddForm }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      if (response.data) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    setAddingCategory(true);
    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
      setShowAddForm(false);
      await fetchCategories(); // Refresh the list
    } catch (err) {
      alert(err.message || 'Failed to create category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        await fetchCategories(); // Refresh the list
      } catch (err) {
        alert(err.message || 'Failed to delete category');
      }
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-6">
          <h3 className="text-[16px] font-semibold text-[#212529] mb-4">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              disabled={addingCategory}
              className="flex-1 h-11 px-4 border border-[#DEE2E6] rounded-lg text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={addingCategory}
              className="px-6 py-2 bg-[#000000] text-white rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
            >
              {addingCategory ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewCategoryName('');
              }}
              className="px-6 py-2 border border-[#DEE2E6] rounded-lg font-semibold text-[14px] hover:bg-[#F8F9FA] transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg p-4">
          <p className="text-[#721C24] text-[14px]">{error}</p>
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-[#DEE2E6] rounded-md text-[13px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#000000]"
            />
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 border border-[#DEE2E6] rounded-md text-[12px] hover:bg-[#F8F9FA] transition-colors"
            >
              Clear
            </button>
          </div>
          <span className="block text-[12px] text-[#6C757D] font-medium">
            Showing {filteredCategories.length} of {categories.length} categories
          </span>
        </div>
      </div>

      {/* Categories Table Section */}
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA] border-b-2 border-[#DEE2E6]">
                <th className="px-6 py-4 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Category Name
                </th>
                <th className="px-6 py-4 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Number of Products
                </th>
                <th className="px-6 py-4 text-right text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-[#6C757D]">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-[#6C757D]">
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors duration-100"
                  >
                    {/* Category Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#F1F3F5]">
                          <span style={{ color: '#6C757D', fontSize: '20px' }}>●</span>
                        </div>
                        <p className="text-[14px] font-semibold text-[#212529]">{category.name}</p>
                      </div>
                    </td>

                    {/* Product Count */}
                    <td className="px-6 py-4">
                      <p className="text-[14px] text-[#6C757D]">
                        {category.productCount || 0} product{category.productCount !== 1 ? 's' : ''}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-[#6C757D] hover:text-[#212529] hover:bg-[#F1F3F5] rounded transition-colors">
                          <MdEdit className="text-[20px]" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-[#6C757D] hover:text-[#DC3545] hover:bg-[#FCE4E6] rounded transition-colors"
                        >
                          <MdDelete className="text-[20px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { CategoriesHeader, CategoriesGrid };
