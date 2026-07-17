import React, { useState, useRef, useEffect } from 'react';
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Maximize2,
  FileText,
  ListMusic,
  Heart,
  ChevronDown,
  Music
} from 'lucide-react';
import { Track } from '../types';

interface MediaPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isShuffle: boolean;
  setIsShuffle: (shuffle: boolean) => void;
  isRepeat: boolean;
  setIsRepeat: (repeat: boolean) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function MediaPlayer({
  currentTrack,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  isShuffle,
  setIsShuffle,
  isRepeat,
  setIsRepeat,
  onNextTrack,
  onPrevTrack,
  favorites,
  toggleFavorite,
}: MediaPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  // Sync audio element state with props
  useEffect(() => {
    if (!audioRef.current) return;

    if (currentTrack) {
      const prevSrc = audioRef.current.src;
      if (prevSrc !== currentTrack.mediaUrl) {
        audioRef.current.src = currentTrack.mediaUrl;
        audioRef.current.load();
      }

      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Playback might be blocked initially by browser policies
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    } else {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlaying, setIsPlaying]);

  // Sync volume state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      onNextTrack();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleTogglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isFav = currentTrack ? favorites.includes(currentTrack.id) : false;

  return (
    <>
      {/* Invisible HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Persistent Now Playing Bar */}
      <footer
        id="persistent-media-player"
        className="fixed bottom-0 left-0 md:left-64 right-0 z-50 p-4 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 shadow-2xl"
      >
        <div className="bg-neutral-900 border border-neutral-800 rounded-none p-3 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Track Information */}
          <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0">
            {currentTrack ? (
              <>
                <div className="w-12 h-12 rounded-none overflow-hidden flex-shrink-0 shadow-lg relative group border border-neutral-800">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={currentTrack.thumbnailUrl}
                    alt={currentTrack.title}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-xs font-black uppercase tracking-wider text-white truncate" title={currentTrack.title}>
                    {currentTrack.title}
                  </div>
                  <div className="text-[10px] font-sans text-fuchsia-500 uppercase tracking-widest truncate font-black mt-0.5">
                    {currentTrack.artist}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(currentTrack.id)}
                  className={`p-1.5 rounded-none transition-all active:scale-90 ${
                    isFav ? 'text-fuchsia-500 scale-110' : 'text-neutral-400 hover:text-fuchsia-500'
                  }`}
                  title={isFav ? "Remove from Favorites" : "Favorite"}
                >
                  <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-none bg-neutral-950 flex items-center justify-center border border-neutral-800">
                  <Music size={20} className="text-neutral-500 opacity-40 animate-pulse" />
                </div>
                <div>
                  <div className="font-sans text-xs font-black uppercase tracking-wider text-neutral-500">No Track Selected</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mt-0.5">Choose a playlist</div>
                </div>
              </div>
            )}
          </div>

          {/* Center: Controls & Timelines */}
          <div className="flex-1 w-full flex flex-col items-center">
            {/* Control Row */}
            <div className="flex items-center gap-6 mb-1.5">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-1.5 transition-colors ${
                  isShuffle ? 'text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]' : 'text-neutral-400 hover:text-white'
                }`}
                title="Shuffle"
                disabled={!currentTrack}
              >
                <Shuffle size={16} />
              </button>

              <button
                onClick={onPrevTrack}
                className="text-neutral-400 hover:text-fuchsia-500 active:scale-95 transition-transform"
                title="Previous Track"
                disabled={!currentTrack}
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-none bg-fuchsia-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.3)] active:scale-90 transition-transform hover:bg-fuchsia-500 duration-300"
                title={isPlaying ? 'Pause' : 'Play'}
                disabled={!currentTrack}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>

              <button
                onClick={onNextTrack}
                className="text-neutral-400 hover:text-fuchsia-500 active:scale-95 transition-transform"
                title="Next Track"
                disabled={!currentTrack}
              >
                <SkipForward size={20} />
              </button>

              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-1.5 transition-colors ${
                  isRepeat ? 'text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]' : 'text-neutral-400 hover:text-white'
                }`}
                title="Repeat / Loop"
                disabled={!currentTrack}
              >
                <Repeat size={16} />
              </button>
            </div>

            {/* Time Slider */}
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] font-mono text-neutral-500 w-8 text-right font-bold">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative group flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={!currentTrack}
                  className="w-full h-1 bg-neutral-850 appearance-none cursor-pointer accent-fuchsia-500 group-hover:h-1.5 transition-all outline-none"
                  style={{
                    background: `linear-gradient(to right, #d946ef 0%, #d946ef ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.05) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.05) 100%)`
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-neutral-500 w-8 font-bold">
                {currentTrack ? formatTime(duration || currentTrack.durationSeconds) : '0:00'}
              </span>
            </div>
          </div>

          {/* Right: Audio Volume & Utility Panels */}
          <div className="hidden md:flex items-center justify-end gap-4 w-1/4">
            {/* Show Lyrics panel */}
            <button
              onClick={() => currentTrack?.lyrics && setShowLyrics(!showLyrics)}
              className={`p-2 rounded-none transition-colors ${
                showLyrics ? 'text-fuchsia-500 bg-neutral-800' : 'text-neutral-400 hover:text-white'
              } ${!currentTrack?.lyrics ? 'opacity-30 cursor-not-allowed' : ''}`}
              title={currentTrack?.lyrics ? "Toggle Lyrics" : "No Lyrics Available"}
              disabled={!currentTrack?.lyrics}
            >
              <FileText size={18} />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-neutral-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-20 h-1 bg-neutral-850 appearance-none cursor-pointer accent-fuchsia-500 outline-none"
                style={{
                  background: `linear-gradient(to right, #d946ef 0%, #d946ef ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.05) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.05) 100%)`
                }}
              />
            </div>

            {/* Fullscreen view or lyrics showcase */}
            <button
              onClick={() => currentTrack && setShowLyrics(!showLyrics)}
              className="text-neutral-400 hover:text-white transition-colors p-1"
              title="Expand Focus Mode"
              disabled={!currentTrack}
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Lyrics Overlay Drawer */}
      {showLyrics && currentTrack && (
        <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-3xl z-40 flex flex-col justify-center items-center p-8 animate-in fade-in duration-300">
          <button
            onClick={() => setShowLyrics(false)}
            className="absolute top-8 right-8 p-3 rounded-none bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition-colors active:scale-90"
          >
            <ChevronDown size={24} />
          </button>

          <div className="max-w-2xl w-full text-center space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar px-4">
            <div className="space-y-4">
              <img
                src={currentTrack.thumbnailUrl}
                alt={currentTrack.title}
                className="w-32 h-32 rounded-none object-cover mx-auto border border-neutral-800 shadow-[0_0_30px_rgba(217,70,239,0.2)] animate-pulse"
              />
              <div>
                <h2 className="text-3xl font-sans font-black uppercase tracking-wider text-white">
                  {currentTrack.title}
                </h2>
                <p className="text-sm font-sans text-fuchsia-500 tracking-widest uppercase font-black mt-1">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Scrolling Lyrics */}
            <div className="text-lg md:text-xl font-sans text-neutral-400 leading-relaxed whitespace-pre-wrap select-none py-6 max-w-lg mx-auto font-medium">
              {currentTrack.lyrics || "No lyrics available for this track."}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
