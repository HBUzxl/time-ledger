import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, PieChart, Calendar, ChevronLeft, ChevronRight,
  ArrowUpDown, Filter, Download, Layers, Activity
} from 'lucide-react';
import { mockStatistics, mockCategories, formatDuration, formatShortDate, formatDate } from '../mocks/data';

const StatisticsView = () => {
  const [activePeriod, setActivePeriod] = useState('daily');
  const [selectedDate, setSelectedDate] = useState('2026-04-15');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedWeek, setSelectedWeek] = useState(15);
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [viewMode, setViewMode] = useState('chart');

  const stats = activePeriod === 'daily' ? mockStatistics.daily 
    : activePeriod === 'weekly' ? mockStatistics.weekly 
    : mockStatistics.monthly;

  const periods = [
    { id: 'daily', label: 'Daily', icon: Calendar },
    { id: 'weekly', label: 'Weekly', icon: Layers },
    { id: 'monthly', label: 'Monthly', icon: BarChart3 },
  ];

  const renderTreemap = () => {
    const total = stats.totalMinutes;
    const sizes = stats.byCategory.map(cat => ({
      ...cat,
      width: (cat.minutes / total) * 100,
    }));

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Time Distribution</h3>
        <div className="grid grid-cols-4 grid-rows-3 gap-1 h-64 rounded-xl overflow-hidden">
          {sizes.map((cat, i) => (
            <div
              key={cat.categoryId}
              className="relative p-3 flex flex-col justify-end transition-all hover:opacity-90 cursor-pointer"
              style={{ 
                backgroundColor: cat.color,
                gridColumn: i === 0 ? 'span 2' : 'span 1',
                gridRow: i === 0 ? 'span 2' : 'span 1',
              }}
            >
              <span className="text-white text-xs font-semibold opacity-90">{cat.categoryName}</span>
              <span className="text-white text-lg font-bold">{formatDuration(cat.minutes)}</span>
              <span className="text-white/70 text-xs">{cat.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {stats.byCategory.map(cat => (
            <div key={cat.categoryId} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-sm text-slate-600">{cat.categoryName}</span>
              <span className="text-sm text-slate-400">({formatDuration(cat.minutes)})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Category Breakdown</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              {stats.byCategory.map((cat, i) => {
                const segmentLength = (cat.minutes / stats.totalMinutes) * circumference;
                const segment = (
                  <circle
                    key={cat.categoryId}
                    cx="96"
                    cy="96"
                    r={radius}
                    fill="none"
                    stroke={cat.color}
                    strokeWidth="24"
                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                    strokeDashoffset={-offset}
                    className="transition-all duration-500 hover:stroke-width-28 cursor-pointer"
                  />
                );
                offset += segmentLength;
                return segment;
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{formatDuration(stats.totalMinutes)}</span>
              <span className="text-xs text-slate-500">Total</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6">
          {stats.byCategory.map(cat => (
            <div key={cat.categoryId} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-sm text-slate-600 flex-1">{cat.categoryName}</span>
              <span className="text-sm font-medium text-slate-800">{cat.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    if (activePeriod !== 'weekly') return null;
    
    const weeklyData = mockStatistics.weekly.dailyBreakdown;
    const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Daily Breakdown</h3>
        <div className="flex items-end justify-between h-48 gap-2">
          {weeklyData.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col-reverse h-40 rounded-lg overflow-hidden">
                <div 
                  className="w-full bg-violet-500 transition-all duration-300 hover:bg-violet-600"
                  style={{ height: `${(day.rest / maxMinutes) * 100}%` }}
                  title={`Rest: ${formatDuration(day.rest)}`}
                />
                <div 
                  className="w-full bg-emerald-500 transition-all duration-300 hover:bg-emerald-600"
                  style={{ height: `${(day.work / maxMinutes) * 100}%` }}
                  title={`Work: ${formatDuration(day.work)}`}
                />
                <div 
                  className="w-full bg-orange-500 transition-all duration-300 hover:bg-orange-600"
                  style={{ height: `${(day.learning / maxMinutes) * 100}%` }}
                  title={`Learning: ${formatDuration(day.learning)}`}
                />
                <div 
                  className="w-full bg-blue-500 transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(day.life / maxMinutes) * 100}%` }}
                  title={`Life: ${formatDuration(day.life)}`}
                />
              </div>
              <span className="text-xs text-slate-500">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-6">
          {[
            { label: 'Work', color: 'bg-emerald-500' },
            { label: 'Learning', color: 'bg-orange-500' },
            { label: 'Life', color: 'bg-blue-500' },
            { label: 'Rest', color: 'bg-violet-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const trends = mockStatistics.categoryTrends;
    
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Trend Analysis</h3>
        <div className="h-48 relative">
          <svg className="w-full h-full overflow-visible">
            {['Work', 'Learning', 'Life', 'Rest'].map((category, idx) => {
              const colors = { Work: '#10b981', Learning: '#f97316', Life: '#3b82f6', Rest: '#8b5cf6' };
              const points = trends.map((d, i) => {
                const x = (i / (trends.length - 1)) * 100;
                const y = 100 - (d[category] / 600) * 100;
                return `${x},${y}`;
              }).join(' ');
              
              return (
                <g key={category}>
                  <polyline
                    fill="none"
                    stroke={colors[category]}
                    strokeWidth="2"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                  {trends.map((d, i) => (
                    <circle
                      key={i}
                      cx={(i / (trends.length - 1)) * 100}
                      cy={100 - (d[category] / 600) * 100}
                      r="3"
                      fill={colors[category]}
                      stroke="white"
                      strokeWidth="1"
                      className="opacity-0 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </g>
              );
            })}
          </svg>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-400">{formatShortDate(trends[0].date)}</span>
            <span className="text-xs text-slate-400">{formatShortDate(trends[trends.length - 1].date)}</span>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {[
            { label: 'Work', color: '#10b981' },
            { label: 'Learning', color: '#f97316' },
            { label: 'Life', color: '#3b82f6' },
            { label: 'Rest', color: '#8b5cf6' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategorySelect = () => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Category Selection</h3>
        <button className="text-sm text-slate-500 hover:text-slate-700">Select All</button>
      </div>
      <div className="space-y-2">
        {mockCategories.map(cat => (
          <label key={cat.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              defaultChecked 
              className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-200"
            />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-sm text-slate-700 flex-1">{cat.name}</span>
            <span className="text-xs text-slate-400">{formatDuration(cat.timeThisMonth)}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderDatePicker = () => {
    if (activePeriod === 'daily') {
      return (
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <span className="px-4 py-1 font-medium text-slate-800 min-w-[200px] text-center">
            {formatDate(selectedDate)}
          </span>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronRight size={18} className="text-slate-600" />
          </button>
        </div>
      );
    }
    
    if (activePeriod === 'weekly') {
      return (
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <span className="px-4 py-1 font-medium text-slate-800 min-w-[200px] text-center">
            Week {selectedWeek}, {selectedYear}
          </span>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronRight size={18} className="text-slate-600" />
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <span className="px-4 py-1 font-medium text-slate-800 min-w-[200px] text-center">
          April {selectedYear}
        </span>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronRight size={18} className="text-slate-600" />
        </button>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-800">Statistics</h2>
          <p className="text-slate-400 text-xs mt-2">Analyze your time distribution</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {periods.map(period => {
              const Icon = period.icon;
              return (
                <button
                  key={period.id}
                  onClick={() => setActivePeriod(period.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activePeriod === period.id
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {period.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mb-8">
        {renderDatePicker()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTreemap()}
        {renderPieChart()}
        {renderBarChart()}
        {renderLineChart()}
        {renderCategorySelect()}
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                  <Activity size={20} className="text-slate-600" />
                </div>
                <span className="text-sm text-slate-600">Total Time</span>
              </div>
              <span className="font-bold text-slate-800">{formatDuration(stats.totalMinutes)}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                  <TrendingUp size={20} className="text-slate-600" />
                </div>
                <span className="text-sm text-slate-600">Top Category</span>
              </div>
              <span className="font-bold text-slate-800">{stats.byCategory[0]?.categoryName}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                  <PieChart size={20} className="text-slate-600" />
                </div>
                <span className="text-sm text-slate-600">Categories Used</span>
              </div>
              <span className="font-bold text-slate-800">{stats.byCategory.length}</span>
            </div>
          </div>
          
          <button className="w-full mt-6 px-4 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
