import React from 'react';
import { ArrowLeft, Shield, FileText, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { NeliWatermark } from './NeliWatermark';

export type InfoType = 'terms' | 'privacy' | 'contact';

interface InfoPageProps {
  type: InfoType;
  onBackToHome: () => void;
  language: 'sw' | 'en';
}

export const InfoPage: React.FC<InfoPageProps> = ({ type, onBackToHome, language }) => {
  return (
    <div className="relative min-h-screen text-slate-900 pt-20 sm:pt-24 pb-24 animate-fadeIn">
      <NeliWatermark position="backdrop" size="hero-sky" opacity={0.06} glow />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#FF6A00] border border-orange-200/70 shadow-xs transition-all cursor-pointer font-bold text-xs sm:text-sm hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6A00]" />
            <span>{language === 'sw' ? 'Rudi Nyumbani' : 'Back to Home'}</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-orange-200/80 shadow-md space-y-6">
          
          {type === 'terms' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                  {language === 'sw' ? 'Vigezo na Masharti ya Matumizi' : 'Terms of Service'}
                </h1>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                <p>
                  Karibu <strong>NeliPlay Swahili</strong>, tawi maalum la jukwaa la kidijitali la <strong>NeliPlay</strong>. Kwa kutumia tovuti au huduma zetu, unakubali kufuata vigezo na masharti haya:
                </p>
                <h3 className="font-bold text-slate-800 text-sm pt-2">1. Matumizi ya Maudhui</h3>
                <p>
                  Filamu na simulizi zote zinazopatikana kwenye NeliPlay Swahili zimekusudiwa kwa matumizi ya kibinafsi na burudani ya bure kwa watazamaji wote bila ada yoyote ya usajili.
                </p>
                <h3 className="font-bold text-slate-800 text-sm pt-2">2. Haki Miliki na Ushirikiano</h3>
                <p>
                  Chapa za NeliPlay, Baynith Cinema, na mtandao wa washirika (Kinoma Store, Safari Comfort, ZEZE Cosmetology, iTrood) zinalindwa chini ya sheria zinazotumika za Jamhuri ya Muungano wa Tanzania na mikataba ya kimataifa.
                </p>
                <h3 className="font-bold text-slate-800 text-sm pt-2">3. Mabadiliko ya Huduma</h3>
                <p>
                  NeliPlay ina haki ya kuongeza, kubadilisha au kuboresha maudhui na vipengele vya app wakati wowote ili kuhakikisha ubora wa juu wa utazamaji.
                </p>
              </div>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#FF2D87] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                  {language === 'sw' ? 'Sera ya Faragha (Privacy Policy)' : 'Privacy Policy'}
                </h1>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                <p>
                  Ufaragha wa watumiaji wetu ni kipaumbele kikuu cha <strong>NeliPlay</strong> na <strong>NeliPlay Swahili</strong>:
                </p>
                <h3 className="font-bold text-slate-800 text-sm pt-2">1. Data Tunazokusanya</h3>
                <p>
                  Hatuhitaji utengeneze akaunti, wala hatuhifadhi data binafsi kama nenosiri au kadi za benki ili kutazama filamu. App yetu inatumia kumbukumbu ya ndani (local storage) kwa ajili ya vipendwa na mipangilio ya kicheza video tu.
                </p>
                <h3 className="font-bold text-slate-800 text-sm pt-2">2. Vidakuzi na Takwimu</h3>
                <p>
                  Tunatumia mifumo ya kawaida ya takwimu ili kupima idadi ya watazamaji na kuboresha kasi ya seva zetu za utiririshaji wa video.
                </p>
                <h3 className="font-bold text-slate-800 text-sm pt-2">3. Usalama</h3>
                <p>
                  Tovuti inalindwa kwa itifaki za kisasa za usalama (SSL / HTTPS) ili kuhakikisha mawasiliano salama kati ya kifaa chako na seva zetu.
                </p>
              </div>
            </div>
          )}

          {type === 'contact' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                  {language === 'sw' ? 'Wasiliana Nasi (Contact Us)' : 'Contact Us'}
                </h1>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                <p>
                  Tuko tayari kupokea maoni, mapendekezo ya filamu, au maombi ya ushirikiano wa kibiashara:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-1.5">
                    <span className="text-xs font-bold text-[#FF6A00] uppercase block">Barua Pepe (Email)</span>
                    <a href="mailto:baynithcinema@gmail.com" className="font-bold text-slate-900 hover:text-[#FF6A00] transition-colors">
                      baynithcinema@gmail.com
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase block">Ofisi Kuu & Eneo</span>
                    <p className="font-bold text-slate-900">
                      Sinza Makaburini, Igesa Road, Dar es Salaam, Tanzania
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 space-y-2 mt-4">
                  <h4 className="font-bold text-slate-900">Washirika wa Teknolojia na Huduma:</h4>
                  <p>
                    <strong>Kinoma Store:</strong> Duka rasmi la simu na vifaa vya kielektroniki, Sinza Makaburini, Dar es Salaam.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
