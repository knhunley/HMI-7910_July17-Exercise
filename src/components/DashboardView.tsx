import { Play, Sparkles, Clapperboard, Heart, ListMusic, Music, Hourglass, Film } from 'lucide-react';
import { VideoMedia, Playlist, Track } from '../types';

interface DashboardViewProps {
  playlists: Playlist[];
  movies: VideoMedia[];
  animations: VideoMedia[];
  searchQuery: string;
  onPlayPlaylist: (playlist: Playlist) => void;
  onPlayVideo: (video: VideoMedia) => void;
  favorites: string[];
}

export default function DashboardView({
  playlists,
  movies,
  animations,
  searchQuery,
  onPlayPlaylist,
  onPlayVideo,
  favorites,
}: DashboardViewProps) {
  // Filter based on search query
  const filteredPlaylists = playlists.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAnimations = animations.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const allMediaCount =
    playlists.length +
    movies.length +
    animations.length +
    playlists.reduce((acc, p) => acc + p.tracks.length, 0);

  // Spotlight media item (e.g., Sintel or Tears of Steel)
  const spotlightItem = movies[0] || null;

  return (
    <div id="dashboard-view" className="space-y-10 animate-in fade-in duration-500">
      
      {/* Featured Spotlight Section */}
      {spotlightItem && !searchQuery && (
        <section className="relative overflow-hidden group border border-neutral-800 bg-neutral-900">
          {/* Glass background overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent z-10" />
          <img
            className="w-full h-80 md:h-96 object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-40"
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200"
            alt="Spotlight Spotlight"
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4 z-20">
            <span className="bg-fuchsia-600 text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 mb-4 inline-block text-white select-none">
              Featured Spotlight
            </span>
            <h3 className="font-sans text-4xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase mb-4 text-white">
              {spotlightItem.title.split(' ')[0]}<br/>
              <span className="text-fuchsia-500">{spotlightItem.title.split(' ').slice(1).join(' ') || 'Dynasty'}</span>
            </h3>
            <p className="text-neutral-300 font-sans text-sm md:text-base max-w-xl opacity-90 line-clamp-2 leading-relaxed mb-6 font-medium">
              {spotlightItem.description}
            </p>
            <div className="flex gap-4 flex-wrap items-center">
              <button
                id="spotlight-play-btn"
                onClick={() => onPlayVideo(spotlightItem)}
                className="bg-white text-black px-8 py-3.5 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-fuchsia-400 transition-colors rounded-none shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
              >
                <Play size={14} fill="currentColor" /> Watch Now
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-800 bg-neutral-950 px-4 py-3 select-none">
                Directed by {spotlightItem.creator} • {spotlightItem.duration}
              </span>
            </div>
          </div>
          {/* Floating Side Info */}
          <div className="absolute right-8 bottom-8 flex flex-col items-end gap-2 z-20 hidden md:flex">
            <div className="text-6xl font-black italic text-neutral-800 opacity-60 select-none">01</div>
            <div className="w-1 bg-fuchsia-500 h-16"></div>
            <div className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500">LIVE PRO PIPELINE</div>
          </div>
        </section>
      )}

      {/* Main Dashboard Hub / Search results */}
      {searchQuery ? (
        <div className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500">
            Search results for "{searchQuery}"
          </h3>

          {/* Combined list */}
          {filteredPlaylists.length === 0 && filteredMovies.length === 0 && filteredAnimations.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-none">
              <p className="text-neutral-400 font-sans text-sm font-bold">No matching movies, animations, or music found.</p>
              <p className="text-xs text-neutral-500 mt-2 font-medium">Try searching another title, director, or tag.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Movies */}
              {filteredMovies.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onPlayVideo(m)}
                  className="bg-neutral-900 border border-neutral-800 p-4 rounded-none hover:border-fuchsia-500 transition-all cursor-pointer group"
                >
                  <div className="relative aspect-video overflow-hidden mb-3 bg-neutral-800">
                    <img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} className="text-fuchsia-500 fill-current" />
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white truncate max-w-[200px]">{m.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">{m.creator} • Movie</p>
                    </div>
                    <span className="bg-fuchsia-500/10 text-fuchsia-400 text-[9px] px-2.5 py-0.5 font-black uppercase tracking-widest rounded-none">
                      {m.duration}
                    </span>
                  </div>
                </div>
              ))}

              {/* Animations */}
              {filteredAnimations.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onPlayVideo(a)}
                  className="bg-neutral-900 border border-neutral-800 p-4 rounded-none hover:border-fuchsia-500 transition-all cursor-pointer group"
                >
                  <div className="relative aspect-video overflow-hidden mb-3 bg-neutral-800">
                    <img src={a.thumbnailUrl} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} className="text-fuchsia-500 fill-current" />
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white truncate max-w-[200px]">{a.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">{a.creator} • Animation</p>
                    </div>
                    <span className="bg-fuchsia-500/10 text-fuchsia-400 text-[9px] px-2.5 py-0.5 font-black uppercase tracking-widest rounded-none">
                      {a.duration}
                    </span>
                  </div>
                </div>
              ))}

              {/* Music Playlists */}
              {filteredPlaylists.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onPlayPlaylist(p)}
                  className="bg-neutral-900 border border-neutral-800 p-4 rounded-none hover:border-fuchsia-500 transition-all cursor-pointer group"
                >
                  <div className="relative aspect-square overflow-hidden mb-3 max-h-48 bg-neutral-800">
                    <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} className="text-fuchsia-500 fill-current" />
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white truncate max-w-[200px]">{p.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">{p.creator} • Playlist</p>
                    </div>
                    <span className="bg-fuchsia-500/10 text-fuchsia-400 text-[9px] px-2.5 py-0.5 font-black uppercase tracking-widest rounded-none">
                      {p.tracksCount} tracks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Platform Performance Metrics (Bento Hub) */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-none flex items-center gap-4 hover:border-fuchsia-500 transition-colors">
              <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 rounded-none">
                <Film size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">{movies.length}</h4>
                <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">Movies</p>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-none flex items-center gap-4 hover:border-fuchsia-500 transition-colors">
              <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 rounded-none">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">{animations.length}</h4>
                <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">Animations</p>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-none flex items-center gap-4 hover:border-fuchsia-500 transition-colors">
              <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 rounded-none">
                <ListMusic size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">{playlists.length}</h4>
                <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">Playlists</p>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-none flex items-center gap-4 hover:border-fuchsia-500 transition-colors">
              <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 rounded-none">
                <Heart size={24} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">{favorites.length}</h4>
                <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">Favorites</p>
              </div>
            </div>

          </section>

          {/* Quick Access Media Grid */}
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-500">
                Recommended Content
              </h4>
              <div className="h-px bg-neutral-800 flex-1 mx-8 hidden sm:block"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Featured Playlist */}
              {playlists[0] && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-none p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform shadow-lg group hover:border-fuchsia-500">
                  <div>
                    <span className="text-[9px] bg-fuchsia-500/10 text-fuchsia-400 font-sans font-black px-2.5 py-1 rounded-none uppercase tracking-widest">
                      Hot Music
                    </span>
                    <h5 className="text-sm font-black uppercase tracking-wider text-white mt-4 leading-tight">
                      {playlists[0].title}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                      {playlists[0].description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{playlists[0].tracksCount} Soundtracks</span>
                    <button
                      onClick={() => onPlayPlaylist(playlists[0])}
                      className="p-3 rounded-none bg-white hover:bg-fuchsia-500 text-black hover:text-white transition-colors shadow-sm active:scale-90"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  </div>
                </div>
              )}

              {/* Featured Animation */}
              {animations[0] && (
                <div className="bg-neutral-900 border-l-4 border-fuchsia-500 bg-neutral-900/90 border-r border-y border-neutral-800 rounded-none p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform shadow-lg group hover:border-fuchsia-500">
                  <div>
                    <span className="text-[9px] bg-fuchsia-500/10 text-fuchsia-400 font-sans font-black px-2.5 py-1 rounded-none uppercase tracking-widest">
                      Trending Animation
                    </span>
                    <h5 className="text-sm font-black uppercase tracking-wider text-white mt-4 leading-tight">
                      {animations[0].title}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                      {animations[0].description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{animations[0].creator}</span>
                    <button
                      onClick={() => onPlayVideo(animations[0])}
                      className="p-3 rounded-none bg-white hover:bg-fuchsia-500 text-black hover:text-white transition-colors shadow-sm active:scale-90"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  </div>
                </div>
              )}

              {/* Featured Movie */}
              {movies[1] && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-none p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform shadow-lg group hover:border-fuchsia-500">
                  <div>
                    <span className="text-[9px] bg-fuchsia-500/10 text-fuchsia-400 font-sans font-black px-2.5 py-1 rounded-none uppercase tracking-widest">
                      Sci-Fi Cinema
                    </span>
                    <h5 className="text-sm font-black uppercase tracking-wider text-white mt-4 leading-tight">
                      {movies[1].title}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                      {movies[1].description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{movies[1].duration}</span>
                    <button
                      onClick={() => onPlayVideo(movies[1])}
                      className="p-3 rounded-none bg-white hover:bg-fuchsia-500 text-black hover:text-white transition-colors shadow-sm active:scale-90"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* Recently Viewed Block */}
          <section className="bg-neutral-900/60 border border-neutral-800 rounded-none p-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 mb-4">
              Explore Content Catalogues
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-4xl font-medium">
              Dive into our specifically curated galleries. Each corner of Lumina holds breathtaking animations, retro playlists, and high-tech cinematic movies. You can also import your own custom MP4 and M4A video/audio assets instantly!
            </p>
          </section>
        </>
      )}

    </div>
  );
}
