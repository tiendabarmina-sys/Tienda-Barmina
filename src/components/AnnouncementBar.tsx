import React from 'react';
import { StoreConfig } from '../types';

interface AnnouncementBarProps {
  config: StoreConfig;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ config }) => {
  const textoAnuncio = config.barra_anuncio || config.banner_anuncio || '✨ 3 y 6 CUOTAS SIN INTERÉS | 15% OFF EN TRANSFERENCIA ✨';

  return (
    <div className="bg-[#002a58] text-white text-center py-2 px-4 text-xs font-semibold tracking-wide border-b border-[#004080]">
      <p className="truncate max-w-6xl mx-auto">{textoAnuncio}</p>
    </div>
  );
};
