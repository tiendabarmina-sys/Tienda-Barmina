import React, { useState } from 'react';
import { X, ShoppingBag, Heart, Star, ShieldCheck, Truck, RefreshCw, CreditCard, Check } from 'lucide-react';
import { Product, StoreConfig } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onDirectCheckout: (product: Product, quantity: number, size?: string, color?: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  config?: StoreConfig;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
  isFavorite,
  onToggleFavorite,
  config
}) => {
  if (!product) return null;

  const showCuotas = config?.mostrar_cuotas !== false;
  const showEnvioGratis = config?.mostrar_envio_gratis !== false;
  const showTransferencia = config?.mostrar_descuento_transferencia !== false;
  const descuentoPercent = config?.descuento_transferencia || 15;
  const cuotasCount = config?.cuotas_sin_interes || 6;

  const defaultSizes = product.talles || [];
  const defaultColors = product.colores || [];

  const [selectedSize, setSelectedSize] = useState<string>(defaultSizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(defaultColors[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const price = product.precio || product.price || 0;
  const originalPrice = product.precio_anterior || product.original_price;
  const cuotasVal = Math.round(price / cuotasCount);
  const transferPrice = Math.round(price * (1 - descuentoPercent / 100));

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize || undefined, selectedColor || undefined);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    onDirectCheckout(product, quantity, selectedSize || undefined, selectedColor || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e6e2da] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Product Image */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] bg-[#f5f1e9] rounded-2xl overflow-hidden shadow-inner border border-[#e6e2da]">
              <img
                src={product.imagen_url || product.image || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
              {showEnvioGratis && product.envio_gratis && (
                <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Envío Gratis
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 bg-[#f5f1e9] p-3 rounded-xl">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#004080]" />
                Garantía oficial Barmina
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#004080]" />
                Envíos a todo el país
              </span>
            </div>
          </div>

          {/* Right Column: Details & Ordering */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category */}
              <div className="flex items-center justify-between text-xs text-[#605e58] font-medium mb-1">
                <span className="uppercase tracking-widest">{product.categoria || 'Colección Atelier'}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-[#1c1b1b] font-serif leading-tight">
                {product.nombre || product.title}
              </h2>

              {/* Price & Installments */}
              <div className="mt-4 p-4 rounded-2xl bg-[#f5f1e9] border border-[#e6e2da] space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#004080]">
                    ${price.toLocaleString('es-AR')}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-sm text-slate-400 line-through">
                      ${originalPrice.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>

                {showCuotas && (
                  <p className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Hasta {cuotasCount} cuotas sin interés de ${cuotasVal.toLocaleString('es-AR')}</span>
                  </p>
                )}

                {showTransferencia && (
                  <p className="text-xs text-amber-800 font-semibold">
                    💰 Pago por Transferencia ({descuentoPercent}% OFF): <strong>${transferPrice.toLocaleString('es-AR')}</strong>
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-[#605e58] leading-relaxed">
                {product.descripcion || 'Producto seleccionado especialmente para acompañar tus momentos de relajación, meditación y bienestar.'}
              </p>

              {/* Size Selector */}
              {defaultSizes.length > 0 && (
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Seleccionar Talle: <span className="text-[#004080]">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {defaultSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#004080] text-white border-[#004080] shadow-sm'
                            : 'bg-white text-slate-700 border-[#d1cdc7] hover:border-[#004080]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {defaultColors.length > 0 && (
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Color: <span className="text-[#004080]">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {defaultColors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
                          selectedColor === col
                            ? 'bg-[#002a58] text-white border-[#002a58]'
                            : 'bg-[#f5f1e9] text-slate-700 border-[#d1cdc7] hover:border-[#004080]'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Cantidad:
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-[#d1cdc7] rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-base"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-bold text-sm text-[#004080]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-base"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">
                    Stock disponible: {product.stock || 12} unidades
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-[#e6e2da] space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#004080] hover:bg-[#002a58] text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>¡Agregado al Carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Agregar al Carrito</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleFavorite(product)}
                  className="p-3.5 rounded-2xl border border-[#d1cdc7] text-slate-700 hover:text-[#004080] hover:border-[#004080] transition-colors cursor-pointer"
                  title="Guardar en Favoritos"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#004080] text-[#004080]' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#1c1b1b] hover:bg-black text-white font-bold text-sm py-3 px-6 rounded-2xl transition-all cursor-pointer"
              >
                Comprar Ahora (Checkout Rápido)
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
