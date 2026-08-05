import React from 'react';
import { Truck, CreditCard, Percent } from 'lucide-react';
import { StoreConfig } from '../types';

interface AnnouncementBarProps {
  config?: StoreConfig;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ config }) => {
  const showCuotas = config?.mostrar_cuotas !== false;
  const showEnvioGratis = config?.mostrar_envio_gratis !== false;
  const showTransferencia = config?.mostrar_descuento_transferencia !== false;

  const cuotasText = config?.texto_cuotas || `Hasta ${config?.cuotas_sin_interes || 6} cuotas sin interés`;
  const freeShippingMin = config?.monto_envio_gratis ?? config?.envio_gratis_minimo ?? 60000;
  const transferDesc = config?.descuento_transferencia || 15;
  const customText = config?.barra_anuncio || config?.banner_anuncio;

  // Build automatic default banner message based on active toggles
  const defaultItems: string[] = [];
  if (showCuotas) defaultItems.push(cuotasText.toUpperCase());
  if (showTransferencia) defaultItems.push(`${transferDesc}% OFF EN TRANSFERENCIA`);
  if (showEnvioGratis) defaultItems.push(`ENVÍO GRATIS DESDE $${freeShippingMin.toLocaleString('es-AR')}`);
  if (defaultItems.length === 0) defaultItems.push('ENVÍOS A TODO EL PAÍS');

  const marqueeText = customText || `✨ ${defaultItems.join(' | ')} ✨`;

  return (
    <div className="bg-[#002a58] text-white text-xs py-2 px-4 shadow-inner border-b border-[#004080]/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left Guarantees - Desktop */}
        <div className="hidden md:flex items-center space-x-6 text-slate-200">
          {showCuotas && (
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <CreditCard className="w-3.5 h-3.5 text-[#83aef5]" />
              <span>{cuotasText}</span>
            </span>
          )}
          {showEnvioGratis && (
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Truck className="w-3.5 h-3.5 text-[#83aef5]" />
              <span>Envío gratis desde ${freeShippingMin.toLocaleString('es-AR')}</span>
            </span>
          )}
          {showTransferencia && (
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Percent className="w-3.5 h-3.5" />
              <span>{transferDesc}% OFF en Transferencia Bancaria</span>
            </span>
          )}
        </div>

        {/* Center Marquee Text */}
        <div className="flex-1 text-center font-semibold tracking-wide text-white overflow-hidden text-ellipsis whitespace-nowrap text-xs">
          {marqueeText}
        </div>

      </div>
    </div>
  );
};
