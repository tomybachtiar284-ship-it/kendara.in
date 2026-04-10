
import React, { useState } from 'react';
import { Search, TrendingDown, TrendingUp, ArrowUpDown, Tag, CheckCircle, Wrench, SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { Motorcycle } from '../types';
import MotorCard from './MotorCard';
import MotorDetail from './MotorDetail';

interface CatalogProps {
  motors: Motorcycle[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenSellModal?: () => void;
  onViewMotor?: (id: string) => void;
}

type SortType = 'default' | 'price_asc' | 'price_desc' | 'newest';

const Catalog: React.FC<CatalogProps> = ({ motors, favorites, onToggleFavorite, onOpenSellModal, onViewMotor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [conditionFilter, setConditionFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [selectedMotor, setSelectedMotor] = useState<Motorcycle | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredMotors = motors
    .filter(m => {
      const matchesSearch = `${m.brand} ${m.model}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = brandFilter === 'Semua' || m.brand === brandFilter;
      const matchesCondition = conditionFilter === 'Semua' || m.condition === conditionFilter;

      let matchesCategory = false;
      if (categoryFilter === 'Semua') {
        matchesCategory = true;
      } else if (categoryFilter === 'BestDeal') {
        matchesCategory = m.price < 25000000;
      } else {
        matchesCategory = m.category === categoryFilter;
      }

      const isExpired = m.expiryDate && Date.now() > m.expiryDate;

      return matchesSearch && matchesBrand && matchesCategory && matchesCondition && !isExpired;
    })
    .sort((a, b) => {
      // Prioritize Premium listings
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;

      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      return 0;
    });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="max-w-7xl mx-auto px-5 py-4 pb-32">


      {/* Promo Banner */}
      <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-[20px] p-5 mb-4 overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 right-8 w-20 h-20 bg-blue-500/20 rounded-full translate-y-8" />
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">kendara.in • Palu</p>
        <h3 className="text-white font-black text-lg leading-tight mb-1">Kendaraan Bekas<br />Terpercaya di Palu</h3>
        <p className="text-slate-400 text-[11px] font-medium">Unit terawat, surat lengkap, harga bersahabat.</p>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-white text-[10px] font-bold">Unit pilihan tersedia</span>
        </div>
      </div>

      {/* Sell Your Vehicle Call to Action */}
      <button 
        onClick={onOpenSellModal}
        className="w-full bg-white border-2 border-dashed border-slate-200 rounded-[20px] p-4 flex items-center justify-between mb-6 active:scale-[0.98] transition-all hover:border-blue-300 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Tag size={20} className="text-blue-600" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-slate-800">Jual Kendaraan Anda</h4>
            <p className="text-[11px] text-slate-500 font-medium italic">Titip jual cepat & aman di sini</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ArrowRight size={18} />
        </div>
      </button>

      {/* Search + Filter Row */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 shadow-sm rounded-2xl overflow-hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari merek atau model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border-none focus:ring-0 focus:outline-none text-slate-700 font-medium text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm transition-all shrink-0 ${showFilterMenu ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Expandable Filter Menu */}
      {showFilterMenu && (
        <div className="bg-white rounded-2xl p-4 mb-5 shadow-sm border border-slate-100 space-y-4">
          {/* Sort */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Urutkan</p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'default', label: 'Default' },
                { key: 'price_asc', label: 'Harga ↑' },
                { key: 'price_desc', label: 'Harga ↓' },
                { key: 'newest', label: 'Terbaru' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key as SortType)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === opt.key ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {/* Condition */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kondisi</p>
            <div className="flex flex-wrap gap-2">
              {['Semua', 'Mulus', 'Standar', 'Modifikasi'].map(c => (
                <button
                  key={c}
                  onClick={() => setConditionFilter(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${conditionFilter === c ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Curated Brands */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-black text-slate-900">Merek Kendaraan</h3>
          {brandFilter !== 'Semua' && (
            <button onClick={() => setBrandFilter('Semua')} className="text-xs text-rose-500 font-bold flex items-center gap-1">
              <X size={12} /> Reset
            </button>
          )}
        </div>
        <div className="-mx-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-2 px-5" style={{width: 'max-content', minWidth: '100%'}}>
          {['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'Vespa'].map((brand, i) => {
            const colors = ['bg-[#FFE4E1]', 'bg-[#E0F7FA]', 'bg-[#F3E5F5]', 'bg-[#FFF9C4]', 'bg-[#E8F5E9]'];
            const textColors = ['text-rose-500', 'text-cyan-600', 'text-purple-500', 'text-yellow-600', 'text-emerald-500'];
            const isActive = brandFilter === brand;
            return (
              <button
                key={brand}
                onClick={() => { setBrandFilter(isActive ? 'Semua' : brand); setCategoryFilter('Semua'); }}
                className="flex flex-col items-center gap-2 min-w-[56px] group shrink-0"
              >
                <div className={`w-[52px] h-[52px] flex items-center justify-center rounded-[16px] shadow-sm transition-all active:scale-95 ${isActive ? 'ring-2 ring-slate-800 ring-offset-2 scale-105' : 'hover:scale-105'} ${colors[i % colors.length]}`}>
                  <span className={`text-[22px] font-black ${textColors[i % textColors.length]} opacity-90`}>{brand[0]}</span>
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{brand}</span>
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-black text-slate-900">
          {filteredMotors.length} Unit Ditemukan
        </h3>
      </div>
      <div className="-mx-5 overflow-x-auto scrollbar-hide mb-4">
        <div className="flex items-center gap-2 pb-3 px-5" style={{width: 'max-content', minWidth: '100%'}}>
          {[
            { key: 'Semua', label: 'Semua' },
            { key: 'Motor', label: '🏍️ Motor' },
            { key: 'Mobil', label: '🚗 Mobil' },
            { key: 'BestDeal', label: '🔥 Best Deal' },
          ].map(cat => {
            const isActive = categoryFilter === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => { setCategoryFilter(cat.key); setBrandFilter('Semua'); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0 ${isActive ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}
              >
                {cat.label}
              </button>
            );
          })}
          {/* Spacer so last button clears edge */}
          <div className="w-1 shrink-0" />
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredMotors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[28px] border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-slate-300" />
          </div>
          <h4 className="text-lg font-black text-slate-900 mb-1">Tidak ada hasil</h4>
          <p className="text-slate-400 text-sm px-8">Coba ubah filter atau kata kunci pencarian.</p>
          <button
            onClick={() => { setSearchTerm(''); setBrandFilter('Semua'); setCategoryFilter('Semua'); setConditionFilter('Semua'); setSortBy('default'); }}
            className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm active:scale-95 transition-all"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredMotors.map(motor => (
            <MotorCard
              key={motor.id}
              motor={motor}
              isFavorite={favorites.includes(motor.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={() => {
                setSelectedMotor(motor);
                if (onViewMotor) onViewMotor(motor.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Motor Detail Slide-up */}
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

export default Catalog;
