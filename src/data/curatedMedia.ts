import { Playlist, VideoMedia, Track } from '../types';

// Let's use high-quality, working royalty-free MP3 tracks
export const curatedTracks: Track[] = [
  {
    id: 't1',
    title: 'Hyperdrive',
    artist: 'Neon Dreams',
    album: 'Electric Future',
    duration: '6:12',
    durationSeconds: 372,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
    lyrics: `[Instrumental Intro]\n\nRunning in the grid, through the digital street\nWe feel the laser pulse and the heavy synth beat\nHyperdrive is active, speed of neon light\nWe are taking off to the electronic night.\n\n[Chorus]\nFly with me across the cyber dome\nElectric dreams will lead us home\nWe don't need a map, we don't need a key\nJust the binary waves of the memory tree.`
  },
  {
    id: 't2',
    title: 'Electric Midnight',
    artist: 'Cyber Synth',
    album: 'Nightlife Chronicles',
    duration: '7:05',
    durationSeconds: 425,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80',
    lyrics: `[Intro with Arpeggiator]\n\nElectric midnight, the cities glow\nPurple currents start to flow\nIn the shadow of the spire\nWe ignite the neon fire.\n\n[Synthesizer Solo]`
  },
  {
    id: 't3',
    title: 'Stardust',
    artist: 'Retro Lofi',
    album: 'Vintage Dreams',
    duration: '5:44',
    durationSeconds: 344,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&q=80',
    lyrics: 'Chill beats under a stellar sky. Drift off into a lo-fi orbit...'
  },
  {
    id: 't4',
    title: 'Midnight City',
    artist: 'Synthwave Project',
    album: 'Outrun 84',
    duration: '5:02',
    durationSeconds: 302,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515462277126-270d878326e5?w=300&q=80'
  },
  {
    id: 't5',
    title: 'Pixel Quest',
    artist: '8-Bit Hero',
    album: 'Arcade Legends',
    duration: '6:03',
    durationSeconds: 363,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&q=80'
  },
  {
    id: 't6',
    title: 'Cyber Drift',
    artist: 'Neon Dreams',
    album: 'Outrun 84',
    duration: '5:34',
    durationSeconds: 334,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&q=80'
  },
  {
    id: 't7',
    title: 'Study Session',
    artist: 'Chill Lofi',
    album: 'Afternoon Beats',
    duration: '7:42',
    durationSeconds: 462,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=300&q=80'
  },
  {
    id: 't8',
    title: 'Cozy Window',
    artist: 'Dreamy Beats',
    album: 'Afternoon Beats',
    duration: '5:18',
    durationSeconds: 318,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&q=80'
  },
  {
    id: 't9',
    title: 'Sakura Wind',
    artist: 'Anime Project',
    album: 'Tokyo Seasons',
    duration: '6:12',
    durationSeconds: 372,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Reuse for anime vibes
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80'
  },
  {
    id: 't10',
    title: 'Neo Tokyo Streets',
    artist: 'Cyberpunk Anime',
    album: 'Tokyo Seasons',
    duration: '7:05',
    durationSeconds: 425,
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=300&q=80'
  }
];

export const curatedPlaylists: Playlist[] = [
  {
    id: 'p1',
    title: 'Late Night Beats',
    description: 'Chill arpeggiations and deep beats for late night drives and late night coding.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
    creator: 'Lumina Curated',
    tracksCount: 4,
    duration: '24m 03s',
    lastModified: '2 days ago',
    isCurated: true,
    tracks: [curatedTracks[0], curatedTracks[1], curatedTracks[2], curatedTracks[3]]
  },
  {
    id: 'p2',
    title: 'Gaming Mix',
    description: 'High-energy electronic, synthwave, and 8-bit tracks to fuel your gaming sessions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80',
    creator: 'Personal Playlist',
    tracksCount: 3,
    duration: '16m 41s',
    lastModified: 'Yesterday',
    isCurated: false,
    tracks: [curatedTracks[4], curatedTracks[5], curatedTracks[0]]
  },
  {
    id: 'p3',
    title: 'Lo-Fi Study',
    description: 'Smooth rhythms, vinyl crackle, and soft melodies for work, study, and deep focus.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&q=80',
    creator: 'Lumina Essentials',
    tracksCount: 3,
    duration: '18m 44s',
    lastModified: '1 week ago',
    isCurated: true,
    tracks: [curatedTracks[6], curatedTracks[7], curatedTracks[2]]
  },
  {
    id: 'p4',
    title: 'Anime Soundtracks',
    description: 'Vibrant, cinematic melodies and electronic beats inspired by futuristic anime aesthetics.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80',
    creator: 'Animation Hits',
    tracksCount: 3,
    duration: '18m 21s',
    lastModified: '3 days ago',
    isCurated: true,
    tracks: [curatedTracks[8], curatedTracks[9], curatedTracks[1]]
  }
];

export const curatedVideos: VideoMedia[] = [
  // Movies (isAnimation = false)
  {
    id: 'v1',
    title: 'Tears of Steel',
    creator: 'Blender Foundation',
    description: 'A sci-fi action short featuring giant robots, high-tech weapons, and a futuristic Amsterdam setting. This project showcases highly realistic CGI integrated with live-action footage.',
    duration: '12m 14s',
    durationSeconds: 734,
    thumbnailUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    tags: ['Sci-Fi', 'CGI', 'Action', 'Robots'],
    year: '2012',
    isAnimation: false,
    views: '1.2M',
    rating: '8.4'
  },
  {
    id: 'v2',
    title: 'Cyber Odyssey',
    creator: 'Cosmic Studio',
    description: 'A breathtaking cinematic drive through a high-octane neon metropolis. Perfect for ambient visualization or setting the mood for a sci-fi streaming night.',
    duration: '0m 15s',
    durationSeconds: 15,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tags: ['Neon', 'Vibe', 'Cinematic', 'Ambient'],
    year: '2024',
    isAnimation: false,
    views: '340K',
    rating: '7.8'
  },
  {
    id: 'v3',
    title: 'The Great Outdoors',
    creator: 'Apex Explorers',
    description: 'A stunning documentary-style showcase of majestic mountains, rapid rivers, and untamed wildlife. An exploration of the planet\'s raw and pure power.',
    duration: '0m 30s',
    durationSeconds: 30,
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    tags: ['Documentary', 'Nature', 'Cinematic'],
    year: '2023',
    isAnimation: false,
    views: '150K',
    rating: '7.5'
  },

  // Animations (isAnimation = true)
  {
    id: 'v4',
    title: 'Sintel',
    creator: 'Blender Institute',
    description: 'An emotional fantasy story about a lonely girl named Sintel who rescues and forms a deep bond with a baby dragon. When the dragon is taken, she embarks on a dangerous and life-changing quest to find him.',
    duration: '14m 48s',
    durationSeconds: 888,
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    tags: ['Fantasy', 'CGI', 'Emotion', 'Adventure'],
    year: '2010',
    isAnimation: true,
    views: '2.5M',
    rating: '9.0'
  },
  {
    id: 'v5',
    title: 'Big Buck Bunny',
    creator: 'Peach Open Movie',
    description: 'A hilarious comedy animation centered on a giant, soft-hearted rabbit. When three mischievous woodland rodents decide to bully him and ruin his peaceful day, he devises a comical plan for revenge.',
    duration: '9m 56s',
    durationSeconds: 596,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tags: ['Comedy', 'Cartoon', 'Classic', 'Family'],
    year: '2008',
    isAnimation: true,
    views: '4.8M',
    rating: '8.1'
  },
  {
    id: 'v6',
    title: 'Elephants Dream',
    creator: 'Orange Open Movie',
    description: 'The world\'s first open-source 3D animated film. It presents a highly surreal and mechanical world where two characters explore the bizarre, abstract machinery of a giant machine city.',
    duration: '10m 53s',
    durationSeconds: 653,
    thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    tags: ['Surreal', 'Abstract', 'Sci-Fi', 'Steampunk'],
    year: '2006',
    isAnimation: true,
    views: '890K',
    rating: '7.2'
  }
];
