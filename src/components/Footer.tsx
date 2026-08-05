import React, { useState } from 'react';
import { StoreConfig } from '../types';
import { Mail, Phone, MapPin, Instagram, Facebook, Share2, Send, Check } from 'lucide-react';

interface FooterProps {
  config: StoreConfig;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setEmailInput('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const email = config.email_contacto || 'contacto@barmina.com';
  const whatsapp = config.whatsapp_numero || config.telefono_whatsapp || '+54 9 11 5555-8200';
  const direccion = config.ubicacion || config.direccion || 'Buenos Aires, Argentina';

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs mt-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        
        {/* Newsletter opcional */}
        {config.mostrar_newsletter !== false && (
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-sm">Novedades y Beneficios</h4>
              <p className="text-slate-400 text-xs">Suscribite para recibir ofertas exclusivas de Barmina.</p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Tu email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#004080] w-full sm:w-64"
              />
              <button
                type="submit"
                className="bg-[#004080] hover:bg-[#002a58] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {subscribed ? <Check className="w-4 h-4 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
                <span>{subscribed ? '¡Enviado!' : 'Unirme'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Columnas de Contacto y Redes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-slate-800/60">
          <div>
            <h5 className="font-serif font-bold text-white text-sm mb-3">{config.nombre_tienda || 'Barmina'}</h5>
            <p className="text-slate-400 leading-relaxed text-xs">
              {config.texto_bienvenida || config.descripcion_tienda || 'Productos holísticos y aromaterapia para armonizar tu espacio.'}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Contacto</h5>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#83aef5]" />
                <span>{email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#83aef5]" />
                <span>{whatsapp}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#83aef5]" />
                <span>{direccion}</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Seguinos</h5>
            <div className="flex items-center gap-3">
              {config.instagram_url && (
                <a 
                  href={config.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-[#004080] rounded-xl text-white transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {config.facebook_url && (
                <a 
                  href={config.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-[#004080] rounded-xl text-white transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {config.tiktok_url && (
                <a 
                  href={config.tiktok_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-[#004080] rounded-xl text-white transition-colors"
                  title="TikTok"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-slate-500 text-[11px] pt-6 border-t border-slate-800/40">
          © {new Date().getFullYear()} {config.nombre_tienda || 'Barmina'}. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
};
