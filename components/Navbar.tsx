
import React, { useState } from 'react';
import { Bell, LogOut, ChevronDown } from 'lucide-react';
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
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);
  const { sub, title } = viewTitles[currentView] ?? viewTitles.visitor;

  return (
    <nav className="relative z-50 pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between py-3 sm:py-4 items-center">

          {/* Brand + Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
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
            {/* Admin logout button */}
            {isAdmin && currentView === 'admin' && (
              <>
                <button className="relative flex items-center justify-center p-2.5 rounded-full bg-white shadow-sm text-slate-700">
                  <Bell size={20} strokeWidth={2.5} />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center p-2.5 rounded-full bg-white text-rose-500 shadow-sm"
                  title="Logout Admin"
                >
                  <LogOut size={20} strokeWidth={2.5} />
                </button>
              </>
            )}

            {/* Google User Avatar / Sign-In button */}
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

                    {/* Dropdown menu */}
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

                    {/* Google Sign-In popup */}
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

      {/* Overlay to close dropdown */}
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
