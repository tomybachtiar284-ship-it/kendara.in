
import React, { useState } from 'react';
import { X, Camera, Send, Check } from 'lucide-react';

interface SellModalProps {
  onClose: () => void;
}

const SellModal: React.FC<SellModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: 'Motor',
    brand: '',
    model: '',
    year: '',
    price: '',
    condition: 'Mulus',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Halo Admin kendara.in,\n\nSaya ingin menjual kendaraan saya:\n` +
      `- Kategori: ${formData.category}\n` +
      `- Unit: ${formData.brand} ${formData.model}\n` +
      `- Tahun: ${formData.year}\n` +
      `- Harga: Rp ${formData.price}\n` +
      `- Kondisi: ${formData.condition}\n` +
      `- Deskripsi: ${formData.description}\n\n` +
      `Mohon bantuannya untuk proses listing. Terima kasih!`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
    setStep(3); // Show success
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white w-full max-w-[480px] rounded-t-[40px] shadow-2xl relative animate-in slide-in-from-bottom-full duration-500 ease-out max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 pt-4 pb-2 border-b border-slate-50">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
          <div className="flex justify-between items-center px-6 mb-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Jual Kendaraan</h2>
            <button onClick={onClose} className="w-9 h-9 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
              <X size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100/50">
                <p className="text-sm font-bold text-blue-800 leading-relaxed">
                  Lengkapi data kendaraan Anda. Admin akan memvalidasi data sebelum unit tayang di katalog.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Motor">Motor</option>
                    <option value="Mobil">Mobil</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tahun</label>
                  <input
                    type="number"
                    name="year"
                    placeholder="Contoh: 2022"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Merek & Model</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="brand"
                    placeholder="Merek (Honda, dll)"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    name="model"
                    placeholder="Model (Vario, dll)"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Harga (IDR)</label>
                <input
                  type="text"
                  name="price"
                  placeholder="Contoh: 15.000.000"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.brand || !formData.model || !formData.price}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Lanjutkan
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kondisi</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Mulus', 'Standar', 'Modifikasi'].map(c => (
                    <button
                      key={c}
                      onClick={() => setFormData({ ...formData, condition: c })}
                      className={`py-3 rounded-2xl text-[11px] font-black border transition-all ${formData.condition === c ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-100'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Deskripsi Tambahan</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Ceritakan sejarah servis, minus, atau bonus aksesoris..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-3xl border border-slate-100 bg-slate-50 font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-20 py-5 bg-slate-100 text-slate-600 rounded-3xl font-black text-sm"
                >
                  Kembali
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-5 bg-emerald-500 text-white rounded-3xl font-black text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Send size={18} />
                  Kirim ke WhatsApp
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-emerald-500" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Berhasil Dikirim!</h3>
              <p className="text-slate-500 text-sm px-10 leading-relaxed mb-10">
                Terima kasih! Pesan data kendaraan Anda telah diproses. Silakan lanjutkan obrolan di WhatsApp untuk mengirim foto unit.
              </p>
              <button
                onClick={onClose}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-xl"
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellModal;
