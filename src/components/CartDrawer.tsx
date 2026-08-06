{/* Resumen de costos limpio, sin envío automático ni mínimos obligatorios */}
<div className="space-y-2 border-t pt-4 text-sm text-slate-700">
  <div className="flex justify-between">
    <span>Total parcial:</span>
    <span className="font-semibold">${subtotal.toLocaleString('es-AR')}</span>
  </div>
  
  {/* Envío a coordinar (sin costos fijos ni automáticos) */}
  <div className="flex justify-between text-xs text-slate-500">
    <span>Envío:</span>
    <span>A coordinar con el vendedor</span>
  </div>

  <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t">
    <span>Total estimado:</span>
    <span className="text-[#004080]">${subtotal.toLocaleString('es-AR')}</span>
  </div>
</div>

<button
  onClick={onCheckout}
  className="w-full mt-4 bg-[#004080] hover:bg-[#002a58] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
>
  <span>Iniciar Compra Segura</span>
  <ArrowRight className="w-4 h-4" />
</button>
