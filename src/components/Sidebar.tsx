import { LayoutDashboard, Film, Sparkles, Music, HelpCircle, LogOut, ArrowUpCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUpgradeClick: () => void;
  onSupportClick: () => void;
  onSignOutClick: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onUpgradeClick,
  onSupportClick,
  onSignOutClick,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'animations', label: 'Animation', icon: Sparkles },
    { id: 'music', label: 'Music', icon: Music },
  ];

  return (
    <aside
      id="sidebar-navigation"
      className="fixed left-0 top-0 h-full flex flex-col p-6 z-40 bg-[#0e0e10]/85 backdrop-blur-2xl border-r border-white/5 shadow-2xl w-64 hidden md:flex"
    >
      {/* Brand Header */}
      <div className="mb-10 px-4">
        <h1 className="text-3xl font-black tracking-tighter italic text-fuchsia-500 uppercase hover:scale-[1.02] transition-transform duration-300 select-none">
          Lumina
        </h1>
        <p className="font-sans text-[10px] uppercase font-black tracking-[0.2em] text-neutral-500">
          Entertainment Hub
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                isActive
                  ? 'text-white bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.15)] border-l-4 border-fuchsia-500 scale-[1.02]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 hover:scale-[1.01]'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-fuchsia-500' : 'text-neutral-400'} />
              <span className="font-sans text-xs font-black uppercase tracking-widest">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Upgrade Zone */}
      <div className="mt-auto space-y-4">
        <button
          id="btn-upgrade-pro"
          onClick={onUpgradeClick}
          className="w-full py-3 px-4 rounded-none bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-sans text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(217,70,239,0.2)] hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ArrowUpCircle size={16} />
          Upgrade to Pro
        </button>

        <div className="pt-6 border-t border-white/10 space-y-1">
          <button
            id="btn-support"
            onClick={onSupportClick}
            className="w-full flex items-center gap-3 text-neutral-400 hover:text-white px-4 py-3 transition-colors text-left"
          >
            <HelpCircle size={18} />
            <span className="font-sans text-xs font-black uppercase tracking-widest">Support</span>
          </button>
          <button
            id="btn-signout"
            onClick={onSignOutClick}
            className="w-full flex items-center gap-3 text-neutral-400 hover:text-red-400 px-4 py-3 transition-colors text-left"
          >
            <LogOut size={18} />
            <span className="font-sans text-xs font-black uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
