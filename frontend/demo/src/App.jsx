import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Clock3, 
  FolderOpen, 
  BarChart3, 
  Download, 
  Settings,
  ChevronLeft, 
  ChevronRight, 
  Send,
  AlertTriangle,
  Hourglass,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  User
} from 'lucide-react';
import { mockCategories as categoriesDataRaw, formatDuration } from './mocks/data';

const categoriesData = [
  { name: "Work", subCats: ["Coding", "Meeting", "Doc", "Research"], time: 120, color: "bg-emerald-400" },
  { name: "Learning", subCats: ["Reading", "Language", "Algorithmic"], time: 45, color: "bg-orange-400" },
  { name: "Life", subCats: ["Exercise", "Cooking", "Shopping"], time: 60, color: "bg-blue-400" },
  { name: "Rest", subCats: ["Sleep", "Nap", "Meditation"], time: 210, color: "bg-indigo-400" },
];
import { EmptyState } from './components/EmptyState';
import ExportView from './components/ExportView';
import StatisticsView from './components/StatisticsView';

const mockData = {
  events: [
    { id: 1, start: "00:00", end: "08:30", title: "Sleeping", category: "Rest", type: "rest" },
    { id: 2, start: "09:00", end: "10:00", title: "Deep Work: Go backend CRUD", category: "Work/Coding", type: "work" },
    { id: 3, start: "10:15", end: "11:15", title: 'Reading "The Unwomanly Face of War"', category: "Personal/Learning", type: "learning", isConflict: true },
    { id: 4, start: "11:00", end: "11:15", title: "Meeting", category: "Work", type: "conflict", isConflict: true },
    { id: 5, start: "14:00", end: "16:00", title: "Sleeping", category: "Rest", type: "rest" },
    { id: 6, start: "17:00", end: "19:00", title: "Deep Work: Go backend CRUD", category: "Work/Coding", type: "work" },
    { id: 7, start: "20:00", end: "21:30", title: 'Reading "The Unwomanly Face of War"', category: "Personal/Learning", type: "learning" },
    { id: 8, start: "22:00", end: "24:00", title: "Sleeping", category: "Rest", type: "rest" },
  ],
  categories: [
    { label: "Dev/Go", color: "bg-emerald-200 text-emerald-800" },
    { label: "Dev/Flutter", color: "bg-teal-200 text-teal-800" },
    { label: "Learning/Books", color: "bg-orange-200 text-orange-800" },
    { label: "Personal/Admin", color: "bg-amber-200 text-amber-800" },
    { label: "Rest/Sleep", color: "bg-blue-200 text-blue-800" },
    { label: "Health/Exercise", color: "bg-cyan-200 text-cyan-800" },
  ]
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all rounded-lg mb-1
      ${active ? 'bg-slate-200 text-slate-900 font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
  >
    <Icon size={18} />
    <span className="text-[14px]">{label}</span>
  </button>
);

const TimelineEvent = ({ event }) => {
  const bgColorMap = {
    rest: 'bg-[#b8cae4]',
    work: 'bg-[#d1dfd4]',
    learning: 'bg-[#e5d5bc]',
    conflict: 'bg-[#f0d0d0] border border-red-300 opacity-80'
  };

  return (
    <div className={`relative flex items-center justify-between p-3 mb-2 rounded-md ${bgColorMap[event.type] || 'bg-gray-100'} min-h-[60px] cursor-pointer hover:shadow-sm transition-shadow`}>
      <div>
        <div className="text-[13px] font-semibold text-slate-800">
          {event.start} - {event.end}: {event.title}
        </div>
        <div className="text-[12px] text-slate-600">({event.category})</div>
      </div>
      {event.isConflict && (
        <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 flex flex-col items-center group">
          <div className="bg-white p-1 rounded-full shadow-md border border-red-100">
            <AlertTriangle size={14} className="text-red-500" />
          </div>
          <div className="hidden group-hover:block absolute top-8 right-0 bg-white shadow-xl border border-slate-200 px-3 py-1 rounded text-[11px] whitespace-nowrap z-10">
            Conflict
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardView = () => (
  <div className="grid grid-cols-12 gap-6 p-8">
    <section className="col-span-12 lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-50">
        <button className="p-1 hover:bg-slate-100 rounded border border-slate-200"><ChevronLeft size={16} /></button>
        <h2 className="text-lg font-bold flex items-center">
          Monday, April 6, 2026
          <ChevronRight size={16} className="ml-1 rotate-90 scale-75 opacity-50" />
        </h2>
        <button className="p-1 hover:bg-slate-100 rounded border border-slate-200"><ChevronRight size={16} /></button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto relative">
        <div className="absolute left-4 top-6 bottom-6 w-12 flex flex-col justify-between text-[11px] text-slate-400 pointer-events-none">
          <span>00:00</span><span>02:00</span><span>04:00</span><span>06:00</span>
          <span>08:00</span><span>09:00</span><span>10:00</span><span>11:00</span>
          <span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span><span>22:00</span><span>24:00</span>
        </div>
        <div className="ml-12 pl-4">
          {mockData.events.map(event => <TimelineEvent key={event.id} event={event} />)}
        </div>
      </div>
    </section>

    <div className="col-span-12 lg:col-span-5 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[15px]">Quick Log & Categorization</h3>
          <span className="text-xs text-slate-400 flex items-center"><Send size={12} className="mr-1" /> Telegram Style</span>
        </div>
        <textarea 
          className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
          placeholder='Log time (e.g., "15:00-16:30 Flutter setup, category: Dev")'
        />
        <div className="mt-4 p-3 border-2 border-dashed border-slate-100 rounded-lg bg-[#fdfcfb]">
          <div className="text-[12px] font-bold text-slate-400 mb-1 tracking-tight">Structure Preview</div>
          <div className="text-[13px] text-slate-600">
            Start: <span className="text-slate-300">--:--</span> | End: <span className="text-slate-300">--:--</span> | Category: <span className="text-slate-300">--</span> | Note: <span className="text-slate-300">--</span>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button className="flex items-center px-4 py-1.5 bg-[#5b8c91] text-white text-[13px] rounded-md hover:bg-[#4a7377] transition-colors">Save</button>
          <button className="flex items-center px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[13px] rounded-md hover:bg-slate-50">Undo</button>
          <button className="flex items-center px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[13px] rounded-md hover:bg-slate-50">Edit</button>
        </div>
        <div className="mt-6">
          <div className="text-[13px] font-bold mb-3">Recent Categories</div>
          <div className="flex flex-wrap gap-2">
            {mockData.categories.map((cat, i) => (
              <span key={i} className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer hover:opacity-80 transition-opacity ${cat.color}`}>
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-[15px] mb-4">Quick Insights</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-[12px] font-bold text-slate-800 mb-2">Treemap</div>
            <div className="h-32 w-full grid grid-cols-3 grid-rows-3 gap-0.5 rounded overflow-hidden">
              <div className="col-span-2 row-span-2 bg-[#d1dfd4] p-1 text-[9px] text-emerald-800 font-bold">Work</div>
              <div className="bg-[#e5d5bc] p-1 text-[9px] text-orange-800 font-bold">Learning</div>
              <div className="row-span-2 bg-[#b8cae4] p-1 text-[9px] text-blue-800 font-bold">Rest</div>
              <div className="bg-[#b8cae4] p-1 text-[9px] text-blue-800 font-bold opacity-50">Sleeping (Rest)</div>
              <div className="bg-[#e5d5bc] p-1 text-[9px] opacity-70">Perso...</div>
              <div className="bg-[#f0d0d0] p-1"></div>
              <div className="bg-[#d1dfd4] p-1 text-[9px] opacity-70">Healt...</div>
              <div className="bg-[#f0d0d0] p-1"></div>
            </div>
          </div>
          <div>
            <div className="text-[12px] font-bold text-slate-800 mb-2">Daily Trend</div>
            <div className="h-32 w-full flex items-end justify-between px-1 border-l border-b border-slate-100 relative">
              <svg className="absolute inset-0 h-full w-full overflow-visible">
                <path d="M0 80 L20 60 L40 45 L60 85 L80 85 L100 70 L120 65" fill="none" stroke="#5b8c91" strokeWidth="2" strokeLinecap="round" />
                {[0, 20, 40, 60, 80, 100, 120].map((x, i) => (
                  <circle key={i} cx={x} cy={[80, 60, 45, 85, 85, 70, 65][i]} r="3" fill="#5b8c91" stroke="white" strokeWidth="1" />
                ))}
              </svg>
              <div className="absolute top-1 right-1 text-[9px] bg-slate-100 p-1 rounded border border-slate-200">
                <span className="inline-block w-2 h-2 bg-[#5b8c91] mr-1"></span>
                Deep Work Minutes
              </div>
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 mt-1 px-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TimelineView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredItems = timelineItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === 'all' || item.tags.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const allTags = [...new Set(timelineItems.flatMap(item => item.tags))];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold">Log Archive</h2>
          <p className="text-slate-400 text-xs mt-2">Your time log archive</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredItems.map((item, i) => (
        <div key={i} className="flex gap-6 mb-2 group">
          <div className="w-16 pt-1 text-right font-mono text-xs text-slate-400">{item.time}</div>
          <div className="relative pb-10 border-l border-slate-200 pl-8 flex-1">
            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-[#5b8c91]" />
            <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-all">
              <div className="flex justify-between">
                <h3 className="font-bold text-slate-800">{item.title}</h3>
                <ArrowUpRight size={14} className="text-slate-300" />
              </div>
              <div className="flex gap-2 mt-2">
                {item.tags.map(t => <span key={t} className="text-[10px] text-[#5b8c91] bg-emerald-50 px-2 py-0.5 rounded">#{t}</span>)}
              </div>
              {item.note && <p className="mt-3 text-xs text-slate-500 bg-slate-50 p-2 rounded leading-relaxed">{item.note}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const timelineItems = [
  { time: "10:15", title: "Refactor Go Middleware", tags: ["work", "backend"], note: "Using ent for schema validation", amount: "50" },
  { time: "14:00", title: "Read: Brave New World", tags: ["learning", "books"], note: "Chapter 4-6, focus on social structure" },
  { time: "16:30", title: "Gym: Upper Body", tags: ["health"], amount: "-20" },
];

const CategoriesView = () => (
  <div className="p-8">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-2xl font-serif font-bold">Categories</h2>
        <p className="text-slate-400 text-xs">Hierarchy defined by your Ledger rules</p>
      </div>
      <button className="px-4 py-2 bg-[#5b8c91] text-white rounded-lg text-xs font-bold">+ New Category</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {categoriesData.map((cat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-2 rounded-lg ${cat.color} bg-opacity-20`}>
              <FolderOpen className={cat.color.replace('bg-', 'text-')} size={20} />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">{cat.time} hrs this month</span>
          </div>
          <h3 className="text-lg font-bold mb-4">{cat.name}</h3>
          <div className="flex flex-wrap gap-2">
            {cat.subCats.map(s => (
              <span key={s} className="px-3 py-1 bg-slate-50 text-slate-500 text-[11px] rounded-full border border-slate-100 hover:bg-white hover:border-slate-300 cursor-pointer">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function TimeLedgerApp() {
  const [currentView, setCurrentView] = useState('Dashboard');

  const navItems = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Timeline View', icon: Clock3 },
    { id: 'Categories', icon: FolderOpen },
    { id: 'Statistics', icon: BarChart3 },
    { id: 'Export', icon: Download },
    { id: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Timeline View':
        return <TimelineView />;
      case 'Categories':
        return <CategoriesView />;
      case 'Statistics':
        return <StatisticsView />;
      case 'Export':
        return <ExportView />;
      case 'Settings':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-8">Settings</h2>
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Account</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                    <User size={24} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">John Doe</div>
                    <div className="text-xs text-slate-500">john@example.com</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Time Granularity (minutes)</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                      <option value="1">1 minute</option>
                      <option value="5">5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-bold text-slate-700">Dark Mode</div>
                      <div className="text-xs text-slate-500">Coming soon</div>
                    </div>
                    <button className="w-10 h-5 bg-slate-200 rounded-full opacity-50 cursor-not-allowed">
                      <div className="w-4 h-4 bg-white rounded-full ml-0.5 mt-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-20 text-center text-slate-300 font-serif text-xl">Coming Soon: {currentView}</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f2ee] font-sans text-slate-800 antialiased overflow-hidden">
      <aside className="w-64 flex flex-col border-r border-slate-200/60 bg-[#f9f8f6] p-6">
        <div className="flex items-center space-x-2 mb-10 px-2 cursor-pointer" onClick={() => setCurrentView('Dashboard')}>
          <Hourglass className="text-amber-800" size={24} />
          <h1 className="text-xl font-serif font-semibold">TimeLedger</h1>
        </div>
        <nav className="flex-1">
          {navItems.map(item => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.id}
              active={currentView === item.id}
              onClick={() => setCurrentView(item.id)}
            />
          ))}
        </nav>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={14} className="text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-700 truncate">John Doe</div>
              <div className="text-xs text-slate-400 truncate">john@example.com</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-8 py-4 bg-white/50 backdrop-blur-md border-b border-slate-200/50 flex justify-between items-center">
          <div className="text-xs text-slate-400">
            System Status: <span className="text-emerald-500 font-bold">Synced with Go-Backend</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <Calendar size={14} /> 2026-04-15
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
