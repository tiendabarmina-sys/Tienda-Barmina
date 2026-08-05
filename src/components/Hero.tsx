import React from 'react';
import { StoreConfig } from '../types';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  config: StoreConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  const bannerUrl = config.banner_url || 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1200&q=80';
  const titulo = config.nombre_tienda || 'Barmina Aromas';
  const textoBienvenida = config.texto_bienvenida || config.descripcion_tienda || 'Encontrá tu equilibrio con nuestras fragancias artesanales, sahumerios y difusores holísticos.';

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden my-4 rounded-3xl mx-4 sm:mx-6 shadow-md">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-500"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#002a58]/80 to-transparent" />

      <div className="relative max-w-4xl mx-auto py-16 px-6 sm:py-24 text-center sm:text-left space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-[#83aef5] font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Línea Holística & Aromaterapia</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
          {titulo}
        </h1>

        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-light">
          {textoBienvenida}
        </p>
      </div>
    </div>
  );
};
