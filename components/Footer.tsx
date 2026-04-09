
import React from 'react';
import { MapPin, Phone, Instagram, Facebook, Clock, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">Kendara.in <span className="text-red-600">Bekas Palu</span></h2>
            <p className="text-sm leading-relaxed mb-8">
              Pusat jual beli motor bekas terpercaya di Kota Palu. Menyediakan berbagai merk motor dengan kondisi terjamin dan surat-surat lengkap.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Navigasi</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">Beranda</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Unit Ready</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Testimoni</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Hubungi Kami</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Tentang Kami</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hubungi Kami</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-red-600 flex-shrink-0" />
                <span>Jl. I Gusti Ngurah Rai, Palu, Sulawesi Tengah</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-red-600" />
                <span>+62 822-1234-5678</span>
              </li>
              <li className="flex items-center">
                <Clock size={18} className="mr-3 text-red-600" />
                <span>Senin - Sabtu (08:00 - 18:00)</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Lokasi</h3>
            <div className="rounded-xl overflow-hidden h-40 bg-slate-800 relative">
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-xs">Google Maps Preview</span>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Kendara.in Bekas Palu. All rights reserved. Managed by Kendara.in Admin Team.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
