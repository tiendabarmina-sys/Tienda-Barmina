import React from 'react';
import { CheckCircle2, ShoppingBag, Truck, CreditCard, Sparkles, X } from 'lucide-react';

interface OrderSuccessModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ orderId, onClose }) => {
  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl border border-[#e6e2da] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            ¡Compra Confirmada!
          </span>
          <h2 className="text-2xl font-bold text-[#004080] font-serif">¡Muchas gracias por tu pedido!</h2>
          <p className="text-xs text-slate-600 mt-2">
            Hemos registrado tu pedido exitosamente en nuestra base de datos en Supabase.
          </p>
        </div>

        {/* Order ID Box */}
        <div className="bg-[#f5f1e9] p-4 rounded-2xl border border-[#d1cdc7] space-y-1 text-xs">
          <span className="text-slate-500 uppercase text-[10px] font-mono tracking-wider">Número de Seguimiento Barmina:</span>
          <p className="text-lg font-mono font-extrabold text-[#004080]">{orderId}</p>
          <p className="text-[11px] text-slate-600 pt-1">
            Enviamos un comprobante y resumen detallado a tu correo electrónico.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#004080] shrink-0" />
            <span className="text-left font-medium">Despacho en 24/48hs hábiles</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#004080] shrink-0" />
            <span className="text-left font-medium">Factura enviada a tu email</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#004080] hover:bg-[#002a58] text-white font-bold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md cursor-pointer"
        >
          Seguir Comprando en Barmina
        </button>
      </div>
    </div>
  );
};
