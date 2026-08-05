import React, { useState } from 'react';
import { 
  CreditCard, ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin, 
  CheckCircle2, Instagram, Facebook, MessageCircle, Lock, Share2 
} from 'lucide-react';
import { LOGO_URL } from '../lib/supabase';
import { StoreConfig } from '../types';

interface FooterProps {
  config: StoreConfig;
  onSelectCategory: (category: string) => void;
  onOpenAdmin: () => void;
  categories: string[];
  onOpenHelp?: (type: 'faq' | 'pago' | 'envio' | 'cambios' | 'contacto') => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onSelectCategory, onOpenAdmin, categories, onOpenHelp }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const instagramUrl = config.instagram_url || 'https://instagram.com/barmina';
  const facebookUrl = config.facebook_url || 'https://facebook.com/barmina';
  const cleanPhone = (config.whatsapp_numero || config.telefono_whatsapp || '+54 9 11 5555-8200').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  const showEnvio = config.mostrar_seguimiento_envio !== false && config.mostrar_envio_gratis !== false;
  const showPago = config.mostrar_medios_pago !== false && config.mostrar_cuotas !== false;
  const showGarantia = config.mostrar_garantia !== false;
  const showFaq = config.mostrar_preguntas_frecuentes !== false;

  const hasAnyTopRibbon = showEnvio || showPago || showGarantia || showFaq;

  return (
    <footer className="bg-[#002a58] text-white pt-14 pb-8 border-t border-[#004080]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Features Ribbon */}
        {hasAnyTopRibbon && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-white/10 text-xs">
            {showEnvio && (
              <div 
                onClick={() => onOpenHelp && onOpenHelp('envio')}
                className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Truck className="w-6 h-6 text-[#83aef5] shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">Envíos a todo el País</h4>
                  <p className="text-slate-300">Correo Argentino y Andreani a domicilio</p>
                </div>
              </div>
            )}

            {showPago && (
              <div 
                onClick={() => onOpenHelp && onOpenHelp('pago')}
                className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <CreditCard className="w-6 h-6 text-[#83aef5] shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">Medios de Pago</h4>
                  <p className="text-slate-300">Tarjetas, Mercado Pago y Transferencia</p>
                </div>
              </div>
            )}

            {showGarantia && (
              <div 
                onClick={() => onOpenHelp && onOpenHelp('cambios')}
                className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-6 h-6 text-[#83aef5] shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">Garantía Barmina</h4>
                  <p className="text-slate-300">Atención y calidad en tu compra</p>
                </div>
              </div>
            )}

            {showFaq && (
              <div 
                onClick={() => onOpenHelp && onOpenHelp('faq')}
                className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-6 h-6 text-[#83aef5] shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">Preguntas Frecuentes</h4>
                  <p className="text-slate-[#83aef5]">Resolver dudas aquí →</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          
          {/* Col 1: Brand Info & Social Media Links */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <img src={config.logo_url || LOGO_URL} alt="Barmina" className="h-10 w-auto bg-white/10 p-1.5 rounded-xl" />
              <span className="text-2xl font-bold tracking-tight text-white font-serif">{config.nombre_tienda || 'BARMINA'}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {config.descripcion_tienda || 'Bienvenid@ a tu espacio de bienestar, aromaterapia y armonía.'}
            </p>

            <div className="space-y-2 text-slate-300 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#83aef5] shrink-0" />
                <span>{config.ubicacion || config.direccion || 'Buenos Aires, Argentina'}</span>
              </p>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#83aef5] shrink-0" />
                <span>WhatsApp: {config.whatsapp_numero || config.telefono_whatsapp || '+54 9 11 5555-8200'}</span>
              </a>
              <button 
                onClick={() => onOpenHelp && onOpenHelp('contacto')}
                className="flex items-center gap-2 hover:text-white transition-colors text-left cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#83aef5] shrink-0" />
                <span>Email: {config.email_contacto || 'contacto@barmina.com'}</span>
              </button>
            </div>

            {/* Redes Sociales Barmina */}
            <div className="pt-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#83aef5]" />
                <span>Redes Sociales Barmina</span>
              </p>
              <div className="flex items-center space-x-3">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-600 transition-colors flex items-center justify-center text-white"
                  title="Instagram Barmina"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>

                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 transition-colors flex items-center justify-center text-white"
                  title="Facebook Barmina"
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] transition-colors flex items-center justify-center text-white"
                  title="WhatsApp Directo"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Categorías</h4>
            <ul className="space-y-2 text-slate-300">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <button onClick={() => onSelectCategory(cat)} className="hover:text-white transition-colors text-left cursor-pointer">
                    {cat}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => onSelectCategory('Todos')} className="hover:text-white transition-colors font-bold text-[#83aef5] cursor-pointer">
                  Ver Catálogo Completo →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Ayuda</h4>
            <ul className="space-y-2.5 text-slate-300">
              {config.mostrar_preguntas_frecuentes !== false && (
                <li>
                  <button onClick={() => onOpenHelp && onOpenHelp('faq')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Preguntas Frecuentes
                  </button>
                </li>
              )}
              {config.mostrar_medios_pago !== false && (
                <li>
                  <button onClick={() => onOpenHelp && onOpenHelp('pago')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Medios de Pago
                  </button>
                </li>
              )}
              {config.mostrar_seguimiento_envio !== false && (
                <li>
                  <button onClick={() => onOpenHelp && onOpenHelp('envio')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Seguimiento de Envíos
                  </button>
                </li>
              )}
              {config.mostrar_garantia !== false && (
                <li>
                  <button onClick={() => onOpenHelp && onOpenHelp('cambios')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Políticas & Garantía
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onOpenHelp && onOpenHelp('contacto')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Contacto & Consultas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          {config.mostrar_newsletter !== false && (
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider">Newsletter Barmina</h4>
              <p className="text-slate-300 text-xs">
                Suscribite para recibir lanzamientos de la colección y ofertas exclusivas de aromaterapia.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 text-white placeholder:text-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-[#83aef5]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bg-[#83aef5] text-[#001b3d] font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    Unirse
                  </button>
                </div>
                {subscribed && (
                  <p className="text-emerald-300 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ¡Gracias por suscribirte a Barmina!
                  </p>
                )}
              </form>
            </div>
          )}

        </div>

        {/* Bottom Bar: Copyright & Payment Logos */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p 
            onClick={onOpenAdmin} 
            className="cursor-pointer select-none hover:text-slate-300 transition-colors"
            title="Panel de Administración Barmina"
          >
            © {new Date().getFullYear()} BARMINA. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="font-mono text-[11px] bg-white/10 px-2.5 py-1 rounded-md">VISA</span>
            <span className="font-mono text-[11px] bg-white/10 px-2.5 py-1 rounded-md">MASTERCARD</span>
            <span className="font-mono text-[11px] bg-white/10 px-2.5 py-1 rounded-md">MERCADO PAGO</span>
            <span className="font-mono text-[11px] bg-white/10 px-2.5 py-1 rounded-md">TRANSFERENCIA</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
