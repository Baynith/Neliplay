import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Minimize, 
  Settings, 
  Subtitles, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle,
  ThumbsUp,
  Share2,
  Bookmark,
  Check,
  Film,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Expand,
  CheckCircle2
} from 'lucide-react';
import { Movie } from '../types/movie';
import { optimizeTmdbImage } from '../utils/imageOptimizer';

interface NeliPlayerProps {
  movie: Movie;
  onClose: () => void;
  language: 'sw' | 'en';
  allMovies?: Movie[];
  onSelectMovie?: (movie: Movie) => void;
}

export const NeliPlayer: React.FC<NeliPlayerProps> = ({
  movie,
  onClose,
  language,
  allMovies = [],
  onSelectMovie,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Settings & Captions state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCaptionsOpen, setIsCaptionsOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedSubtitle, setSelectedSubtitle] = useState<'Off' | 'Kiswahili' | 'English'>('Kiswahili');

  // Multi-stream fallbacks with Bunny Stream support:
  // 1. Direct Bunny CDN with no-referrer policy
  // 2. Server proxy /api/stream?url=... that strips Referer/Origin headers
  // 3. Backup URL & High Availability CDN streams
  const directUrl = movie.videoUrl;
  const proxyUrl = directUrl && directUrl.startsWith('https://') ? `/api/stream?url=${encodeURIComponent(directUrl)}` : '';
  const sources = [
    directUrl,
    proxyUrl,
    movie.backupVideoUrl,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  ].filter(Boolean) as string[];

  // Recommended movies from catalogue (matching user reference images)
  const recommendedMovies = allMovies
    .filter(m => m.id !== movie.id)
    .slice(0, 18);

  // Dynamic sample subtitles
  const subtitleLines = {
    Kiswahili: [
      { start: 0, end: 5, text: `NeliPlay Swahili: "${movie.title}"` },
      { start: 6, end: 14, text: 'Simulizi rasmi ya Kiswahili - Burudani ya kweli nyumbani.' },
      { start: 15, end: 25, text: 'Ushujaa, heshima na ukweli ndio nguzo za safari hii.' },
      { start: 26, end: 40, text: 'Kumbuka kuwa hakuna jaribu lisilo na mwisho.' },
      { start: 41, end: 58, text: 'Haki itadhihiri, na giza lote litatoweka.' },
    ],
    English: [
      { start: 0, end: 5, text: `NeliPlay Swahili presents: "${movie.title}"` },
      { start: 6, end: 14, text: 'Swahili Dubbed - Your home of Swahili entertainment.' },
      { start: 15, end: 25, text: 'Courage, honor, and truth are the foundations of this journey.' },
      { start: 26, end: 40, text: 'Remember that every trial will eventually pass.' },
      { start: 41, end: 58, text: 'Justice will prevail, and darkness will fade.' },
    ],
  };

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isSettingsOpen && !isCaptionsOpen) {
          setShowControls(false);
        }
      }, 3500);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      resetControlsTimer();
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        skip(10);
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        skip(-10);
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 't') {
        setIsTheaterMode(prev => !prev);
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else {
          setIsSettingsOpen(false);
          setIsCaptionsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFullscreen, isMuted, isSettingsOpen, isCaptionsOpen]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (isNowFullscreen) {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch {}
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasError(false);
      }).catch((err) => {
        console.warn('Playback error:', err);
        handleStreamError();
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      Math.max(videoRef.current.currentTime + seconds, 0),
      duration || 1000
    );
    resetControlsTimer();
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    if (videoRef.current) {
      videoRef.current.muted = newMute;
    }
    resetControlsTimer();
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch {}
      }).catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
    resetControlsTimer();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleStreamError = () => {
    console.warn(`Stream source index ${currentSourceIndex} failed:`, sources[currentSourceIndex]);
    if (currentSourceIndex < sources.length - 1) {
      // Automatically switch to next stream source (e.g. proxyUrl) seamlessly
      const nextIndex = currentSourceIndex + 1;
      setCurrentSourceIndex(nextIndex);
      setIsLoading(true);
      setHasError(false);
      if (videoRef.current) {
        videoRef.current.src = sources[nextIndex];
        videoRef.current.load();
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        }).catch(() => {
          // Will cascade to next on error
        });
      }
    } else {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage(
        language === 'sw'
          ? 'Kiunganishi cha video kimezuiwa na seva ya video. Bofya kitufe cha chini kujaribu chanzo mbadala.'
          : 'Unable to stream directly from video server. Click below to try backup.'
      );
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    const nextIndex = (currentSourceIndex + 1) % sources.length;
    setCurrentSourceIndex(nextIndex);
    if (videoRef.current) {
      videoRef.current.src = sources[nextIndex];
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(err => {
        console.warn('Manual retry error:', err);
        setIsLoading(false);
        setHasError(true);
      });
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const currentSubtitle = selectedSubtitle !== 'Off'
    ? subtitleLines[selectedSubtitle]?.find(
        line => currentTime >= line.start && currentTime <= line.end
      )?.text
    : null;

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-20 animate-fadeIn">
      <div className="max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Back Navigation Bar */}
        <div className="py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#FF6A00] border border-orange-200/80 shadow-xs transition-all cursor-pointer font-bold text-xs sm:text-sm hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6A00]" />
            <span>{language === 'sw' ? 'Rudi Nyumbani' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200/60 text-xs font-bold text-[#FF6A00]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2D87]" />
              <span>NeliPlay Swahili HD</span>
            </span>
          </div>
        </div>

        {/* YouTube-Style Main Layout: Video on Left, Recommendations on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Player + Title + Channel + Synopsis */}
          <div className={`${isTheaterMode ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-9'} space-y-4`}>
            
            {/* 1. Cinema 16:9 Video Player Box with NeliPlay Branding & YouTube Style */}
            <div
              ref={containerRef}
              onMouseMove={resetControlsTimer}
              onClick={resetControlsTimer}
              className={`relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl select-none group/player ${
                isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''
              }`}
            >
              {/* HTML5 Video Stream with Referrer Policy for Bunny CDN compatibility */}
              <video
                ref={videoRef}
                src={sources[currentSourceIndex]}
                autoPlay
                playsInline
                // @ts-expect-error referrerPolicy is standard HTMLVideoElement property
                referrerPolicy="no-referrer"
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                    setIsLoading(false);
                    setHasError(false);
                  }
                }}
                onWaiting={() => setIsLoading(true)}
                onPlaying={() => {
                  setIsLoading(false);
                  setIsPlaying(true);
                  setHasError(false);
                }}
                onError={handleStreamError}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Top-Right NeliPlay Signature Watermark Badge (Non-obstructive) */}
              <div className="absolute top-4 right-4 z-20 pointer-events-none select-none flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-75 hover:opacity-100 transition-opacity">
                <img
                  src="/assets/aistudio/neliplay_brand_transparent.png"
                  alt="NeliPlay"
                  className="h-4 sm:h-5 object-contain"
                />
              </div>

              {/* Subtitles Overlay */}
              {currentSubtitle && (
                <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 max-w-xl px-4 py-2 rounded-lg bg-black/85 backdrop-blur-md text-center text-xs sm:text-base font-semibold text-white pointer-events-none transition-all shadow-xl">
                  {currentSubtitle}
                </div>
              )}

              {/* Center Play Button with NeliPlay Signature Glow Ring */}
              {!isPlaying && !isLoading && !hasError && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[1px] cursor-pointer"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF2D87] to-[#0066FF] p-0.5 shadow-[0_0_35px_rgba(255,106,0,0.7)] transform hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current translate-x-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Branded Loading Spinner */}
              {isLoading && !hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs pointer-events-none">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-white/10 border-t-[#FF6A00] animate-spin mb-3 shadow-[0_0_25px_rgba(255,106,0,0.6)]" />
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/aistudio/neliplay_brand_transparent.png"
                      alt="NeliPlay"
                      className="h-3.5 object-contain opacity-80"
                    />
                    <span className="text-xs font-semibold text-white/90">
                      {language === 'sw' ? 'Inapakia simulizi ya Kiswahili...' : 'Loading Swahili movie stream...'}
                    </span>
                  </div>
                </div>
              )}

              {/* Error Screen with Resilient Fallback */}
              {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center z-40">
                  <AlertCircle className="w-12 h-12 text-[#FF6A00] mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">
                    {language === 'sw' ? 'Hitilafu ya Kucheza Video' : 'Playback Issue'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mb-4">
                    {errorMessage}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Jaribu Seva Mbadala' : 'Try Backup Source'}</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 cursor-pointer"
                    >
                      {language === 'sw' ? 'Rudi Nyuma' : 'Back'}
                    </button>
                  </div>
                </div>
              )}

              {/* CLEAN YOUTUBE-STYLE CONTROL BAR WITH NELIPLAY SIGNATURE BRANDING */}
              <div
                className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-8 pb-3 px-3 sm:px-5 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* 1. SIMPLE YOUTUBE TIMELINE WITH NELIPLAY SIGNATURE SUNSET GRADIENT */}
                <div
                  ref={progressBarRef}
                  onClick={handleSeek}
                  className="relative group/scrub w-full h-2 cursor-pointer py-1 flex items-center mb-2"
                >
                  {/* Track Background */}
                  <div className="relative w-full h-1 group-hover/scrub:h-1.5 bg-white/20 rounded-full transition-all overflow-hidden">
                    {/* Buffer / Loaded progress */}
                    <div className="absolute top-0 bottom-0 left-0 bg-white/35 w-[75%]" />
                    {/* Played progress in NeliPlay signature Sunset Orange-Pink */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#FF6A00] via-[#FF2D87] to-[#FF4500]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Scrubber Playhead Dot (YouTube style with NeliPlay glow) */}
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] ring-2 ring-white shadow-[0_0_10px_rgba(255,106,0,0.9)] -translate-x-1/2 scale-0 group-hover/scrub:scale-100 transition-transform pointer-events-none"
                    style={{ left: `${progressPercent}%` }}
                  />
                </div>

                {/* 2. CONTROLS STRIP */}
                <div className="flex items-center justify-between text-white">
                  
                  {/* Left Controls: Prev, Play/Pause, Next, Volume, Time */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => skip(-10)}
                      className="text-white/80 hover:text-white p-1 transition-colors cursor-pointer"
                      title="Rudi Nyuma 10s / Rewind 10s"
                    >
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="text-white p-1 hover:scale-110 transition-transform cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                      )}
                    </button>

                    <button
                      onClick={() => skip(10)}
                      className="text-white/80 hover:text-white p-1 transition-colors cursor-pointer"
                      title="Mbele 10s / Forward 10s"
                    >
                      <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Volume with hover slider */}
                    <div className="flex items-center gap-1.5 group/vol">
                      <button
                        onClick={toggleMute}
                        className="text-white/80 hover:text-white p-1 cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF2D87]" />
                        ) : (
                          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-14 sm:w-18 h-1 bg-white/30 rounded appearance-none cursor-pointer accent-[#FF6A00]"
                      />
                    </div>

                    {/* Time display: 1:15 / 1:45:00 */}
                    <div className="text-[11px] sm:text-xs text-white/90 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span className="text-white/40 mx-1">/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Right Controls: Subtitles, Settings, Theater, Fullscreen */}
                  <div className="flex items-center gap-2 sm:gap-3.5">
                    {/* Subtitles Button */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsCaptionsOpen(!isCaptionsOpen);
                          setIsSettingsOpen(false);
                        }}
                        className={`p-1 cursor-pointer transition-colors ${
                          selectedSubtitle !== 'Off' ? 'text-[#FF6A00] font-bold' : 'text-white/80 hover:text-white'
                        }`}
                        title="Manukuu / Subtitles"
                      >
                        <Subtitles className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      {isCaptionsOpen && (
                        <div className="absolute bottom-10 right-0 w-44 rounded-xl bg-black/95 border border-white/15 p-2 shadow-2xl text-xs space-y-1">
                          <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400">
                            {language === 'sw' ? 'Manukuu' : 'Subtitles'}
                          </div>
                          {(['Off', 'Kiswahili', 'English'] as const).map((sub) => (
                            <button
                              key={sub}
                              onClick={() => {
                                setSelectedSubtitle(sub);
                                setIsCaptionsOpen(false);
                              }}
                              className={`w-full text-left px-2 py-1 rounded flex items-center justify-between cursor-pointer ${
                                selectedSubtitle === sub ? 'bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                              }`}
                            >
                              <span>{sub}</span>
                              {selectedSubtitle === sub && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Settings Button */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsSettingsOpen(!isSettingsOpen);
                          setIsCaptionsOpen(false);
                        }}
                        className="text-white/80 hover:text-white p-1 cursor-pointer transition-colors"
                        title="Mipangilio / Settings"
                      >
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      {isSettingsOpen && (
                        <div className="absolute bottom-10 right-0 w-48 rounded-xl bg-black/95 border border-white/15 p-3 shadow-2xl text-xs space-y-3">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                              {language === 'sw' ? 'Ubora (Quality)' : 'Quality'}
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              {['1080p', '720p', '480p'].map((q) => (
                                <button
                                  key={q}
                                  onClick={() => setSelectedQuality(q)}
                                  className={`py-1 rounded text-center cursor-pointer ${
                                    selectedQuality === q ? 'bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                  }`}
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                              {language === 'sw' ? 'Kasi ya Video' : 'Playback Speed'}
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              {[0.75, 1, 1.25, 1.5].map((spd) => (
                                <button
                                  key={spd}
                                  onClick={() => {
                                    setPlaybackSpeed(spd);
                                    if (videoRef.current) videoRef.current.playbackRate = spd;
                                  }}
                                  className={`py-1 rounded text-center cursor-pointer ${
                                    playbackSpeed === spd ? 'bg-[#FF2D87] text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                  }`}
                                >
                                  {spd}x
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Theater Mode Toggle */}
                    <button
                      onClick={() => setIsTheaterMode(!isTheaterMode)}
                      className="hidden md:inline-flex text-white/80 hover:text-white p-1 cursor-pointer"
                      title={isTheaterMode ? 'Hali ya Kawaida / Default View' : 'Hali ya Sinema / Theater Mode'}
                    >
                      <Expand className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="text-white/80 hover:text-white p-1 cursor-pointer"
                      title={isFullscreen ? 'Ondoa Skrini Kamili' : 'Skrini Kamili / Fullscreen'}
                    >
                      {isFullscreen ? (
                        <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* 2. MOVIE TITLE & ACTIONS (Matching YouTube watch page references with NeliPlay Branding) */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-orange-100/80 shadow-sm space-y-4">
              {/* Title & Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white text-[11px] font-black uppercase shadow-xs">
                    Simulizi ya Kiswahili
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                    HD 1080p
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                    {movie.ageRating}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-slate-900 tracking-tight">
                  {movie.title}
                </h1>
              </div>

              {/* NeliPlay Channel Bar + Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                {/* Platform Channel Info */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full p-1 bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] shrink-0 shadow-sm">
                    <img
                      src="/assets/aistudio/media_1792487075393_11596c6f_ab3db261.png"
                      alt="NeliPlay"
                      className="w-full h-full object-contain rounded-full bg-black p-1"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900">
                        NeliPlay Swahili
                      </h3>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] fill-current" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Nyumba ya Burudani ya Kiswahili · Bure Kutazama
                    </p>
                  </div>
                </div>

                {/* Actions: Like, Share, Save */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      isLiked ? 'bg-orange-50 text-[#FF6A00] border border-orange-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{isLiked ? 'Umeipenda' : 'Penda'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `${movie.title} | NeliPlay Swahili`,
                          text: movie.synopsisSwahili,
                          url: window.location.href,
                        }).catch(() => {});
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Shiriki</span>
                  </button>

                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      isSaved ? 'bg-pink-50 text-[#FF2D87] border border-pink-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Imehifadhiwa' : 'Hifadhi'}</span>
                  </button>
                </div>
              </div>

              {/* 3. EXPANDABLE DESCRIPTION BOX */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600 pb-1 border-b border-slate-200/60">
                  <span>Mwaka: {movie.releaseYear}</span>
                  <span>·</span>
                  <span>Muda: {movie.runtime}</span>
                  <span>·</span>
                  <span>Aina: {movie.genres.join(', ')}</span>
                  <span>·</span>
                  <span className="text-[#FF6A00] font-mono">Alama: {movie.ratingScore} / 5.0</span>
                </div>

                <p className="text-slate-800 leading-relaxed font-normal">
                  {movie.synopsisSwahili}
                </p>

                {isDescExpanded && (
                  <div className="pt-2 space-y-3 border-t border-slate-200/60 text-xs text-slate-600">
                    {movie.overview && movie.overview !== movie.synopsisSwahili && (
                      <div>
                        <span className="font-bold text-slate-800 block mb-1">English Synopsis:</span>
                        <p>{movie.overview}</p>
                      </div>
                    )}

                    <div>
                      <span className="font-bold text-slate-800 block mb-1">Mwongozaji (Director):</span>
                      <p className="font-semibold text-slate-700">{movie.director || 'NeliPlay Studio'}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-800 block mb-1">Waigizaji Wakuu:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {movie.cast.map(c => (
                          <span key={c} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-xs font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6A00] hover:text-[#FF2D87] transition-colors cursor-pointer pt-1"
                >
                  <span>{isDescExpanded ? 'Ficha Maelezo' : 'Soma Zaidi...'}</span>
                  {isDescExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: RECOMMENDED SWAHILI MOVIES (Matches User's Reference Layout!) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base sm:text-lg font-black font-display text-slate-900 flex items-center gap-2">
                <Film className="w-4 h-4 text-[#FF6A00]" />
                <span>{language === 'sw' ? 'Filamu Zinazopendekezwa' : 'Recommended Movies'}</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {recommendedMovies.length}
              </span>
            </div>

            {/* Vertical list of recommended cards (YouTube Sidebar style) */}
            <div className="space-y-2.5">
              {recommendedMovies.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => {
                    if (onSelectMovie) {
                      onSelectMovie(rec);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="group flex gap-3 p-2 rounded-xl bg-white/80 hover:bg-white border border-orange-100/70 hover:border-[#FF6A00]/50 transition-all cursor-pointer shadow-2xs hover:shadow-md"
                >
                  {/* 16:9 Thumbnail with Duration */}
                  <div className="relative w-36 sm:w-40 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={optimizeTmdbImage(rec.backdropUrl || rec.posterUrl, 'thumb')}
                      alt={rec.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    
                    {/* Duration badge at bottom right */}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono font-bold text-white shadow-xs">
                      {rec.runtime}
                    </span>

                    {/* Play icon overlay on hover with NeliPlay gradient */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white flex items-center justify-center shadow-md">
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FF6A00] transition-colors line-clamp-2 leading-tight">
                        {rec.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {rec.genres.slice(0, 2).join(' · ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <span>{rec.releaseYear}</span>
                      <span>·</span>
                      <span className="text-[#FF6A00] font-semibold">Kiswahili</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
