import React from 'react';
import { FolderOpen, Clock, BarChart, Download, Database } from 'lucide-react';

export const EmptyState = ({ type = 'default', title, message, action }) => {
  const icons = {
    default: Database,
    records: Clock,
    categories: FolderOpen,
    statistics: BarChart,
    export: Download,
  };

  const messages = {
    default: { title: 'No Data', message: 'There is nothing here yet.' },
    records: { title: 'No Records', message: 'Start logging your time to see records here.' },
    categories: { title: 'No Categories', message: 'Create your first category to organize your time.' },
    statistics: { title: 'No Statistics', message: 'Log some time to see your statistics.' },
    export: { title: 'No Exports', message: 'Export your data to see export history.' },
  };

  const Icon = icons[type] || Database;
  const content = title ? { title, message } : messages[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{content.title}</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-6">{content.message}</p>
      {action && (
        <button className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors">
          {action}
        </button>
      )}
    </div>
  );
};

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const RecordSkeleton = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton className="h-12 w-12 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100">
    <Skeleton className="h-6 w-32 mb-4" />
    <Skeleton className="h-48 w-full" />
  </div>
);
