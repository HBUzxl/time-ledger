export const mockCategories = [
  {
    id: 1,
    name: 'Work',
    color: '#10b981',
    subCategories: [
      { id: 11, name: 'Coding', parentId: 1 },
      { id: 12, name: 'Meeting', parentId: 1 },
      { id: 13, name: 'Documentation', parentId: 1 },
      { id: 14, name: 'Research', parentId: 1 },
    ],
    timeThisMonth: 480,
  },
  {
    id: 2,
    name: 'Learning',
    color: '#f97316',
    subCategories: [
      { id: 21, name: 'Reading', parentId: 2 },
      { id: 22, name: 'Language', parentId: 2 },
      { id: 23, name: 'Algorithms', parentId: 2 },
    ],
    timeThisMonth: 180,
  },
  {
    id: 3,
    name: 'Life',
    color: '#3b82f6',
    subCategories: [
      { id: 31, name: 'Exercise', parentId: 3 },
      { id: 32, name: 'Cooking', parentId: 3 },
      { id: 33, name: 'Shopping', parentId: 3 },
    ],
    timeThisMonth: 120,
  },
  {
    id: 4,
    name: 'Rest',
    color: '#8b5cf6',
    subCategories: [
      { id: 41, name: 'Sleep', parentId: 4 },
      { id: 42, name: 'Nap', parentId: 4 },
      { id: 43, name: 'Meditation', parentId: 4 },
    ],
    timeThisMonth: 420,
  },
];

export const mockRecords = [
  {
    id: 1,
    startTime: '2026-04-15T00:00:00',
    endTime: '2026-04-15T08:30:00',
    categoryId: 41,
    categoryName: 'Sleep',
    parentCategoryName: 'Rest',
    note: '',
  },
  {
    id: 2,
    startTime: '2026-04-15T09:00:00',
    endTime: '2026-04-15T10:00:00',
    categoryId: 11,
    categoryName: 'Coding',
    parentCategoryName: 'Work',
    note: 'Go backend CRUD implementation',
  },
  {
    id: 3,
    startTime: '2026-04-15T10:15:00',
    endTime: '2026-04-15T11:15:00',
    categoryId: 21,
    categoryName: 'Reading',
    parentCategoryName: 'Learning',
    note: 'Reading "The Unwomanly Face of War"',
  },
  {
    id: 4,
    startTime: '2026-04-15T14:00:00',
    endTime: '2026-04-15T16:00:00',
    categoryId: 42,
    categoryName: 'Nap',
    parentCategoryName: 'Rest',
    note: '',
  },
  {
    id: 5,
    startTime: '2026-04-15T17:00:00',
    endTime: '2026-04-15T19:00:00',
    categoryId: 11,
    categoryName: 'Coding',
    parentCategoryName: 'Work',
    note: 'Go backend CRUD implementation',
  },
  {
    id: 6,
    startTime: '2026-04-15T20:00:00',
    endTime: '2026-04-15T21:30:00',
    categoryId: 21,
    categoryName: 'Reading',
    parentCategoryName: 'Learning',
    note: 'Reading "The Unwomanly Face of War"',
  },
  {
    id: 7,
    startTime: '2026-04-15T22:00:00',
    endTime: '2026-04-15T24:00:00',
    categoryId: 41,
    categoryName: 'Sleep',
    parentCategoryName: 'Rest',
    note: '',
  },
];

export const mockTimelineItems = [
  {
    id: 1,
    time: '09:00',
    title: 'Refactor Go Middleware',
    tags: ['work', 'backend'],
    note: 'Using ent for schema validation',
    duration: 60,
  },
  {
    id: 2,
    time: '10:15',
    title: 'Reading: Brave New World',
    tags: ['learning', 'books'],
    note: 'Chapter 4-6, focus on social structure',
    duration: 60,
  },
  {
    id: 3,
    time: '14:00',
    title: 'Gym: Upper Body',
    tags: ['health', 'exercise'],
    note: '',
    duration: 90,
  },
  {
    id: 4,
    time: '17:00',
    title: 'Deep Work Session',
    tags: ['work', 'coding'],
    note: 'API endpoints implementation',
    duration: 120,
  },
  {
    id: 5,
    time: '20:00',
    title: 'Language Learning',
    tags: ['learning', 'language'],
    note: 'Duolingo practice',
    duration: 30,
  },
];

export const mockStatistics = {
  daily: {
    date: '2026-04-15',
    totalMinutes: 840,
    byCategory: [
      { categoryId: 4, categoryName: 'Rest', minutes: 510, percentage: 60.7, color: '#8b5cf6' },
      { categoryId: 1, categoryName: 'Work', minutes: 180, percentage: 21.4, color: '#10b981' },
      { categoryId: 2, categoryName: 'Learning', minutes: 120, percentage: 14.3, color: '#f97316' },
      { categoryId: 3, categoryName: 'Life', minutes: 30, percentage: 3.6, color: '#3b82f6' },
    ],
    timeline: mockRecords,
  },
  weekly: {
    startDate: '2026-04-09',
    endDate: '2026-04-15',
    totalMinutes: 5400,
    byCategory: [
      { categoryId: 4, categoryName: 'Rest', minutes: 2520, percentage: 46.7, color: '#8b5cf6' },
      { categoryId: 1, categoryName: 'Work', minutes: 1680, percentage: 31.1, color: '#10b981' },
      { categoryId: 2, categoryName: 'Learning', minutes: 720, percentage: 13.3, color: '#f97316' },
      { categoryId: 3, categoryName: 'Life', minutes: 480, percentage: 8.9, color: '#3b82f6' },
    ],
    dailyBreakdown: [
      { day: 'Mon', minutes: 720, work: 180, learning: 60, rest: 420, life: 60 },
      { day: 'Tue', minutes: 840, work: 240, learning: 90, rest: 450, life: 60 },
      { day: 'Wed', minutes: 780, work: 180, learning: 120, rest: 420, life: 60 },
      { day: 'Thu', minutes: 690, work: 150, learning: 60, rest: 420, life: 60 },
      { day: 'Fri', minutes: 810, work: 240, learning: 90, rest: 420, life: 60 },
      { day: 'Sat', minutes: 720, work: 60, learning: 120, rest: 480, life: 60 },
      { day: 'Sun', minutes: 840, work: 120, learning: 180, rest: 480, life: 60 },
    ],
  },
  monthly: {
    year: 2026,
    month: 4,
    totalMinutes: 2520,
    byCategory: [
      { categoryId: 4, categoryName: 'Rest', minutes: 1260, percentage: 50.0, color: '#8b5cf6' },
      { categoryId: 1, categoryName: 'Work', minutes: 720, percentage: 28.6, color: '#10b981' },
      { categoryId: 2, categoryName: 'Learning', minutes: 360, percentage: 14.3, color: '#f97316' },
      { categoryId: 3, categoryName: 'Life', minutes: 180, percentage: 7.1, color: '#3b82f6' },
    ],
  },
  categoryTrends: [
    { date: '2026-04-01', Work: 120, Learning: 60, Rest: 420, Life: 30 },
    { date: '2026-04-02', Work: 180, Learning: 90, Rest: 420, Life: 60 },
    { date: '2026-04-03', Work: 150, Learning: 30, Rest: 480, Life: 30 },
    { date: '2026-04-04', Work: 240, Learning: 120, Rest: 360, Life: 60 },
    { date: '2026-04-05', Work: 180, Learning: 60, Rest: 420, Life: 30 },
    { date: '2026-04-06', Work: 90, Learning: 90, Rest: 480, Life: 60 },
    { date: '2026-04-07', Work: 150, Learning: 120, Rest: 420, Life: 30 },
    { date: '2026-04-08', Work: 210, Learning: 60, Rest: 420, Life: 60 },
    { date: '2026-04-09', Work: 180, Learning: 90, Rest: 480, Life: 30 },
    { date: '2026-04-10', Work: 240, Learning: 120, Rest: 420, Life: 60 },
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
    Work: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50' },
    Learning: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' },
    Life: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
    Rest: { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50' },
  };
  return colors[categoryName] || { bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-50' };
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
