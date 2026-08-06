import React, { useState } from 'react';
import { 
  X, ShieldCheck, Store, PackagePlus, ShoppingBag, Database, 
  Save, Plus, Trash2, Edit3, Check, RefreshCw, AlertCircle, 
  Lock, Share2, HelpCircle, CreditCard, 
  Truck, RefreshCw as RefreshIcon, ToggleLeft, ToggleRight
} from 'lucide-react';
import { StoreConfig, Product, CustomerOrder } from '../types';
import { supabase, SUPABASE_URL } from '../lib/supabase';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
  onSaveConfig: (updated: StoreConfig) => Promise<void>;
  products: Product[];
  onRefreshProducts: () => void;
  supabaseSource: 'supabase' | 'fallback';
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  products,
  onRefreshProducts,
  supabaseSource
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'config' | 'policies' | 'products' | 'categories' | 'orders' | 'debug'>('config');

  // Config state con sincronización garantizada al abrir
  const [formData, setFormData] = useState<StoreConfig>({ ...config });

  // Actualizar el formulario si las props de configuración cambian o se recargan
  React.useEffect(() => {
    if (config) {
      setFormData({ ...config });
    }
  }, [config, isOpen]);

  // Editing existing product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    nombre: '',
    categoria: 'Sahumerios',
    precio: 3500,
    precio_anterior: undefined,
    stock: 10,
    imagen_url: '',
    descripcion: '',
    destacado: true,
    envio_gratis: true
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [productMsg, setProductMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Orders state
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput.toLowerCase() === 'admin' || pinInput === '') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // --- LÓGICA LIMPIA Y DIRECTA DE GUARDADO DE CONFIGURACIÓN ---
  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setConfigMsg(null);

    try {
      const payload = { id: 1, ...formData };

      // Apuntando directamente a la tabla 'configuracion'
      const { error } = await supabase
        .from('configuracion')
        .upsert([payload]);

      if (error) throw error;

      // Actualizar el estado global de React
      await onSaveConfig(formData);
      setConfigMsg({ type: 'success', text: '¡Configuración e información de la tienda guardada con éxito!' });
      setTimeout(() => setConfigMsg(null), 4000);
    } catch (err: any) {
      console.error('Error al guardar configuración:', err);
      setConfigMsg({ 
        type: 'error', 
        text: `Error al guardar: ${err?.message || 'Revisá la tabla configuracion en Supabase.'}` 
      });
    } finally {
      setSavingConfig(false);
    }
  };

  // --- CREACIÓN DE PRODUCTO ---
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.nombre || !newProduct.precio) {
      setProductMsg({ type: 'error', text: 'Por favor completá el nombre y el precio.' });
      return;
    }

    setSavingProduct(true);
    setProductMsg(null);

    try {
      const payload = {
        nombre: newProduct.nombre,
        categoria: newProduct.categoria || 'General',
        precio: Number(newProduct.precio),
        precio_anterior: newProduct.precio_anterior ? Number(newProduct.precio_anterior) : null,
        stock: Number(newProduct.stock || 10),
        imagen_url: newProduct.imagen_url || null,
        descripcion: newProduct.descripcion || '',
        destacado: newProduct.destacado ?? true,
        nuevo: true,
        envio_gratis: newProduct.envio_gratis ?? true
      };

      const { error } = await supabase.from('productos').insert([payload]);

      if (error) throw error;

      setProductMsg({ type: 'success', text: '¡Producto guardado exitosamente!' });
      setShowAddProduct(false);
      setNewProduct({
        nombre: '',
        categoria: 'Sahumerios',
        precio: 3500,
        stock: 10,
        imagen_url: '',
        descripcion: '',
        destacado: true,
        envio_gratis: true
      });
      onRefreshProducts();
    } catch (err: any) {
      console.error(err);
      setProductMsg({ type: 'error', text: `Error al guardar: ${err?.message || 'Revisá la conexión'}` });
    } finally {
      setSavingProduct(false);
    }
  };

  // --- ACTUALIZACIÓN DE PRODUCTO ---
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSavingProduct(true);
    setProductMsg(null);

    try {
      const payload = {
        nombre: editingProduct.nombre,
        categoria: editingProduct.categoria,
        precio: Number(editingProduct.precio),
        precio_anterior: editingProduct.precio_anterior ? Number(editingProduct.precio_anterior) : null,
        stock: Number(editingProduct.stock || 0),
        imagen_url: editingProduct.imagen_url || null,
        descripcion: editingProduct.descripcion || '',
        destacado: editingProduct.destacado ?? false,
        envio_gratis: editingProduct.envio_gratis ?? false
      };

      const { error } = await supabase.from('productos').update(payload).eq('id', editingProduct.id);

      if (error) throw error;

      setProductMsg({ type: 'success', text: '¡Producto actualizado con éxito!' });
      setEditingProduct(null);
      onRefreshProducts();
    } catch (err: any) {
      console.error(err);
      setProductMsg({ type: 'error', text: `Error al actualizar: ${err?.message || 'Revisá la conexión'}` });
    } finally {
      setSavingProduct(false);
    }
  };

  // --- ELIMINACIÓN DE PRODUCTO ---
  const handleDeleteProduct = async (productId: string | number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const { error } = await supabase.from('productos').delete().eq('id', productId);
      if (error) throw error;
      onRefreshProducts();
    } catch (err: any) {
      console.error('Error al eliminar producto:', err);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#e6e2da]">
        
        {/* Header Modal Bar */}
        <div className="bg-[#002a58] text-white px-6 py-4 flex items-center justify-between border-b border-[#004080]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-[#83aef5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif tracking-wide">Panel Administrador Barmina</h2>
              <p className="text-xs text-slate-300">Control de Textos, Productos, Datos de Contacto y Configuración</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PIN Login view */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 bg-[#004080]/10 rounded-full flex items-center justify-center mx-auto text-[#004080]">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Acceso Administrador</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ingresá la clave de administración. (Clave por defecto: <strong className="text-slate-800">admin</strong>)
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Clave..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004080] focus:outline-none"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-medium">Clave incorrecta. Probá con "admin" o 1234.</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#004080] hover:bg-[#002a58] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm cursor-pointer"
              >
                Acceder al Panel
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-1 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('config')}
                className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'config'
                    ? 'border-[#004080] text-[#004080] bg-white font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Tienda & Contacto</span>
              </button>

              <button
                onClick={() => setActiveTab('policies')}
                className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'policies'
                    ? 'border-[#004080] text-[#004080] bg-white font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Textos de Ayuda y Políticas</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-[#004080] text-[#004080] bg-white font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <PackagePlus className="w-4 h-4" />
                <span>Productos ({products.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  fetchOrders();
                }}
                className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-[#004080] text-[#004080] bg-white font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pedidos</span>
              </button>

              <button
                onClick={() => setActiveTab('debug')}
                className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'debug'
                    ? 'border-[#004080] text-[#004080] bg-white font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Diagnóstico</span>
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              
              {/* TAB 1: STORE CONFIG & CONTACT */}
              {activeTab === 'config' && (
                <form onSubmit={handleConfigSubmit} className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 font-serif border-b pb-3 flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#004080]" />
                    <span>Información de la Tienda, Contacto y Promociones</span>
                  </h3>

                  {configMsg && (
                    <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      configMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {configMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                      <span>{configMsg.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Nombre de la Tienda</label>
                      <input
                        type="text"
                        value={formData.nombre_tienda || ''}
                        onChange={(e) => setFormData({ ...formData, nombre_tienda: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Email de Contacto</label>
                      <input
                        type="email"
                        placeholder="contacto@barmina.com"
                        value={formData.email_contacto || ''}
                        onChange={(e) => setFormData({ ...formData, email_contacto: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">WhatsApp / Teléfono de Contacto</label>
                      <input
                        type="text"
                        placeholder="+54 9 11 5555-8200"
                        value={formData.whatsapp_numero || formData.telefono_whatsapp || ''}
                        onChange={(e) => setFormData({ ...formData, whatsapp_numero: e.target.value, telefono_whatsapp: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Ubicación / Dirección Física</label>
                      <input
                        type="text"
                        placeholder="Buenos Aires, Argentina"
                        value={formData.ubicacion || formData.direccion || ''}
                        onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value, direccion: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-sm"
                      />
                    </div>
                  </div>

                  {/* Banner Ticker Announcement */}
                  <div>
                    <label className="block font-medium text-slate-700 mb-1 text-xs">Cinta de Anuncio Superior (barra_anuncio)</label>
                    <input
                      type="text"
                      placeholder="✨ 3 y 6 CUOTAS SIN INTERÉS | 15% OFF EN TRANSFERENCIA ✨"
                      value={formData.barra_anuncio || formData.banner_anuncio || ''}
                      onChange={(e) => setFormData({ ...formData, barra_anuncio: e.target.value, banner_anuncio: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-xs font-semibold"
                    />
                  </div>

                  {/* Descriptions and Banners */}
                  <div className="space-y-4 pt-2 border-t">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1 text-xs">Texto de Bienvenida (Descripción Portada)</label>
                      <textarea
                        rows={2}
                        value={formData.texto_bienvenida || formData.descripcion_tienda || ''}
                        onChange={(e) => setFormData({ ...formData, texto_bienvenida: e.target.value, descripcion_tienda: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1 text-xs">URL del Banner Principal (Imagen de Portada)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.banner_url || ''}
                        onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Promos & Discounts Config */}
                  <div className="pt-4 border-t space-y-4 text-xs">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                      <span>Promociones, Descuentos y Beneficios</span>
                      <span className="text-[11px] font-normal text-slate-500">Activa o desactiva cada beneficio libremente</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Cuotas sin Interes */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Cuotas Sin Interés</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, mostrar_cuotas: formData.mostrar_cuotas === false ? true : false })}
                            className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer text-[10px] ${
                              formData.mostrar_cuotas !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {formData.mostrar_cuotas !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            <span>{formData.mostrar_cuotas !== false ? 'ACTIVO' : 'INACTIVO'}</span>
                          </button>
                        </div>
                        {formData.mostrar_cuotas !== false && (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[11px] font-medium text-slate-600 mb-1">Leyenda (texto_cuotas)</label>
                              <input
                                type="text"
                                placeholder="Hasta 6 cuotas sin interés"
                                value={formData.texto_cuotas || ''}
                                onChange={(e) => setFormData({ ...formData, texto_cuotas: e.target.value })}
                                className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#004080] text-xs bg-white font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-slate-600 mb-1">Cantidad de Cuotas</label>
                              <input
                                type="number"
                                value={formData.cuotas_sin_interes || 6}
                                onChange={(e) => setFormData({ ...formData, cuotas_sin_interes: Number(e.target.value) })}
                                className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#004080] text-xs bg-white font-bold"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Descuento Transferencia */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">OFF Transferencia</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, mostrar_descuento_transferencia: formData.mostrar_descuento_transferencia === false ? true : false })}
                            className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer text-[10px] ${
                              formData.mostrar_descuento_transferencia !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {formData.mostrar_descuento_transferencia !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            <span>{formData.mostrar_descuento_transferencia !== false ? 'ACTIVO' : 'INACTIVO'}</span>
                          </button>
                        </div>
                        {formData.mostrar_descuento_transferencia !== false && (
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">% de Descuento</label>
                            <input
                              type="number"
                              value={formData.descuento_transferencia || 15}
                              onChange={(e) => setFormData({ ...formData, descuento_transferencia: Number(e.target.value) })}
                              className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#004080] text-xs bg-white font-bold text-amber-800"
                            />
                          </div>
                        )}
                      </div>

                      {/* Envío Gratis */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Envío Gratis</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, mostrar_envio_gratis: formData.mostrar_envio_gratis === false ? true : false })}
                            className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer text-[10px] ${
                              formData.mostrar_envio_gratis !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {formData.mostrar_envio_gratis !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            <span>{formData.mostrar_envio_gratis !== false ? 'ACTIVO' : 'INACTIVO'}</span>
                          </button>
                        </div>
                        {formData.mostrar_envio_gratis !== false && (
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Mínimo en Compra ($)</label>
                            <input
                              type="number"
                              value={formData.monto_envio_gratis ?? formData.envio_gratis_minimo ?? 60000}
                              onChange={(e) => setFormData({ ...formData, monto_envio_gratis: Number(e.target.value), envio_gratis_minimo: Number(e.target.value) })}
                              className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#004080] text-xs bg-white font-bold text-emerald-800"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links Section */}
                  <div className="pt-4 border-t space-y-4">
                    <h4 className="font-bold text-xs uppercase text-slate-600 tracking-wider flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#004080]" />
                      <span>Redes Sociales (RRSS Barmina)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Instagram (URL)</label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/barmina"
                          value={formData.instagram_url || ''}
                          onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Facebook (URL)</label>
                        <input
                          type="text"
                          placeholder="https://facebook.com/barmina"
                          value={formData.facebook_url || ''}
                          onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-slate-700 mb-1">TikTok (URL)</label>
                        <input
                          type="text"
                          placeholder="https://tiktok.com/@barmina"
                          value={formData.tiktok_url || ''}
                          onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex items-center justify-end border-t">
                    <button
                      type="submit"
                      disabled={savingConfig}
                      className="bg-[#004080] hover:bg-[#002a58] text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      {savingConfig ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Guardar Todos los Cambios</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: POLICIES & HELP CONTENT EDITING */}
              {activeTab === 'policies' && (
                <form onSubmit={handleConfigSubmit} className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs">
                  <h3 className="text-base font-bold text-slate-800 font-serif border-b pb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#004080]" />
                      <span>Edición de Textos Informativos y Visibilidad de Secciones</span>
                    </span>
                    <span className="text-xs font-normal text-slate-500">Formulario y Modales Emergentes</span>
                  </h3>

                  {configMsg && (
                    <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      configMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {configMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                      <span>{configMsg.text}</span>
                    </div>
                  )}

                  <div className="space-y-6">

                    {/* Preguntas Frecuentes */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                          <HelpCircle className="w-4 h-4 text-[#004080]" />
                          <span>Preguntas Frecuentes (texto_preguntas_frecuentes)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, mostrar_preguntas_frecuentes: formData.mostrar_preguntas_frecuentes === false ? true : false })}
                          className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                            formData.mostrar_preguntas_frecuentes !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {formData.mostrar_preguntas_frecuentes !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{formData.mostrar_preguntas_frecuentes !== false ? 'MOSTRAR EN TIENDA' : 'OCULTO'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Escribí las preguntas y respuestas frecuentes..."
                        value={formData.texto_preguntas_frecuentes || formData.preguntas_frecuentes || ''}
                        onChange={(e) => setFormData({ ...formData, texto_preguntas_frecuentes: e.target.value, preguntas_frecuentes: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] leading-relaxed bg-white"
                      />
                    </div>

                    {/* Medios de Pago */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                          <CreditCard className="w-4 h-4 text-[#004080]" />
                          <span>Medios de Pago (texto_medios_pago)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, mostrar_medios_pago: formData.mostrar_medios_pago === false ? true : false })}
                          className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                            formData.mostrar_medios_pago !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {formData.mostrar_medios_pago !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{formData.mostrar_medios_pago !== false ? 'MOSTRAR EN TIENDA' : 'OCULTO'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Explicación de tarjetas, cuotas y transferencia..."
                        value={formData.texto_medios_pago || formData.medios_pago_info || ''}
                        onChange={(e) => setFormData({ ...formData, texto_medios_pago: e.target.value, medios_pago_info: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] leading-relaxed bg-white"
                      />
                    </div>

                    {/* Seguimiento de Envíos */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                          <Truck className="w-4 h-4 text-[#004080]" />
                          <span>Seguimiento de Envíos (texto_seguimiento_envio)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, mostrar_seguimiento_envio: formData.mostrar_seguimiento_envio === false ? true : false })}
                          className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                            formData.mostrar_seguimiento_envio !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {formData.mostrar_seguimiento_envio !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{formData.mostrar_seguimiento_envio !== false ? 'MOSTRAR EN TIENDA' : 'OCULTO'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Explicación de despachos y números de seguimiento..."
                        value={formData.texto_seguimiento_envio || formData.seguimiento_envios_info || ''}
                        onChange={(e) => setFormData({ ...formData, texto_seguimiento_envio: e.target.value, seguimiento_envios_info: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] leading-relaxed bg-white"
                      />
                    </div>

                    {/* Garantía y Políticas */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                          <RefreshIcon className="w-4 h-4 text-[#004080]" />
                          <span>Garantía & Políticas de Calidad (texto_politicas)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, mostrar_garantia: formData.mostrar_garantia === false ? true : false })}
                          className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                            formData.mostrar_garantia !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {formData.mostrar_garantia !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{formData.mostrar_garantia !== false ? 'MOSTRAR EN TIENDA' : 'OCULTO'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Información sobre la calidad artesanal, embalaje y garantía de fragancias y sahumerios..."
                        value={formData.texto_politicas || formData.politicas_cambio_info || ''}
                        onChange={(e) => setFormData({ ...formData, texto_politicas: e.target.value, politicas_cambio_info: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#004080] leading-relaxed bg-white"
                      />
                    </div>

                    {/* Newsletter Toggle */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">Sección de Newsletter en Footer</span>
                        <span className="text-slate-500 text-xs">Muestra el formulario de suscripción a ofertas y novedades</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, mostrar_newsletter: formData.mostrar_newsletter === false ? true : false })}
                        className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-2 transition-all cursor-pointer text-xs ${
                          formData.mostrar_newsletter !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {formData.mostrar_newsletter !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        <span>{formData.mostrar_newsletter !== false ? 'MOSTRAR' : 'OCULTO'}</span>
                      </button>
                    </div>

                  </div>

                  <div className="pt-4 flex items-center justify-end border-t">
                    <button
                      type="submit"
                      disabled={savingConfig}
                      className="bg-[#004080] hover:bg-[#002a58] text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      {savingConfig ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Guardar Políticas y Textos</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: PRODUCT MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 font-serif">Catálogo de Productos ({products.length})</h3>
                      <p className="text-xs text-slate-500">Podés crear, modificar precios, fotos, descripciones o eliminar cualquier producto.</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setShowAddProduct(!showAddProduct);
                      }}
                      className="bg-[#004080] hover:bg-[#002a58] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showAddProduct ? 'Cerrar Formulario' : 'Nuevo Producto'}</span>
                    </button>
                  </div>

                  {productMsg && (
                    <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      productMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {productMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{productMsg.text}</span>
                    </div>
                  )}

                  {/* Edit Product Modal Form */}
                  {editingProduct && (
                    <form onSubmit={handleUpdateProduct} className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-4 text-xs animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                        <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                          <Edit3 className="w-4 h-4 text-[#004080]" />
                          <span>Modificar Producto #{editingProduct.id}</span>
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => setEditingProduct(null)} 
                          className="text-amber-800 hover:text-rose-600 font-bold"
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Nombre del Producto</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.nombre || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                            className="w-full px-3 py-1.5 border bg-white rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Categoría</label>
                          <input
                            type="text"
                            value={editingProduct.categoria || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, categoria: e.target.value })}
                            className="w-full px-3 py-1.5 border bg-white rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Precio Actual ($)</label>
                          <input
                            type="number"
                            required
                            value={editingProduct.precio || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, precio: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 border bg-white rounded-lg text-xs font-bold text-[#004080]"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Precio Anterior ($ - Tachado)</label>
                          <input
                            type="number"
                            placeholder="Opcional"
                            value={editingProduct.precio_anterior || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, precio_anterior: e.target.value ? Number(e.target.value) : undefined })}
                            className="w-full px-3 py-1.5 border bg-white rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Stock Disponible</label>
                          <input
                            type="number"
                            value={editingProduct.stock || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 border bg-white rounded-lg text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-medium text-slate-700 mb-1">URL de Imagen</label>
                          <input
                            type="url"
                            value={editingProduct.imagen_url || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, imagen_url: e.target.value })}
                            className="w-full px-3 py-1.5 border bg-white rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block font-medium text-slate-700 mb-1">Descripción del Producto</label>
                          <textarea
                            rows={2}
                            value={editingProduct.descripcion || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                            className="w-full px-3 py-1.5 border bg-white rounded-lg text-xs"
                          />
                        </div>

                        <div className="sm:col-span-3 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                          <span className="block font-bold text-slate-800 text-xs">Etiquetas y Distintivos del Producto</span>
                          <div className="flex flex-wrap items-center gap-6 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingProduct.nuevo ?? false}
                                onChange={(e) => setEditingProduct({ ...editingProduct, nuevo: e.target.checked })}
                                className="w-4 h-4 rounded text-[#004080]"
                              />
                              <span className="font-semibold text-slate-800">✨ Marca "Nuevo"</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingProduct.destacado ?? false}
                                onChange={(e) => setEditingProduct({ ...editingProduct, destacado: e.target.checked })}
                                className="w-4 h-4 rounded text-[#004080]"
                              />
                              <span className="font-semibold text-slate-800">⭐ Producto Destacado</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingProduct.envio_gratis ?? false}
                                onChange={(e) => setEditingProduct({ ...editingProduct, envio_gratis: e.target.checked })}
                                className="w-4 h-4 rounded text-[#004080]"
                              />
                              <span className="font-semibold text-slate-800">🚚 Envío Gratis</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={savingProduct}
                          className="bg-[#004080] hover:bg-[#002a58] text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {savingProduct ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          <span>Guardar Cambios</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Add Product Form */}
                  {showAddProduct && !editingProduct && (
                    <form onSubmit={handleCreateProduct} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs animate-fadeIn">
                      <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Cargar Nuevo Producto</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Nombre del Producto *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: Sahumerio Lavanda & Ruda"
                            value={newProduct.nombre || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Categoría</label>
                          <input
                            type="text"
                            placeholder="Sahumerios, DIFUSORES, VELA AROMÁTICA..."
                            value={newProduct.categoria || 'Sahumerios'}
                            onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Precio ($ ARS) *</label>
                          <input
                            type="number"
                            required
                            value={newProduct.precio || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, precio: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Precio Anterior ($ - Tachado/Oferta)</label>
                          <input
                            type="number"
                            placeholder="Ej: 15000 (Opcional)"
                            value={newProduct.precio_anterior || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, precio_anterior: e.target.value ? Number(e.target.value) : undefined })}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-700 mb-1">Stock Disponible</label>
                          <input
                            type="number"
                            value={newProduct.stock || 10}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-medium text-slate-700 mb-1">URL de Imagen</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={newProduct.imagen_url || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, imagen_url: e.target.value })}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                          <span className="block font-bold text-slate-800 text-xs">Etiquetas y Distintivos del Producto</span>
                          <div className="flex flex-wrap items-center gap-6 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newProduct.nuevo ?? true}
                                onChange={(e) => setNewProduct({ ...newProduct, nuevo: e.target.checked })}
                                className="w-4 h-4 rounded text-[#004080]"
                              />
                              <span className="font-semibold text-slate-800">✨ Marca "Nuevo"</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newProduct.destacado ?? false}
                                onChange={(e) => setNewProduct({ ...newProduct, destacado: e.target.checked })}
                                className="w-4 h-4 rounded text-[#004080]"
                              />
                              <span className="font-semibold text-slate-800">⭐ Producto Destacado</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newProduct.envio_gratis ?? false}
                                onChange={(e) => setNewProduct({ ...newProduct, envio_gratis: e.target.checked })}
                                className="w-4 h-4 rounded text-[#004080]"
                              />
                              <span className="font-semibold text-slate-800">🚚 Envío Gratis</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddProduct(false)}
                          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={savingProduct}
                          className="bg-[#004080] hover:bg-[#002a58] text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {savingProduct ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>Guardar Producto</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Products Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="max-h-[380px] overflow-y-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 uppercase text-[10px] tracking-wider border-b">
                          <tr>
                            <th className="p-3">Imagen</th>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Categoría</th>
                            <th className="p-3">Precio</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3">
                                <img
                                  src={p.imagen_url || 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=100'}
                                  alt={p.nombre}
                                  className="w-10 h-10 object-cover rounded-lg border"
                                />
                              </td>
                              <td className="p-3 font-semibold text-slate-900 max-w-[200px] truncate">{p.nombre}</td>
                              <td className="p-3">
                                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                  {p.categoria}
                                </span>
                              </td>
                              <td className="p-3 font-bold text-[#004080]">${p.precio?.toLocaleString('es-AR')}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  (p.stock || 0) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {p.stock ?? 0}
                                </span>
                              </td>
                              <td className="p-3 text-right flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setShowAddProduct(false);
                                    setEditingProduct(p);
                                  }}
                                  className="text-[#004080] hover:text-[#002a58] p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
                                  title="Editar producto"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  title="Eliminar producto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-800 font-serif">Pedidos Recibidos ({orders.length})</h3>
                    <button
                      onClick={fetchOrders}
                      className="text-xs text-[#004080] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                      <span>Actualizar</span>
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border text-center text-xs text-slate-500">
                      No hay pedidos registrados en la base de datos.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((o) => (
                        <div key={o.id} className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-2 shadow-sm">
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>Pedido #{o.id}</span>
                            <span className="text-[#004080] text-sm">${o.total?.toLocaleString('es-AR')}</span>
                          </div>
                          <div className="text-slate-600 space-y-0.5">
                            <p><strong>Cliente:</strong> {o.nombre} ({o.email} - Tel: {o.telefono})</p>
                            <p><strong>Dirección:</strong> {o.direccion}, {o.ciudad} (CP {o.codigo_postal})</p>
                            <p><strong>Pago:</strong> {o.metodo_pago} | <strong>Envío:</strong> {o.metodo_envio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: DIAGNOSTICS */}
              {activeTab === 'debug' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono space-y-2 shadow-inner">
                    <p className="text-emerald-400 font-bold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Status Conexión Supabase: {supabaseSource === 'supabase' ? 'CONECTADO Y ACTIVO' : 'MODO DEMO LOCAL'}
                    </p>
                    <p><strong>URL Supabase:</strong> {SUPABASE_URL}</p>
                    <p><strong>Tablas activas:</strong> productos, configuracion, pedidos</p>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    Este panel interno de administración permite editar absolutamente todos los textos, imágenes de portada, preguntas frecuentes, medios de pago, políticas de cambio y catálogo de la tienda de Barmina.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
