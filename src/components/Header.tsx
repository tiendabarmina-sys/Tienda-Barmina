import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { LOGO_URL } from '../lib/supabase';
import { StoreConfig } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  config?: StoreConfig;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  categories,
  config,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const mainCategories = categories.length > 0 ? categories.slice(0, 6) : ['Todos', 'Sahumerios', 'VELA AROMÁTICA', 'HUMIDIFICADOR', 'DIFUSORES', 'TEXTIL'];

  return (
    <header className="sticky top-0 z-40 bg-[#f5f1e9]/95 backdrop-blur-md border-b border-[#e6e2da] transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button - STRICTLY MOBILE ONLY (md:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#004080] hover:bg-[#e6e2da] rounded-xl transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo Barmina */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              onClick={() => onSelectCategory('Todos')} 
              onDoubleClick={() => onOpenAdmin && onOpenAdmin()}
              className="flex items-center group text-left focus:outline-none cursor-pointer py-1"
              title="Barmina - Click para ver todo, doble click para Administrador"
            >
              <img
                src={config?.logo_url || LOGO_URL}
                alt="Barmina Tienda Holística"
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar por sahumerio, difusor, textil, hornillo..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white text-[#1c1b1b] placeholder:text-[#605e58] pl-10 pr-10 py-2.5 rounded-full border border-[#d1cdc7] focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/20 text-xs sm:text-sm transition-all shadow-sm"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#605e58]" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions: Wishlist & Shopping Cart */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-[#004080] hover:bg-[#e6e2da] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Favoritos"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#004080] text-[#004080]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#004080] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#f5f1e9]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative bg-[#004080] hover:bg-[#002a58] text-white px-4 py-2.5 rounded-full flex items-center space-x-2 transition-all shadow-sm hover:shadow-md cursor-pointer group"
              aria-label="Ver carrito"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline font-bold text-xs sm:text-sm">Mi Carrito</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#004080] text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar sahumerios, esencias, difusores..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white text-[#1c1b1b] placeholder:text-[#605e58] pl-9 pr-9 py-2 rounded-full border border-[#d1cdc7] focus:border-[#004080] text-xs"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#605e58]" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>


      </div>

      {/* Mobile Drawer Menu - Only triggered on Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative bg-[#f5f1e9] w-4/5 max-w-sm h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-[#e6e2da]">
              <div className="flex items-center gap-2">
                <img src={config?.logo_url || LOGO_URL} alt="Barmina" className="h-8 w-auto" />
                <span className="font-serif font-bold text-lg text-[#004080]">{config?.nombre_tienda || 'BARMINA'}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 space-y-2">
              <p className="text-xs uppercase font-bold text-[#605e58] tracking-wider mb-3">Categorías de Productos</p>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#004080] text-white shadow-sm'
                      : 'text-[#1c1b1b] hover:bg-[#e6e2da]'
                  }`}
                >
                  <span>{cat}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-[#e6e2da] text-xs text-[#605e58] space-y-2">
              <p>📍 {config?.direccion || 'Buenos Aires, Argentina'}</p>
              <p>💬 WhatsApp: {config?.whatsapp_numero || '5491164504653'}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
