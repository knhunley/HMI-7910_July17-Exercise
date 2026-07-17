import { useState } from 'react';
import { Play, Plus, Film, Calendar, Eye, Star, Search, Trash2 } from 'lucide-react';
import { VideoMedia } from '../types';

interface MoviesViewProps {
  movies: VideoMedia[];
  onPlayVideo: (video: VideoMedia) => void;
  onOpenAddModal: () => void;
  onDeleteVideo?: (id: string) => void;
  searchQuery: string;
}

export default function MoviesView({
  movies,
  onPlayVideo,
  onOpenAddModal,
  onDeleteVideo,
  searchQuery,
}: MoviesViewProps) {
  const [selectedTag, setSelectedTag] = useState('All');

  // Gather unique tags across all movies
  const allTags = ['All', ...Array.from(new Set(movies.flatMap((m) => m.tags)))];

  // Filter based on selected tag and search query
  const filteredMovies = movies.filter((m) => {
    const matchesTag = selectedTag === 'All' || m.tags.includes(selectedTag);
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTag && matchesSearch;
  });

  return (
    <div id="movies-view" className="space-y-8 animate-in fade-in duration-500">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-sans text-xl font-black uppercase tracking-[0.25em] text-white">
            Lumina Cinema
          </h3>
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500 mt-1">
            Cinematic masterpieces and ambient video loops.
          </p>
        </div>

        {/* Add Movie Action Button */}
        <button
          id="btn-add-movie-view"
          onClick={onOpenAddModal}
          className="px-6 py-3.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-none font-sans text-xs font-black uppercase tracking-widest self-start sm:self-center shadow-[0_0_15px_rgba(217,70,239,0.2)] active:scale-95 transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={16} />
          HOST NEW VIDEO
        </button>
      </div>

      {/* Genre Tags Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 border transition-all duration-300 whitespace-nowrap text-[10px] font-black uppercase tracking-widest rounded-none ${
              selectedTag === tag
                ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-[0_0_10px_rgba(217,70,239,0.2)]'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            {tag === 'All' ? 'All Genres' : tag}
          </button>
        ))}
      </div>

      {/* Movies Cards Grid */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-none">
          <Film size={48} className="mx-auto text-neutral-600 mb-4 stroke-[1.5]" />
          <p className="text-neutral-400 font-sans text-sm font-bold">No films found matching your filter.</p>
          <p className="text-xs text-neutral-500 mt-2 font-medium">Try choosing a different genre or uploading an MP4 video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex flex-col bg-neutral-900 border border-neutral-800 rounded-none overflow-hidden hover:border-fuchsia-500 transition-all duration-300 group cursor-pointer"
            >
              
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video bg-black overflow-hidden"
                onClick={() => onPlayVideo(movie)}
              >
                <img
                  src={movie.thumbnailUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                />
                
                {/* Visual Glassmorphic play button */}
                <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="p-4 rounded-none bg-fuchsia-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] transform scale-90 group-hover:scale-100 transition-all duration-300">
                    <Play size={20} fill="currentColor" />
                  </span>
                </div>

                {/* Left Bottom corner badge */}
                <span className="absolute bottom-3 left-3 bg-neutral-950/80 border border-neutral-800 text-[9px] text-neutral-300 px-2.5 py-1 rounded-none font-black tracking-widest">
                  {movie.duration}
                </span>
              </div>

              {/* Movie Info body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2" onClick={() => onPlayVideo(movie)}>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-sans text-sm font-black uppercase tracking-wider text-white line-clamp-1 group-hover:text-fuchsia-500 transition-colors">
                      {movie.title}
                    </h4>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500">
                    {movie.creator}
                  </p>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800">
                  <div className="flex items-center gap-3 text-[9px] text-neutral-500 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-fuchsia-500" />
                      {movie.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} className="text-fuchsia-500" />
                      {movie.views || '0'} views
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onDeleteVideo && !movie.id.startsWith('v') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteVideo(movie.id);
                        }}
                        className="p-1.5 rounded-none text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-all"
                        title="Delete custom movie"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    <span className="flex items-center gap-0.5 text-xs text-yellow-400 font-bold font-mono">
                      ★ {movie.rating}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
