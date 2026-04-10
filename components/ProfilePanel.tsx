
import React from 'react';
import { Motorcycle, PendingSubmission } from '../types';
import { GoogleUser } from '../services/googleAuth';
import { User, Package, Clock, XCircle, Trash2, CheckCircle, ExternalLink, AlertCircle, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import MotorCard from './MotorCard';

interface ProfilePanelProps {
  motors: Motorcycle[];
  pendingSubmissions: PendingSubmission[];
  googleUser: GoogleUser | null;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  onDeleteMotor: (id: string) => void;
  onDeleteSubmission: (id: string) => void;
  onUpdateStatus: (id: string, status: 'Tersedia' | 'Terjual') => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  motors,
  pendingSubmissions,
  googleUser,
  onToggleFavorite,
  favorites,
  onDeleteMotor,
  onDeleteSubmission,
  onUpdateStatus,
}) => {
  if (!googleUser) {
    return (
      <div className="p-8 text-center mt-20">
        <div className="w-20 h-20 bg-slate-100 rounded-[30px] flex items-center justify-center mx-auto mb-6">
          <User size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Belum Masuk</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[240px] mx-auto">
          Silakan masuk dengan akun Google Anda untuk mengelola iklan dan melihat riwayat pengajuan.
        </p>
      </div>
    );
  }

  const myActiveMotors = motors.filter(m => m.sellerEmail === googleUser.email);
  const myPendingSubmissions = pendingSubmissions.filter(s => s.sellerEmail === googleUser.email);
  
  const pendingCount = myPendingSubmissions.filter(s => s.status === 'pending').length;
  const approvedCount = myActiveMotors.length;
  const rejectedCount = myPendingSubmissions.filter(s => s.status === 'rejected').length;

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="px-6 pt-6 mb-8">
        <div className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -translate-x-12 -translate-y-12 blur-3xl -z-0" />
          
          <div className="flex items-center gap-5 relative z-10">
            <img 
              src={googleUser.picture} 
              alt={googleUser.name} 
              className="w-20 h-20 rounded-[28px] object-cover ring-4 ring-slate-50 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <h2 className="text-xl font-black text-slate-900 truncate">{googleUser.name}</h2>
              <p className="text-sm text-slate-400 font-medium truncate">{googleUser.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">Penjual</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-500">
              <CheckCircle size={20} />
            </div>
            <p className="text-xl font-black text-slate-900 leading-none">{approvedCount}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Tayang</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-amber-500">
              <Clock size={20} />
            </div>
            <p className="text-xl font-black text-slate-900 leading-none">{pendingCount}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Pending</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-rose-500">
              <XCircle size={20} />
            </div>
            <p className="text-xl font-black text-slate-900 leading-none">{rejectedCount}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Ditolak</p>
          </div>
        </div>
      </div>

      {/* Active Listings Section */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h3 className="text-lg font-black text-slate-900">Iklan Tayang</h3>
            <p className="text-xs text-slate-400 font-medium">Unit yang sedang aktif di katalog</p>
          </div>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">{myActiveMotors.length} Unit</span>
        </div>

        {myActiveMotors.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[32px] p-10 text-center">
            <Package className="text-slate-200 mx-auto mb-3" size={32} />
            <p className="text-slate-400 text-xs font-bold">Belum ada iklan yang tayang</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myActiveMotors.map(motor => (
              <div key={motor.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm group">
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={motor.images[0]} alt={motor.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-slate-900 text-sm truncate pr-2">{motor.brand} {motor.model}</h4>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${motor.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {motor.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">Rp {motor.price.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                        onClick={() => onUpdateStatus(motor.id, motor.status === 'Tersedia' ? 'Terjual' : 'Tersedia')}
                        className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-black transition-all active:scale-95"
                      >
                        {motor.status === 'Tersedia' ? 'Tandai Terjual' : 'Tandai Tersedia'}
                      </button>
                      <button 
                        onClick={() => onDeleteMotor(motor.id)}
                        className="w-10 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-100 transition-all active:scale-95"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                      <BarChart3 size={10} /> {motor.views || 0} Dilihat
                    </div>
                  </div>
                  {motor.isPremium && (
                    <span className="text-[8px] font-black text-amber-600 flex items-center gap-0.5">
                      <TrendingUp size={10} /> PREMIUM AKTIF
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Submissions Section */}
      <div className="px-6">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h3 className="text-lg font-black text-slate-900">Status Pengajuan</h3>
            <p className="text-xs text-slate-400 font-medium">Riwayat pengajuan iklan Anda</p>
          </div>
        </div>

        {myPendingSubmissions.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[32px] p-10 text-center">
            <Clock className="text-slate-200 mx-auto mb-3" size={32} />
            <p className="text-slate-400 text-xs font-bold">Belum ada riwayat pengajuan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myPendingSubmissions.map(submission => (
              <div key={submission.id} className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm relative overflow-hidden">
                {submission.status === 'pending' && <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />}
                {submission.status === 'rejected' && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />}
                {submission.status === 'approved' && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}

                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={submission.images[0]} alt={submission.model} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm truncate pr-2">{submission.brand} {submission.model}</h4>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                        submission.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        submission.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {submission.status === 'pending' ? 'PENDING' : submission.status === 'approved' ? 'TAYANG' : 'DITOLAK'}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 italic">
                      Diajukan pada {new Date(submission.submittedAt).toLocaleDateString('id-ID')}
                    </p>
                    
                    {submission.status === 'rejected' && (
                       <div className="mt-3 p-3 bg-rose-50 rounded-2xl flex items-start gap-2 border border-rose-100">
                        <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-rose-600 leading-relaxed">
                          Foto kurang jelas atau data tidak lengkap. Silakan ajukan ulang dengan data yang benar.
                        </p>
                      </div>
                    )}

                    {submission.status === 'pending' && (
                      <div className="mt-3 flex gap-2">
                        <button 
                          onClick={() => onDeleteSubmission(submission.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold hover:bg-slate-100 transition-all"
                        >
                          <Trash2 size={12} /> Batalkan Pengajuan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePanel;
