import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Tv, 
  ExternalLink, 
  Store, 
  Award, 
  Globe, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Layers,
  HeartHandshake,
  Users
} from 'lucide-react';
import { NeliWatermark } from './NeliWatermark';

interface AboutPageProps {
  onBackToHome: () => void;
  language: 'sw' | 'en';
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToHome, language }) => {
  return (
    <div className="relative min-h-screen text-slate-900 pt-20 sm:pt-24 pb-24 animate-fadeIn">
      {/* Background Watermark */}
      <NeliWatermark position="backdrop" size="hero-sky" opacity={0.06} glow />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#FF6A00] border border-orange-200/70 shadow-xs transition-all cursor-pointer font-bold text-xs sm:text-sm hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6A00]" />
            <span>{language === 'sw' ? 'Rudi Nyumbani' : 'Back to Home'}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-xs font-bold text-[#FF6A00]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2D87]" />
            <span>{language === 'sw' ? 'Wasifu Rasmi' : 'Official Profile'}</span>
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 text-xs font-extrabold text-[#FF6A00]">
            <Layers className="w-4 h-4 text-[#FF2D87]" />
            <span>{language === 'sw' ? 'Mfumo wa NeliPlay na NeliPlay Swahili' : 'NeliPlay & NeliPlay Swahili Ecosystem'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-900 leading-tight">
            {language === 'sw' ? 'Kuhusu ' : 'About '}
            <span className="bg-gradient-to-r from-[#FF6A00] via-[#FF2D87] to-[#0066FF] bg-clip-text text-transparent">
              NeliPlay Swahili
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {language === 'sw'
              ? 'NeliPlay ni jukwaa kuu la burudani ya kidijitali Afrika Mashariki. NeliPlay Swahili ni tawi maalum (sub-app) lililojitolea kutoa filamu zilizotafsiriwa kwa lugha adhimu ya Kiswahili bila malipo yoyote ya usajili.'
              : 'NeliPlay is the flagship digital entertainment ecosystem. NeliPlay Swahili is the specialized streaming branch dedicated to localized Swahili-dubbed cinema and East African entertainment, 100% free without subscription.'}
          </p>
        </div>

        {/* Architecture Hierarchy Card: NeliPlay vs NeliPlay Swahili */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main App: NeliPlay */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-orange-200/70 shadow-lg space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6A00] to-[#FF2D87] flex items-center justify-center text-white shadow-md">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#FF6A00]">
                {language === 'sw' ? 'Jukwaa Kuu (Parent Brand)' : 'Flagship Platform'}
              </span>
              <h2 className="text-2xl font-black font-display text-slate-900">
                NeliPlay
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'sw'
                ? 'NeliPlay ni mtandao mkuu na chapa mama ya kidijitali inayoundwa na Alex Michael Baineth (Baynith Alex) na Nelson Betram Candidus. Inalenga kubadilisha jinsi Waafrika wanavyotazama na kufurahia sinema za kidijitali duniani kote.'
                : 'NeliPlay is the parent brand and primary digital entertainment platform founded by Baynith Alex and Nelson Betram Candidus, redefining how African audiences access cinema globally.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{language === 'sw' ? 'Makao Makuu: Dar es Salaam, Tanzania' : 'HQ: Dar es Salaam, Tanzania'}</span>
            </div>
          </div>

          {/* Sub-App: NeliPlay Swahili */}
          <div className="bg-gradient-to-br from-orange-50/80 via-pink-50/60 to-white backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-[#FF6A00]/40 shadow-lg space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF2D87] to-[#0066FF] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#FF2D87]">
                {language === 'sw' ? 'Tawi la Kiswahili (Sub-App)' : 'Specialized Sub-App'}
              </span>
              <h2 className="text-2xl font-black font-display text-slate-900">
                NeliPlay Swahili
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'sw'
                ? 'Hili ni tawi maalum la NeliPlay linalomilikiwa na kusimamiwa na timu ile ile, likiwa na mkusanyiko wa filamu zote bora zenye simulizi ya Kiswahili, sauti za ma-DJ mashuhuri, na muundo wa kisasa unaofaa simu, Smart TV, na web.'
                : 'The official dedicated branch of NeliPlay streaming Swahili-narrated feature films, DJ dubs, and cultural storytelling, engineered for mobile, TV, and web audiences.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A00]" />
              <span>{language === 'sw' ? 'Bure Kabisa · Hakuna Ada ya Mwezi' : '100% Free · No Subscription Required'}</span>
            </div>
          </div>
        </div>

        {/* Meet the Founders Section */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              {language === 'sw' ? 'Waanzilishi wa NeliPlay (Founders)' : 'Leadership & Founders'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {language === 'sw'
                ? 'Viongozi wenye maono wanaojenga jukwaa la burudani la siku zijazo.'
                : 'The visionary creators driving NeliPlay forward.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Founder 1: Baynith Alex */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-md space-y-4 hover:border-[#FF6A00] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-[#FF6A00] text-[11px] font-black uppercase tracking-wide">
                    {language === 'sw' ? 'Mwanzilishi & Mwenyekiti' : 'Founder & Chairperson'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-2">
                    Baynith Alex
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    (Alex Michael Baineth)
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] p-1 shrink-0 shadow-md">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                    BA
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  {language === 'sw'
                    ? 'Alex Michael Baineth (anayejulikana maarufu kama Baynith Alex) ni mjasiriamali wa kidijitali, mwanateknolojia na mtengeneza maudhui kutoka Tanzania. Ndiye mwanzilishi na mwenyekiti anayeongoza dira kuu ya NeliPlay na chapa zake ikiwemo Baynith Cinema na Baynith Label.'
                    : 'Alex Michael Baineth (Baynith Alex) is a Tanzanian digital entrepreneur, editor, and creator. As Founder & Chairperson of NeliPlay, he guides the strategic vision and streaming architecture of the platform.'}
                </p>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">{language === 'sw' ? 'Elimu & Historia:' : 'Background & Education:'}</p>
                  <p>• Utete High School (Kidato cha 5 & 6, 2026)</p>
                  <p>• College of Business Education (CBE) — Information Technology</p>
                </div>
              </div>

              <a
                href="https://nelinews1.blogspot.com/2026/10/meet-baynith-alex-founder-building.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6A00] hover:text-[#FF2D87] transition-colors pt-2 cursor-pointer"
              >
                <span>{language === 'sw' ? 'Soma Makala Kamili kwenye NeliNews' : 'Read Full Profile on NeliNews'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Founder 2: Nelson Betram Candidus */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-md space-y-4 hover:border-[#0066FF] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0066FF] text-[11px] font-black uppercase tracking-wide">
                    {language === 'sw' ? 'Mwanzilishi Mwenza' : 'Co-Founder'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-2">
                    Nelson Betram Candidus
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    President, Nelify Commercial
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#FF2D87] p-1 shrink-0 shadow-md">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                    NC
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  {language === 'sw'
                    ? 'Nelson Betram Candidus ni mwanzilishi mwenza wa NeliPlay na Rais wa kitengo cha biashara (Nelify Commercial). Jina "NeliPlay" linatokana na uhusiano wake wa karibu na jina lake ("Neli"), likiakisi ushirikiano na ubunifu thabiti.'
                    : 'Nelson Betram Candidus is the Co-Founder of NeliPlay and President of Nelify Commercial. The brand name "NeliPlay" draws inspiration directly from his name, reflecting strong leadership and partnership.'}
                </p>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">{language === 'sw' ? 'Elimu & Utaalamu:' : 'Background & Expertise:'}</p>
                  <p>• College of Business Education (CBE) — Marketing & Commercial Strategy</p>
                  <p>• Uongozi wa Biashara na Masoko ya Kidijitali</p>
                </div>
              </div>

              <a
                href="https://nelinews1.blogspot.com/2026/10/meet-nelson-betram-candidus-co-founder.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0066FF] hover:text-[#FF2D87] transition-colors pt-2 cursor-pointer"
              >
                <span>{language === 'sw' ? 'Soma Makala Kamili kwenye NeliNews' : 'Read Full Profile on NeliNews'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

        {/* NeliPlay Partner Network: Kinoma Store & Partners */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-orange-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-[#FF6A00] uppercase tracking-wider">
                {language === 'sw' ? 'Mtandao wa Ushirikiano' : 'Strategic Alliances'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                NeliPlay Partner Network
              </h2>
            </div>
            <a
              href="https://nelinews1.blogspot.com/2026/10/meet-neliplay-partner-network-kinoma.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              <span>{language === 'sw' ? 'Habari za Washirika' : 'Partner Article'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FF6A00]" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'sw'
              ? 'NeliPlay inashirikiana na chapa na watoa huduma wanaoaminika ili kuimarisha muunganisho wa teknolojia na maisha ya kila siku ya watazamaji wetu:'
              : 'NeliPlay collaborates with leading regional brands to support digital connectivity and customer lifestyle:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Kinoma Store */}
            <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6A00] text-white flex items-center justify-center font-bold shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Kinoma Store</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'sw'
                  ? 'Duka rasmi la simu, vifaa vya kompyuta na huduma za kielektroniki. Lipo Sinza Makaburini kando ya Barabara ya Igesa, Dar es Salaam.'
                  : 'Technology retail partner for smartphones, computer accessories & repair located at Sinza Makaburini, Igesa Road, Dar es Salaam.'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-[#FF6A00] font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Sinza, Dar es Salaam</span>
              </div>
            </div>

            {/* Safari Comfort Furniture */}
            <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF2D87] text-white flex items-center justify-center font-bold shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Safari Comfort</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'sw'
                  ? 'Samani na viti vya kisasa vya sebule na sinema kwa ajili ya starehe ya kutazama filamu nyumbani.'
                  : 'Premium furniture and home cinema comfort partner.'}
              </p>
              <span className="text-[11px] text-[#FF2D87] font-bold block">
                Lifestyle & Comfort
              </span>
            </div>

            {/* ZEZE Cosmetology */}
            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">ZEZE Cosmetology</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'sw'
                  ? 'Bidhaa na huduma za urembo na matunzo ya ngozi zinazoaminika kwa watazamaji wetu.'
                  : 'Beauty, wellness and personal care network partner.'}
              </p>
              <span className="text-[11px] text-purple-600 font-bold block">
                Beauty & Care
              </span>
            </div>

            {/* iTrood */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center font-bold shadow-xs">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">iTrood</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'sw'
                  ? 'Jukwaa la kidijitali la habari, miongozo na usambazaji wa huduma za mtandaoni.'
                  : 'Digital platform partner for media and content discovery.'}
              </p>
              <span className="text-[11px] text-[#0066FF] font-bold block">
                Digital Media
              </span>
            </div>

          </div>
        </div>

        {/* Official Article Links for Web Indexing */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF6A00] uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>{language === 'sw' ? 'Machapisho na Habari Rasmi za Wavuti' : 'Official Press & Articles'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            {language === 'sw' ? 'Soma Zaidi Kuhusu NeliPlay kwenye NeliNews' : 'Read Official Reports on NeliNews'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href="https://nelinews1.blogspot.com/2026/10/meet-founders-behind-neliplay.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-xs font-semibold"
            >
              <span>Meet the Founders Behind NeliPlay</span>
              <ExternalLink className="w-4 h-4 text-[#FF6A00] shrink-0" />
            </a>

            <a
              href="https://nelinews1.blogspot.com/2026/10/meet-baynith-alex-founder-building.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-xs font-semibold"
            >
              <span>Meet Baynith Alex: Founder Building NeliPlay</span>
              <ExternalLink className="w-4 h-4 text-[#FF6A00] shrink-0" />
            </a>

            <a
              href="https://nelinews1.blogspot.com/2026/10/meet-nelson-betram-candidus-co-founder.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-xs font-semibold"
            >
              <span>Meet Nelson Betram Candidus: Co-Founder</span>
              <ExternalLink className="w-4 h-4 text-[#FF6A00] shrink-0" />
            </a>

            <a
              href="https://nelinews1.blogspot.com/2026/10/meet-neliplay-partner-network-kinoma.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-xs font-semibold"
            >
              <span>Meet the NeliPlay Partner Network: Kinoma Store & Partners</span>
              <ExternalLink className="w-4 h-4 text-[#FF6A00] shrink-0" />
            </a>
          </div>

          <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF6A00]" />
              <span>baynithcinema@gmail.com</span>
            </div>
            <span>NeliPlay Swahili · Dar es Salaam, Tanzania</span>
          </div>
        </div>

      </div>
    </div>
  );
};
