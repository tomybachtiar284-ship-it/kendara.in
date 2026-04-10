
import React, { useState } from 'react';
import { Bell, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { ViewType } from '../types';
import { GoogleUser } from '../services/googleAuth';
import GoogleSignInButton from './GoogleSignInButton';

interface NavbarProps {
  currentView: ViewType;
  onToggleView: (view: ViewType) => void;
  isAdmin: boolean;
  onLogout?: () => void;
  favoritesCount?: number;
  googleUser?: GoogleUser | null;
  onGoogleSignOut?: () => void;
  onGoogleSignIn?: (user: GoogleUser) => void;
  onLogoTap?: () => void;
  logoTapCount?: number;
  pendingCount?: number;
  onOpenNotifications?: () => void;
}

const viewTitles: Record<ViewType, { sub: string; title: string }> = {
  visitor: { sub: 'Selamat Datang', title: 'kendara.in bekas palu' },
  search: { sub: 'Temukan Kendaraan', title: 'Jelajah & Filter' },
  favorites: { sub: 'Tersimpan', title: 'Favorit Saya' },
  admin: { sub: 'Dashboard', title: 'Kelola Inventaris' },
};

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onToggleView,
  isAdmin,
  onLogout,
  favoritesCount = 0,
  googleUser,
  onGoogleSignOut,
  onGoogleSignIn,
  onLogoTap,
  logoTapCount = 0,
  pendingCount = 0,
  onOpenNotifications,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);
  const { sub, title } = viewTitles[currentView] ?? viewTitles.visitor;

  // Visual feedback dots for secret tap progress
  const tapDots = logoTapCount > 0 ? logoTapCount : 0;

  return (
    <nav className="relative z-50 pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between py-3 sm:py-4 items-center">

          {/* Brand + Logo (secret tap target) */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <button
                onClick={onLogoTap}
                className="w-11 h-11 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-slate-100 shrink-0 active:scale-90 transition-transform select-none"
                aria-label="Logo"
              >
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </button>

              {/* Tap progress indicator dots — visible only while tapping */}
              {tapDots > 0 && (
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i <= tapDots ? 'bg-blue-500 scale-110' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              )}

              {/* Admin badge shown discreetly when in admin mode */}
              {isAdmin && currentView === 'admin' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                  <ShieldCheck size={8} className="text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider truncate">
                {googleUser && currentView === 'visitor'
                  ? `Halo, ${googleUser.name.split(' ')[0]}!`
                  : sub}
              </span>
              <span className="text-[17px] font-black text-slate-900 tracking-tight leading-snug truncate">{title}</span>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Admin notifications bell — only shown when inside admin view */}
            {isAdmin && currentView === 'admin' && (
              <>
                <button 
                  onClick={onOpenNotifications}
                  className="relative flex items-center justify-center p-2.5 rounded-full bg-white shadow-sm text-slate-700 active:scale-95 transition-transform"
                >
                  <Bell size={20} strokeWidth={2.5} />
                  {pendingCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center p-2.5 rounded-full bg-white text-rose-500 shadow-sm"
                  title="Keluar dari Admin"
                >
                  <LogOut size={20} strokeWidth={2.5} />
                </button>
              </>
            )}

            {/* Google User Avatar / Sign-In — only on public views */}
            {currentView !== 'admin' && (
              <>
                {googleUser ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 bg-white rounded-2xl pl-1 pr-3 py-1 shadow-sm border border-slate-100 active:scale-95 transition-transform"
                    >
                      <img
                        src={googleUser.picture}
                        alt={googleUser.name}
                        className="w-8 h-8 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-black text-slate-800 max-w-[70px] truncate">
                        {googleUser.name.split(' ')[0]}
                      </span>
                      <ChevronDown size={12} className="text-slate-400" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 w-52 z-50">
                        <div className="flex items-center gap-3 p-2 border-b border-slate-50 mb-2">
                          <img
                            src={googleUser.picture}
                            alt={googleUser.name}
                            className="w-10 h-10 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate">{googleUser.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{googleUser.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { onGoogleSignOut?.(); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2 text-rose-500 text-sm font-bold py-2 px-2 rounded-xl hover:bg-rose-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Keluar dari Google
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setShowGoogleSignIn(!showGoogleSignIn)}
                      className="flex items-center gap-1.5 bg-white rounded-2xl px-3 py-2 shadow-sm border border-slate-100 text-xs font-black text-slate-700 active:scale-95 transition-transform"
                    >
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                      Masuk
                    </button>

                    {showGoogleSignIn && onGoogleSignIn && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 w-72">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Masuk dengan Google</p>
                        <GoogleSignInButton onSignIn={(user) => { onGoogleSignIn(user); setShowGoogleSignIn(false); }} />
                        <p className="text-[10px] text-slate-400 text-center mt-3 leading-relaxed">
                          Dengan masuk, Anda menyetujui penggunaan data profil Google Anda di kendara.in
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdowns */}
      {(showUserMenu || showGoogleSignIn) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowUserMenu(false); setShowGoogleSignIn(false); }}
        />
      )}
    </nav>
  );
};

export default Navbar;
