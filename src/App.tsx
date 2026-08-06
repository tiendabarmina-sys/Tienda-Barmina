import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, StoreConfig, FilterState } from './types';
import { fetchProducts, fetchStoreConfig, saveStoreConfigToSupabase } from './lib/supabase';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistModal } from './components/WishlistModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminPanelModal } from './components/AdminPanelModal';
import { HelpModal } from './components/HelpModal';
import { Footer } from './components/Footer';
import { ShoppingBag, Database } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<StoreConfig>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [supabaseSource, setSupabaseSource] = useState<'supabase' | 'fallback'>('supabase');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [helpModalType, setHelpModalType] = useState<'faq' | 'pago' | 'envio' | 'cambios' | 'contacto' | null>(null);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: 'Todos',
    search: '',
    minPrice: 0,
    maxPrice: 300000,
    sortBy: 'featured',
    onlyInStock: false,
    onlyFreeShipping: false,
    onlyOnSale: false,
  });
  const [visibleCount, setVisibleCount] = useState<number>(16);

  useEffect(() => {
    setVisibleCount(16);
  }, [filters]);

  const loadInitialData = async () => {
    setLoading(true);
    const [configRes, productsRes] = await Promise.all([
      fetchStoreConfig(),
      fetchProducts(),
    ]);

    setConfig(configRes.config);
    setProducts(productsRes.products);
    
    if (configRes.source === 'supabase' || productsRes.source === 'supabase') {
      setSupabaseSource('supabase');
    } else {
      setSupabaseSource('fallback');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadInitialData();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    if (window.location.search.includes('admin=true') || window.location.hash.includes('admin')) {
      setIsAdminOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveConfig = async (updatedConfig: StoreConfig) => {
    setConfig(updatedConfig);
    try {
      await saveStoreConfigToSupabase(updatedConfig);
    } catch (e) {
      console.warn('Config save exception:', e);
    }
  };

  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    cats.add('Todos');
    products.forEach((p) => {
      if (p.categoria) cats.add(p.categoria);
    });
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.category !== 'Todos') {
        if (filters.category === 'Ofertas') {
          const originalPrice = p.precio_anterior || p.original_price;
          const currentPrice = p.precio || p.price || 0;
          if (!originalPrice || originalPrice <= currentPrice) return false;
        } else if (p.categoria !== filters.category) {
          return false;
        }
      }

      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const nameMatch = (p.nombre || p.title || '').toLowerCase().includes(query);
        const descMatch = (p.descripcion || p.description || '').toLowerCase().includes(query);
        const catMatch = (p.categoria || '').toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }

      if (filters.onlyFreeShipping && !p.envio_gratis) return false;
      if (filters.onlyInStock && p.stock !== undefined && p.stock <= 0) return false;
      if (filters.onlyOnSale) {
        const originalPrice = p.precio_anterior || p.original_price;
        const currentPrice = p.precio || p.price || 0;
        if (!originalPrice || originalPrice <= currentPrice) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.precio || a.price || 0;
      const priceB = b.precio || b.price || 0;

      if (filters.sortBy === 'price-asc') return priceA - priceB;
      if (filters.sortBy === 'price-desc') return priceB - priceA;
      if (filters.sortBy === 'name-asc') return (a.nombre || '').localeCompare(b.nombre || '');
      if (filters.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, filters]);

  const handleAddToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    const chosenSize = size || (product.talles && product.talles.length > 0 ? product.talles[0] : undefined);
    const chosenColor = color || (product.colores && product.colores.length > 0 ? product.colores[0] : undefined);

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [...prevCart, { product, quantity, selectedSize: chosenSize, selectedColor: chosenColor }];
    });
  };

  const handleUpdateCartQuantity = (productId: string | number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleToggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isFavorite = (productId: string | number) => {
    return favorites.some((p) => p.id === productId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f1e9] text-[#1c1b1b] font-sans">
      
      <AnnouncementBar config={config} />

      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
        searchQuery={filters.search}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, search: q }))}
        categories={categoriesList}
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        
        <Hero
          config={config}
          onExplore={() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e6e2da]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#004080]">Catálogo Barmina</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1b1b] font-serif">
                {filters.category === 'Todos' ? 'Nuestros Productos' : `Categoría: ${filters.category}`}
              </h2>
            </div>
          </div>

          <FilterBar
            filters={filters}
            onChangeFilter={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
            categories={categoriesList}
            totalResults={filteredProducts.length}
            onResetFilters={() =>
              setFilters({
                category: 'Todos',
                search: '',
                minPrice: 0,
                maxPrice: 300000,
                sortBy: 'featured',
                onlyInStock: false,
                onlyFreeShipping: false,
                onlyOnSale: false,
              })
            }
          />

          {loading ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-[#e6e2da] shadow-sm my-8 space-y-4 max-w-md mx-auto">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#004080]/20 border-t-[#004080] animate-spin"></div>
                <Database className="w-7 h-7 text-[#004080]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 font-sans">Cargando catálogo...</h3>
                <p className="text-xs text-slate-500">Obteniendo los productos de la tienda.</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e6e2da] space-y-4 max-w-lg mx-auto barmina-card-shadow">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 font-serif">No se encontraron productos</h3>
              <p className="text-xs text-slate-500">Probá cambiando los términos de búsqueda o seleccionando otra categoría.</p>
              <button
                onClick={() =>
                  setFilters({
                    category: 'Todos',
                    search: '',
                    minPrice: 0,
                    maxPrice: 300000,
                    sortBy: 'featured',
                    onlyInStock: false,
                    onlyFreeShipping: false,
                    onlyOnSale: false,
                  })
                }
                className="bg-[#004080] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#002a58] transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    isFavorite={isFavorite(product.id)}
                    onToggleFavorite={handleToggleFavorite}
                    cuotasCount={config.cuotas_sin_interes || 6}
                    showCuotas={config.mostrar_cuotas !== false}
                    showEnvioGratis={config.mostrar_envio_gratis !== false}
                    showTransferencia={config.mostrar_descuento_transferencia !== false}
                    descuentoTransferencia={config.descuento_transferencia || 15}
                  />
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 16)}
                    className="inline-flex items-center justify-center gap-2 bg-[#004080] hover:bg-[#002a58] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>Continuar viendo ({filteredProducts.length - visibleCount} productos más)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

      </main>

      <WhatsAppButton phoneNumber={config.whatsapp_numero || '5491164504653'} />

      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(prod, qty, size, col) => handleAddToCart(prod, qty, size, col)}
        onDirectCheckout={(prod, qty, size, col) => {
          handleAddToCart(prod, qty, size, col);
          setQuickViewProduct(null);
          setIsCheckoutOpen(true);
        }}
        isFavorite={quickViewProduct ? isFavorite(quickViewProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        config={config}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        freeShippingMin={config.envio_gratis_minimo || 60000}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={(id) => {
          setIsCheckoutOpen(false);
          setCart([]);
          setOrderSuccessId(id);
        }}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleToggleFavorite}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        products={products}
        onRefreshProducts={loadInitialData}
        supabaseSource={supabaseSource}
      />

      <OrderSuccessModal
        orderId={orderSuccessId}
        onClose={() => setOrderSuccessId(null)}
      />

      <HelpModal
        type={helpModalType}
        onClose={() => setHelpModalType(null)}
        config={config}
      />

      <Footer
        config={config}
        onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
        onOpenAdmin={() => setIsAdminOpen(true)}
        categories={categoriesList}
        onOpenHelp={(type) => setHelpModalType(type)}
      />

    </div>
  );
}
