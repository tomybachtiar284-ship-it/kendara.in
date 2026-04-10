
import React, { useState } from 'react';
import { Bell, X, Check, ChevronRight, Clock, Phone, MapPin, Tag, CreditCard, FileText, Star } from 'lucide-react';
import { PendingSubmission } from '../types';

interface NotificationPanelProps {
  submissions: PendingSubmission[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
}

const formatTimeAgo = (ts: number) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} hari lalu`;
  if (hours > 0) return `${hours} jam lalu`;
  if (mins > 0) return `${mins} menit lalu`;
  return 'Baru saja';
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

const NotificationPanel: React.FC<NotificationPanelProps> = ({ submissions, onApprove, onReject, onClose }) => {
  const [selected, setSelected] = useState<PendingSubmission | null>(null);
  const pending = submissions.filter(s => s.status === 'pending');

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-[480px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 z-10">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-slate-100 bg-slate-900">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                <Bell size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Notifikasi Admin</h3>
                <p className="text-slate-400 text-xs">
                  {pending.length === 0 ? 'Tidak ada pengajuan baru' : `${pending.length} pengajuan menunggu review`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* List or Detail */}
        <div className="flex-1 overflow-y-auto">
          {selected ? (
            /* Detail View */
            <div>
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <button onClick={() => setSelected(null)} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                  <ChevronRight size={16} className="text-slate-600 rotate-180" />
                </button>
                <h4 className="font-black text-slate-900">Detail Pengajuan</h4>
              </div>

              {/* Photos */}
              {selected.images.length > 0 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {selected.images.map((img, i) => (
                    <img key={i} src={img} alt={`foto-${i}`}
                      className="h-32 w-44 object-cover rounded-2xl flex-shrink-0 border border-slate-100" />
                  ))}
                </div>
              )}

              <div className="px-6 py-4 space-y-4">
                {/* Vehicle info */}
                <div className="bg-slate-50 rounded-3xl p-4 space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Info Kendaraan</p>
                  <h3 className="text-xl font-black text-slate-900">{selected.brand} {selected.model} {selected.year}</h3>
                  <p className="text-xl font-black text-emerald-600">{formatPrice(selected.price)}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-3 py-1 bg-white rounded-xl text-xs font-black text-slate-600 border border-slate-100">{selected.category}</span>
                    <span className="px-3 py-1 bg-white rounded-xl text-xs font-black text-slate-600 border border-slate-100">{selected.condition}</span>
                    <span className="px-3 py-1 bg-white rounded-xl text-xs font-black text-slate-600 border border-slate-100 flex items-center gap-1">
                      <MapPin size={10} /> {selected.location}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-xl text-xs font-black text-slate-600 border border-slate-100 flex items-center gap-1">
                      <Tag size={10} /> {selected.mileage} km
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">{selected.description || '-'}</p>
                </div>

                {/* Seller info */}
                <div className="bg-blue-50 rounded-3xl p-4 space-y-2">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Info Penjual</p>
                  <p className="text-sm font-black text-slate-900">{selected.sellerName}</p>
                  <a href={`https://wa.me/${selected.sellerPhone}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <Phone size={14} /> {selected.sellerPhone}
                  </a>
                </div>

                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock size={11} /> Dikirim {formatTimeAgo(selected.submittedAt)}
                </p>

                {/* PREMIUM PAYMENT INFO */}
                {selected.isPremium && (
                  <div className="pt-2">
                    <div className="bg-amber-50 rounded-[32px] border border-amber-100 overflow-hidden shadow-sm">
                      <div className="px-5 py-4 bg-amber-100/30 flex items-center justify-between border-b border-amber-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Star size={14} fill="currentColor" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-amber-900 leading-none">Paket Premium</p>
                            <p className="text-[10px] font-bold text-amber-600 mt-0.5 uppercase tracking-tighter">Pembayaran Diterima</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-black text-amber-700 shadow-sm">{selected.paymentMethod}</span>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-amber-500" />
                          <p className="text-xs font-bold text-slate-600">Bukti Transfer:</p>
                        </div>
                        {selected.paymentProof ? (
                          <div className="rounded-2xl border border-amber-200 overflow-hidden bg-white shadow-inner">
                            <img 
                              src={selected.paymentProof} 
                              alt="Bukti Transfer" 
                              className="w-full object-contain max-h-96 cursor-zoom-in"
                              onClick={() => window.open(selected.paymentProof, '_blank')}
                            />
                          </div>
                        ) : (
                          <p className="text-[10px] text-rose-500 font-bold italic bg-rose-50 px-3 py-2 rounded-xl border border-rose-100 uppercase">⚠️ Bukti transfer tidak ditemukan</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* List View */
            <div>
              {submissions.length === 0 ? (
                <div className="text-center py-20 px-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={28} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold">Belum ada pengajuan masuk</p>
                  <p className="text-slate-300 text-sm mt-1">Pengajuan dari pengguna akan muncul di sini</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {submissions.map(s => (
                    <div key={s.id}
                      className={`bg-white rounded-3xl border p-4 shadow-sm transition-all ${s.status === 'pending' ? 'border-blue-100 bg-blue-50/30' : 'border-slate-100 opacity-60'}`}>
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        {s.images[0] ? (
                          <img src={s.images[0]} alt="thumb" className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex-shrink-0 flex items-center justify-center">
                            <Tag size={20} className="text-slate-300" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-black text-slate-900 text-sm truncate">{s.brand} {s.model} {s.year}</p>
                            <div className="flex items-center gap-2">
                              {s.isPremium && (
                                <span className="bg-amber-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                  <Star size={8} fill="currentColor" /> PREMIUM
                                </span>
                              )}
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                                s.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                s.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-rose-100 text-rose-700'
                              }`}>
                                {s.status === 'pending' ? 'Menunggu' : s.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-emerald-600">{formatPrice(s.price)}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">oleh {s.sellerName} · {formatTimeAgo(s.submittedAt)}</p>
                        </div>
                      </div>

                      {s.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => setSelected(s)}
                            className="flex-1 py-2.5 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors">
                            Lihat Detail
                          </button>
                          <button onClick={() => onReject(s.id)}
                            className="flex-1 py-2.5 bg-rose-50 rounded-2xl text-xs font-black text-rose-600 hover:bg-rose-100 transition-colors">
                            Tolak
                          </button>
                          <button onClick={() => onApprove(s.id)}
                            className="flex-1 py-2.5 bg-emerald-500 rounded-2xl text-xs font-black text-white hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                            <Check size={12} /> Setuju
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detail footer with Approve/Reject */}
        {selected && selected.status === 'pending' && (
          <div className="flex-shrink-0 flex gap-3 px-6 py-4 border-t border-slate-100 bg-white">
            <button onClick={() => { onReject(selected.id); setSelected(null); }}
              className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-3xl font-black text-sm active:scale-[0.98] transition-all">
              ✕ Tolak
            </button>
            <button onClick={() => { onApprove(selected.id); setSelected(null); }}
              className="flex-1 py-4 bg-emerald-500 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all">
              <Check size={18} /> Setujui & Tayangkan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
