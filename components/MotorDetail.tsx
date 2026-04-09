
import React, { useState } from 'react';
import { X, Heart, MapPin, Calendar, Gauge, Tag, MessageCircleMore, ChevronLeft, ChevronRight, CheckCircle2, Wrench, ArrowRight } from 'lucide-react';
import { Motorcycle } from '../types';

interface MotorDetailProps {
  motor: Motorcycle;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

const MotorDetail: React.FC<MotorDetailProps> = ({ motor, isFavorite, onToggleFavorite, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const conditionIcon = {
    Mulus: <CheckCircle2 size={14} className="text-emerald-500" />,
    Standar: <Gauge size={14} className="text-yellow-500" />,
    Modifikasi: <Wrench size={14} className="text-purple-500" />,
  }[motor.condition] ?? null;

  const waMessage = encodeURIComponent(
    `Halo, saya tertarik dengan ${motor.brand} ${motor.model} (Tahun ${motor.year}) yang ada di kendara.in bekas Palu. Apakah masih tersedia?`
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white w-full max-w-[480px] rounded-t-[36px] shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-300 ease-out">

        {/* Drag Handle */}
        <div className="sticky top-0 z-10 pt-4 pb-3 bg-white rounded-t-[36px] border-b border-slate-50">
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3" />
          <div className="flex justify-between items-center px-5">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{motor.category} • {motor.location}</p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{motor.brand} {motor.model}</h2>
            </div>
            <button onClick={onClose} className="w-9 h-9 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
              <X size={18} className="text-slate-700" />
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative mx-5 mt-4 aspect-video rounded-[20px] overflow-hidden bg-slate-100">
          <img
            src={motor.images[currentImageIndex] || ''}
            alt={`${motor.brand} ${motor.model} foto ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {motor.images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(p => p === 0 ? motor.images.length - 1 : p - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentImageIndex(p => p === motor.images.length - 1 ? 0 : p + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white"
              >
                <ChevronRight size={18} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {motor.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`rounded-full transition-all ${i === currentImageIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md ${motor.status === 'Tersedia' ? 'bg-white text-slate-900' : 'bg-slate-900/90 text-white'}`}>
              {motor.status}
            </span>
          </div>
          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(motor.id)}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 ${isFavorite ? 'bg-rose-500' : 'bg-white/80 backdrop-blur'}`}
          >
            <Heart size={16} fill={isFavorite ? 'white' : 'none'} className={isFavorite ? 'text-white' : 'text-slate-500'} />
          </button>
        </div>

        {/* Price */}
        <div className="mx-5 mt-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Harga</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatPrice(motor.price)}</p>
          </div>
          {motor.status === 'Tersedia' && (
            <a
              href={`https://wa.me/${motor.sellerPhone}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
            >
              <MessageCircleMore size={18} />
              Hub. Penjual
            </a>
          )}
        </div>

        {/* Specs Grid */}
        <div className="mx-5 mt-5 grid grid-cols-3 gap-3">
          {[
            { icon: <Calendar size={16} className="text-blue-500" />, label: 'Tahun', value: String(motor.year) },
            { icon: <Gauge size={16} className="text-orange-500" />, label: 'KM', value: motor.mileage },
            { icon: conditionIcon, label: 'Kondisi', value: motor.condition },
            { icon: <Tag size={16} className="text-slate-500" />, label: 'Kategori', value: motor.category },
            { icon: <MapPin size={16} className="text-rose-500" />, label: 'Lokasi', value: motor.location },
            { icon: <CheckCircle2 size={16} className={motor.status === 'Tersedia' ? 'text-emerald-500' : 'text-slate-400'} />, label: 'Status', value: motor.status },
          ].map((s, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-3 flex flex-col gap-1.5">
              {s.icon}
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-xs font-black text-slate-800 leading-snug">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mx-5 mt-5 mb-8">
          <h4 className="text-sm font-black text-slate-900 mb-2">Deskripsi Unit</h4>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">{motor.description}</p>
        </div>

        {/* Bottom CTA */}
        {motor.status === 'Tersedia' && (
          <div className="sticky bottom-0 bg-white border-t border-slate-100 p-5 flex gap-3">
            <button
              onClick={() => onToggleFavorite(motor.id)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all active:scale-90 ${isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-slate-200 text-slate-400'}`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <a
              href={`https://wa.me/${motor.sellerPhone}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 py-3.5 text-sm active:scale-[0.98] transition-transform shadow-xl shadow-slate-900/10"
            >
              <MessageCircleMore size={20} />
              Hubungi Penjual via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotorDetail;
