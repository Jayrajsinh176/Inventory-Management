import { MdDelete, MdAdd, MdRemove, MdShoppingCart } from 'react-icons/md';

const CartItems = ({ items, onRemoveItem, onUpdateQuantity, onAddMoreProducts }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#DEE2E6] p-8">
        <div className="text-center py-8">
          <MdShoppingCart className="mx-auto text-[48px] text-[#ADB5BD] mb-4" />
          <h3 className="text-[16px] font-semibold text-[#6C757D] mb-2">Cart is empty</h3>
          <p className="text-[14px] text-[#ADB5BD] mb-6">Scan or add products to get started</p>
          <button
            onClick={onAddMoreProducts}
            className="px-4 py-2 bg-[#000000] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors"
          >
            Add Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
      {/* Cart Items */}
      <div className="divide-y divide-[#DEE2E6]">
        {items.map((item) => (
          <div key={item.id} className="p-4 hover:bg-[#F8F9FA] transition-colors">
            <div className="flex items-start justify-between gap-4">
              {/* Product Info */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-16 h-16 bg-[#F1F3F5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[12px] text-[#6C757D]">
                      {item.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-[#212529] mb-1">{item.name}</h4>
                    <div className="flex items-center gap-4 text-[12px] text-[#6C757D]">
                      <span>SKU: <span className="font-medium">{item.sku}</span></span>
                      <span>Category: <span className="font-medium">{item.category}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Quantity */}
              <div className="text-right flex-shrink-0">
                <p className="text-[14px] font-semibold text-[#212529] mb-3">₹{item.price?.toFixed(2) || '0.00'}</p>
                
                {/* Quantity Controls */}
                <div className="inline-flex items-center border border-[#DEE2E6] rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-1 hover:bg-[#F8F9FA] transition-colors"
                    title="Decrease quantity"
                  >
                    <MdRemove className="text-[16px] text-[#6C757D]" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 h-8 text-center text-[13px] font-semibold border-l border-r border-[#DEE2E6] bg-white focus:outline-none"
                  />
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-[#F8F9FA] transition-colors"
                    title="Increase quantity"
                  >
                    <MdAdd className="text-[16px] text-[#6C757D]" />
                  </button>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-2 text-[#DC3545] hover:bg-[#F8D7DA] rounded transition-colors flex-shrink-0"
                title="Remove item"
              >
                <MdDelete className="text-[18px]" />
              </button>
            </div>

            {/* Item Total */}
            <div className="mt-3 pt-3 border-t border-[#E9ECEF] flex justify-between">
              <span className="text-[12px] text-[#6C757D]">Item Total:</span>
              <span className="text-[13px] font-semibold text-[#212529]">₹{(item.price * item.quantity)?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add More Products */}
      <div className="p-4 bg-[#F8F9FA] border-t border-[#DEE2E6]">
        <button
          onClick={onAddMoreProducts}
          className="w-full py-2 text-[14px] font-semibold text-[#007BFF] hover:text-[#0056b3] transition-colors"
        >
          + Add More Products
        </button>
      </div>
    </div>
  );
};

export default CartItems;
