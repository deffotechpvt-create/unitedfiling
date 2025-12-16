
import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateCartItem, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // const handleCheckout = () => {
    
  //   // onClose();
  // };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" title="Close cart">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={item.serviceId} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">{item.serviceName}</h4>
                      <p className="text-xs text-gray-500 mt-1">Service ID: {item.serviceId.slice(0, 8)}...</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.serviceId)}
                      className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                      title="Remove from cart"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartItem(item.serviceId, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 border rounded hover:bg-gray-100 text-sm font-medium"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-sm font-medium min-w-[30px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.serviceId, item.quantity + 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100 text-sm font-medium"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">₹{item.price.toLocaleString()} × {item.quantity}</p>
                      <p className="text-sm font-bold text-green-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">GST (18%):</span>
                <span className="font-medium">₹{Math.round(totalPrice * 0.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold text-base">Total:</span>
                <span className="font-bold text-lg text-green-600">₹{(totalPrice + Math.round(totalPrice * 0.18)).toLocaleString()}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={clearCart}
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  Clear Cart
                </Button>
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                  disabled={items.length === 0}   
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
