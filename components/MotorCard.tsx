
import React from 'react';
import { MapPin, Heart, Edit, Trash2, Star } from 'lucide-react';
import { Motorcycle } from '../types';

interface MotorCardProps {
  motor: Motorcycle;
  isAdminView?: boolean;
  isFavorite?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (motor: Motorcycle) => void;
  onUpdateStatus?: (id: string, status: 'Tersedia' | 'Terjual') => void;
  onToggleFavorite?: (id: string) => void;
  onClick?: () => void;
}

const MotorCard: React.FC<MotorCardProps> = ({
  motor,
  isAdminView = false,
  isFavorite = false,
  onDelete,
  onEdit,
  onUpdateStatus,
  onToggleFavorite,
  onClick,
}) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div
      className={`bg-white rounded-[20px] p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col group relative cursor-pointer active:scale-[0.98] transition-all duration-200 ${motor.isPremium ? 'border-2 border-amber-400 shadow-amber-100 shadow-lg' : 'border border-transparent'}`}
      onClick={onClick}
    >
      {motor.isPremium && (
        <div className="absolute -top-2 -left-2 z-30 px-3 py-1 bg-amber-400 text-white rounded-xl shadow-lg flex items-center gap-1.5 animate-bounce-subtle">
          <Star size={12} fill="white" />
          <span className="text-[10px] font-black tracking-tight uppercase">Gold</span>
        </div>
      )}
      {/* Image */}
      <div className="relative aspect-square rounded-[16px] overflow-hidden">
        <img
          src={motor.images?.[0] || 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=400&auto=format&fit=crop'}
          alt={`${motor.brand} ${motor.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-slate-100"
        />

        {/* Admin overlay buttons */}
        {isAdminView ? (
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onEdit?.(motor)}
              className="p-1.5 bg-blue-600 text-white rounded-xl shadow-md active:scale-90 transition-transform"
            >
              <Edit size={13} />
            </button>
            <button
              onClick={() => onDelete?.(motor.id)}
              className="p-1.5 bg-rose-600 text-white rounded-xl shadow-md active:scale-90 transition-transform"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ) : (
          <button
            className={`absolute top-2 right-2 p-1.5 rounded-xl backdrop-blur-md shadow-sm z-20 transition-all active:scale-90 ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-400 hover:text-rose-500'}`}
            onClick={e => { e.stopPropagation(); onToggleFavorite?.(motor.id); }}
          >
            <Heart size={15} fill={isFavorite ? 'white' : 'none'} />
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm ${motor.status === 'Tersedia' ? 'bg-white text-slate-800' : 'bg-slate-800 text-white'}`}>
            {motor.status}
          </span>
        </div>

        {/* Category chip */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide bg-black/40 text-white backdrop-blur-sm">
            {motor.category}
          </span>
        </div>

        {/* Multiple images indicator */}
        {(motor.images?.length || 0) > 1 && (
          <div className="absolute bottom-2 right-2 z-10 bg-black/40 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
            +{motor.images.length - 1}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 pb-1 px-1 flex-1 flex flex-col">
        <h3 className="text-[13px] font-bold text-slate-800 leading-tight line-clamp-1 uppercase tracking-tight">
          {motor.brand} {motor.model}
        </h3>

        <div className="flex items-center text-[9px] text-slate-400 mt-1 mb-2.5 gap-1">
          <span>{motor.year}</span>
          <span>•</span>
          <span className="truncate">{motor.mileage}</span>
          <span>•</span>
          <span>{motor.condition}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={10} className="text-slate-400 shrink-0" />
          <span className="text-[10px] text-slate-400 font-medium truncate">{motor.location}</span>
        </div>

        <div className="flex items-center justify-between mt-auto gap-2">
          <p className="text-[14px] font-black text-slate-900 tracking-tight">
            {formatPrice(motor.price)}
          </p>
          {!isAdminView && motor.status === 'Tersedia' && (
            <a
              href={`https://wa.me/${motor.sellerPhone || '6281234567890'}?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(motor.brand + ' ' + motor.model)}%20(Tahun%20${motor.year})`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 text-white text-[10px] font-black px-3 py-2 rounded-xl active:scale-90 transition-transform whitespace-nowrap shadow-sm shadow-emerald-500/30"
              onClick={e => e.stopPropagation()}
            >
              WA
            </a>
          )}
        </div>
        {isAdminView && (
          <button
            onClick={e => { e.stopPropagation(); onUpdateStatus?.(motor.id, motor.status === 'Tersedia' ? 'Terjual' : 'Tersedia'); }}
            className={`mt-3 py-2 rounded-xl text-xs font-bold transition-all w-full ${motor.status === 'Tersedia' ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' : 'bg-green-100 text-green-700'}`}
          >
            {motor.status === 'Tersedia' ? 'Set Terjual' : 'Set Tersedia'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MotorCard;
