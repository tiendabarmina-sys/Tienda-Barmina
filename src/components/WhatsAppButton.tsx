import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber = '5491164504653' }) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent('¡Hola Barmina! Quisiera consultar sobre los productos de la tienda.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden sm:block mr-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap pointer-events-none">
        ¿Consultas? Hablá con Barmina por WhatsApp
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer ring-4 ring-white/30"
      >
        {/* Pulsing halo */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none"></span>
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-[#25D366] relative z-10" />
      </a>
    </div>
  );
};
