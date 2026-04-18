import React, { useState } from 'react';
import { 
  FolderOpen, Plus, Trash2, Edit3, ChevronDown, ChevronRight,
  Check, X, GripVertical, Briefcase, TrendingUp, Home, Heart, AlertTriangle
} from 'lucide-react';
import { mockCategories, formatDuration } from '../mocks/data';

const CATEGORY_ICONS = {
  Output: Briefcase,
  Growth: TrendingUp,
  Basic: Home,
  Recharge: Heart,
  Drain: AlertTriangle,
};

const CATEGORY_COLORS = {
  Output: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700', accent: '#10b981' },
  Growth: { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700', accent: '#f59e0b' },
  Basic: { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-700', accent: '#3b82f6' },
  Recharge: { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-700', accent: '#ec4899' },
  Drain: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-700', accent: '#64748b' },
};

const CategoryManagerView = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCat, setSelectedCat] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');

  const toggleCategory = (id) => {
    setSelectedCat(selectedCat === id ? null : id);
  };

  const addSubCategory = (parentId) => {
    if (!newSubCategory.trim()) return;
    setCategories(categories.map(cat => {
      if (cat.id === parentId) {
        return {
          ...cat,
          subCategories: [
            ...cat.subCategories,
            { id: Date.now(), name: newSubCategory, displayName: newSubCategory, parentId }
          ]
        };
      }
      return cat;
    }));
    setNewSubCategory('');
    setEditMode(null);
  };

  const deleteSubCategory = (parentId, subId) => {
    setCategories(categories.map(cat => {
      if (cat.id === parentId) {
        return {
          ...cat,
          subCategories: cat.subCategories.filter(s => s.id !== subId)
        };
      }
      return cat;
    }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold">分类管理</h2>
          <p className="text-slate-400 text-xs">基于柳比歇夫时间统计法的五大核心分类体系</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
        {categories.map(cat => {
          const Icon = CATEGORY_ICONS[cat.name] || FolderOpen;
          const colors = CATEGORY_COLORS[cat.name];
          return (
            <div 
              key={cat.id}
              className={`p-4 rounded-xl border ${colors.border} ${colors.bg} cursor-pointer transition-all hover:shadow-md`}
              onClick={() => toggleCategory(cat.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} style={{ color: colors.accent }} />
                <span className={`font-bold text-[14px] ${colors.text}`}>{cat.displayName}</span>
              </div>
              <div className="text-xs text-slate-500 mb-2">{cat.subCategories.length} 子分类</div>
              <div className="text-lg font-bold text-slate-700">{formatDuration(cat.timeThisMonth)}</div>
              <div className="text-[10px] text-slate-400">本月统计</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">分类层级结构</h3>
          <span className="text-xs text-slate-400">点击分类展开详情</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat.name] || FolderOpen;
            const colors = CATEGORY_COLORS[cat.name];
            const isExpanded = selectedCat === cat.id;
            
            return (
              <div key={cat.id} className="divide-y divide-slate-50">
                <div 
                  className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <GripVertical size={16} className="text-slate-300" />
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.accent + '20' }}
                  >
                    <Icon size={20} style={{ color: colors.accent }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-700">{cat.displayName}</div>
                    <div className="text-xs text-slate-400">{cat.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-700">{formatDuration(cat.timeThisMonth)}</div>
                    <div className="text-xs text-slate-400">本月</div>
                  </div>
                  {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                </div>
                
                {isExpanded && (
                  <div className="p-4 pl-14 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-600">子分类</span>
                      <button 
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50"
                        onClick={() => setEditMode(cat.id)}
                      >
                        <Plus size={12} /> 添加子分类
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {cat.subCategories.map(sub => (
                        <div 
                          key={sub.id}
                          className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300"
                        >
                          <GripVertical size={14} className="text-slate-300" />
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
                          <span className="flex-1 text-sm text-slate-600">{sub.displayName}</span>
                          <span className="text-xs text-slate-400">{sub.name}</span>
                          <button 
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            onClick={() => deleteSubCategory(cat.id, sub.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {editMode === cat.id && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={newSubCategory}
                          onChange={(e) => setNewSubCategory(e.target.value)}
                          placeholder="新子分类名称"
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
                          autoFocus
                        />
                        <button 
                          className="px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600"
                          onClick={() => addSubCategory(cat.id)}
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          className="px-3 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-300"
                          onClick={() => { setEditMode(null); setNewSubCategory(''); }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagerView;