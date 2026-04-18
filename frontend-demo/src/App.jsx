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
  User,
  FolderCog
} from 'lucide-react';
import { mockCategories as categoriesDataRaw, formatDuration } from './mocks/data';

const categoriesData = [
  { name: "价值产出", subCats: ["核心事务", "创造/研究", "专项深耕"], time: 180, color: "bg-emerald-400", key: "Output" },
  { name: "自我提升", subCats: ["广度阅读", "身体管理", "技能探索"], time: 120, color: "bg-amber-400", key: "Growth" },
  { name: "基础生活", subCats: ["睡眠休整", "生理代谢", "物理移位"], time: 420, color: "bg-blue-400", key: "Basic" },
  { name: "能量补给", subCats: ["情感链接", "深度愉悦"], time: 60, color: "bg-pink-400", key: "Recharge" },
  { name: "系统损耗", subCats: ["意志瘫痪", "外界干扰", "未知余数"], time: 60, color: "bg-slate-400", key: "Drain" },
];
import { EmptyState } from './components/EmptyState';
import ExportView from './components/ExportView';
import StatisticsView from './components/StatisticsView';
import CategoryManagerView from './components/CategoryManagerView';

const mockData = {
  events: [
    { id: 1, start: "00:00", end: "08:30", title: "Sleeping", category: "基础生活/睡眠休整", type: "Basic" },
    { id: 2, start: "09:00", end: "10:00", title: "Go backend CRUD", category: "价值产出/核心事务", type: "Output" },
    { id: 3, start: "10:15", end: "11:15", title: 'Reading "The Unwomanly Face of War"', category: "自我提升/广度阅读", type: "Growth" },
    { id: 4, start: "14:00", end: "16:00", title: "Afternoon Nap", category: "基础生活/睡眠休整", type: "Basic" },
    { id: 5, start: "17:00", end: "19:00", title: "Deep Work: API Design", category: "价值产出/创造研究", type: "Output" },
    { id: 6, start: "19:30", end: "20:30", title: "Movie: Inception", category: "能量补给/深度愉悦", type: "Recharge" },
    { id: 7, start: "21:00", end: "22:00", title: "Gym Workout", category: "自我提升/身体管理", type: "Growth" },
    { id: 8, start: "22:00", end: "24:00", title: "Sleeping", category: "基础生活/睡眠休整", type: "Basic" },
  ],
  categories: [
    { label: "价值产出/核心事务", color: "bg-emerald-100 text-emerald-700" },
    { label: "价值产出/创造研究", color: "bg-emerald-100 text-emerald-700" },
    { label: "自我提升/广度阅读", color: "bg-amber-100 text-amber-700" },
    { label: "自我提升/身体管理", color: "bg-amber-100 text-amber-700" },
    { label: "基础生活/睡眠休整", color: "bg-blue-100 text-blue-700" },
    { label: "能量补给/深度愉悦", color: "bg-pink-100 text-pink-700" },
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
    Output: 'bg-emerald-100 border-emerald-200',
    Growth: 'bg-amber-100 border-amber-200',
    Basic: 'bg-blue-100 border-blue-200',
    Recharge: 'bg-pink-100 border-pink-200',
    Drain: 'bg-slate-100 border-slate-200',
    conflict: 'bg-red-100 border border-red-300'
  };

  return (
    <div className={`relative flex items-center justify-between p-3 mb-2 rounded-md border ${bgColorMap[event.type] || 'bg-gray-100'} min-h-[60px] cursor-pointer hover:shadow-sm transition-shadow`}>
      <div>
        <div className="text-[13px] font-semibold text-slate-800">
          {event.start} - {event.end}: {event.title}
        </div>
        <div className="text-[12px] text-slate-500">({event.category})</div>
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

const DashboardView = () => {
  const [parsedLog, setParsedLog] = useState({ start: '', end: '', category: '', note: '' });

  const todayStats = {
    recorded: 1110,
    unknown: 30,
    productivity: 42,
    targetHours: 16,
  };

  const categoryCards = [
    { name: '价值产出', key: 'Output', color: '#10b981', current: 180, target: 240, subCats: ['核心事务', '创造/研究', '专项深耕'] },
    { name: '自我提升', key: 'Growth', color: '#f59e0b', current: 120, target: 120, subCats: ['广度阅读', '身体管理', '技能探索'] },
    { name: '基础生活', key: 'Basic', color: '#3b82f6', current: 510, target: 600, subCats: ['睡眠休整', '生理代谢', '物理移位'] },
    { name: '能量补给', key: 'Recharge', color: '#ec4899', current: 60, target: 90, subCats: ['情感链接', '深度愉悦'] },
    { name: '系统损耗', key: 'Drain', color: '#64748b', current: 240, target: 60, subCats: ['意志瘫痪', '外界干扰', '未知余数'], isWarning: true },
  ];

  const getProgressColor = (current, target, isWarning) => {
    const ratio = current / target;
    if (isWarning) {
      return ratio > 1 ? 'bg-red-500' : ratio > 0.5 ? 'bg-amber-500' : 'bg-slate-400';
    }
    return ratio >= 1 ? 'bg-emerald-500' : ratio >= 0.7 ? 'bg-blue-500' : 'bg-amber-500';
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <button className="p-1 hover:bg-slate-100 rounded border border-slate-200"><ChevronLeft size={16} /></button>
          <span className="text-lg font-bold ml-3">Monday, April 6, 2026</span>
          <button className="p-1 hover:bg-slate-100 rounded border border-slate-200 ml-2"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <section className="col-span-3 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-600">时间流水</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {mockData.events.map(event => (
              <TimelineEvent key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section className="col-span-5 flex flex-col gap-4 min-h-0">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold mb-3">Quick Log</h3>
            <textarea 
              className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder='输入: "15:00-16:30 读《1984》"'
            />
            <div className="flex flex-wrap gap-2 mt-3">
              <button className="px-3 py-1.5 rounded-full text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                09:00-10:00 核心事务
              </button>
              <button className="px-3 py-1.5 rounded-full text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                10:15-11:15 广度阅读
              </button>
              <button className="px-3 py-1.5 rounded-full text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                14:00-16:00 睡眠休整
              </button>
            </div>
            <div className="flex justify-end mt-3">
              <button className="px-4 py-2 bg-[#5b8c91] text-white text-sm rounded-lg hover:bg-[#4a7377]">Save</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto">
            {categoryCards.map((cat, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="font-bold text-sm">{cat.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{cat.current}m / {cat.target}m</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(cat.current, cat.target, cat.isWarning)} transition-all`} 
                    style={{ width: `${Math.min((cat.current / cat.target) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {cat.subCats.map((sub, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-50 text-[10px] text-slate-500 rounded">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-center">
              <div className="text-xl font-bold text-emerald-700">{Math.floor(todayStats.recorded / 60)}h{todayStats.recorded % 60}m</div>
              <div className="text-[10px] text-emerald-600">已核算</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
              <div className="text-xl font-bold text-red-600">{todayStats.unknown}m</div>
              <div className="text-[10px] text-red-500">未知余数</div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
              <div className="text-xl font-bold text-amber-600">{todayStats.productivity}%</div>
              <div className="text-[10px] text-amber-600">核心产出</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex-1">
            <h3 className="text-sm font-bold mb-3">实时方块</h3>
            <div className="grid grid-cols-4 grid-rows-4 gap-1 h-full min-h-[200px]">
              <div className="col-span-2 row-span-2 bg-emerald-400 rounded-lg p-2 flex flex-col justify-center items-center">
                <span className="text-white text-xs font-bold">价值产出</span>
                <span className="text-white text-lg font-bold">21%</span>
              </div>
              <div className="col-span-2 row-span-1 bg-blue-400 rounded-lg p-1 flex items-center justify-center">
                <span className="text-white text-[10px]">基础生活 75%</span>
              </div>
              <div className="col-span-2 bg-blue-400/80 rounded-lg p-1 flex items-center justify-center">
                <span className="text-white text-[10px]">睡眠休整</span>
              </div>
              <div className="col-span-1 bg-amber-400 rounded-lg p-1 flex items-center justify-center">
                <span className="text-white text-[8px]">14%</span>
              </div>
              <div className="col-span-1 bg-pink-400 rounded-lg p-1 flex items-center justify-center">
                <span className="text-white text-[8px]">7%</span>
              </div>
              <div className="col-span-2 bg-slate-400/80 rounded-lg p-1 flex items-center justify-center">
                <span className="text-white text-[10px]">意志损耗</span>
              </div>
              <div className="col-span-2 bg-slate-100 rounded-lg p-1 flex items-center justify-center">
                <span className="text-slate-400 text-[8px]">+ 添加</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold mb-3">产出趋势</h3>
            <div className="h-24 flex items-end gap-1">
              {[65, 80, 45, 90, 70, 85, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-emerald-400 rounded-t" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 mt-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

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

const CategoriesView = () => {
  const [expandedCat, setExpandedCat] = useState(null);
  
  return (
  <div className="p-8">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-2xl font-serif font-bold">Categories</h2>
        <p className="text-slate-400 text-xs">基于柳比歇夫分类标准 - 五大维度</p>
      </div>
      <button className="px-4 py-2 bg-[#5b8c91] text-white rounded-lg text-xs font-bold">+ Manage Categories</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {categoriesData.map((cat, i) => (
        <div 
          key={i} 
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
          onClick={() => setExpandedCat(expandedCat === i ? null : i)}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${cat.color} bg-opacity-20`}>
              <FolderOpen className={cat.color.replace('bg-', 'text-')} size={20} />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">{cat.time}m this month</span>
          </div>
          <h3 className="text-lg font-bold mb-2">{cat.name}</h3>
          <p className="text-[11px] text-slate-400 mb-4">
            {cat.key === 'Output' && '高专注状态、产生直接价值的时间'}
            {cat.key === 'Growth' && '提升个人综合素质与长期竞争力'}
            {cat.key === 'Basic' && '维持生命运转的必要时间成本'}
            {cat.key === 'Recharge' && '恢复情感能量、建立社会链接'}
            {cat.key === 'Drain' && '外界干扰或自我控制失效的流失'}
          </p>
          <div className="flex flex-wrap gap-2">
            {cat.subCats.map((s, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-slate-50 text-slate-500 text-[11px] rounded-full border border-slate-100 hover:bg-white hover:border-slate-300 cursor-pointer transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
          {expandedCat === i && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-[12px] font-bold text-slate-600 mb-2">子分类详情</div>
              <div className="space-y-2">
                {cat.subCats.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[12px]">
                    <span className="text-slate-500">{s}</span>
                    <span className="text-slate-400">{Math.round(cat.time / cat.subCats.length)}m</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

export default function TimeLedgerApp() {
  const [currentView, setCurrentView] = useState('Dashboard');

  const navItems = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Timeline View', icon: Clock3 },
    { id: 'Categories', icon: FolderOpen },
    { id: 'Category Manager', icon: FolderCog },
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
      case 'Category Manager':
        return <CategoryManagerView />;
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
