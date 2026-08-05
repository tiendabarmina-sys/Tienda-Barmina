import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Key, Globe, Table } from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY, CONFIG_ENDPOINT, supabase } from '../lib/supabase';

interface SupabaseDebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
  source: 'supabase' | 'fallback';
  onReload: () => void;
}

export const SupabaseDebugPanel: React.FC<SupabaseDebugPanelProps> = ({
  isOpen,
  onClose,
  source,
  onReload
}) => {
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'products' | 'orders'>('config');

  if (!isOpen) return null;

  const handleTestQuery = async (table: string) => {
    setTestingEndpoint(true);
    setTestResult(null);
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact' });
      setTestResult({
        table,
        status: error ? 'Error' : 'Éxito 200 OK',
        error: error ? error.message : null,
        count: data?.length || 0,
        sampleData: data
      });
    } catch (err: any) {
      setTestResult({
        table,
        status: 'Falló consulta',
        error: err?.message || String(err)
      });
    } finally {
      setTestingEndpoint(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#e6e2da] max-h-[90vh] overflow-y-auto font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e6e2da]">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#004080]" />
            <h2 className="text-sm font-bold text-[#004080] font-sans">Panel de Conexión Supabase - Barmina</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 font-sans">
          
          {/* Status banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            source === 'supabase'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <div className="flex items-center gap-2.5">
              {source === 'supabase' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              )}
              <div>
                <strong className="block text-xs uppercase font-bold">
                  Estado de Conexión: {source === 'supabase' ? 'Conectado en Vivo' : 'Demostración / Datos Locales'}
                </strong>
                <span className="text-[11px] opacity-90">
                  {source === 'supabase' 
                    ? 'Los datos de productos y configuración se están recibiendo correctamente de Supabase.' 
                    : 'Las peticiones de Supabase responden y se integran automáticamente con respaldo para garantizar alta disponibilidad.'}
                </span>
              </div>
            </div>

            <button
              onClick={onReload}
              className="bg-white text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300 font-medium text-xs flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar
            </button>
          </div>

          {/* Connection Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#f5f1e9] p-3.5 rounded-2xl border border-[#d1cdc7]">
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#004080]" />
                Supabase URL
              </span>
              <p className="font-mono text-slate-900 truncate mt-1 text-[11px] font-semibold">{SUPABASE_URL}</p>
            </div>

            <div className="bg-[#f5f1e9] p-3.5 rounded-2xl border border-[#d1cdc7]">
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-[#004080]" />
                Publishable Key
              </span>
              <p className="font-mono text-slate-900 truncate mt-1 text-[11px]">
                {SUPABASE_ANON_KEY.substring(0, 20)}...
              </p>
            </div>
          </div>

          {/* Endpoint test triggers */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Probar Tablas de Supabase:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setActiveTab('config');
                  handleTestQuery('configuracion');
                }}
                className="bg-[#004080] text-white px-3 py-1.5 rounded-xl font-medium text-xs hover:bg-[#002a58] flex items-center gap-1"
              >
                <Table className="w-3.5 h-3.5" />
                Tabla "configuracion"
              </button>

              <button
                onClick={() => {
                  setActiveTab('products');
                  handleTestQuery('productos');
                }}
                className="bg-[#004080] text-white px-3 py-1.5 rounded-xl font-medium text-xs hover:bg-[#002a58] flex items-center gap-1"
              >
                <Table className="w-3.5 h-3.5" />
                Tabla "productos"
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  handleTestQuery('pedidos');
                }}
                className="bg-[#004080] text-white px-3 py-1.5 rounded-xl font-medium text-xs hover:bg-[#002a58] flex items-center gap-1"
              >
                <Table className="w-3.5 h-3.5" />
                Tabla "pedidos"
              </button>
            </div>
          </div>

          {/* Test Results View */}
          {testResult && (
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl overflow-x-auto max-h-48 text-[11px] font-mono space-y-2">
              <div className="flex justify-between text-slate-300 font-bold border-b border-slate-800 pb-1">
                <span>Resultado Consulta Tabla: "{testResult.table}"</span>
                <span className={testResult.error ? 'text-red-400' : 'text-emerald-400'}>{testResult.status}</span>
              </div>
              {testResult.error && (
                <p className="text-red-400 font-sans">{testResult.error}</p>
              )}
              {testResult.sampleData && (
                <pre>{JSON.stringify(testResult.sampleData, null, 2)}</pre>
              )}
            </div>
          )}

          <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-200">
            📌 <strong>Nota de Arquitectura:</strong> Barmina consulta en tiempo real tu base de datos Supabase usando la librería oficial <code>@supabase/supabase-js</code>.
          </div>

        </div>
      </div>
    </div>
  );
};
