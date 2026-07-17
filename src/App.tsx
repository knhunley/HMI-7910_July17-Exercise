import { useState, useEffect } from 'react';
import {
  curatedPlaylists,
  curatedTracks,
  curatedVideos
} from './data/curatedMedia';
import { Playlist, Track, VideoMedia } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MediaPlayer from './components/MediaPlayer';
import VideoPlayerModal from './components/VideoPlayerModal';
import AddContentModal from './components/AddContentModal';

// Views
import DashboardView from './components/DashboardView';
import MoviesView from './components/MoviesView';
import AnimationView from './components/AnimationView';
import MusicView from './components/MusicView';

import { Sparkles, HelpCircle, Film, Play, Heart, Star, Compass, User, AlertCircle, Info, Music } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Media Collections (Curated + Custom Hosted LocalStorage)
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [movies, setMovies] = useState<VideoMedia[]>([]);
  const [animations, setAnimations] = useState<VideoMedia[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Persistent Media Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // Overlay Trigger Modals
  const [selectedVideo, setSelectedVideo] = useState<VideoMedia | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Live Toast Notifications
  const [toast, setToast] = useState<string | null>(null);

  // Load and sync from localStorage on mount
  useEffect(() => {
    // Playlists
    const storedPlaylists = localStorage.getItem('lumina_playlists');
    if (storedPlaylists) {
      try {
        setPlaylists(JSON.parse(storedPlaylists));
      } catch (e) {
        setPlaylists(curatedPlaylists);
      }
    } else {
      setPlaylists(curatedPlaylists);
    }

    // Videos (Movies vs Animations)
    const storedVideos = localStorage.getItem('lumina_videos');
    if (storedVideos) {
      try {
        const allVids: VideoMedia[] = JSON.parse(storedVideos);
        setMovies(allVids.filter(v => !v.isAnimation));
        setAnimations(allVids.filter(v => v.isAnimation));
      } catch (e) {
        setMovies(curatedVideos.filter(v => !v.isAnimation));
        setAnimations(curatedVideos.filter(v => v.isAnimation));
      }
    } else {
      setMovies(curatedVideos.filter(v => !v.isAnimation));
      setAnimations(curatedVideos.filter(v => v.isAnimation));
    }

    // Favorites
    const storedFavs = localStorage.getItem('lumina_favorites');
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch (e) {}
    }
  }, []);

  // Save changes helper
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Add handlers
  const handleAddMovie = (movie: VideoMedia) => {
    const updated = [movie, ...movies];
    setMovies(updated);
    
    // Save to localStorage
    const storedVids = localStorage.getItem('lumina_videos');
    let parsedVids: VideoMedia[] = curatedVideos;
    if (storedVids) {
      try { parsedVids = JSON.parse(storedVids); } catch(e) {}
    }
    localStorage.setItem('lumina_videos', JSON.stringify([movie, ...parsedVids]));
    triggerToast(`"${movie.title}" hosted successfully in Cinema!`);
  };

  const handleAddAnimation = (animation: VideoMedia) => {
    const updated = [animation, ...animations];
    setAnimations(updated);

    const storedVids = localStorage.getItem('lumina_videos');
    let parsedVids: VideoMedia[] = curatedVideos;
    if (storedVids) {
      try { parsedVids = JSON.parse(storedVids); } catch(e) {}
    }
    localStorage.setItem('lumina_videos', JSON.stringify([animation, ...parsedVids]));
    triggerToast(`"${animation.title}" hosted successfully in Animation Station!`);
  };

  const handleAddPlaylist = (playlist: Playlist) => {
    const updated = [playlist, ...playlists];
    setPlaylists(updated);
    localStorage.setItem('lumina_playlists', JSON.stringify(updated));
    triggerToast(`Playlist "${playlist.title}" compiled successfully!`);
  };

  // Deletion helper
  const handleDeletePlaylist = (id: string) => {
    const updated = playlists.filter(p => p.id !== id);
    setPlaylists(updated);
    localStorage.setItem('lumina_playlists', JSON.stringify(updated));
    triggerToast('Custom playlist deleted.');
  };

  const handleDeleteVideo = (id: string) => {
    // Movies
    const updatedMovies = movies.filter(m => m.id !== id);
    setMovies(updatedMovies);

    // Animations
    const updatedAnims = animations.filter(a => a.id !== id);
    setAnimations(updatedAnims);

    // Sync localStorage
    const storedVids = localStorage.getItem('lumina_videos');
    if (storedVids) {
      try {
        const parsed: VideoMedia[] = JSON.parse(storedVids);
        const filtered = parsed.filter(v => v.id !== id);
        localStorage.setItem('lumina_videos', JSON.stringify(filtered));
      } catch(e) {}
    }
    triggerToast('Hosted video removed.');
  };

  // Favorite handler
  const handleToggleFavorite = (trackId: string) => {
    let nextFavs: string[];
    if (favorites.includes(trackId)) {
      nextFavs = favorites.filter(id => id !== trackId);
      triggerToast('Removed from favorites.');
    } else {
      nextFavs = [...favorites, trackId];
      triggerToast('Added to favorites!');
    }
    setFavorites(nextFavs);
    localStorage.setItem('lumina_favorites', JSON.stringify(nextFavs));
  };

  // Dynamic Audio player skip triggers
  const handleNextTrack = () => {
    if (!currentPlaylist || currentPlaylist.tracks.length === 0) return;

    const currentIdx = currentPlaylist.tracks.findIndex(t => t.id === currentTrack?.id);
    let nextIdx = 0;

    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * currentPlaylist.tracks.length);
    } else {
      nextIdx = currentIdx + 1;
      if (nextIdx >= currentPlaylist.tracks.length) {
        nextIdx = 0; // loop back to start
      }
    }

    const nextTrack = currentPlaylist.tracks[nextIdx];
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (!currentPlaylist || currentPlaylist.tracks.length === 0) return;

    const currentIdx = currentPlaylist.tracks.findIndex(t => t.id === currentTrack?.id);
    let prevIdx = 0;

    if (isShuffle) {
      prevIdx = Math.floor(Math.random() * currentPlaylist.tracks.length);
    } else {
      prevIdx = currentIdx - 1;
      if (prevIdx < 0) {
        prevIdx = currentPlaylist.tracks.length - 1; // loop to end
      }
    }

    const prevTrack = currentPlaylist.tracks[prevIdx];
    setCurrentTrack(prevTrack);
    setIsPlaying(true);
  };

  const handlePlayTrack = (track: Track, playlist: Playlist) => {
    setCurrentTrack(track);
    setCurrentPlaylist(playlist);
    setIsPlaying(true);
    triggerToast(`Streaming "${track.title}" • ${track.artist}`);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length === 0) {
      triggerToast('This playlist has no soundtracks loaded.');
      return;
    }
    setCurrentPlaylist(playlist);
    setCurrentTrack(playlist.tracks[0]);
    setIsPlaying(true);
    triggerToast(`Streaming playlist: "${playlist.title}"`);
  };

  const handlePlayVideo = (video: VideoMedia) => {
    setSelectedVideo(video);
    setIsPlaying(false); // Pause any background music when they play a video
  };

  // Static Action items
  const handleUpgradePro = () => {
    triggerToast('✨ Lumina Pro active! Full bandwidth pipeline enabled.');
  };

  const handleSupport = () => {
    triggerToast('💬 Connecting to Lumina Support agent...');
  };

  const handleSignOut = () => {
    triggerToast('👋 Cleared custom library. Sign-out successful!');
    localStorage.removeItem('lumina_playlists');
    localStorage.removeItem('lumina_videos');
    localStorage.removeItem('lumina_favorites');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="bg-[#131315] text-[#e5e1e4] font-sans h-screen flex flex-col overflow-hidden relative selection:bg-[#00eefc] selection:text-black">
      
      {/* Toast Alert Notice */}
      {toast && (
        <div
          id="toast-notification"
          className="fixed top-6 right-6 z-50 bg-[#201f21]/90 backdrop-blur-md border border-[#00dbe9]/30 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,219,233,0.2)] flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300 select-none max-w-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#00dbe9] animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Container Core */}
      <div className="flex flex-1 h-full relative overflow-hidden">
        
        {/* Sidebar Nav (Left) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSearchQuery(''); // Clear searches when navigating tabs
          }}
          onUpgradeClick={handleUpgradePro}
          onSupportClick={handleSupport}
          onSignOutClick={handleSignOut}
        />

        {/* Action view workspace (Right) */}
        <main className="flex-1 md:ml-64 flex flex-col relative h-full overflow-hidden">
          
          {/* Header (Top) */}
          <Header
            activeTab={activeTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenSettings={() => triggerToast('Lumina Preference Engine active.')}
            onOpenNotifications={() => triggerToast('Viewing notification log.')}
          />

          {/* Scrollable Main Stage */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-12 py-8 pb-36">
            {activeTab === 'dashboard' && (
              <DashboardView
                playlists={playlists}
                movies={movies}
                animations={animations}
                searchQuery={searchQuery}
                onPlayPlaylist={handlePlayPlaylist}
                onPlayVideo={handlePlayVideo}
                favorites={favorites}
              />
            )}

            {activeTab === 'movies' && (
              <MoviesView
                movies={movies}
                onPlayVideo={handlePlayVideo}
                onOpenAddModal={() => setShowAddModal(true)}
                onDeleteVideo={handleDeleteVideo}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'animations' && (
              <AnimationView
                animations={animations}
                onPlayVideo={handlePlayVideo}
                onOpenAddModal={() => setShowAddModal(true)}
                onDeleteVideo={handleDeleteVideo}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'music' && (
              <MusicView
                playlists={playlists}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onPlayPlaylist={handlePlayPlaylist}
                favorites={favorites}
                toggleFavorite={handleToggleFavorite}
                onOpenAddModal={() => setShowAddModal(true)}
                onDeletePlaylist={handleDeletePlaylist}
                searchQuery={searchQuery}
              />
            )}
          </div>

        </main>
      </div>

      {/* Persistent Media Controller bar (Bottom) */}
      <MediaPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        volume={volume}
        setVolume={setVolume}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        isRepeat={isRepeat}
        setIsRepeat={setIsRepeat}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        favorites={favorites}
        toggleFavorite={handleToggleFavorite}
      />

      {/* Cinematic Modal Custom Video Player (Popup) */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          relatedVideos={selectedVideo.isAnimation ? animations : movies}
          onPlayVideo={handlePlayVideo}
        />
      )}

      {/* Custom Media host uploader (Popup) */}
      {showAddModal && (
        <AddContentModal
          onClose={() => setShowAddModal(false)}
          onAddMovie={handleAddMovie}
          onAddAnimation={handleAddAnimation}
          onAddPlaylist={handleAddPlaylist}
        />
      )}

      {/* Mobile Navigation Bar (Bottom) */}
      <nav
        id="mobile-navigation"
        className="fixed bottom-0 left-0 right-0 h-16 bg-[#0e0e10]/95 backdrop-blur-xl border-t border-white/5 flex md:hidden items-center justify-around px-4 z-40 shadow-2xl"
      >
        <button
          onClick={() => { setActiveTab('dashboard'); setSearchQuery(''); }}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            activeTab === 'dashboard' ? 'text-[#00dbe9]' : 'text-[#d4c0d7] opacity-60'
          }`}
        >
          <Compass size={18} />
          <span className="text-[9px] font-sans font-bold tracking-wide">Home</span>
        </button>

        <button
          onClick={() => { setActiveTab('movies'); setSearchQuery(''); }}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            activeTab === 'movies' ? 'text-[#00dbe9]' : 'text-[#d4c0d7] opacity-60'
          }`}
        >
          <Film size={18} />
          <span className="text-[9px] font-sans font-bold tracking-wide">Movies</span>
        </button>

        <button
          onClick={() => { setActiveTab('animations'); setSearchQuery(''); }}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            activeTab === 'animations' ? 'text-[#00dbe9]' : 'text-[#d4c0d7] opacity-60'
          }`}
        >
          <Sparkles size={18} />
          <span className="text-[9px] font-sans font-bold tracking-wide">Animation</span>
        </button>

        <button
          onClick={() => { setActiveTab('music'); setSearchQuery(''); }}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            activeTab === 'music' ? 'text-[#00dbe9]' : 'text-[#d4c0d7] opacity-60'
          }`}
        >
          <Music size={18} />
          <span className="text-[9px] font-sans font-bold tracking-wide">Music</span>
        </button>
      </nav>

    </div>
  );
}
