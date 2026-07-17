import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, Menu, X, Sliders } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
}

export default function Header({
  activeTab,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  onOpenNotifications,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Arrival', text: '"Sintel" is now available in high fidelity.', time: '10m ago', unread: true },
    { id: 2, title: 'Curator\'s Pick', text: '"Late Night Beats" received 4 new cyber synth tracks.', time: '2h ago', unread: true },
    { id: 3, title: 'Lumina Premium', text: 'Thank you for exploring our entertainment space!', time: '1d ago', unread: false },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Lumina Dashboard';
      case 'movies':
        return 'Movie Theater';
      case 'animations':
        return 'Animation Station';
      case 'music':
        return 'Music Library';
      default:
        return 'Lumina Library';
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'movies':
        return 'Search movies and genres...';
      case 'animations':
        return 'Search animations and tags...';
      case 'music':
        return 'Search playlists and tracks...';
      default:
        return 'Search anything on Lumina...';
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header
      id="header-navigation"
      className="sticky top-0 z-30 flex justify-between items-center w-full px-6 md:px-12 py-4 bg-neutral-950/75 backdrop-blur-xl border-b border-neutral-800 shadow-sm"
    >
      {/* Tab Title / Mobile Logo */}
      <div className="flex items-center gap-4">
        <h2 id="header-title" className="font-sans text-lg font-black uppercase tracking-[0.2em] text-white hidden md:block">
          {getTitle()}
        </h2>
        <div className="md:hidden">
          <h2 className="font-sans text-xl font-black tracking-tighter italic text-fuchsia-500 uppercase">
            Lumina
          </h2>
        </div>
      </div>

      {/* Control Area: Search & Actions */}
      <div className="flex items-center gap-6 flex-1 justify-end max-w-4xl">
        {/* Real-time Search Input */}
        <div className="relative w-full max-w-xs md:max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            id="search-media"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-none py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-neutral-500 focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all duration-300"
            placeholder={getSearchPlaceholder()}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* System Utilities */}
        <div className="flex items-center gap-4 relative">
          {/* Notifications Trigger */}
          <div className="relative" ref={notificationRef}>
            <button
              id="header-btn-notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                onOpenNotifications();
              }}
              className="p-2 rounded-none text-neutral-400 hover:text-fuchsia-500 hover:bg-neutral-900 active:scale-95 transition-all duration-300 relative"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-fuchsia-500 rounded-full ring-1 ring-neutral-950 animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-none shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800 mb-2">
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2 rounded-none text-xs transition-colors ${
                        notif.unread ? 'bg-fuchsia-500/5 border-l-2 border-fuchsia-500' : 'hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white">{notif.title}</span>
                        <span className="text-[9px] text-neutral-500 font-bold">{notif.time}</span>
                      </div>
                      <p className="text-neutral-400 mt-1 line-clamp-2 text-[11px]">{notif.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Trigger */}
          <button
            id="header-btn-settings"
            onClick={onOpenSettings}
            className="p-2 rounded-none text-neutral-400 hover:text-fuchsia-500 hover:bg-neutral-900 active:scale-95 transition-all duration-300"
            title="Lumina Settings"
          >
            <Settings size={20} />
          </button>

          {/* Divider */}
          <span className="h-6 w-px bg-neutral-800 hidden sm:block" />

          {/* Profile Badge */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-none bg-gradient-to-tr from-fuchsia-500 to-fuchsia-400 p-[1.5px] overflow-hidden shadow-sm">
              <img
                className="w-full h-full object-cover rounded-none"
                alt="Lumina Enthusiast"
                referrerPolicy="no-referrer"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80"
              />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-white hidden lg:block select-none">
              CyberEnthusiast
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
