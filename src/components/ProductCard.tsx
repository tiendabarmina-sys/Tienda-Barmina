import React from 'react';
import { Heart, ShoppingBag, Eye, Star, Truck, Percent } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  cuotasCount?: number;
  showCuotas?: boolean;
  showEnvioGratis?: boolean;
  showTransferencia?: boolean;
  descuentoTransferencia?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isFavorite,
  onToggleFavorite,
  cuotasCount = 6,
  showCuotas = true,
  showEnvioGratis = true,
  showTransferencia = true,
  descuentoTransferencia = 15
}) => {
  const price = product.precio || product.price || 0;
  const originalPrice = product.precio_anterior || product.original_price;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const cuotaVal = Math.round(price / cuotasCount);

  return (
    <div className="group bg-white rounded-2xl border border-[#e5e2e1] overflow-hidden barmina-card-shadow transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] bg-[#f5f1e9] overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.imagen_url || product.image || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'}
          alt={product.nombre || 'Producto Barmina'}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.nuevo && (
            <span className="bg-[#004080] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Nuevo
            </span>
          )}
          {hasDiscount && (
            <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Percent className="w-2.5 h-2.5" />
              -{discountPercent}%
            </span>
          )}
          {showEnvioGratis && product.envio_gratis && (
            <span className="bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Truck className="w-2.5 h-2.5" />
              Envío Gratis
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#004080] shadow-md backdrop-blur-sm transition-all z-10 cursor-pointer"
          aria-label="Guardar en favoritos"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-[#004080] text-[#004080]' : ''}`} />
        </button>

        {/* Quick View Hover Button Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-[#004080] font-semibold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            Vista Rápida
          </span>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#605e58] font-medium mb-1">
            <span className="uppercase tracking-wider">{product.categoria || 'Colección'}</span>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="text-sm font-semibold text-[#1c1b1b] line-clamp-2 hover:text-[#004080] transition-colors cursor-pointer leading-snug"
          >
            {product.nombre || product.title}
          </h3>
        </div>

        {/* Pricing & Installments */}
        <div className="pt-2 border-t border-[#f0eded]">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#004080]">
              ${price.toLocaleString('es-AR')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                ${originalPrice.toLocaleString('es-AR')}
              </span>
            )}
          </div>

          {showCuotas && (
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              {cuotasCount}x ${cuotaVal.toLocaleString('es-AR')} sin interés
            </p>
          )}

          {showTransferencia && (
            <p className="text-[10px] text-slate-500 mt-0.5">
              {descuentoTransferencia}% OFF abonando con Transferencia
            </p>
          )}
        </div>

        {/* Add To Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full mt-2 bg-[#004080] hover:bg-[#002a58] text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Agregar al Carrito</span>
        </button>
      </div>
    </div>
  );
};
