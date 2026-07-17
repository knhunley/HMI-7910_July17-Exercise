import React, { useState, useRef } from 'react';
import { X, UploadCloud, Film, Sparkles, Music, Image as ImageIcon, Link, AlertCircle } from 'lucide-react';
import { VideoMedia, Playlist, Track } from '../types';

interface AddContentModalProps {
  onClose: () => void;
  onAddMovie: (movie: VideoMedia) => void;
  onAddAnimation: (animation: VideoMedia) => void;
  onAddPlaylist: (playlist: Playlist) => void;
}

type TabType = 'movie' | 'animation' | 'playlist';

export default function AddContentModal({
  onClose,
  onAddMovie,
  onAddAnimation,
  onAddPlaylist,
}: AddContentModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('movie');

  // Common Form Fields
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('2026');
  const [rating, setRating] = useState('8.5');
  const [tagsInput, setTagsInput] = useState('');
  const [duration, setDuration] = useState('');

  // Media Source: File Upload vs URL Link
  const [sourceType, setSourceType] = useState<'upload' | 'link'>('upload');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Thumbnail Source: File Upload vs URL Link
  const [thumbType, setThumbType] = useState<'upload' | 'link'>('upload');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Drag and Drop States
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);

  // Music Playlist Tracks Addition (For Playlist tab)
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackArtist, setNewTrackArtist] = useState('');
  const [newTrackFile, setNewTrackFile] = useState<File | null>(null);
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [newTrackSource, setNewTrackSource] = useState<'upload' | 'link'>('upload');

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const trackFileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedMediaTypes = () => {
    if (activeTab === 'playlist') {
      return '.m4a,.mp3,.wav';
    }
    return '.mp4,.mov,.webm';
  };

  const handleMediaFileChange = (file: File) => {
    setMediaFile(file);
    // Auto-fill title if empty
    if (!title) {
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setTitle(cleanName.replace(/[_-]/g, ' '));
    }
    // Auto-fill duration estimation
    if (activeTab === 'playlist') {
      setDuration('3:45');
    } else {
      setDuration('10m 00s');
    }
  };

  const handleThumbnailFileChange = (file: File) => {
    setThumbnailFile(file);
  };

  const handleDragOver = (e: React.DragEvent, type: 'media' | 'thumb') => {
    e.preventDefault();
    if (type === 'media') setIsDraggingMedia(true);
    else setIsDraggingThumb(true);
  };

  const handleDragLeave = (type: 'media' | 'thumb') => {
    if (type === 'media') setIsDraggingMedia(false);
    else setIsDraggingThumb(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'media' | 'thumb') => {
    e.preventDefault();
    if (type === 'media') {
      setIsDraggingMedia(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleMediaFileChange(e.dataTransfer.files[0]);
      }
    } else {
      setIsDraggingThumb(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleThumbnailFileChange(e.dataTransfer.files[0]);
      }
    }
  };

  const handleAddTrack = () => {
    if (!newTrackTitle) return;

    let trackUrlStr = newTrackUrl;
    if (newTrackSource === 'upload' && newTrackFile) {
      trackUrlStr = URL.createObjectURL(newTrackFile);
    }

    if (!trackUrlStr) {
      trackUrlStr = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Fallback
    }

    const track: Track = {
      id: 'custom-track-' + Math.random().toString(),
      title: newTrackTitle,
      artist: newTrackArtist || creator || 'Custom Artist',
      duration: '3:45',
      durationSeconds: 225,
      mediaUrl: trackUrlStr,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
    };

    setPlaylistTracks([...playlistTracks, track]);
    setNewTrackTitle('');
    setNewTrackArtist('');
    setNewTrackFile(null);
    setNewTrackUrl('');
  };

  const handleRemoveTrack = (index: number) => {
    setPlaylistTracks(playlistTracks.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct final Media URL
    let finalMediaUrl = mediaUrl;
    if (sourceType === 'upload' && mediaFile) {
      finalMediaUrl = URL.createObjectURL(mediaFile);
    }

    // Construct final Thumbnail URL
    let finalThumbnailUrl = thumbnailUrl;
    if (thumbType === 'upload' && thumbnailFile) {
      finalThumbnailUrl = URL.createObjectURL(thumbnailFile);
    }

    // Fallbacks
    if (!finalMediaUrl) {
      if (activeTab === 'playlist') {
        finalMediaUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      } else {
        finalMediaUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
      }
    }

    if (!finalThumbnailUrl) {
      if (activeTab === 'playlist') {
        finalThumbnailUrl = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80';
      } else if (activeTab === 'animation') {
        finalThumbnailUrl = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80';
      } else {
        finalThumbnailUrl = 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80';
      }
    }

    // Process Tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (tags.length === 0) {
      tags.push(activeTab === 'movie' ? 'Sci-Fi' : activeTab === 'animation' ? 'Stylized' : 'Chillhop');
    }

    if (activeTab === 'movie') {
      const movie: VideoMedia = {
        id: 'movie-' + Date.now(),
        title,
        creator: creator || 'Independent Cineast',
        description: description || 'A custom hosted masterpiece shared on Lumina.',
        duration: duration || '10m 00s',
        durationSeconds: 600,
        thumbnailUrl: finalThumbnailUrl,
        mediaUrl: finalMediaUrl,
        tags,
        year: year || '2026',
        isAnimation: false,
        views: '0',
        rating: rating || '8.5',
      };
      onAddMovie(movie);
    } else if (activeTab === 'animation') {
      const animation: VideoMedia = {
        id: 'anim-' + Date.now(),
        title,
        creator: creator || 'Indie Animator',
        description: description || 'A visually energetic animation shared on Lumina.',
        duration: duration || '5m 00s',
        durationSeconds: 300,
        thumbnailUrl: finalThumbnailUrl,
        mediaUrl: finalMediaUrl,
        tags,
        year: year || '2026',
        isAnimation: true,
        views: '0',
        rating: rating || '8.5',
      };
      onAddAnimation(animation);
    } else {
      // Playlist Creation
      const playlist: Playlist = {
        id: 'play-' + Date.now(),
        title,
        description: description || 'Personal music compilation curated on Lumina.',
        thumbnailUrl: finalThumbnailUrl,
        creator: creator || 'Lumina Listener',
        tracksCount: playlistTracks.length,
        duration: '18m 45s',
        lastModified: 'Just now',
        tracks: playlistTracks,
        isCurated: false,
      };
      onAddPlaylist(playlist);
    }

    onClose();
  };

  return (
    <div
      id="add-content-backdrop"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="add-content-modal"
        className="bg-neutral-900 border border-neutral-800 rounded-none w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.15)] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 bg-neutral-950/40">
          <div>
            <h3 className="text-sm font-sans font-black uppercase tracking-widest text-white">
              Host Personal Entertainment Assets
            </h3>
            <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500 mt-1">
              Host your local MP4 and M4A/MP3 media directly into your session library.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white p-1.5 rounded-none hover:bg-neutral-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Picker */}
        <div className="flex border-b border-neutral-800 p-2 bg-neutral-950/20 gap-2">
          <button
            onClick={() => {
              setActiveTab('movie');
              setTitle('');
              setMediaFile(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-none transition-all ${
              activeTab === 'movie'
                ? 'bg-fuchsia-600 text-white border border-fuchsia-500 shadow-md'
                : 'text-neutral-400 hover:text-white bg-transparent'
            }`}
          >
            <Film size={14} /> Cinema Movie
          </button>
          <button
            onClick={() => {
              setActiveTab('animation');
              setTitle('');
              setMediaFile(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-none transition-all ${
              activeTab === 'animation'
                ? 'bg-fuchsia-600 text-white border border-fuchsia-500 shadow-md'
                : 'text-neutral-400 hover:text-white bg-transparent'
            }`}
          >
            <Sparkles size={14} /> Animation Short
          </button>
          <button
            onClick={() => {
              setActiveTab('playlist');
              setTitle('');
              setMediaFile(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-none transition-all ${
              activeTab === 'playlist'
                ? 'bg-fuchsia-600 text-white border border-fuchsia-500 shadow-md'
                : 'text-neutral-400 hover:text-white bg-transparent'
            }`}
          >
            <Music size={14} /> Soundtrack Playlist
          </button>
        </div>

        {/* Modal Form content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
          
          {/* General Metadata Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                Asset Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Electric Odyssey"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                Director / Studio / Creator
              </label>
              <input
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="e.g. Paramount, Independent"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
              Description / Synopsis
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief background or storyline summary..."
              rows={2}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          {/* Video Metadata Column */}
          {activeTab !== 'playlist' && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                  Release Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                  Initial Rating
                </label>
                <input
                  type="text"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                  Duration Display
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10m 30s"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>
            </div>
          )}

          {/* Tag inputs */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
              Category Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Sci-Fi, Action, CGI, Cyberpunk"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          {/* SOURCE TYPE SELECTOR (FILE VS URL LINK) */}
          {activeTab !== 'playlist' && (
            <div className="space-y-3 p-4 bg-neutral-950 border border-neutral-800 rounded-none">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Media Source</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSourceType('upload')}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                      sourceType === 'upload'
                        ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30'
                        : 'text-neutral-500 border-transparent hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceType('link')}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                      sourceType === 'link'
                        ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30'
                        : 'text-neutral-500 border-transparent hover:text-white'
                    }`}
                  >
                    Paste URL
                  </button>
                </div>
              </div>

              {sourceType === 'upload' ? (
                /* DRAG AND DROP ZONE */
                <div
                  onDragOver={(e) => handleDragOver(e, 'media')}
                  onDragLeave={() => handleDragLeave('media')}
                  onDrop={(e) => handleDrop(e, 'media')}
                  onClick={() => mediaInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-none p-6 text-center cursor-pointer transition-all ${
                    isDraggingMedia
                      ? 'border-fuchsia-500 bg-fuchsia-500/5 shadow-[0_0_15px_rgba(217,70,239,0.15)]'
                      : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                  }`}
                >
                  <input
                    type="file"
                    ref={mediaInputRef}
                    accept={getAcceptedMediaTypes()}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleMediaFileChange(e.target.files[0])}
                  />
                  <UploadCloud size={28} className="mx-auto text-neutral-500 mb-2 animate-bounce" />
                  <p className="text-xs text-white font-bold uppercase tracking-wide">
                    {mediaFile ? mediaFile.name : `Drag & Drop your ${getAcceptedMediaTypes()} file`}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1 uppercase font-black tracking-widest">or click to browse from system explorer</p>
                </div>
              ) : (
                /* PASTE LINK FORM */
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="url"
                      placeholder="https://example.com/movie.mp4"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-none pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COVERS / ARTWORK THUMBNAILS */}
          <div className="space-y-3 p-4 bg-neutral-950 border border-neutral-800 rounded-none">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Cover Artwork Thumbnail</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setThumbType('upload')}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                    thumbType === 'upload'
                      ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30'
                      : 'text-neutral-500 border-transparent hover:text-white'
                  }`}
                >
                  Upload Cover
                </button>
                <button
                  type="button"
                  onClick={() => setThumbType('link')}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                    thumbType === 'link'
                      ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30'
                      : 'text-neutral-500 border-transparent hover:text-white'
                  }`}
                >
                  Paste URL
                </button>
              </div>
            </div>

            {thumbType === 'upload' ? (
              <div
                onDragOver={(e) => handleDragOver(e, 'thumb')}
                onDragLeave={() => handleDragLeave('thumb')}
                onDrop={(e) => handleDrop(e, 'thumb')}
                onClick={() => thumbInputRef.current?.click()}
                className={`border-2 border-dashed rounded-none p-5 text-center cursor-pointer transition-all ${
                  isDraggingThumb
                    ? 'border-fuchsia-500 bg-fuchsia-500/5 shadow-[0_0_15px_rgba(217,70,239,0.15)]'
                    : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                }`}
              >
                <input
                  type="file"
                  ref={thumbInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleThumbnailFileChange(e.target.files[0])}
                />
                <ImageIcon size={24} className="mx-auto text-neutral-500 mb-2" />
                <p className="text-xs text-white font-bold uppercase tracking-wide">
                  {thumbnailFile ? thumbnailFile.name : 'Drag & Drop your cover image file'}
                </p>
                <p className="text-[10px] text-neutral-500 mt-1 uppercase font-black tracking-widest">Supports PNG, JPG, or WEBP formats</p>
              </div>
            ) : (
              <div className="relative">
                <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-none pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>
            )}
          </div>

          {/* MUSIC TRACKS ADDER (FOR PLAYLIST MODE ONLY) */}
          {activeTab === 'playlist' && (
            <div className="space-y-4 p-4 bg-neutral-950 border border-neutral-800 rounded-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Compile Playlist Tracks</span>

              {/* Added track visual list */}
              {playlistTracks.length > 0 && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-none divide-y divide-neutral-800 max-h-40 overflow-y-auto custom-scrollbar">
                  {playlistTracks.map((tr, trIdx) => (
                    <div key={tr.id} className="flex justify-between items-center p-2.5 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-neutral-500 font-mono font-bold">{trIdx + 1}</span>
                        <p className="text-white font-bold uppercase tracking-wider truncate max-w-[200px]">{tr.title}</p>
                        <p className="text-neutral-500 font-black uppercase tracking-widest text-[9px]">by {tr.artist}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTrack(trIdx)}
                        className="text-red-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest px-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Form */}
              <div className="p-3 bg-neutral-900 rounded-none border border-neutral-800 space-y-3">
                <p className="text-[9px] uppercase font-black tracking-widest text-neutral-500">
                  Quick Add Track Row
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Soundtrack Title..."
                    value={newTrackTitle}
                    onChange={(e) => setNewTrackTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                  />
                  <input
                    type="text"
                    placeholder="Artist..."
                    value={newTrackArtist}
                    onChange={(e) => setNewTrackArtist(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">Track Source</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNewTrackSource('upload')}
                        className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                          newTrackSource === 'upload'
                            ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30'
                            : 'text-neutral-500 border-transparent hover:text-white'
                        }`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewTrackSource('link')}
                        className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                          newTrackSource === 'link'
                            ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30'
                            : 'text-neutral-500 border-transparent hover:text-white'
                        }`}
                      >
                        Paste URL
                      </button>
                    </div>
                  </div>

                  {newTrackSource === 'upload' ? (
                    <div
                      onClick={() => trackFileInputRef.current?.click()}
                      className="border border-dashed border-neutral-800 p-3 rounded-none text-center cursor-pointer hover:border-neutral-700 hover:bg-neutral-850"
                    >
                      <input
                        type="file"
                        ref={trackFileInputRef}
                        accept=".mp3,.m4a"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setNewTrackFile(e.target.files[0])}
                      />
                      <p className="text-[10px] text-fuchsia-500 font-black uppercase tracking-widest">
                        {newTrackFile ? newTrackFile.name : 'Select track file (MP3/M4A)'}
                      </p>
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder="https://example.com/soundtrack.mp3"
                      value={newTrackUrl}
                      onChange={(e) => setNewTrackUrl(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-none px-2.5 py-1 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddTrack}
                  className="w-full py-2 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 text-[9px] font-black uppercase tracking-widest rounded-none"
                >
                  Confirm and Add Track to Playlist
                </button>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-neutral-800 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white rounded-none bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-none font-sans text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(217,70,239,0.2)]"
            >
              HOST NOW
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
