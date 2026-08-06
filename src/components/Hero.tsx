import React from 'react';
import { StoreConfig } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

interface HeroProps {
  config: StoreConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  const bannerUrl = config.banner_url || 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1600&q=80';
  const titulo = config.nombre_tienda || 'Fragancias y elementos sagrados para tus ritos diarios';
  const textoBienvenida = config.texto_bienvenida || config.descripcion_tienda || 'Diseñados con ingredientes naturales, resinas puras y aceites botánicos para elevar la vibración de tu hogar.';

  return (
    <div className="relative text-white overflow-hidden my-4 rounded-[2.5rem] mx-4 sm:mx-8 shadow-2xl bg-slate-900 min-h-[500px] sm:min-h-[580px] flex items-center">
      {/* Imagen de fondo con opacidad y efecto inmersivo */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />
      
      {/* Degradado lateral oscuro profesional (igual al de tu referencia) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a] via-[#0d1b2a]/80 to-transparent" />

      {/* Contenido principal alineado a la izquierda */}
      <div className="relative max-w-4xl mx-auto py-16 px-6 sm:py-24 sm:px-12 w-full space-y-6">
        
        {/* Badge superior sutil */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-slate-200 font-medium tracking-wide border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>NOVEDADES HOLÍSTICAS 2026</span>
        </div>

        {/* Título principal grande y elegante */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white max-w-2xl leading-tight">
          {titulo}
        </h1>

        {/* Descripción descriptiva */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-light">
          {textoBienvenida}
        </p>

        {/* Botón de acción principal en tono terracota/cobrizo características de Barmina */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <a
            href="#productos"
            className="bg-[#c26842] hover:bg-[#a85734] text-white font-medium text-xs sm:text-sm py-3.5 px-7 rounded-full transition-all shadow-lg flex items-center gap-2 cursor-pointer group"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Iconos de confianza inferiores */}
          <div className="flex items-center gap-4 text-[11px] text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Natural</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Sustentable</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
