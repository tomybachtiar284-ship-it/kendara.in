
import React, { useState } from 'react';
import { Heart, Trash2, MessageCircleMore } from 'lucide-react';
import { Motorcycle } from '../types';
import MotorDetail from './MotorDetail';

interface FavoritesPanelProps {
  motors: Motorcycle[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ motors, favorites, onToggleFavorite }) => {
  const [selectedMotor, setSelectedMotor] = useState<Motorcycle | null>(null);

  const favoriteMotors = motors.filter(m => favorites.includes(m.id));

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="max-w-7xl mx-auto px-5 py-6 pb-32 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Koleksi Saya</p>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Unit Favorit</h2>
        <p className="text-slate-400 text-sm mt-1">
          {favoriteMotors.length === 0 ? 'Belum ada unit yang disimpan.' : `${favoriteMotors.length} unit tersimpan`}
        </p>
      </div>

      {favoriteMotors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[28px] border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-rose-300" />
          </div>
          <h4 className="text-lg font-black text-slate-900 mb-1">Belum Ada Favorit</h4>
          <p className="text-slate-400 text-sm px-10 leading-relaxed">
            Tekan ikon ❤️ pada unit kendaraan yang menarik minat Anda untuk menyimpannya di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {favoriteMotors.map(motor => (
            <div
              key={motor.id}
              className="bg-white rounded-[20px] p-3 shadow-sm border border-slate-100 flex gap-4 items-center cursor-pointer active:scale-[0.99] transition-all"
              onClick={() => setSelectedMotor(motor)}
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-[16px] overflow-hidden shrink-0 bg-slate-100">
                <img
                  src={motor.images?.[0] || ''}
                  alt={`${motor.brand} ${motor.model}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${motor.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {motor.status}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{motor.category}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 truncate">{motor.brand} {motor.model}</h4>
                <p className="text-[10px] text-slate-400 mb-1">{motor.year} • {motor.mileage} • {motor.condition}</p>
                <p className="text-[15px] font-black text-slate-900">{formatPrice(motor.price)}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                {motor.status === 'Tersedia' && (
                  <a
                    href={`https://wa.me/${motor.sellerPhone}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${motor.brand} ${motor.model} (Tahun ${motor.year}) dari kendara.in bekas Palu.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-emerald-500/30 active:scale-90 transition-transform"
                  >
                    <MessageCircleMore size={16} />
                  </a>
                )}
                <button
                  onClick={() => onToggleFavorite(motor.id)}
                  className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 active:scale-90 transition-transform"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Motor Detail Slideup */}
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

export default FavoritesPanel;
