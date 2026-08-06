import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string | number, delta: number) => void;
  onRemoveItem: (productId: string | number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slideLeft">
        
        {/* Header */}
        <div className="bg-[#002a58] text-white px-6 py-4 flex items-center justify-between border-b border-[#004080]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#83aef5]" />
            <h2 className="text-lg font-bold font-serif">Mi Carrito Barmina</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium text-slate-600">Tu carrito está vacío</p>
              <p className="text-xs text-slate-400">Explorá la tienda y agregá productos de bienestar.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                <img
                  src={item.imagen_url || 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=100'}
                  alt={item.nombre}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.nombre}</h4>
                  <p className="text-xs font-bold text-[#004080] mt-0.5">${item.precio?.toLocaleString('es-AR')}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-100 space-y-4">
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Total parcial:</span>
                <span className="font-semibold">${subtotal.toLocaleString('es-AR')}</span>
              </div>
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>Envío:</span>
                <span className="font-medium text-emerald-700">A coordinar con el vendedor</span>
              </div>

              <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t">
                <span>Total estimado:</span>
                <span className="text-[#004080]">${subtotal.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-[#004080] hover:bg-[#002a58] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Iniciar Compra Segura</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
