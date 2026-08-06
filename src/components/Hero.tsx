import React from 'react';
import { StoreConfig } from '../types';
import { Sparkles, Leaf } from 'lucide-react';

interface HeroProps {
  config: StoreConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  const bannerUrl = config.banner_url || 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1400&q=80';
  const titulo = config.nombre_tienda || 'Barmina Aromas';
  const textoBienvenida = config.texto_bienvenida || config.descripcion_tienda || 'Encontrá tu equilibrio con nuestras fragancias artesanales, sahumerios y difusores holísticos.';

  return (
    <div className="relative bg-[#001f3f] text-white overflow-hidden my-6 rounded-[2.5rem] mx-4 sm:mx-8 shadow-xl border border-white/10">
      {/* Imagen de fondo con filtro de opacidad suave */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-35 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />
      
      {/* Degradado sofisticado estilo cálido/nocturno */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#002a58]/95 via-[#002a58]/70 to-transparent" />

      {/* Contenido principal */}
      <div className="relative max-w-4xl mx-auto py-14 px-8 sm:py-20 sm:px-12 text-center sm:text-left space-y-5">
        
        {/* Badge superior decorativo */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-xs text-[#a5c5ff] font-medium tracking-wide shadow-sm border border-white/10 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Esencias & Bienestar Holístico</span>
        </div>

        {/* Título principal */}
        <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
          {titulo}
        </h1>

        {/* Párrafo descriptivo */}
        <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed font-light">
          {textoBienvenida}
        </p>

        {/* Detalle visual sutil abajo */}
        <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs text-amber-200/80 font-serif italic">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hecho con amor y armonía para tus espacios</span>
        </div>

      </div>
    </div>
  );
};
