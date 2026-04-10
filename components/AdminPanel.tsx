
import React, { useState } from 'react';
import { PlusCircle, Sparkles, X, Save, Image as ImageIcon, Search } from 'lucide-react';
import { Motorcycle } from '../types';
import { generateMotorDescription } from '../services/geminiService';
import MotorCard from './MotorCard';

interface AdminPanelProps {
  motors: Motorcycle[];
  onAddMotor: (motor: Omit<Motorcycle, 'id' | 'createdAt'>) => void;
  onUpdateMotor: (motor: Motorcycle) => void;
  onDeleteMotor: (id: string) => void;
  onUpdateStatus: (id: string, status: 'Tersedia' | 'Terjual') => void;
  pendingCount?: number;
  onOpenNotifications?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  motors, 
  onAddMotor, 
  onUpdateMotor, 
  onDeleteMotor,
  onUpdateStatus,
  pendingCount = 0,
  onOpenNotifications
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMotor, setEditingMotor] = useState<Motorcycle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: '',
    condition: 'Mulus' as Motorcycle['condition'],
    images: [''],
    description: '',
    status: 'Tersedia' as Motorcycle['status'],
    location: 'Palu',
    sellerPhone: '6281234567890',
    category: 'Motor'
  });

  const handleOpenForm = (motor?: Motorcycle) => {
    if (motor) {
      setEditingMotor(motor);
      setFormData({
        brand: motor.brand,
        model: motor.model,
        year: motor.year,
        price: motor.price,
        mileage: motor.mileage,
        condition: motor.condition,
        images: motor.images || [''],
        description: motor.description,
        status: motor.status,
        location: motor.location || 'Palu',
        sellerPhone: motor.sellerPhone || '6281234567890',
        category: motor.category || 'Motor'
      });
    } else {
      setEditingMotor(null);
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        mileage: '',
        condition: 'Mulus',
        images: [''],
        description: '',
        status: 'Tersedia',
        location: 'Palu',
        sellerPhone: '6281234567890',
        category: 'Motor'
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMotor) {
      onUpdateMotor({ ...editingMotor, ...formData });
    } else {
      onAddMotor(formData);
    }
    setIsFormOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            setFormData(prev => {
              const currentImages = prev.images.filter(i => i !== '');
              if (currentImages.length >= 5) return prev;
              return { ...prev, images: [...currentImages, dataUrl].slice(0, 5) };
            });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAutoDescription = async () => {
    if (!formData.brand || !formData.model) {
      alert("Masukkan merek dan tipe motor terlebih dahulu!");
      return;
    }
    setIsGenerating(true);
    const desc = await generateMotorDescription(
      formData.brand, 
      formData.model, 
      formData.year, 
      formData.condition
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const filteredMotors = motors.filter(m => 
    `${m.brand} ${m.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAvailable = motors.filter(m => m.status === 'Tersedia').length;
  const totalSold = motors.filter(m => m.status === 'Terjual').length;
  const totalValue = motors.filter(m => m.status === 'Tersedia').reduce((s, m) => s + m.price, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="max-w-7xl mx-auto px-5 py-4 min-h-screen pb-32 relative">
      <div className="flex flex-col gap-1 mb-5">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Dashboard</p>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Kelola Inventaris</h2>
        <p className="text-slate-400 text-sm">Admin · Kendara.in Bekas Palu</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-900 rounded-2xl p-4 text-white">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Total Unit</p>
          <p className="text-3xl font-black">{motors.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">dalam katalog</p>
        </div>
        <div className="bg-emerald-500 rounded-2xl p-4 text-white">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-100/80 mb-1">Tersedia</p>
          <p className="text-3xl font-black">{totalAvailable}</p>
          <p className="text-[10px] text-emerald-100/70 mt-1">siap dijual</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Terjual</p>
          <p className="text-3xl font-black text-slate-900">{totalSold}</p>
          <p className="text-[10px] text-slate-400 mt-1">unit closing</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100/50">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-400 mb-1">Nilai Stok</p>
          <p className="text-sm font-black text-slate-900 leading-tight">{formatPrice(totalValue)}</p>
          <p className="text-[10px] text-slate-400 mt-1">total estimasi</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari motor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-3.5 bg-white border-none shadow-sm rounded-2xl focus:ring-2 focus:ring-slate-900 focus:outline-none w-full text-sm font-medium"
          />
        </div>
      </div>

      {filteredMotors.length === 0 ? (
        <div className="bg-white rounded-[32px] p-12 border border-slate-100 shadow-sm text-center mx-1">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="text-slate-300" size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Belum ada unit</h3>
          <p className="text-slate-400 text-sm mb-6">Mulai tambahkan koleksi kendaraan Anda untuk ditampilkan di katalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-1">
          {filteredMotors.map(motor => (
            <MotorCard 
              key={motor.id} 
              motor={motor} 
              isAdminView 
              onDelete={onDeleteMotor}
              onEdit={handleOpenForm}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-[480px] rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300"
            style={{ height: '90dvh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Header — fixed at top */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl flex-shrink-0">
              <h3 className="text-2xl font-black text-slate-900">
                {editingMotor ? 'Edit Motor' : 'Tambah Unit Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            {/* Scrollable form fields — takes all remaining height */}
            <div className="flex-1 overflow-y-auto">
              <form id="motor-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Merek (Contoh: Honda)</label>
                    <input required type="text" value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Model/Tipe (Contoh: Vario 150)</label>
                    <input required type="text" value={formData.model}
                      onChange={e => setFormData({...formData, model: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tahun</label>
                    <input required type="number" value={formData.year}
                      onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kilometer (KM)</label>
                    <input required type="text" placeholder="Contoh: 15rb - 20rb" value={formData.mileage}
                      onChange={e => setFormData({...formData, mileage: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Harga (Rp)</label>
                    <input required type="number" value={formData.price}
                      onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kondisi</label>
                    <select value={formData.condition}
                      onChange={e => setFormData({...formData, condition: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all">
                      <option value="Mulus">Mulus (Like New)</option>
                      <option value="Standar">Standar Pemakaian</option>
                      <option value="Modifikasi">Modifikasi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                    <select value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all">
                      <option value="Motor">Motor</option>
                      <option value="Mobil">Mobil</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi Terkini (Contoh: Palu, Parigi)</label>
                    <input required type="text" value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">No. WA Penjual (Berawalan 62)</label>
                    <input required type="text" placeholder="Contoh: 6281234567890" value={formData.sellerPhone}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({...formData, sellerPhone: val});
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all" />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Foto Produk (Maks 5 Foto)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                    {formData.images.filter(img => img !== '').map((img, index) => (
                      <div key={index} className="relative aspect-video sm:aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData({...formData, images: newImages.length ? newImages : ['']});
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg shadow-sm"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {formData.images.filter(img => img !== '').length < 5 && (
                      <label className="aspect-video sm:aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-rose-500 hover:bg-rose-50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 group">
                        <PlusCircle className="text-slate-400 group-hover:text-rose-500 mb-2" size={28} />
                        <span className="text-xs font-bold text-slate-500 group-hover:text-rose-600">Pilih / Kamera</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Otomatis diperkecil agar kualitas tetap bagus dan tidak memberatkan (bisa pilih banyak sekaligus).</p>
                </div>

                {/* Description */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700">Deskripsi Promosi</label>
                    <button type="button" onClick={handleAutoDescription} disabled={isGenerating}
                      className="text-xs flex items-center gap-1 text-purple-600 font-bold hover:text-purple-700 disabled:opacity-50">
                      <Sparkles size={14} />
                      {isGenerating ? 'Menulis...' : 'Tulis Otomatis dengan AI'}
                    </button>
                  </div>
                  <textarea required rows={4} value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-slate-50 transition-all" />
                </div>
              </form>
            </div>

            {/* Action buttons — ALWAYS visible, outside scroll area */}
            <div className="flex-shrink-0 flex gap-3 px-6 py-4 border-t border-slate-100 bg-white">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="motor-form"
                className="flex-1 py-4 bg-gradient-to-r from-rose-600 to-orange-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
              >
                <Save size={20} />
                Simpan Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => handleOpenForm()}
        className="fixed bottom-24 right-8 w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border border-white/20"
      >
        <PlusCircle size={32} />
      </button>
    </div>
  );
};

export default AdminPanel;
