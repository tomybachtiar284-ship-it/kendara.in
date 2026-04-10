
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import AdminPanel from './components/AdminPanel';
import FavoritesPanel from './components/FavoritesPanel';
import SearchPanel from './components/SearchPanel';
import SellModal from './components/SellModal';
import NotificationPanel from './components/NotificationPanel';
import { Motorcycle, PendingSubmission, ViewType } from './types';
import { Key, X, Home, Heart, Search } from 'lucide-react';
import { GoogleUser, initGoogleSignIn, googleSignOut } from './services/googleAuth';

const INITIAL_MOTORS: Motorcycle[] = [
  {
    id: '1',
    brand: 'Honda',
    model: 'Vario 160 ABS',
    year: 2023,
    price: 24500000,
    mileage: '5rb - 7rb',
    condition: 'Mulus',
    images: ['https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1974&auto=format&fit=crop'],
    description: 'Unit sangat istimewa, mulus 99%. Servis rutin AHASS, ban masih tebal semua. Tangan pertama dari baru, surat lengkap Palu.',
    status: 'Tersedia',
    location: 'Palu',
    category: 'Motor',
    sellerPhone: '6281234567890',
    createdAt: Date.now()
  },
  {
    id: '2',
    brand: 'Yamaha',
    model: 'NMAX 155 Connected',
    year: 2022,
    price: 28900000,
    mileage: '12rb - 15rb',
    condition: 'Mulus',
    images: ['https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=2070&auto=format&fit=crop'],
    description: 'Pajak hidup panjang, body mulus terawat. Mesin halus standar pabrik. Siap turing jauh!',
    status: 'Tersedia',
    location: 'Palu',
    category: 'Motor',
    sellerPhone: '6281234567890',
    createdAt: Date.now() - 86400000
  },
  {
    id: '3',
    brand: 'Kawasaki',
    model: 'Ninja ZX-25R',
    year: 2021,
    price: 92000000,
    mileage: '3rb - 4rb',
    condition: 'Modifikasi',
    images: ['https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop'],
    description: 'Modifikasi tipis-tipis (knalpot Akrapovic full system, ban Pirelli). Unit pajangan jarang dipakai.',
    status: 'Terjual',
    location: 'Palu',
    category: 'Motor',
    sellerPhone: '6281234567890',
    createdAt: Date.now() - 172800000
  },
  {
    id: '4',
    brand: 'Honda',
    model: 'Scoopy Prestige',
    year: 2022,
    price: 19800000,
    mileage: '8rb - 10rb',
    condition: 'Mulus',
    images: ['https://images.unsplash.com/photo-1616150242138-b7650f959682?q=80&w=2069&auto=format&fit=crop'],
    description: 'Warna favorit White, Smart Key System berfungsi normal. Motor bersih luar dalam, rawatan AHASS.',
    status: 'Tersedia',
    location: 'Palu',
    category: 'Motor',
    sellerPhone: '6281234567890',
    createdAt: Date.now() - 259200000
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('visitor');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>(() => {
    try { return JSON.parse(localStorage.getItem('kip_pending_submissions') || '[]'); } catch { return []; }
  });
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try { return JSON.parse(localStorage.getItem('kip_google_user') || 'null'); } catch { return null; }
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('kip_favorites') || '[]'); } catch { return []; }
  });

  const [motors, setMotors] = useState<Motorcycle[]>(() => {
    const saved = localStorage.getItem('jmp_inventory');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => {
        if (m.imageUrl && !m.images) { m.images = [m.imageUrl]; delete m.imageUrl; }
        if (!m.location) m.location = 'Palu';
        if (!m.sellerPhone) m.sellerPhone = '6281234567890';
        if (!m.category) m.category = 'Motor';
        return m;
      });
    }
    return INITIAL_MOTORS;
  });

  useEffect(() => {
    localStorage.setItem('jmp_inventory', JSON.stringify(motors));
  }, [motors]);

  useEffect(() => {
    localStorage.setItem('kip_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('kip_pending_submissions', JSON.stringify(pendingSubmissions));
  }, [pendingSubmissions]);

  useEffect(() => {
    if (googleUser) {
      localStorage.setItem('kip_google_user', JSON.stringify(googleUser));
    } else {
      localStorage.removeItem('kip_google_user');
    }
  }, [googleUser]);

  // Init Google Sign-In auto-prompt on mount
  useEffect(() => {
    if (!googleUser) {
      initGoogleSignIn((user) => {
        setGoogleUser(user);
      });
    }
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleToggleView = (newView: ViewType) => {
    if (newView === 'admin' && !isAdmin) { setShowLoginModal(true); return; }
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdmin(true);
    setShowLoginModal(false);
    setView('admin');
  };

  const handleLogout = () => { setIsAdmin(false); setView('visitor'); };
  const handleGoogleSignOut = () => {
    googleSignOut();
    setGoogleUser(null);
  };

  const addMotor = (motorData: Omit<Motorcycle, 'id' | 'createdAt'>) => {
    setMotors([{ ...motorData, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }, ...motors]);
  };
  const updateMotor = (updatedMotor: Motorcycle) => setMotors(motors.map(m => m.id === updatedMotor.id ? updatedMotor : m));
  const deleteMotor = (id: string) => { if (confirm('Hapus unit ini dari katalog?')) setMotors(motors.filter(m => m.id !== id)); };
  const updateStatus = (id: string, status: 'Tersedia' | 'Terjual') => setMotors(motors.map(m => m.id === id ? { ...m, status } : m));

  // Pending submissions handlers
  const handleNewSubmission = (submission: PendingSubmission) => {
    setPendingSubmissions(prev => [submission, ...prev]);
    setShowSellModal(false);
  };

  const handleApprove = (id: string) => {
    const sub = pendingSubmissions.find(s => s.id === id);
    if (!sub) return;
    // Add to motors catalog
    const newMotor: Motorcycle = {
      id: Math.random().toString(36).substr(2, 9),
      brand: sub.brand,
      model: sub.model,
      year: sub.year,
      price: sub.price,
      mileage: sub.mileage,
      condition: sub.condition,
      images: sub.images,
      description: sub.description,
      status: 'Tersedia',
      location: sub.location,
      sellerPhone: sub.sellerPhone,
      category: sub.category,
      createdAt: Date.now(),
    };
    setMotors(prev => [newMotor, ...prev]);
    setPendingSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  };

  const handleReject = (id: string) => {
    setPendingSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
  };

  // Secret admin access: tap logo 3x
  const [logoTapCount, setLogoTapCount] = useState(0);
  const logoTapTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = () => {
    const next = logoTapCount + 1;
    setLogoTapCount(next);
    if (logoTapTimer.current) clearTimeout(logoTapTimer.current);
    if (next >= 3) {
      setLogoTapCount(0);
      if (isAdmin) {
        setView('admin');
      } else {
        setShowLoginModal(true);
      }
    } else {
      logoTapTimer.current = setTimeout(() => setLogoTapCount(0), 1500);
    }
  };

  // Only public nav items — admin access is via secret logo tap
  const navItems: { view: ViewType; icon: React.ReactNode; label: string }[] = [
    { view: 'visitor', icon: <Home size={20} />, label: 'Beranda' },
    { view: 'search', icon: <Search size={20} />, label: 'Jelajah' },
    { view: 'favorites', icon: <Heart size={20} />, label: 'Favorit' },
  ];

  return (
    <div className="max-w-[480px] mx-auto bg-[#F8F9FA] min-h-screen relative flex flex-col overflow-x-hidden shadow-[0_0_80px_rgba(0,0,0,0.15)] border-x border-slate-200/50">
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#E0F2FE] to-transparent -z-0 pointer-events-none" />

      <Navbar
        currentView={view}
        onToggleView={handleToggleView}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        favoritesCount={favorites.length}
        googleUser={googleUser}
        onGoogleSignOut={handleGoogleSignOut}
        onGoogleSignIn={setGoogleUser}
        onLogoTap={handleLogoTap}
        logoTapCount={logoTapCount}
        pendingCount={pendingSubmissions.filter(s => s.status === 'pending').length}
        onOpenNotifications={() => setShowNotificationPanel(true)}
      />

      <main className="flex-1 z-10">
        {view === 'visitor' && (
          <Catalog 
            motors={motors} 
            favorites={favorites} 
            onToggleFavorite={handleToggleFavorite} 
            onOpenSellModal={() => setShowSellModal(true)}
          />
        )}
        {view === 'search' && (
          <SearchPanel 
            motors={motors} 
            favorites={favorites} 
            onToggleFavorite={handleToggleFavorite} 
            googleUser={googleUser}
          />
        )}
        {view === 'favorites' && (
          <FavoritesPanel 
            motors={motors} 
            favorites={favorites} 
            onToggleFavorite={handleToggleFavorite} 
            googleUser={googleUser}
          />
        )}
        {view === 'admin' && (
          <AdminPanel
            motors={motors}
            onAddMotor={addMotor}
            onUpdateMotor={updateMotor}
            onDeleteMotor={deleteMotor}
            onUpdateStatus={updateStatus}
            pendingCount={pendingSubmissions.filter(s => s.status === 'pending').length}
            onOpenNotifications={() => setShowNotificationPanel(true)}
          />
        )}
      </main>

      {/* Bottom Navigation Bar — hidden in admin view */}
      {view !== 'admin' && (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[430px] bg-slate-900/95 backdrop-blur-xl border border-white/10 z-50 rounded-[32px] shadow-2xl py-2 px-4">
        <div className="flex justify-around items-center">
          {navItems.map(item => {
            const isActive = view === item.view;
            const showBadge = item.view === 'favorites' && favorites.length > 0;
            return (
              <button
                key={item.view}
                onClick={() => handleToggleView(item.view)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all relative ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-[9px] font-bold transition-all ${isActive ? 'text-white' : 'text-slate-600'}`}>
                  {item.label}
                </span>
                {isActive && <div className="absolute -bottom-0.5 w-1 h-1 bg-white rounded-full" />}
                {showBadge && !isActive && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        // ... (login modal content)
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setShowLoginModal(false)} />
          <div className="bg-white w-full max-w-[480px] rounded-t-[40px] shadow-2xl p-8 relative animate-in slide-in-from-bottom-full duration-500 ease-out z-[210]">
            {/* Drag handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 cursor-pointer" onClick={() => setShowLoginModal(false)} />
            {/* X close button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-8 right-8 w-9 h-9 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
            >
              <X size={18} className="text-slate-600" />
            </button>
            <div className="text-center mb-8">
              <div className="bg-slate-900 w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Key className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Admin Area</h2>
              <p className="text-slate-500 mt-1">Silakan masuk untuk mengelola katalog</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5 pb-8">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Username</label>
                <input type="text" defaultValue="admin" required className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                <input type="password" defaultValue="123456" required className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 font-medium" />
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-[0.98] shadow-xl mt-4">
                Masuk
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <SellModal onClose={() => setShowSellModal(false)} onSubmit={handleNewSubmission} />
      )}

      {/* Notification Panel (admin only) */}
      {showNotificationPanel && (
        <NotificationPanel
          submissions={pendingSubmissions}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setShowNotificationPanel(false)}
        />
      )}
    </div>
  );
};

export default App;
