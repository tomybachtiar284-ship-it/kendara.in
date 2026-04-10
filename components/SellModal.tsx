
import React, { useState, useEffect } from 'react';
import { PendingSubmission, AppSettings } from '../types';
import { Star, Clock, CheckCircle2, CreditCard, X, Camera, ChevronRight, Check, User, Phone, Image as ImageIcon, DollarSign, Copy, AlertCircle, Landmark, Wallet, Smartphone } from 'lucide-react';

interface SellModalProps {
  onClose: () => void;
  onSubmit: (submission: PendingSubmission) => void;
  settings: AppSettings;
}

const SellModal: React.FC<SellModalProps> = ({ onClose, onSubmit, settings }) => {
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
    isPremium: false,
    paymentMethod: 'BCA',
    paymentProof: '',
  });

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (step === 4 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (step === 4 && timeLeft === 0) {
      alert('Waktu pembayaran habis. Silakan ulangi proses.');
      setStep(3);
      setTimeLeft(600);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Nomor berhasil disalin!');
  };

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

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > 800) { h = Math.round(h * 800 / w); w = 800; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
          setFormData(prev => ({ ...prev, paymentProof: canvas.toDataURL('image/jpeg', 0.8) }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
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
      isPremium: formData.isPremium,
      paymentMethod: formData.isPremium ? formData.paymentMethod : undefined,
      paymentProof: formData.isPremium ? formData.paymentProof : undefined,
    };
    onSubmit(submission);
    setStep(5); // Show success (now step 5)
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
              {step < 5 && (
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Langkah {step} dari {formData.isPremium ? 4 : 3}</p>
              )}
            </div>
            <button onClick={onClose} className="w-9 h-9 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
              <X size={18} className="text-slate-600" />
            </button>
          </div>
          {/* Step progress bar */}
          {step < 5 && (
            <div className="flex gap-1.5 mt-3">
              {[1, 2, 3, ...(formData.isPremium ? [4] : [])].map(i => (
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

              {/* PACKAGE SELECTION */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Paket Iklan</p>
                <div className="grid grid-cols-1 gap-3">
                  {/* Gratis */}
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isPremium: false })}
                    className={`p-4 rounded-[24px] border-2 text-left transition-all ${!formData.isPremium ? 'border-slate-900 bg-slate-50' : 'border-slate-100 opacity-60'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-black text-slate-900">Paket Gratis</span>
                      {!formData.isPremium && <CheckCircle2 size={18} className="text-slate-900" />}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={12} /> {settings.freeDurationDays} Hari</span>
                      <span className="flex items-center gap-1"><Check size={12} /> Tayang Standar</span>
                    </div>
                  </button>

                  {/* Premium */}
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isPremium: true })}
                    className={`p-4 rounded-[24px] border-2 text-left transition-all relative overflow-hidden ${formData.isPremium ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100 opacity-60'}`}
                  >
                    {formData.isPremium && <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 -rotate-45 translate-x-8 -translate-y-8 flex items-end justify-center pb-2"><Star size={12} className="text-amber-500" /></div>}
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-slate-900">Paket Premium</span>
                        <span className="px-1.5 py-0.5 bg-amber-400 text-white text-[8px] font-black rounded-md">GOLD</span>
                      </div>
                      <span className="text-sm font-black text-amber-600">Rp {settings.premiumPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                      <span className="flex items-center gap-1 text-amber-600"><Clock size={12} /> {settings.premiumDurationDays} Hari</span>
                      <span className="flex items-center gap-1"><Check size={12} /> Prioritas Atas</span>
                      <span className="flex items-center gap-1"><Check size={12} /> Badge Gold</span>
                    </div>
                  </button>
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

          {/* STEP 4: Payment (Premium only) */}
          {step === 4 && (
            <div className="p-6 space-y-6">
              {/* Timer & Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                  <Clock size={14} className="animate-pulse" />
                  <span className="text-xs font-black tabular-nums">{formatTime(timeLeft)}</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selesaikan Pembayaran</span>
              </div>

              <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <DollarSign size={80} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Bayar</p>
                <h3 className="text-3xl font-black mb-4">Rp {settings.premiumPrice.toLocaleString('id-ID')}</h3>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pilih Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'BCA', label: 'Bank BCA', icon: <Landmark size={20} />, color: 'bg-blue-500' },
                    { id: 'DANA', label: 'DANA', icon: <Wallet size={20} />, color: 'bg-blue-400' },
                    { id: 'OVO', label: 'OVO', icon: <Smartphone size={20} />, color: 'bg-indigo-500' },
                    { id: 'Gopay', label: 'Gopay', icon: <CreditCard size={20} />, color: 'bg-emerald-500' },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 active:scale-95 ${
                        formData.paymentMethod === method.id 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg' 
                        : 'border-slate-100 bg-slate-50 text-slate-600 grayscale opacity-60'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${formData.paymentMethod === method.id ? 'bg-white/20' : 'bg-slate-200'}`}>
                        {method.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Payment Details */}
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-slate-50 rounded-[32px] p-5 border border-slate-100 relative group overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Tujuan</p>
                      <p className="font-black text-slate-900 text-lg">
                        {formData.paymentMethod === 'BCA' && settings.bankAccount}
                        {formData.paymentMethod === 'DANA' && settings.danaNumber}
                        {formData.paymentMethod === 'OVO' && settings.ovoNumber}
                        {formData.paymentMethod === 'Gopay' && settings.gopayNumber}
                      </p>
                      <p className="text-xs font-bold text-slate-500">
                        {formData.paymentMethod === 'BCA' ? `a/n ${settings.bankHolder}` : 'a/n Admin Kendara.in'}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        const num = formData.paymentMethod === 'BCA' ? settings.bankAccount : 
                                  formData.paymentMethod === 'DANA' ? settings.danaNumber :
                                  formData.paymentMethod === 'OVO' ? settings.ovoNumber : settings.gopayNumber;
                        copyToClipboard(num);
                      }}
                      className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-900 active:scale-90 transition-all"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="bg-amber-100/50 rounded-2xl p-3 flex items-start gap-2">
                    <AlertCircle size={14} className="text-amber-600 mt-0.5" />
                    <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                      Pastikan nominal transfer sesuai. Kirim bukti transfer di bawah setelah pembayaran berhasil.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bukti Transfer (Upload Foto)</label>
                {formData.paymentProof ? (
                  <div className="relative aspect-video rounded-[32px] overflow-hidden border border-slate-100 shadow-sm group">
                    <img src={formData.paymentProof} alt="Bukti Transfer" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, paymentProof: '' })}
                      className="absolute top-3 right-3 w-9 h-9 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-white"
                    >
                      <X size={18} />
                    </button>
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-4 py-2 bg-white rounded-xl text-[10px] font-black text-emerald-600 shadow-xl">KLIK X UNTUK GANTI</span>
                    </div>
                  </div>
                ) : (
                  <label className="w-full h-44 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer group">
                    <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3">
                      <ImageIcon className="text-slate-300 group-hover:text-emerald-400 transition-colors" size={28} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">Klik untuk foto struk</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleProofUpload} />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Success (Previously step 4) */}
          {step === 5 && (
            <div className="text-center py-12 px-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-emerald-500" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Pengajuan Terkirim!</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Data kendaraan Anda telah dikirim ke admin untuk direview. {formData.isPremium ? 'Bukti transfer sudah kami terima. Admin akan memproses aktivasi segera.' : 'Tunggu konfirmasi melalui WhatsApp.'}
              </p>
              
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 text-left shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Informasi Pengajuan</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-bold">Unit</span>
                    <span className="text-xs font-black text-slate-900 text-right truncate ml-4">{formData.brand} {formData.model}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-bold">Paket</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${formData.isPremium ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                      {formData.isPremium ? '🌟 PREMIUM (30 Hari)' : '📄 GRATIS (14 Hari)'}
                    </span>
                  </div>
                  {formData.isPremium && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                      <span className="text-xs text-slate-400 font-bold">Metode Bayar</span>
                      <span className="text-xs font-black text-slate-900">{formData.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Confirmation Button */}
              {!formData.isPremium && (
                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `Halo Admin, saya baru saja mengirim pengajuan jual kendaraan di Kendara.in.\n\n` +
                    `*PAKET: GRATIS*\n` +
                    `Unit: ${formData.brand} ${formData.model} (${formData.year})\n\n` +
                    `Mohon bantuannya untuk di-review.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                >
                  <Phone size={18} /> Konfirmasi via WhatsApp
                </a>
              )}
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
              <button 
                onClick={() => formData.isPremium ? setStep(4) : handleSubmit()} 
                disabled={images.length === 0}
                className="flex-1 py-4 bg-slate-900 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all shadow-lg"
              >
                {formData.isPremium ? 'Lanjut ke Pembayaran' : 'Kirim ke Admin'} <ChevronRight size={18} />
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="w-16 py-4 bg-slate-100 text-slate-600 rounded-3xl font-black text-sm">←</button>
              <button onClick={handleSubmit} disabled={!formData.paymentProof}
                className="flex-1 py-4 bg-emerald-500 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/30">
                Kirim Bukti & Selesai ✓
              </button>
            </div>
          )}
          {step === 5 && (
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
