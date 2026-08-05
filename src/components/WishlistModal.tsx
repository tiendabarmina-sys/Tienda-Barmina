import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e6e2da] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#e6e2da]">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-[#004080] fill-[#004080]" />
            <h2 className="text-lg font-bold text-[#1c1b1b] font-serif">Mis Favoritos ({favorites.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-600 font-medium">Aún no guardaste prendas en tus favoritos.</p>
              <button
                onClick={onClose}
                className="bg-[#004080] text-white text-xs font-bold px-5 py-2.5 rounded-full"
              >
                Explorar Colección
              </button>
            </div>
          ) : (
            favorites.map((product) => (
              <div 
                key={product.id}
                className="bg-[#f5f1e9] rounded-2xl p-3 border border-[#e6e2da] flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={product.imagen_url || product.image || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200'}
                    alt={product.nombre}
                    className="w-14 h-16 object-cover rounded-xl bg-white"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1c1b1b] line-clamp-1">{product.nombre}</h4>
                    <p className="text-xs font-extrabold text-[#004080] mt-0.5">
                      ${(product.precio || product.price || 0).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-[#004080] text-white p-2.5 rounded-xl hover:bg-[#002a58] transition-colors"
                    title="Agregar al carrito"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(product)}
                    className="text-slate-400 hover:text-red-600 p-2 transition-colors"
                    title="Quitar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
