import React from 'react';
import { Filter, Check, Percent, Truck, ArrowUpDown, ChevronDown, Layers } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onChangeFilter: (key: keyof FilterState, value: any) => void;
  categories: string[];
  totalResults: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilter,
  categories,
  totalResults,
  onResetFilters
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e6e2da] barmina-card-shadow mb-8 space-y-4">
      
      {/* Category Dropdown & Total Counter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Category Dropdown Selector */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <label htmlFor="category-select" className="text-xs font-bold uppercase text-[#004080] tracking-wider shrink-0 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#004080]" />
            <span>Categoría:</span>
          </label>

          <div className="relative w-full">
            <select
              id="category-select"
              value={filters.category}
              onChange={(e) => onChangeFilter('category', e.target.value)}
              className="w-full appearance-none bg-[#f5f1e9] hover:bg-[#eae5db] text-[#1c1b1b] font-semibold text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-xl border border-[#d1cdc7] focus:outline-none focus:ring-2 focus:ring-[#004080] transition-all cursor-pointer shadow-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-slate-800 py-1">
                  {cat === 'Todos' ? '✨ Ver Todas las Categorías' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-[#004080] pointer-events-none" />
          </div>
        </div>

        {/* Selected Category Badge, Results Counter & Sorting Dropdown */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 text-xs">
          {filters.category !== 'Todos' && (
            <button
              onClick={() => onChangeFilter('category', 'Todos')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#004080] text-white text-[11px] font-semibold hover:bg-[#002a58] transition-colors cursor-pointer"
            >
              <span>{filters.category}</span>
              <span className="text-xs font-bold">×</span>
            </button>
          )}

          <div className="text-xs text-[#605e58] font-medium bg-[#f5f1e9] px-3.5 py-1.5 rounded-full border border-[#e6e2da]">
            Total: <strong className="text-[#004080] font-bold">{totalResults}</strong> productos
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-[#605e58] font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#004080]" />
              <span>Ordenar:</span>
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onChangeFilter('sortBy', e.target.value)}
              className="bg-[#f5f1e9] text-[#1c1b1b] border border-[#d1cdc7] rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#004080] cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A - Z</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
