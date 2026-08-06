import React from 'react';
import { StoreConfig } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

interface HeroProps {
  config: StoreConfig;
  onExplore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onExplore }) => {
  const bannerUrl = config.banner_url || 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1600&q=80';
  const titulo = config.nombre_tienda || 'Fragancias y elementos sagrados para tus ritos diarios';
  const textoBienvenida = config.texto_bienvenida || config.descripcion_tienda || 'Diseñados con ingredientes naturales, resinas puras y aceites botánicos para elevar la vibración de tu hogar.';

  const handleScrollToCatalog = () => {
    if (onExplore) {
      onExplore();
    } else {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative text-white overflow-hidden my-4 rounded-[2.5rem] mx-4 sm:mx-8 shadow-2xl bg-[#0d1b2a] min-h-[520px] sm:min-h-[600px] flex items-center">
      {/* Imagen de fondo con opacidad suave */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-45 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />
      
      {/* Degradado lateral oscuro profesional */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a] via-[#0d1b2a]/80 to-transparent" />

      {/* Contenido principal con aire y tipografía depurada */}
      <div className="relative max-w-4xl mx-auto py-20 px-8 sm:py-28 sm:px-16 w-full space-y-8">
        
        {/* Badge superior sutil */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs text-slate-200 font-medium tracking-widest border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>NOVEDADES HOLÍSTICAS 2026</span>
        </div>

        {/* Título principal grande, elegante y con espacio cómodo */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white max-w-2xl leading-[1.15]">
          {titulo}
        </h1>

        {/* Descripción limpia y con buena lectura */}
        <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-light">
          {textoBienvenida}
        </p>

        {/* Botón de acción principal en tono terracota/cobrizo características de Barmina */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <button
            onClick={handleScrollToCatalog}
            className="bg-[#c26842] hover:bg-[#a85734] text-white font-medium text-xs sm:text-sm py-4 px-8 rounded-full transition-all shadow-lg flex items-center gap-3 cursor-pointer group"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Sellos de calidad inferiores bien espaciados */}
          <div className="flex items-center gap-6 text-xs text-slate-300 font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Natural</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Sustentable</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
