import React from 'react';
import { Sparkles, ArrowRight, Truck, CreditCard, ShieldCheck, MessageCircle } from 'lucide-react';
import { StoreConfig } from '../types';

interface HeroProps {
  onExplore: () => void;
  config?: StoreConfig;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, config }) => {
  const storeTitle = config?.nombre_tienda || config?.titulo_tienda || 'Barmina';
  const welcomeText = config?.texto_bienvenida || config?.descripcion_tienda || 'Bienvenid@ a tu espacio de bienestar, aromaterapia y armonía. Productos seleccionados para transformar tus momentos.';

  const bannerImg = config?.banner_url || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1800&q=80";

  const cleanPhone = (config?.whatsapp_numero || '5491164504653').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('¡Hola Barmina! Quisiera consultar sobre los productos.')}`;

  return (
    <section className="relative overflow-hidden py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full Width Editorial Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[360px] sm:min-h-[440px] flex items-center bg-[#002a58]">
          
          {/* Background Image with Dark Atmospheric Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ backgroundImage: `url(${bannerImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001b3d]/95 via-[#002a58]/85 to-transparent sm:to-[#002a58]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001b3d]/90 via-transparent to-transparent opacity-80" />

          {/* Banner Content Container */}
          <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-2xl text-white space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold tracking-wider uppercase text-sky-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AROMATERAPIA & BIENESTAR 2026</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-serif">
              {storeTitle}
            </h1>

            {/* Welcome Description */}
            <p className="text-slate-100 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-xl">
              {welcomeText}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExplore}
                className="bg-white text-[#004080] hover:bg-[#f5f1e9] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm group cursor-pointer"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-3.5 rounded-full shadow-md transition-all text-sm flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-white" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#83aef5] shrink-0" />
                <span>Hasta {config?.cuotas_sin_interes || 6} Cuotas Sin Interés</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#83aef5] shrink-0" />
                <span>Envío Gratis desde ${config?.envio_gratis_minimo ? config.envio_gratis_minimo.toLocaleString('es-AR') : '60.000'}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-[#83aef5] shrink-0" />
                <span>Compra 100% Protegida</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
