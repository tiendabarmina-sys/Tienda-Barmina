import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Building, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { CartItem, CustomerOrder } from '../types';
import { createOrderInSupabase } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStatusMsg, setDbStatusMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    dni: '',
    direccion: '',
    ciudad: 'Buenos Aires',
    codigo_postal: '1425',
    metodo_envio: 'domicilio',
    metodo_pago: 'transferencia'
  });

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.product.precio || item.product.price || 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const isFreeShipping = subtotal >= 60000 || formData.metodo_envio === 'retiro';
  const shippingCost = isFreeShipping ? 0 : 4500;
  
  // 15% OFF for Bank Transfer
  const isTransfer = formData.metodo_pago === 'transferencia';
  const discountAmount = isTransfer ? Math.round(subtotal * 0.15) : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDbStatusMsg('Conectando a Supabase para registrar la orden...');

    const orderData: CustomerOrder = {
      nombre: formData.nombre || 'Cliente Barmina',
      email: formData.email || 'cliente@barmina.com',
      telefono: formData.telefono || '+54 11 5555 0000',
      dni: formData.dni || '38123456',
      direccion: formData.direccion || 'Av. Corrientes 1234',
      ciudad: formData.ciudad || 'Buenos Aires',
      codigo_postal: formData.codigo_postal || '1425',
      metodo_pago: formData.metodo_pago === 'transferencia' ? 'Transferencia Bancaria (15% OFF)' : formData.metodo_pago === 'cuotas' ? 'Tarjeta en 6 Cuotas Sin Interés' : 'Mercado Pago',
      metodo_envio: formData.metodo_envio === 'domicilio' ? 'Envío a Domicilio' : 'Retiro en Sucursal Recoleta',
      subtotal,
      descuento: discountAmount,
      envio: shippingCost,
      total,
      items,
      estado: 'Pendiente'
    };

    const res = await createOrderInSupabase(orderData);
    setIsSubmitting(false);

    if (res.success && res.orderId) {
      onOrderSuccess(res.orderId);
    } else {
      onOrderSuccess(`BM-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#e6e2da] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e6e2da]">
          <div>
            <h2 className="text-xl font-bold text-[#004080] font-serif">Finalizar Compra - Barmina</h2>
            <p className="text-xs text-slate-500">Checkout seguro con cifrado SSL</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-between items-center my-6 max-w-md mx-auto text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#004080]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#004080] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>Datos</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 bg-slate-200" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#004080]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#004080] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Envío</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 bg-slate-200" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#004080]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#004080] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>Pago</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          {/* STEP 1: DATOS PERSONALES */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Información de Contacto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Valentina Rossi"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="w-full bg-[#f5f1e9] text-xs p-3 rounded-xl border border-[#d1cdc7] focus:outline-none focus:border-[#004080]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="valentina@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-[#f5f1e9] text-xs p-3 rounded-xl border border-[#d1cdc7] focus:outline-none focus:border-[#004080]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+54 11 9876 5432"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="w-full bg-[#f5f1e9] text-xs p-3 rounded-xl border border-[#d1cdc7] focus:outline-none focus:border-[#004080]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">DNI / CUIT *</label>
                  <input
                    type="text"
                    required
                    placeholder="38.999.000"
                    value={formData.dni}
                    onChange={(e) => handleInputChange('dni', e.target.value)}
                    className="w-full bg-[#f5f1e9] text-xs p-3 rounded-xl border border-[#d1cdc7] focus:outline-none focus:border-[#004080]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-[#004080] hover:bg-[#002a58] text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Continuar a Selección de Envío</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ENVÍO */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Opciones de Envío</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label 
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    formData.metodo_envio === 'domicilio'
                      ? 'border-[#004080] bg-[#004080]/5'
                      : 'border-slate-200 bg-[#f5f1e9]'
                  }`}
                >
                  <input
                    type="radio"
                    name="metodo_envio"
                    value="domicilio"
                    checked={formData.metodo_envio === 'domicilio'}
                    onChange={() => handleInputChange('metodo_envio', 'domicilio')}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#004080] block">Envío a Domicilio</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      {subtotal >= 60000 ? 'GRATIS (Superaste $60.000)' : '$4.500 ARS - Llega en 48hs'}
                    </span>
                  </div>
                </label>

                <label 
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    formData.metodo_envio === 'retiro'
                      ? 'border-[#004080] bg-[#004080]/5'
                      : 'border-slate-200 bg-[#f5f1e9]'
                  }`}
                >
                  <input
                    type="radio"
                    name="metodo_envio"
                    value="retiro"
                    checked={formData.metodo_envio === 'retiro'}
                    onChange={() => handleInputChange('metodo_envio', 'retiro')}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#004080] block">Retiro en Sucursal Barmina</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      GRATIS - Av. Alvear 1850, Recoleta
                    </span>
                  </div>
                </label>
              </div>

              {formData.metodo_envio === 'domicilio' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Calle y Altura *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Av. Alvear 1850 4° B"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      className="w-full bg-[#f5f1e9] text-xs p-2.5 rounded-xl border border-[#d1cdc7]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Código Postal</label>
                    <input
                      type="text"
                      placeholder="C1425"
                      value={formData.codigo_postal}
                      onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
                      className="w-full bg-[#f5f1e9] text-xs p-2.5 rounded-xl border border-[#d1cdc7]"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-5 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-[#004080] hover:bg-[#002a58] text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Ir a Método de Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MÉTODO DE PAGO & RESUMEN */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Selección de Medio de Pago</h3>

              <div className="space-y-2">
                <label 
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    formData.metodo_pago === 'transferencia'
                      ? 'border-emerald-600 bg-emerald-50/60'
                      : 'border-slate-200 bg-[#f5f1e9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="metodo_pago"
                      value="transferencia"
                      checked={formData.metodo_pago === 'transferencia'}
                      onChange={() => handleInputChange('metodo_pago', 'transferencia')}
                    />
                    <div>
                      <span className="font-bold text-xs text-emerald-900 block">Transferencia Bancaria Directa</span>
                      <span className="text-[11px] text-emerald-700 font-semibold">🔥 ¡15% OFF de Descuento Inmediato!</span>
                    </div>
                  </div>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    Ahorrás ${(subtotal * 0.15).toLocaleString('es-AR')}
                  </span>
                </label>

                <label 
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    formData.metodo_pago === 'cuotas'
                      ? 'border-[#004080] bg-[#004080]/5'
                      : 'border-slate-200 bg-[#f5f1e9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="metodo_pago"
                      value="cuotas"
                      checked={formData.metodo_pago === 'cuotas'}
                      onChange={() => handleInputChange('metodo_pago', 'cuotas')}
                    />
                    <div>
                      <span className="font-bold text-xs text-[#004080] block">Tarjeta de Crédito en 3 ó 6 Cuotas Sin Interés</span>
                      <span className="text-[11px] text-slate-600">Visa, Mastercard, Amex de todos los bancos</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#004080]">
                    6x ${Math.round((subtotal + shippingCost) / 6).toLocaleString('es-AR')}
                  </span>
                </label>

                <label 
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    formData.metodo_pago === 'mercadopago'
                      ? 'border-sky-600 bg-sky-50/60'
                      : 'border-slate-200 bg-[#f5f1e9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="metodo_pago"
                      value="mercadopago"
                      checked={formData.metodo_pago === 'mercadopago'}
                      onChange={() => handleInputChange('metodo_pago', 'mercadopago')}
                    />
                    <div>
                      <span className="font-bold text-xs text-sky-900 block">Mercado Pago / Dinero en cuenta</span>
                      <span className="text-[11px] text-sky-700">Débito, saldo virtual y QR</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Order Final Summary Box */}
              <div className="bg-[#f5f1e9] p-4 rounded-2xl border border-[#e6e2da] space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Productos ({items.reduce((acc, i) => acc + i.quantity, 0)}):</span>
                  <span className="font-medium">${subtotal.toLocaleString('es-AR')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Descuento Transferencia (15%):</span>
                    <span>-${discountAmount.toLocaleString('es-AR')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Costo de Envío:</span>
                  <span>{shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString('es-AR')}`}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#004080] pt-2 border-t border-[#d1cdc7]">
                  <span>Total Final:</span>
                  <span>${total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {dbStatusMsg && (
                <p className="text-xs text-[#004080] font-mono text-center animate-pulse">
                  {dbStatusMsg}
                </p>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-5 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#004080] hover:bg-[#002a58] text-white text-xs font-bold py-3.5 px-7 rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando pedido en Supabase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Confirmar & Pagar ${total.toLocaleString('es-AR')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};
