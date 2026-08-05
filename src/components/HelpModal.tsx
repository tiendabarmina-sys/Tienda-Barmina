import React from 'react';
import { X, HelpCircle, CreditCard, Truck, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';
import { StoreConfig } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'faq' | 'pago' | 'envio' | 'cambios' | 'contacto' | null;
  config?: StoreConfig;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  type,
  config
}) => {
  if (!isOpen || !type) return null;

  const getContent = () => {
    switch (type) {
      case 'faq':
        return {
          title: 'Preguntas Frecuentes',
          icon: <HelpCircle className="w-6 h-6 text-[#004080]" />,
          text: config?.texto_preguntas_frecuentes || config?.preguntas_frecuentes || '¿Cómo hago mi pedido?\nSeleccioná los productos que te gusten, agregalos al carrito y completá el formulario de envío.\n\n¿Realizan envíos a todo el país?\nSí, enviamos a toda Argentina a través de Correo Argentino y Andreani.\n\n¿Cuáles son los tiempos de entrega?\nEn CABA y GBA entregamos entre 24 a 48 hs hábiles. Al interior entre 3 a 5 días hábiles.'
        };
      case 'pago':
        const cuotasPart = config?.mostrar_cuotas !== false ? ` Ofrecemos ${config?.cuotas_sin_interes || 6} Cuotas Sin Interés.` : '';
        const transfPart = config?.mostrar_descuento_transferencia !== false ? ` con un ${config?.descuento_transferencia || 15}% de Descuento.` : '.';
        return {
          title: 'Medios de Pago',
          icon: <CreditCard className="w-6 h-6 text-[#004080]" />,
          text: config?.texto_medios_pago || config?.medios_pago_info || `Aceptamos Tarjetas de Crédito y Débito (Visa, Mastercard, Cabal), Mercado Pago, y Transferencia Bancaria${transfPart}${cuotasPart}`
        };
      case 'envio':
        const freeShipPart = config?.mostrar_envio_gratis !== false ? ` Envíos gratis en compras superiores a $${(config?.monto_envio_gratis ?? config?.envio_gratis_minimo ?? 60000).toLocaleString('es-AR')}.` : '';
        return {
          title: 'Seguimiento de Envíos',
          icon: <Truck className="w-6 h-6 text-[#004080]" />,
          text: config?.texto_seguimiento_envio || config?.seguimiento_envios_info || `Una vez despachado tu pedido te enviaremos por email y/o WhatsApp el código de seguimiento para que puedas rastrear el paquete en todo momento.${freeShipPart}`
        };
      case 'cambios':
        return {
          title: 'Garantía & Políticas Barmina',
          icon: <RefreshCw className="w-6 h-6 text-[#004080]" />,
          text: config?.texto_politicas || config?.politicas_cambio_info || `Todos nuestros productos artesanales, sahumerios y aceites son seleccionados con la máxima calidad y enviados en sus empaques herméticos originales.\n\nAnte cualquier duda o inconveniente con tu envío, comunicate directamente con nuestro equipo a ${config?.email_contacto || 'contacto@barmina.com'} o por WhatsApp y te ayudaremos de inmediato.`
        };
      case 'contacto':
        return {
          title: 'Información de Contacto',
          icon: <Mail className="w-6 h-6 text-[#004080]" />,
          text: `Podés comunicarte con nuestro equipo a través de los siguientes medios:\n\n• Email: ${config?.email_contacto || 'contacto@barmina.com'}\n• WhatsApp: ${config?.whatsapp_numero || config?.telefono_whatsapp || '+54 9 11 5555-8200'}\n• Ubicación: ${config?.ubicacion || config?.direccion || 'Buenos Aires, Argentina'}`
        };
      default:
        return { title: '', icon: null, text: '' };
    }
  };

  const { title, icon, text } = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e6e2da] transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#faf8f5] border-b border-[#e6e2da] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#004080]/10 flex items-center justify-center">
              {icon}
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1c1b1b]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
            {text}
          </div>

          {type === 'contacto' && (
            <div className="mt-6 p-4 rounded-2xl bg-[#f5f1e9] space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#004080]" />
                <span><strong>Email:</strong> {config?.email_contacto || 'contacto@barmina.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#004080]" />
                <span><strong>WhatsApp:</strong> {config?.telefono_whatsapp || '+54 9 11 5555-8200'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#004080]" />
                <span><strong>Dirección:</strong> {config?.direccion || 'Buenos Aires, Argentina'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#faf8f5] border-t border-[#e6e2da] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#004080] text-white text-xs font-bold hover:bg-[#002a58] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
