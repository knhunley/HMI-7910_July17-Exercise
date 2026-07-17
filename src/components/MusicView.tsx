import { useState } from 'react';
import {
  Play,
  Heart,
  MoreVertical,
  Sliders,
  Grid,
  ChevronLeft,
  Music,
  Clock,
  Plus,
  Trash2,
  BookmarkCheck
} from 'lucide-react';
import { Playlist, Track } from '../types';

interface MusicViewProps {
  playlists: Playlist[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track, playlist: Playlist) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onOpenAddModal: () => void;
  onDeletePlaylist?: (id: string) => void;
  searchQuery: string;
}

export default function MusicView({
  playlists,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayPlaylist,
  favorites,
  toggleFavorite,
  onOpenAddModal,
  onDeletePlaylist,
  searchQuery,
}: MusicViewProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter playlists based on search query
  const filteredPlaylists = playlists.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tracks.some(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleBackToPlaylists = () => {
    setSelectedPlaylist(null);
  };

  // Curated spotlight (from the mockup)
  const spotlightPlaylist = playlists.find((p) => p.id === 'p1') || playlists[0];

  return (
    <div id="music-view" className="space-y-10 animate-in fade-in duration-500 pb-16">
      
      {/* 1. PLAYLIST DETAIL VIEW (IF SELECTED) */}
      {selectedPlaylist ? (
        <div id="playlist-detail" className="space-y-6">
          {/* Back Action */}
          <button
            onClick={handleBackToPlaylists}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500 hover:text-fuchsia-400 transition-colors bg-transparent border-none"
          >
            <ChevronLeft size={16} /> Back to Playlists
          </button>

          {/* Playlist Header Card */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-neutral-900 p-6 rounded-none border border-neutral-800">
            <img
              src={selectedPlaylist.thumbnailUrl}
              alt={selectedPlaylist.title}
              className="w-40 h-40 md:w-48 md:h-48 rounded-none object-cover shadow-2xl border border-neutral-800"
            />
            <div className="flex-1 text-center md:text-left space-y-2">
              <span className="text-[9px] bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 px-3 py-1 rounded-none font-black uppercase tracking-widest font-sans">
                {selectedPlaylist.creator}
              </span>
              <h3 className="font-sans text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                {selectedPlaylist.title}
              </h3>
              <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                {selectedPlaylist.description}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3 text-[10px] text-neutral-500 font-black uppercase tracking-widest">
                <span>{selectedPlaylist.tracks.length} tracks</span>
                <span>•</span>
                <span>Duration: {selectedPlaylist.duration}</span>
                <span>•</span>
                <span>Last updated {selectedPlaylist.lastModified}</span>
              </div>
            </div>

            {/* Play All Button */}
            <button
              onClick={() => onPlayPlaylist(selectedPlaylist)}
              className="px-6 py-3.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-none font-sans text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(217,70,239,0.2)] active:scale-95 transition-all duration-300 flex items-center gap-2 shrink-0 self-center md:self-end"
            >
              <Play size={16} fill="currentColor" /> Play Playlist
            </button>
          </div>

          {/* Soundtrack Tracks Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-none overflow-hidden shadow-xl">
            <div className="p-4 bg-neutral-950/40 border-b border-neutral-800 hidden md:grid grid-cols-12 text-[10px] font-black tracking-widest text-neutral-500 uppercase font-mono">
              <span className="col-span-1 text-center">#</span>
              <span className="col-span-5">Title / Artist</span>
              <span className="col-span-3">Album</span>
              <span className="col-span-1 text-center">Fav</span>
              <span className="col-span-1 text-center"><Clock size={14} className="mx-auto" /></span>
              <span className="col-span-1"></span>
            </div>

            <div className="divide-y divide-neutral-800/60">
              {selectedPlaylist.tracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                const isFav = favorites.includes(track.id);

                return (
                  <div
                    key={track.id}
                    className={`group grid grid-cols-1 md:grid-cols-12 items-center p-4 hover:bg-neutral-800/40 transition-colors cursor-pointer ${
                      isCurrent ? 'bg-fuchsia-500/5' : ''
                    }`}
                    onClick={() => onPlayTrack(track, selectedPlaylist)}
                  >
                    {/* Track Number / Play Trigger */}
                    <div className="col-span-1 text-center hidden md:block">
                      <span className="text-xs font-black text-neutral-500 group-hover:hidden">
                        {idx + 1}
                      </span>
                      <Play
                        size={12}
                        className="mx-auto hidden group-hover:block text-fuchsia-500 fill-current"
                      />
                    </div>

                    {/* Image & Title */}
                    <div className="col-span-12 md:col-span-5 flex items-center gap-4 min-w-0">
                      <img
                        src={track.thumbnailUrl}
                        alt={track.title}
                        className="w-10 h-10 rounded-none object-cover shadow-md border border-neutral-800"
                      />
                      <div className="min-w-0">
                        <h4
                          className={`text-xs font-black uppercase tracking-wider truncate ${
                            isCurrent ? 'text-fuchsia-500' : 'text-white'
                          }`}
                        >
                          {track.title}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 truncate mt-0.5">{track.artist}</p>
                      </div>
                    </div>

                    {/* Album Name */}
                    <div className="col-span-12 md:col-span-3 mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest text-neutral-400 truncate">
                      {track.album || 'Single'}
                    </div>

                    {/* Favorite Heart Trigger */}
                    <div className="col-span-6 md:col-span-1 text-left md:text-center mt-3 md:mt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(track.id);
                        }}
                        className={`p-1 rounded-none transition-transform active:scale-90 ${
                          isFav ? 'text-fuchsia-500 scale-110' : 'text-neutral-500 hover:text-fuchsia-500'
                        }`}
                      >
                        <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Time Duration */}
                    <div className="col-span-6 md:col-span-1 text-right md:text-center text-xs font-mono text-neutral-400 mt-3 md:mt-0">
                      {track.duration}
                    </div>

                    {/* Track More Dots */}
                    <div className="col-span-12 md:col-span-1 text-right mt-3 md:mt-0 hidden md:block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-neutral-500 hover:text-white"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* 2. MAIN PLAYLIST PORTAL VIEW */
        <>
          {/* Spotlight Hero Section (From the Mockup Screenshot) */}
          {spotlightPlaylist && !searchQuery && (
            <section
              id="music-hero-spotlight"
              className="relative overflow-hidden shadow-2xl p-6 md:p-10 flex flex-col justify-end bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent min-h-64 border border-neutral-800 rounded-none"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&q=80"
                  alt="Electric Midnight"
                  className="w-full h-full object-cover opacity-35"
                />
              </div>
              <div className="relative z-10 w-full md:w-3/4 space-y-4">
                <span className="bg-fuchsia-600 text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 mb-4 inline-block text-white select-none">
                  CURATED FOR YOU
                </span>
                <h3 className="font-sans text-4xl md:text-6xl font-black leading-none tracking-tighter uppercase text-white">
                  Electric Midnight
                </h3>
                <p className="text-xs text-neutral-300 max-w-xl opacity-90 leading-relaxed font-medium">
                  Immerse yourself in deep synthesizers and pulsating rhythms designed for high-focus late night sessions.
                </p>
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => onPlayPlaylist(spotlightPlaylist)}
                    className="px-6 py-3.5 bg-white hover:bg-fuchsia-500 text-black hover:text-white font-sans text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 flex items-center gap-1.5 rounded-none"
                  >
                    <Play size={14} fill="currentColor" /> Play Now
                  </button>
                  <button
                    onClick={() => handlePlaylistClick(spotlightPlaylist)}
                    className="px-6 py-3.5 bg-neutral-950/80 border border-neutral-800 text-white font-sans text-xs font-black uppercase tracking-widest hover:bg-neutral-900 active:scale-95 transition-all duration-300 rounded-none"
                  >
                    Save to Library
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Your Playlists Section Title bar (Matches Mockup) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-sans text-xl font-black uppercase tracking-[0.25em] text-white">
                  Your Playlists
                </h4>
                <p className="text-xs font-black uppercase tracking-widest text-neutral-500 mt-1">
                  Click on any playlist card to view full soundtrack items.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddModal}
                  className="p-2.5 rounded-none border border-neutral-800 bg-neutral-900 text-fuchsia-500 hover:text-fuchsia-400 hover:bg-neutral-800 active:scale-95 transition-all"
                  title="Host Custom Playlist"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-none border border-neutral-800 bg-neutral-900 transition-all ${
                    viewMode === 'list' ? 'text-fuchsia-500 bg-neutral-800' : 'text-neutral-500 hover:text-white'
                  }`}
                  title="List View"
                >
                  <Sliders size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-none border border-neutral-800 bg-neutral-900 transition-all ${
                    viewMode === 'grid' ? 'text-fuchsia-500 bg-neutral-800' : 'text-neutral-500 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
              </div>
            </div>

            {/* Playlists Output Container */}
            {filteredPlaylists.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-none">
                <Music size={48} className="mx-auto text-neutral-600 mb-4 stroke-[1.5]" />
                <p className="text-neutral-400 font-sans text-sm font-bold">No soundtracks found.</p>
                <p className="text-xs text-neutral-500 mt-2 font-medium">Try importing or creating a custom playlist!</p>
              </div>
            ) : viewMode === 'list' ? (
              /* LIST VIEW ROWS (REPLICATES SCREENSHOT MOCKUP) */
              <div className="space-y-3">
                {filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-none hover:border-fuchsia-500 transition-all duration-300 group cursor-pointer"
                  >
                    {/* Left: Thumbnail & Titles */}
                    <div
                      className="flex items-center gap-4 flex-1 min-w-0"
                      onClick={() => handlePlaylistClick(playlist)}
                    >
                      <div className="relative w-16 h-16 rounded-none overflow-hidden flex-shrink-0 shadow-lg border border-neutral-800">
                        <img
                          src={playlist.thumbnailUrl}
                          alt={playlist.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Play Icon overlay */}
                        <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="p-2 rounded-none bg-fuchsia-600 text-white shadow-lg">
                            <Play size={12} fill="currentColor" />
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-sans text-xs font-black uppercase tracking-wider text-white group-hover:text-fuchsia-500 transition-colors">
                          {playlist.title}
                        </h5>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">
                          {playlist.creator} • {playlist.tracks.length} tracks
                        </p>
                      </div>
                    </div>

                    {/* Middle Metadata (Hidden on Mobile) */}
                    <div
                      className="hidden md:flex flex-1 items-center justify-around px-8 gap-8"
                      onClick={() => handlePlaylistClick(playlist)}
                    >
                      <div className="flex flex-col">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-black">
                          Duration
                        </span>
                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                          {playlist.duration}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-black">
                          Last Modified
                        </span>
                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                          {playlist.lastModified}
                        </span>
                      </div>
                    </div>

                    {/* Right Action buttons */}
                    <div className="flex items-center gap-3">
                      {playlist.isCurated ? (
                        <span
                          className="text-[9px] text-fuchsia-400 flex items-center gap-1 uppercase tracking-widest bg-fuchsia-500/10 border border-fuchsia-500/20 px-2.5 py-1 rounded-none font-black"
                          title="Lumina Curated Channel"
                        >
                          <BookmarkCheck size={9} />
                          Curated
                        </span>
                      ) : (
                        onDeletePlaylist && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePlaylist(playlist.id);
                            }}
                            className="p-1.5 rounded-none text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete custom playlist"
                          >
                            <Trash2 size={13} />
                          </button>
                        )
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayPlaylist(playlist);
                        }}
                        className="p-2.5 rounded-none text-white hover:text-fuchsia-500"
                      >
                        <Play size={15} fill="currentColor" />
                      </button>
                      <button className="text-neutral-500 hover:text-white">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* GRID VIEW CARDS */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-none p-4 flex flex-col justify-between hover:border-fuchsia-500 transition-all group cursor-pointer"
                    onClick={() => handlePlaylistClick(playlist)}
                  >
                    <div>
                      <div className="relative aspect-square rounded-none overflow-hidden mb-4 shadow-md border border-neutral-800">
                        <img
                          src={playlist.thumbnailUrl}
                          alt={playlist.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="p-3 rounded-none bg-fuchsia-600 text-white shadow-xl">
                            <Play size={16} fill="currentColor" />
                          </span>
                        </div>
                      </div>
                      <h5 className="font-sans text-xs font-black uppercase tracking-wider text-white truncate group-hover:text-fuchsia-500 transition-colors">
                        {playlist.title}
                      </h5>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1 truncate">
                        {playlist.creator} • {playlist.tracks.length} tracks
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-neutral-800">
                      <span className="text-[10px] font-mono text-neutral-500">
                        {playlist.duration}
                      </span>
                      {onDeletePlaylist && !playlist.isCurated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePlaylist(playlist.id);
                          }}
                          className="text-neutral-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

    </div>
  );
}
