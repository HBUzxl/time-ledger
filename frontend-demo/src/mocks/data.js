export const CATEGORY_COLORS = {
  Output: { bg: '#10b981', text: '#text-emerald-600', light: '#ecfdf5', name: '价值产出' },
  Growth: { bg: '#f59e0b', text: '#text-amber-600', light: '#fffbeb', name: '自我提升' },
  Basic: { bg: '#3b82f6', text: '#text-blue-600', light: '#eff6ff', name: '基础生活' },
  Recharge: { bg: '#ec4899', text: '#text-pink-600', light: '#fdf2f8', name: '能量补给' },
  Drain: { bg: '#64748b', text: '#text-slate-600', light: '#f1f5f9', name: '系统损耗' },
};

export const mockCategories = [
  {
    id: 1,
    name: 'Output',
    displayName: '价值产出',
    color: '#10b981',
    icon: 'briefcase',
    subCategories: [
      { id: 11, name: 'CoreWork', displayName: '核心事务', parentId: 1 },
      { id: 12, name: 'Creation', displayName: '创造/研究', parentId: 1 },
      { id: 13, name: 'DeepStudy', displayName: '专项深耕', parentId: 1 },
    ],
    timeThisMonth: 480,
  },
  {
    id: 2,
    name: 'Growth',
    displayName: '自我提升',
    color: '#f59e0b',
    icon: 'trending-up',
    subCategories: [
      { id: 21, name: 'ExtensiveReading', displayName: '广度阅读', parentId: 2 },
      { id: 22, name: 'BodyManagement', displayName: '身体管理', parentId: 2 },
      { id: 23, name: 'SkillExploration', displayName: '技能探索', parentId: 2 },
    ],
    timeThisMonth: 180,
  },
  {
    id: 3,
    name: 'Basic',
    displayName: '基础生活',
    color: '#3b82f6',
    icon: 'home',
    subCategories: [
      { id: 31, name: 'SleepRest', displayName: '睡眠休整', parentId: 3 },
      { id: 32, name: 'Metabolism', displayName: '生理代谢', parentId: 3 },
      { id: 33, name: 'Commuting', displayName: '物理移位', parentId: 3 },
    ],
    timeThisMonth: 600,
  },
  {
    id: 4,
    name: 'Recharge',
    displayName: '能量补给',
    color: '#ec4899',
    icon: 'heart',
    subCategories: [
      { id: 41, name: 'EmotionalBond', displayName: '情感链接', parentId: 4 },
      { id: 42, name: 'DeepPleasure', displayName: '深度愉悦', parentId: 4 },
    ],
    timeThisMonth: 120,
  },
  {
    id: 5,
    name: 'Drain',
    displayName: '系统损耗',
    color: '#64748b',
    icon: 'alert-triangle',
    subCategories: [
      { id: 51, name: 'WillpowerLoss', displayName: '意志瘫痪', parentId: 5 },
      { id: 52, name: 'ExternalInterference', displayName: '外界干扰', parentId: 5 },
      { id: 53, name: 'UnknownRemainder', displayName: '未知余数', parentId: 5 },
    ],
    timeThisMonth: 60,
  },
];

export const mockRecords = [
  {
    id: 1,
    startTime: '2026-04-15T00:00:00',
    endTime: '2026-04-15T08:30:00',
    categoryId: 31,
    categoryName: 'SleepRest',
    parentCategoryName: 'Basic',
    parentCategory: 'Basic',
    note: '',
  },
  {
    id: 2,
    startTime: '2026-04-15T09:00:00',
    endTime: '2026-04-15T10:00:00',
    categoryId: 11,
    categoryName: 'CoreWork',
    parentCategoryName: 'Output',
    parentCategory: 'Output',
    note: 'Go backend CRUD implementation',
  },
  {
    id: 3,
    startTime: '2026-04-15T10:15:00',
    endTime: '2026-04-15T11:15:00',
    categoryId: 21,
    categoryName: 'ExtensiveReading',
    parentCategoryName: 'Growth',
    parentCategory: 'Growth',
    note: 'Reading "The Unwomanly Face of War"',
  },
  {
    id: 4,
    startTime: '2026-04-15T11:30:00',
    endTime: '2026-04-15T12:00:00',
    categoryId: 32,
    categoryName: 'Metabolism',
    parentCategoryName: 'Basic',
    parentCategory: 'Basic',
    note: 'Lunch and preparation',
  },
  {
    id: 5,
    startTime: '2026-04-15T14:00:00',
    endTime: '2026-04-15T16:00:00',
    categoryId: 31,
    categoryName: 'SleepRest',
    parentCategoryName: 'Basic',
    parentCategory: 'Basic',
    note: 'Afternoon nap',
  },
  {
    id: 6,
    startTime: '2026-04-15T17:00:00',
    endTime: '2026-04-15T19:00:00',
    categoryId: 12,
    categoryName: 'Creation',
    parentCategoryName: 'Output',
    parentCategory: 'Output',
    note: 'Deep work: API design',
  },
  {
    id: 7,
    startTime: '2026-04-15T19:30:00',
    endTime: '2026-04-15T20:30:00',
    categoryId: 42,
    categoryName: 'DeepPleasure',
    parentCategoryName: 'Recharge',
    parentCategory: 'Recharge',
    note: 'Watching a movie',
  },
  {
    id: 8,
    startTime: '2026-04-15T21:00:00',
    endTime: '2026-04-15T22:00:00',
    categoryId: 22,
    categoryName: 'BodyManagement',
    parentCategoryName: 'Growth',
    parentCategory: 'Growth',
    note: 'Gym workout',
  },
  {
    id: 9,
    startTime: '2026-04-15T22:00:00',
    endTime: '2026-04-15T24:00:00',
    categoryId: 31,
    categoryName: 'SleepRest',
    parentCategoryName: 'Basic',
    parentCategory: 'Basic',
    note: '',
  },
  {
    id: 10,
    startTime: '2026-04-15T23:00:00',
    endTime: '2026-04-15T23:30:00',
    categoryId: 51,
    categoryName: 'WillpowerLoss',
    parentCategoryName: 'Drain',
    parentCategory: 'Drain',
    note: 'Unintentional scrolling',
  },
];

export const mockTimelineItems = [
  {
    id: 1,
    time: '09:00',
    title: 'Go Backend CRUD Implementation',
    tags: ['Output', 'CoreWork'],
    note: 'API endpoints design',
    duration: 60,
    parentCategory: 'Output',
  },
  {
    id: 2,
    time: '10:15',
    title: 'Reading: The Unwomanly Face of War',
    tags: ['Growth', 'ExtensiveReading'],
    note: 'Chapter 4-6, focus on social structure',
    duration: 60,
    parentCategory: 'Growth',
  },
  {
    id: 3,
    time: '14:00',
    title: 'Afternoon Nap',
    tags: ['Basic', 'SleepRest'],
    note: '',
    duration: 120,
    parentCategory: 'Basic',
  },
  {
    id: 4,
    time: '17:00',
    title: 'Deep Work: API Design',
    tags: ['Output', 'Creation'],
    note: 'RESTful API architecture',
    duration: 120,
    parentCategory: 'Output',
  },
  {
    id: 5,
    time: '19:30',
    title: 'Movie: Inception',
    tags: ['Recharge', 'DeepPleasure'],
    note: 'Christopher Nolan',
    duration: 60,
    parentCategory: 'Recharge',
  },
  {
    id: 6,
    time: '21:00',
    title: 'Gym: Upper Body Workout',
    tags: ['Growth', 'BodyManagement'],
    note: 'Bench press, rows, curls',
    duration: 60,
    parentCategory: 'Growth',
  },
  {
    id: 7,
    time: '22:30',
    title: 'Unintentional Social Media',
    tags: ['Drain', 'WillpowerLoss'],
    note: 'Mindless scrolling',
    duration: 30,
    parentCategory: 'Drain',
  },
];

export const mockStatistics = {
  daily: {
    date: '2026-04-15',
    totalMinutes: 840,
    byCategory: [
      { categoryId: 3, categoryName: 'Basic', displayName: '基础生活', minutes: 630, percentage: 75.0, color: '#3b82f6' },
      { categoryId: 1, categoryName: 'Output', displayName: '价值产出', minutes: 180, percentage: 21.4, color: '#10b981' },
      { categoryId: 2, categoryName: 'Growth', displayName: '自我提升', minutes: 120, percentage: 14.3, color: '#f59e0b' },
      { categoryId: 4, categoryName: 'Recharge', displayName: '能量补给', minutes: 60, percentage: 7.1, color: '#ec4899' },
      { categoryId: 5, categoryName: 'Drain', displayName: '系统损耗', minutes: 30, percentage: 3.6, color: '#64748b' },
    ],
    timeline: mockRecords,
  },
  weekly: {
    startDate: '2026-04-09',
    endDate: '2026-04-15',
    totalMinutes: 5400,
    byCategory: [
      { categoryId: 3, categoryName: 'Basic', displayName: '基础生活', minutes: 2520, percentage: 46.7, color: '#3b82f6' },
      { categoryId: 1, categoryName: 'Output', displayName: '价值产出', minutes: 1680, percentage: 31.1, color: '#10b981' },
      { categoryId: 2, categoryName: 'Growth', displayName: '自我提升', minutes: 720, percentage: 13.3, color: '#f59e0b' },
      { categoryId: 4, categoryName: 'Recharge', displayName: '能量补给', minutes: 300, percentage: 5.6, color: '#ec4899' },
      { categoryId: 5, categoryName: 'Drain', displayName: '系统损耗', minutes: 180, percentage: 3.3, color: '#64748b' },
    ],
    dailyBreakdown: [
      { day: 'Mon', minutes: 720, Output: 180, Growth: 60, Basic: 420, Recharge: 30, Drain: 30, displayName: '基础生活' },
      { day: 'Tue', minutes: 840, Output: 240, Growth: 90, Basic: 450, Recharge: 30, Drain: 30, displayName: '价值产出' },
      { day: 'Wed', minutes: 780, Output: 180, Growth: 120, Basic: 420, Recharge: 30, Drain: 30, displayName: '自我提升' },
      { day: 'Thu', minutes: 690, Output: 150, Growth: 60, Basic: 420, Recharge: 30, Drain: 30, displayName: '能量补给' },
      { day: 'Fri', minutes: 810, Output: 240, Growth: 90, Basic: 420, Recharge: 30, Drain: 30, displayName: '系统损耗' },
      { day: 'Sat', minutes: 720, Output: 60, Growth: 120, Basic: 480, Recharge: 30, Drain: 30, displayName: '基础生活' },
      { day: 'Sun', minutes: 840, Output: 120, Growth: 180, Basic: 480, Recharge: 30, Drain: 30, displayName: '价值产出' },
    ],
  },
  monthly: {
    year: 2026,
    month: 4,
    totalMinutes: 2520,
    byCategory: [
      { categoryId: 3, categoryName: 'Basic', displayName: '基础生活', minutes: 1260, percentage: 50.0, color: '#3b82f6' },
      { categoryId: 1, categoryName: 'Output', displayName: '价值产出', minutes: 720, percentage: 28.6, color: '#10b981' },
      { categoryId: 2, categoryName: 'Growth', displayName: '自我提升', minutes: 360, percentage: 14.3, color: '#f59e0b' },
      { categoryId: 4, categoryName: 'Recharge', displayName: '能量补给', minutes: 120, percentage: 4.8, color: '#ec4899' },
      { categoryId: 5, categoryName: 'Drain', displayName: '系统损耗', minutes: 60, percentage: 2.4, color: '#64748b' },
    ],
  },
  categoryTrends: [
    { date: '2026-04-01', Output: 120, Growth: 60, Basic: 420, Recharge: 30, Drain: 30 },
    { date: '2026-04-02', Output: 180, Growth: 90, Basic: 420, Recharge: 30, Drain: 30 },
    { date: '2026-04-03', Output: 150, Growth: 30, Basic: 480, Recharge: 30, Drain: 30 },
    { date: '2026-04-04', Output: 240, Growth: 120, Basic: 360, Recharge: 30, Drain: 30 },
    { date: '2026-04-05', Output: 180, Growth: 60, Basic: 420, Recharge: 30, Drain: 30 },
    { date: '2026-04-06', Output: 90, Growth: 90, Basic: 480, Recharge: 30, Drain: 30 },
    { date: '2026-04-07', Output: 150, Growth: 120, Basic: 420, Recharge: 30, Drain: 30 },
    { date: '2026-04-08', Output: 210, Growth: 60, Basic: 420, Recharge: 30, Drain: 30 },
    { date: '2026-04-09', Output: 180, Growth: 90, Basic: 480, Recharge: 30, Drain: 30 },
    { date: '2026-04-10', Output: 240, Growth: 120, Basic: 420, Recharge: 30, Drain: 30 },
  ],
};

export const mockExportData = {
  formats: [
    { id: 'json', name: 'JSON', description: 'Machine-readable structured data', extension: '.json' },
    { id: 'csv', name: 'CSV', description: 'Comma-separated values for spreadsheets', extension: '.csv' },
    { id: 'txt', name: 'TXT', description: 'Human-readable plain text', extension: '.txt' },
    { id: 'html', name: 'HTML', description: 'Static web page for viewing', extension: '.html' },
  ],
  dateRanges: [
    { id: 'today', label: 'Today', days: 0 },
    { id: 'yesterday', label: 'Yesterday', days: 1 },
    { id: 'last7', label: 'Last 7 Days', days: 7 },
    { id: 'last30', label: 'Last 30 Days', days: 30 },
    { id: 'thisMonth', label: 'This Month', days: 30 },
    { id: 'thisYear', label: 'This Year', days: 365 },
    { id: 'all', label: 'All Time', days: 9999 },
  ],
  recentExports: [
    { id: 1, format: 'JSON', dateRange: '2026-04-01 to 2026-04-15', date: '2026-04-15', size: '2.3 MB' },
    { id: 2, format: 'CSV', dateRange: '2026-04-01 to 2026-04-10', date: '2026-04-11', size: '1.1 MB' },
    { id: 3, format: 'HTML', dateRange: '2026-03-01 to 2026-03-31', date: '2026-04-01', size: '5.8 MB' },
  ],
  autoExportConfig: {
    enabled: false,
    frequency: 'monthly',
    email: '',
    lastExport: '2026-04-01',
  },
};

export const mockSettings = {
  timeGranularity: 5,
  exportEmail: '',
  autoExportEnabled: false,
  theme: 'light',
};

export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
};

export const getCategoryColor = (categoryName) => {
  const colors = {
    Output: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', hex: '#10b981' },
    Growth: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', hex: '#f59e0b' },
    Basic: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', hex: '#3b82f6' },
    Recharge: { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-50', hex: '#ec4899' },
    Drain: { bg: 'bg-slate-500', text: 'text-slate-600', light: 'bg-slate-50', hex: '#64748b' },
  };
  return colors[categoryName] || { bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-50', hex: '#64748b' };
};

export const getCategoryDisplayName = (categoryName) => {
  const names = {
    Output: '价值产出',
    Growth: '自我提升',
    Basic: '基础生活',
    Recharge: '能量补给',
    Drain: '系统损耗',
    CoreWork: '核心事务',
    Creation: '创造/研究',
    DeepStudy: '专项深耕',
    ExtensiveReading: '广度阅读',
    BodyManagement: '身体管理',
    SkillExploration: '技能探索',
    SleepRest: '睡眠休整',
    Metabolism: '生理代谢',
    Commuting: '物理移位',
    EmotionalBond: '情感链接',
    DeepPleasure: '深度愉悦',
    WillpowerLoss: '意志瘫痪',
    ExternalInterference: '外界干扰',
    UnknownRemainder: '未知余数',
  };
  return names[categoryName] || categoryName;
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

export const formatShortDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};