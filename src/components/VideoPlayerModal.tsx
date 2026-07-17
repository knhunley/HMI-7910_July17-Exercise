import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Eye,
  Star,
  Calendar,
  Sparkles,
  Clapperboard,
  Send,
  ThumbsUp
} from 'lucide-react';
import { VideoMedia } from '../types';

interface VideoPlayerModalProps {
  video: VideoMedia | null;
  onClose: () => void;
  relatedVideos: VideoMedia[];
  onPlayVideo: (video: VideoMedia) => void;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  likes: number;
  time: string;
}

export default function VideoPlayerModal({
  video,
  onClose,
  relatedVideos,
  onPlayVideo,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Custom reviews state
  const [reviews, setReviews] = useState<Record<string, Review[]>>({
    v1: [
      { id: 'r1', user: 'Cinephile_99', rating: 9, comment: 'Incredible visual effects! The blending of real-world footage with Blender CGI is masterful.', likes: 14, time: '2 days ago' },
      { id: 'r2', user: 'VFX_Artist', rating: 8, comment: 'Very interesting pipeline. The motion tracking on the camera is solid.', likes: 6, time: '5 days ago' }
    ],
    v4: [
      { id: 'r3', user: 'FantasyLover', rating: 10, comment: 'This short breaks my heart every time. Sintel\'s dedication and the tragic ending are beautiful.', likes: 25, time: '1 day ago' },
      { id: 'r4', user: 'AnimeGamer', rating: 9, comment: 'The lighting in Sintel is outstanding. A landmark open movie.', likes: 11, time: '3 days ago' }
    ],
    v5: [
      { id: 'r5', user: 'GamerKid', rating: 8, comment: 'Bunny is hilarious! A timeless classic that inspired so many cartoon animators.', likes: 32, time: 'Yesterday' }
    ]
  });

  const [newUser, setNewUser] = useState('');
  const [newRating, setNewRating] = useState(9);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.src = video.mediaUrl;
      videoRef.current.load();
      setIsPlaying(true);
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [video]);

  if (!video) return null;

  const currentReviews = reviews[video.id] || [];

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
    if (vol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    videoRef.current.muted = newMute;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newReview: Review = {
      id: Math.random().toString(),
      user: newUser.trim() || 'Anonymous Spectator',
      rating: newRating,
      comment: newComment.trim(),
      likes: 0,
      time: 'Just now'
    };

    setReviews({
      ...reviews,
      [video.id]: [newReview, ...currentReviews]
    });

    setNewUser('');
    setNewComment('');
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews({
      ...reviews,
      [video.id]: currentReviews.map(r => r.id === reviewId ? { ...r, likes: r.likes + 1 } : r)
    });
  };

  return (
    <div
      id="video-player-modal-backdrop"
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-0 md:p-4 overflow-y-auto"
    >
      <div
        id="video-player-container-box"
        className={`bg-neutral-950 border border-neutral-800 w-full h-full md:h-auto md:max-h-[92vh] flex flex-col md:flex-row rounded-none overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.15)] ${
          isTheaterMode ? 'max-w-7xl' : 'max-w-5xl'
        }`}
      >
        
        {/* Left Side: Video Screen Area */}
        <div className="flex-1 flex flex-col bg-black relative justify-center">
          
          {/* Header Controls (Close, Theater Mode) */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
            <span className="flex items-center gap-2 bg-neutral-950/80 border border-neutral-800 px-3 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest text-white">
              {video.isAnimation ? (
                <Sparkles size={14} className="text-[#00dbe9]" />
              ) : (
                <Clapperboard size={14} className="text-[#ecb2ff]" />
              )}
              {video.isAnimation ? 'Animation' : 'Cinema'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className="hidden md:block bg-neutral-950/80 border border-neutral-800 text-neutral-400 hover:text-fuchsia-500 p-2 rounded-none transition-all"
                title="Theater Mode"
              >
                <Maximize size={16} />
              </button>
              <button
                id="btn-close-video"
                onClick={onClose}
                className="bg-neutral-950/80 border border-neutral-800 text-neutral-400 hover:text-red-400 p-2 rounded-none transition-all active:scale-95"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={handleTogglePlay}
            className="w-full aspect-video object-contain bg-black cursor-pointer"
          />

          {/* Custom Overlay Video Controller */}
          <div className="bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col gap-2">
            {/* Seek Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#d4c0d7]">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-white/20 rounded-none appearance-none cursor-pointer accent-fuchsia-500"
                style={{
                  background: `linear-gradient(to right, #d946ef 0%, #d946ef ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                }}
              />
              <span className="text-xs font-mono text-[#d4c0d7]">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls panel */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleTogglePlay}
                  className="p-1.5 rounded-none text-white hover:text-fuchsia-500 transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>

                <div className="flex items-center gap-2 group">
                  <button
                    onClick={handleToggleMute}
                    className="text-neutral-400 hover:text-white"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/20 rounded-none appearance-none cursor-pointer accent-[#00dbe9]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#d4c0d7] opacity-80">
                <span>{video.title}</span>
                <span className="opacity-40">•</span>
                <button
                  onClick={handleFullscreen}
                  className="hover:text-white transition-colors"
                  title="Fullscreen"
                >
                  <Maximize size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Metadata, Reviews, & Suggestions Panel */}
        <div className="w-full md:w-80 flex flex-col border-t md:border-t-0 md:border-l border-neutral-800 bg-neutral-900 h-96 md:h-auto overflow-y-auto custom-scrollbar">
          
          {/* Scrollable Panel Area */}
          <div className="p-6 space-y-6 flex-1">
            {/* Title & Desc */}
            <div className="space-y-2">
              <h3 className="text-md font-sans font-black uppercase tracking-widest text-white leading-tight">
                {video.title}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500">
                By {video.creator}
              </p>
              
              {/* Stat Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded-none text-[9px] text-neutral-400 font-black uppercase tracking-widest">
                  <Calendar size={10} className="text-fuchsia-500" />
                  {video.year}
                </span>
                <span className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded-none text-[9px] text-neutral-400 font-black uppercase tracking-widest">
                  <Eye size={10} className="text-fuchsia-500" />
                  {video.views} views
                </span>
                <span className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded-none text-[9px] text-neutral-400 font-black uppercase tracking-widest">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  {video.rating}/10
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-950 border border-neutral-800 p-3 rounded-none">
              {video.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-fuchsia-500/10 text-fuchsia-400 text-[9px] px-2.5 py-0.5 rounded-none font-black border border-fuchsia-500/20 uppercase tracking-widest"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Interactive Review Section */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <span>Viewer Reactions</span>
                <span className="bg-fuchsia-500/20 text-fuchsia-400 text-[9px] px-2 py-0.5 rounded-none font-black">
                  {currentReviews.length}
                </span>
              </h4>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitReview} className="space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Your Alias..."
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 text-[10px] rounded-none px-2.5 py-1.5 text-white focus:outline-none focus:border-fuchsia-500"
                  />
                  <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-none px-2 text-[10px] text-white">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(parseInt(e.target.value))}
                      className="bg-transparent text-white border-none focus:ring-0 p-0 text-[10px] font-bold cursor-pointer outline-none"
                    >
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n} className="bg-neutral-950 text-white">
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-[10px] rounded-none pl-3 pr-10 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 placeholder-neutral-500"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-none bg-fuchsia-600 text-white hover:bg-fuchsia-500 active:scale-95 transition-all"
                  >
                    <Send size={10} />
                  </button>
                </div>
              </form>

              {/* Review Feed */}
              <div className="space-y-3">
                {currentReviews.length === 0 ? (
                  <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest text-center py-2">
                    Be the first to share your reaction!
                  </p>
                ) : (
                  currentReviews.map((r) => (
                    <div key={r.id} className="bg-neutral-950 hover:bg-neutral-850 p-2.5 rounded-none border border-neutral-850 space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span className="text-white">{r.user}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-fuchsia-500 font-bold">★ {r.rating}</span>
                          <span className="text-neutral-500">{r.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-medium">{r.comment}</p>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleLikeReview(r.id)}
                          className="flex items-center gap-1.5 text-[9px] text-neutral-500 hover:text-fuchsia-500 transition-colors"
                        >
                          <ThumbsUp size={10} />
                          <span>{r.likes} likes</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Suggestions List */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
                Suggested Content
              </h4>
              <div className="space-y-2.5">
                {relatedVideos
                  .filter((v) => v.id !== video.id)
                  .slice(0, 3)
                  .map((v) => (
                    <div
                      key={v.id}
                      onClick={() => onPlayVideo(v)}
                      className="flex gap-3 bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 hover:border-fuchsia-500 p-2 rounded-none cursor-pointer transition-all"
                    >
                      <div className="w-20 h-12 rounded-none overflow-hidden relative flex-shrink-0 border border-neutral-850">
                        <img
                          src={v.thumbnailUrl}
                          alt={v.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play size={10} className="text-white fill-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-[10px] font-black uppercase tracking-wider text-white truncate">
                          {v.title}
                        </h5>
                        <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 truncate mt-0.5">
                          {v.creator} • {v.duration}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
