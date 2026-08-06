import React from 'react';
import { Leaf, Sparkles, HeartHandshake } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-[2.5rem] border border-[#e6e2da] shadow-sm overflow-hidden p-8 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Columna de Imágenes Estéticas Combinadas */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-md h-80 sm:h-96">
              <img 
                src="https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1000&q=80" 
                alt="Espacio Barmina Aromas"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Tarjeta flotante superpuesta */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-[#e6e2da] max-w-[240px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">100% Artesanal</p>
                  <p className="text-[11px] text-slate-500">Hecho en Buenos Aires</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna de Texto Institucional */}
          <div className="lg:col-span-6 space-y-6 pt-4 lg:pt-0">
            <div className="inline-flex items-center gap-2 bg-[#f5f1e9] text-[#004080] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-[#e6e2da]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>NUESTRA ESENCIA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#004080] leading-tight">
              Espacios con Intención: <br />
              <span className="italic font-normal text-[#c26842]">El Poder del Aroma</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              En <strong className="font-semibold text-slate-800">Barmina Aromas</strong> creemos que cada hogar es un templo sagrado. Nuestras creaciones nacen de la combinación entre saberes ancestrales de botanismo y procesos de confección ética.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Seleccionamos maderas de recolección sustentable, resinas naturales sin sintéticos y esencias puras para que cada encendido o difusión sea una pausa reparadora en tu rutina.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Cero Sintéticos</h4>
                  <p className="text-[11px] text-slate-500">Aromas 100% vegetales</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Hecho a Mano</h4>
                  <p className="text-[11px] text-slate-500">Confección consciente</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
