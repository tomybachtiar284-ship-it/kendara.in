
import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { Motorcycle } from '../types';
import MotorCard from './MotorCard';
import MotorDetail from './MotorDetail';

import { GoogleUser } from '../services/googleAuth';

interface SearchPanelProps {
  motors: Motorcycle[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  googleUser?: GoogleUser | null;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ motors, favorites, onToggleFavorite, googleUser }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [condition, setCondition] = useState('Semua');
  const [maxPrice, setMaxPrice] = useState(200);
  const [selectedMotor, setSelectedMotor] = useState<Motorcycle | null>(null);

  const priceSteps = [10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200];
  const maxPriceValue = maxPrice * 1_000_000;

  const filtered = motors.filter(m => {
    const matchQuery = `${m.brand} ${m.model} ${m.year}`.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === 'Semua' || m.category === category;
    const matchCond = condition === 'Semua' || m.condition === condition;
    const matchPrice = m.price <= maxPriceValue;
    return matchQuery && matchCat && matchCond && matchPrice;
  });

  const formatM = (val: number) => val >= 100 ? `${val}Jt` : `${val}Jt`;

  return (
    <div className="max-w-7xl mx-auto px-5 py-6 pb-32 min-h-screen">
      {/* Header */}
      <div className="mb-5">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
          {googleUser ? `Halo, ${googleUser.name.split(' ')[0]}!` : 'Temukan Kendaraan'}
        </p>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {googleUser ? 'Cari kendaraan impian Anda' : 'Jelajah & Cari'}
        </h2>
      </div>

      {/* Search input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Merek, model, atau tahun..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-12 pr-11 py-4 bg-white rounded-2xl border border-slate-100 focus:ring-2 focus:ring-slate-900/10 focus:outline-none text-slate-700 font-medium shadow-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-slate-100 shadow-sm space-y-5">
        {/* Category */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Kategori</p>
          <div className="flex gap-2">
            {['Semua', 'Motor', 'Mobil'].map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${category === c ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}
              >
                {c === 'Motor' ? '🏍️ Motor' : c === 'Mobil' ? '🚗 Mobil' : '🔍 Semua'}
              </button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Kondisi</p>
          <div className="flex gap-2 flex-wrap">
            {['Semua', 'Mulus', 'Standar', 'Modifikasi'].map(c => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${condition === c ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga Maks.</p>
            <span className="text-sm font-black text-slate-900">Rp {formatM(maxPrice)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={priceSteps.length - 1}
            value={priceSteps.indexOf(maxPrice) !== -1 ? priceSteps.indexOf(maxPrice) : priceSteps.length - 1}
            onChange={e => setMaxPrice(priceSteps[parseInt(e.target.value)])}
            className="w-full accent-slate-900"
          />
          <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-bold">
            <span>10Jt</span>
            <span>50Jt</span>
            <span>100Jt</span>
            <span>200Jt+</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-black text-slate-900">{filtered.length} Hasil</h3>
        {(query || category !== 'Semua' || condition !== 'Semua' || maxPrice < 200) && (
          <button
            onClick={() => { setQuery(''); setCategory('Semua'); setCondition('Semua'); setMaxPrice(200); }}
            className="text-xs text-rose-500 font-bold flex items-center gap-1"
          >
            <X size={12} /> Reset
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[28px] border border-slate-100 shadow-sm">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search size={24} className="text-slate-300" />
          </div>
          <h4 className="text-base font-black text-slate-900 mb-1">Tidak ditemukan</h4>
          <p className="text-slate-400 text-sm px-8">Coba ubah filter atau perluas rentang harga.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(motor => (
            <MotorCard
              key={motor.id}
              motor={motor}
              isFavorite={favorites.includes(motor.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={() => setSelectedMotor(motor)}
            />
          ))}
        </div>
      )}

      {selectedMotor && (
        <MotorDetail
          motor={selectedMotor}
          isFavorite={favorites.includes(selectedMotor.id)}
          onToggleFavorite={onToggleFavorite}
          onClose={() => setSelectedMotor(null)}
        />
      )}
    </div>
  );
};

export default SearchPanel;
