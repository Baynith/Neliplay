import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: any) => void;
  language: 'sw' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, language }) => {
  return (
    <footer className="relative bg-[#040508] border-t border-white/5 pt-12 pb-24 md:pb-12 overflow-hidden text-slate-400">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-gradient-to-t from-[#FF2D87]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center">
              <img
                src="/assets/aistudio/neliplay_brand_transparent.png"
                alt="NeliPlay"
                className="h-8 object-contain"
              />
            </div>

            <p className="text-sm text-slate-300 font-medium">
              NeliPlay · Your Home of Swahili Entertainment.
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-light">
              {language === 'sw'
                ? 'NeliPlay ni mtandao mkuu wa burudani ya kidijitali. NeliPlay Swahili ni tawi maalum lililojitolea kutoa filamu zote bora zenye simulizi ya Kiswahili bure kabisa.'
                : 'NeliPlay is the flagship digital entertainment ecosystem. NeliPlay Swahili brings you the finest Swahili-dubbed cinema 100% free with no subscription.'}
            </p>

            <div className="pt-1 text-[11px] text-slate-400 space-y-0.5">
              <p>Waanzilishi: <strong>Baynith Alex</strong> & <strong>Nelson Betram Candidus</strong></p>
              <p>Mshirika wa Teknolojia: <strong>Kinoma Store</strong> (Sinza Makaburini, Dar es Salaam)</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              {language === 'sw' ? 'Kurasa Kuu' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Nyumbani' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('movies')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Katalogi ya Filamu' : 'Movies Catalogue'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('genres')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Gundua kwa Aina' : 'Explore Genres'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="text-[#FF6A00] hover:text-[#FF2D87] font-bold transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Kuhusu NeliPlay (About)' : 'About NeliPlay'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Mawasiliano (Contact)' : 'Contact Us'}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Network Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              {language === 'sw' ? 'Taarifa & Sheria' : 'Legal & Trust'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Vigezo na Masharti' : 'Terms of Service'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Sera ya Faragha' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <a
                  href="https://nelinews1.blogspot.com/2026/10/meet-founders-behind-neliplay.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF6A00] transition-colors inline-block"
                >
                  NeliNews Press ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Genres & Features */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              {language === 'sw' ? 'Aina Maarufu' : 'Popular Categories'}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Action', 'Drama', 'Comedy', 'Romance', 'Thriller', 'Science Fiction'].map((g) => (
                <button
                  key={g}
                  onClick={() => onSelectTab('genres')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 pt-2">
              {language === 'sw'
                ? 'Inasaidia vifaa vyote: Simu, Kompyuta na Smart TV.'
                : 'Optimized for mobile, desktop, tablet, and smart TV screens.'}
            </p>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NeliPlay Swahili. Haki zote zimehifadhiwa.</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Imetengenezwa kwa</span>
            <Heart className="w-3.5 h-3.5 text-[#E6007A] fill-current" />
            <span>kwa ajili ya Wapenzi wa Filamu za Kiswahili</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
