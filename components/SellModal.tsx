
import React, { useState } from 'react';
import { X, Camera, ChevronRight, Check, User, Phone } from 'lucide-react';
import { PendingSubmission } from '../types';

interface SellModalProps {
  onClose: () => void;
  onSubmit: (submission: PendingSubmission) => void;
}

const SellModal: React.FC<SellModalProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerPhone: '',
    category: 'Motor',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    condition: 'Mulus' as 'Mulus' | 'Standar' | 'Modifikasi',
    location: 'Palu',
    description: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > 1200) { h = Math.round(h * 1200 / w); w = 1200; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImages(prev => prev.length < 5 ? [...prev, dataUrl] : prev);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleSubmit = () => {
    const submission: PendingSubmission = {
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: Date.now(),
      status: 'pending',
      sellerName: formData.sellerName,
      sellerPhone: formData.sellerPhone,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      price: parseInt(formData.price.replace(/\D/g, '')) || 0,
      mileage: formData.mileage,
      condition: formData.condition,
      category: formData.category,
      location: formData.location,
      description: formData.description,
      images,
    };
    onSubmit(submission);
    setStep(4); // Show success
  };

  const isStep1Valid = formData.brand && formData.model && formData.price && formData.year;
  const isStep2Valid = formData.mileage && formData.location && formData.sellerName && formData.sellerPhone;

  return (
    <div className="fixed inset-0 z-[400] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white w-full max-w-[480px] rounded-t-[40px] shadow-2xl relative z-10 animate-in slide-in-from-bottom-full duration-500 ease-out"
        style={{ maxHeight: '92dvh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="flex-shrink-0 pt-4 pb-3 px-6 border-b border-slate-50">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Jual Kendaraan</h2>
              {step < 4 && (
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Langkah {step} dari 3</p>
              )}
            </div>
            <button onClick={onClose} className="w-9 h-9 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
              <X size={18} className="text-slate-600" />
            </button>
          </div>
          {/* Step progress bar */}
          {step < 4 && (
            <div className="flex gap-1.5 mt-3">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-slate-900' : 'bg-slate-100'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* STEP 1: Basic info */}
          {step === 1 && (
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                <p className="text-sm font-bold text-blue-800 leading-relaxed">
                  Lengkapi data kendaraan Anda. Admin akan memvalidasi sebelum unit tayang di katalog.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kategori</label>
                  <select name="category" value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Motor">Motor</option>
                    <option value="Mobil">Mobil</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tahun</label>
                  <input type="number" value={formData.year}
                    onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Merek</label>
                  <input type="text" placeholder="Honda, Yamaha..." value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Model</label>
                  <input type="text" placeholder="Vario 160..." value={formData.model}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Harga (Rp)</label>
                <input type="text" placeholder="Contoh: 15.000.000" value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          )}

          {/* STEP 2: Details + Contact */}
          {step === 2 && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kilometer</label>
                  <input type="text" placeholder="Cth: 15rb" value={formData.mileage}
                    onChange={e => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Lokasi</label>
                  <input type="text" value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kondisi</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Mulus', 'Standar', 'Modifikasi'] as const).map(c => (
                    <button key={c} type="button" onClick={() => setFormData({ ...formData, condition: c })}
                      className={`py-3 rounded-2xl text-[11px] font-black border transition-all ${formData.condition === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Deskripsi</label>
                <textarea rows={3} placeholder="Ceritakan kondisi, riwayat servis, bonus aksesoris..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Penjual</p>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><User size={10} /> Nama</label>
                  <input type="text" placeholder="Nama lengkap Anda" value={formData.sellerName}
                    onChange={e => setFormData({ ...formData, sellerName: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><Phone size={10} /> No. WhatsApp (62...)</label>
                  <input type="tel" placeholder="6281234567890" value={formData.sellerPhone}
                    onChange={e => setFormData({ ...formData, sellerPhone: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Photos */}
          {step === 3 && (
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100">
                <p className="text-sm font-bold text-amber-800 leading-relaxed">
                  📸 Tambahkan foto kendaraan Anda (maks. 5 foto). Foto yang jelas akan mempercepat proses review admin.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={img} alt={`foto-${i}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 w-7 h-7 bg-rose-600 rounded-xl flex items-center justify-center">
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50 transition-colors">
                    <Camera size={28} className="text-slate-300 mb-2" />
                    <span className="text-xs font-black text-slate-400">Pilih / Kamera</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                {images.length === 0 ? 'Minimal 1 foto diperlukan' : `${images.length} foto dipilih`}
              </p>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="text-center py-12 px-8">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-emerald-500" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Pengajuan Terkirim!</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Data kendaraan Anda telah dikirim ke admin untuk direview. Tunggu konfirmasi melalui WhatsApp ke nomor yang Anda daftarkan.
              </p>
              <div className="bg-slate-50 rounded-2xl p-4 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ringkasan</p>
                <p className="text-sm font-black text-slate-800">{formData.brand} {formData.model} {formData.year}</p>
                <p className="text-sm text-slate-500">Rp {formData.price} · {formData.condition}</p>
                <p className="text-xs text-slate-400 mt-1">Dikirim ke: {formData.sellerPhone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 bg-white">
          {step === 1 && (
            <button onClick={() => setStep(2)} disabled={!isStep1Valid}
              className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all shadow-lg">
              Lanjutkan <ChevronRight size={18} />
            </button>
          )}
          {step === 2 && (
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="w-16 py-4 bg-slate-100 text-slate-600 rounded-3xl font-black text-sm">←</button>
              <button onClick={() => setStep(3)} disabled={!isStep2Valid}
                className="flex-1 py-4 bg-slate-900 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all shadow-lg">
                Lanjutkan <ChevronRight size={18} />
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="w-16 py-4 bg-slate-100 text-slate-600 rounded-3xl font-black text-sm">←</button>
              <button onClick={handleSubmit} disabled={images.length === 0}
                className="flex-1 py-4 bg-emerald-500 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/30">
                Kirim ke Admin ✓
              </button>
            </div>
          )}
          {step === 4 && (
            <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-lg active:scale-[0.98] transition-all">
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellModal;
