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
    <div className="relative bg-white text-slate-800 overflow-hidden my-4 rounded-3xl mx-4 sm:mx-8 shadow-sm border border-[#e6e2da]">
      {/* Contenedor en dos columnas para que se vea moderno (Texto a la izq, Imagen armónica a la der) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        
        {/* Columna de Texto */}
        <div className="lg:col-span-7 py-10 px-6 sm:py-14 sm:px-10 space-y-4 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 bg-[#f5f1e9] text-[#004080] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-[#e6e2da] mx-auto lg:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Tienda Holística & Aromaterapia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#004080]">
            {titulo}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed font-light">
            {textoBienvenida}
          </p>

          <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500 font-serif italic">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hecho con amor y armonía para tus espacios</span>
          </div>

        </div>

        {/* Columna de Imagen Estética */}
        <div className="lg:col-span-5 h-56 sm:h-72 lg:h-full relative overflow-hidden bg-[#f5f1e9]">
          <div 
            className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url(${bannerUrl})` }}
          />
          {/* Sutil degradado interno para fundir la imagen con la tarjeta */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-transparent to-transparent opacity-90 lg:opacity-100" />
        </div>

      </div>
    </div>
  );
};
