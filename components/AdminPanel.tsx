
import React, { useState } from 'react';
import { 
  PlusCircle, Sparkles, X, Save, Image as ImageIcon, Search, 
  TrendingUp, TrendingDown, DollarSign, Package, ClipboardCheck, 
  Eye, Trophy, Target, LayoutDashboard, CreditCard, Wallet, Smartphone, Landmark, Settings as SettingsIcon, Users, ChevronRight
} from 'lucide-react';
import { Motorcycle, AppSettings, UserRecord } from '../types';
import { generateMotorDescription } from '../services/geminiService';
import MotorCard from './MotorCard';

interface AdminPanelProps {
  motors: Motorcycle[];
  pendingSubmissions: PendingSubmission[];
  onAddMotor: (motor: Omit<Motorcycle, 'id' | 'createdAt'>) => void;
  onUpdateMotor: (motor: Motorcycle) => void;
  onDeleteMotor: (id: string) => void;
  onUpdateStatus: (id: string, status: 'Tersedia' | 'Terjual') => void;
  pendingCount?: number;
  onOpenNotifications?: () => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  users: UserRecord[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  motors, 
  pendingSubmissions,
  onAddMotor, 
  onUpdateMotor, 
  onDeleteMotor,
  onUpdateStatus,
  pendingCount = 0,
  onOpenNotifications,
  settings,
  onUpdateSettings,
  users
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'settings' | 'users'>('inventory');
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

  // ANALYTICS CALCULATIONS
  const totalUnits = motors.length;
  const soldUnits = motors.filter(m => m.status === 'Terjual').length;
  const availableUnits = totalUnits - soldUnits;
  const soldRatio = totalUnits > 0 ? (soldUnits / totalUnits) * 100 : 0;
  
  const totalValue = motors
    .filter(m => m.status === 'Tersedia')
    .reduce((sum, m) => sum + m.price, 0);

  const totalViews = motors.reduce((sum, m) => sum + (m.views || 0), 0);
  
  // Find most popular (by views)
  const topMotor = [...motors]
    .filter(m => (m.views || 0) > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-7xl mx-auto px-5 py-4 min-h-screen pb-32 relative">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="bg-slate-100 p-1.5 rounded-[20px] flex gap-1">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutDashboard size={18} /> Inventaris
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users size={18} /> User
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <SettingsIcon size={18} /> Pengaturan
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
      <div className="flex flex-col gap-1 mb-6">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-1">Admin Dashboard</p>
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Data & Statistik</h2>
        </div>
      </div>

      {/* DASHBOARD ANALYTICS SECTION */}
      <div className="space-y-4 mb-8">
        {/* Stats Row 1: Primary Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Value Card */}
          <div className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <DollarSign size={80} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Estimasi Nilai Inventaris</p>
            <h3 className="text-2xl font-black text-white">{formatCurrency(totalValue)}</h3>
            <div className="flex items-center gap-2 mt-4">
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                <TrendingUp size={10} /> Active
              </span>
              <span className="text-slate-500 text-[10px] font-bold">Berdasarkan unit tersedia</span>
            </div>
          </div>

          {/* Stok Card */}
          <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
              <Package size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Total Stok</p>
              <h4 className="text-xl font-black text-slate-900">{totalUnits} <span className="text-xs font-medium text-slate-400">Unit</span></h4>
            </div>
          </div>

          {/* Sold Card */}
          <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
              <Target size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Unit Terjual</p>
              <h4 className="text-xl font-black text-slate-900">{soldUnits} <span className="text-xs font-medium text-slate-400">Unit</span></h4>
            </div>
          </div>
        </div>

        {/* Stats Row 2: Engagement */}
        <div className="grid grid-cols-2 gap-3">
          {/* Views Card */}
          <div className="bg-blue-600 rounded-[28px] p-5 shadow-lg shadow-blue-200 text-white relative overflow-hidden">
             <Eye size={40} className="absolute -bottom-2 -right-2 opacity-20" />
             <p className="text-blue-100 text-[10px] font-black uppercase tracking-wider">Dilihat Hari Ini</p>
             <h4 className="text-2xl font-black mt-1">{totalViews}</h4>
             <p className="text-[9px] text-blue-200 mt-1 font-bold">Total views katalog</p>
          </div>

          {/* Pending Card */}
          <div className="bg-amber-500 rounded-[28px] p-5 shadow-lg shadow-amber-200 text-white relative overflow-hidden cursor-pointer active:scale-95 transition-transform" onClick={onOpenNotifications}>
             <ClipboardCheck size={40} className="absolute -bottom-2 -right-2 opacity-20" />
             <p className="text-amber-100 text-[10px] font-black uppercase tracking-wider">Antrian Review</p>
             <h4 className="text-2xl font-black mt-1">{pendingCount}</h4>
             <p className="text-[9px] text-amber-100 mt-1 font-bold">Klik untuk proses</p>
          </div>
        </div>

        {/* Popular Item Card */}
        {topMotor && (
          <div className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="relative">
              <img src={topMotor.images[0]} alt="top" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
              <div className="absolute -top-2 -left-2 w-7 h-7 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                <Trophy size={14} className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-amber-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                🔥 Unit Terpopuler
              </p>
              <h4 className="text-sm font-black text-slate-900 truncate">{topMotor.brand} {topMotor.model}</h4>
              <p className="text-slate-400 text-[11px] font-bold">Dilihat {topMotor.views} kali oleh pengunjung</p>
            </div>
          </div>
        )}

        {/* Health Indicator */}
        <div className="bg-slate-50 rounded-3xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inventory Health</span>
            <span className="text-xs font-black text-slate-900">{availableUnits} Unit Tersedia</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${100 - soldRatio}%` }} />
            <div className="h-full bg-slate-400/30 transition-all duration-1000" style={{ width: `${soldRatio}%` }} />
          </div>
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
        </>
      ) : activeTab === 'users' ? (
        /* USERS MANAGEMENT SECTION */
        <div className="px-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className="flex flex-col gap-1 mb-2">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] px-1">Database User</p>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Pengguna</h2>
          </div>

          {users.length === 0 ? (
            <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-400 font-bold text-sm">Belum ada user yang terdaftar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...users].sort((a, b) => {
                const aPremium = motors.some(m => m.sellerEmail === a.email && m.isPremium) || pendingSubmissions.some(s => s.sellerEmail === a.email && s.isPremium);
                const bPremium = motors.some(m => m.sellerEmail === b.email && m.isPremium) || pendingSubmissions.some(s => s.sellerEmail === b.email && s.isPremium);
                return (bPremium ? 1 : 0) - (aPremium ? 1 : 0);
              }).map((user) => {
                const userMotors = motors.filter(m => m.sellerEmail === user.email);
                const userPending = pendingSubmissions.filter(s => s.sellerEmail === user.email);
                
                const activePremium = userMotors.filter(m => m.isPremium).length;
                const pendingPremium = userPending.filter(s => s.isPremium).length;
                const totalPremium = activePremium + pendingPremium;
                
                const totalListing = userMotors.length + userPending.length;
                const totalRevenue = totalPremium * settings.premiumPrice;

                return (
                  <div key={user.sub} className={`bg-white rounded-[32px] p-5 border shadow-sm hover:shadow-md transition-all ${totalPremium > 0 ? 'border-amber-100 ring-2 ring-amber-50' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={user.picture} 
                          alt={user.name} 
                          className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50"
                          referrerPolicy="no-referrer"
                        />
                        {totalPremium > 0 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white border-2 border-white">
                            <Sparkles size={12} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-black text-slate-900 text-sm truncate pr-2">{user.name}</h4>
                          <div className="flex flex-col items-end">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-wider">
                              {totalListing} Unit
                            </span>
                            {totalPremium > 0 && (
                              <span className="text-[9px] font-black text-amber-600 mt-1 uppercase tracking-tighter">
                                {totalPremium} PREMIUM
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold truncate mb-2">{user.email}</p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                             Bergabung: {new Date(user.firstLogin).toLocaleDateString('id-ID')}
                          </div>
                          {totalRevenue > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                               <DollarSign size={10} /> {formatCurrency(totalRevenue)}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 ml-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* SETTINGS SECTION */
        <div className="px-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                <DollarSign className="text-rose-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Tarif Premium</h3>
                <p className="text-slate-400 text-sm font-medium">Atur biaya pasang iklan eksklusif</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Harga (Rupiah)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-900">Rp</span>
                  <input 
                    type="number" 
                    value={settings.premiumPrice}
                    onChange={(e) => onUpdateSettings({ ...settings, premiumPrice: Number(e.target.value) })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Masa Aktif</h3>
                  <p className="text-slate-400 text-sm font-medium">Berapa hari iklan akan tampil</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Paket Gratis</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={settings.freeDurationDays}
                      onChange={(e) => onUpdateSettings({ ...settings, freeDurationDays: Number(e.target.value) })}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Hari</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Paket Premium</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={settings.premiumDurationDays}
                      onChange={(e) => onUpdateSettings({ ...settings, premiumDurationDays: Number(e.target.value) })}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Hari</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <Landmark className="text-emerald-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Rekening Bank</h3>
                  <p className="text-slate-400 text-sm font-medium">Informasi transfer antar bank</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Bank</label>
                  <input type="text" value={settings.bankName} 
                    onChange={e => onUpdateSettings({...settings, bankName: e.target.value})}
                    placeholder="Contoh: BCA"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nomor Rekening</label>
                  <input type="text" value={settings.bankAccount} 
                    onChange={e => onUpdateSettings({...settings, bankAccount: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Pemilik Rekening</label>
                  <input type="text" value={settings.bankHolder} 
                    onChange={e => onUpdateSettings({...settings, bankHolder: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Smartphone className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">E-Wallet</h3>
                  <p className="text-slate-400 text-sm font-medium">Nomor akun dompet digital</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nomor DANA</label>
                  <input type="text" value={settings.danaNumber} 
                    onChange={e => onUpdateSettings({...settings, danaNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" rotate-0 />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nomor OVO</label>
                  <input type="text" value={settings.ovoNumber} 
                    onChange={e => onUpdateSettings({...settings, ovoNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nomor Gopay</label>
                  <input type="text" value={settings.gopayNumber} 
                    onChange={e => onUpdateSettings({...settings, gopayNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Pengaturan ini akan langsung merubah informasi harga di form pendaftaran penjual dan masa tenggang baru saat Anda menyetujui unit.
              </p>
            </div>
          </div>
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
