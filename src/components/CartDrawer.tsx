import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string | number, delta: number) => void;
  onRemoveItem: (productId: string | number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.product.precio || item.product.price || 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#f5f1e9] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#e6e2da] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#004080]" />
            <h2 className="text-lg font-bold text-[#1c1b1b] font-serif">Mi Carrito Barmina</h2>
            <span className="bg-[#004080] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-[#e6e2da] rounded-full flex items-center justify-center mx-auto text-[#004080]">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <p className="text-slate-600 font-medium text-sm">Tu carrito está vacío</p>
              <button
                onClick={onClose}
                className="bg-[#004080] text-white font-medium text-xs px-6 py-2.5 rounded-full hover:bg-[#002a58] transition-colors"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemPrice = item.product.precio || item.product.price || 0;
              return (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="bg-white rounded-2xl p-3.5 border border-[#e6e2da] flex gap-3 barmina-card-shadow"
                >
                  <img
                    src={item.product.imagen_url || item.product.image || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400'}
                    alt={item.product.nombre}
                    className="w-20 h-24 object-cover rounded-xl bg-[#f5f1e9]"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#1c1b1b] line-clamp-1">
                          {item.product.nombre}
                        </h4>
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex gap-2 text-[11px] text-slate-500 mt-0.5">
                            {item.selectedSize && item.selectedSize !== 'Único' && <span>Variante: <strong>{item.selectedSize}</strong></span>}
                            {item.selectedColor && item.selectedColor !== 'Estándar' && <span>Color: <strong>{item.selectedColor}</strong></span>}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Eliminar del carrito"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f0eded]">
                      <div className="flex items-center border border-[#d1cdc7] rounded-lg bg-[#f5f1e9]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="px-2 py-0.5 text-slate-600 font-bold hover:bg-[#e6e2da]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#004080]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="px-2 py-0.5 text-slate-600 font-bold hover:bg-[#e6e2da]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-[#004080]">
                        ${(itemPrice * item.quantity).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="bg-white p-5 border-t border-[#e6e2da] space-y-3">
            
            {/* Totals Summary */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Total parcial:</span>
                <span className="font-semibold text-slate-800">${subtotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span className="text-emerald-700 font-semibold">A coordinar</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#004080] pt-2 border-t border-[#f0eded]">
                <span>Total estimado:</span>
                <span>${subtotal.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-[#004080] hover:bg-[#002a58] text-white font-bold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
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
