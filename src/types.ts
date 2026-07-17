export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string; // e.g. "3:42"
  durationSeconds: number; // e.g. 222
  mediaUrl: string; // URL to the .m4a or .mp3 file
  thumbnailUrl: string;
  lyrics?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  creator: string; // e.g. "Lumina Curated" or "Personal Playlist"
  tracksCount: number;
  duration: string; // e.g. "6h 45m"
  lastModified: string; // e.g. "2 days ago"
  tracks: Track[];
  isCurated?: boolean;
}

export interface VideoMedia {
  id: string;
  title: string;
  creator: string; // director/studio
  description: string;
  duration: string; // e.g. "12m" or "1h 45m"
  durationSeconds: number;
  thumbnailUrl: string;
  mediaUrl: string; // URL to the .mp4 file
  tags: string[];
  year: string;
  isAnimation: boolean; // false for Movies, true for Animations
  views?: string;
  rating?: string;
}

export interface PlaybackState {
  currentTrack: Track | null;
  currentPlaylist: Playlist | null;
  isPlaying: boolean;
  volume: number;
  progress: number; // in seconds
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
}
