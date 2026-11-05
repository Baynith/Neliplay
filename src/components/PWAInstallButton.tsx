import React, { useState } from 'react';
import { Download, Smartphone, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  language: 'sw' | 'en';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide the button
  if (isInstalled) {
    return null;
  }

  // Android / Chromium / Desktop PWA flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title={language === 'sw' ? 'Sakinisha App ya NeliPlay kwenye simu au PC yako' : 'Install NeliPlay App'}
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {language === 'sw' ? 'Sakinisha App' : 'Install App'}
        </span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 hover:bg-orange-100/70 border border-orange-200/80 text-xs font-bold text-[#FF6A00] transition-all cursor-pointer shadow-xs"
          title={language === 'sw' ? 'Sakinisha kwenye iPhone / iPad' : 'Install on iPhone'}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'sw' ? 'Sakinisha App' : 'Install App'}
          </span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-orange-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] flex items-center justify-center text-white">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {language === 'sw' ? 'Sakinisha NeliPlay (iOS)' : 'Install on iPhone / iPad'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6A00] flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                  <span>
                    {language === 'sw'
                      ? 'Bonyeza kitufe cha Shiriki (Share) chini ya browser yako ya Safari.'
                      : 'Tap the Share button in Safari.'}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6A00] flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                  <span>
                    {language === 'sw'
                      ? 'Sogeza chini kisha chagua "Ongeza kwenye Skrini ya Mwanzo" (Add to Home Screen).'
                      : 'Scroll down and tap "Add to Home Screen".'}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6A00] flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                  <span>
                    {language === 'sw'
                      ? 'Bonyeza "Add" juu kulia, na NeliPlay itatokea kama App kamili kwenye simu yako!'
                      : 'Tap "Add" in the top right to install!'}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                {language === 'sw' ? 'Nimeelewa' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
