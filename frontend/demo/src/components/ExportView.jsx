import React, { useState } from 'react';
import { 
  Download, FileJson, FileSpreadsheet, FileText, Globe, 
  Calendar, Mail, Clock, CheckCircle, AlertCircle, ChevronRight,
  RefreshCw, Settings
} from 'lucide-react';
import { mockExportData, formatDate } from '../mocks/data';

const ExportView = () => {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [selectedRange, setSelectedRange] = useState('last30');
  const [customStartDate, setCustomStartDate] = useState('2026-04-01');
  const [customEndDate, setCustomEndDate] = useState('2026-04-15');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('export');

  const formatIcons = {
    json: FileJson,
    csv: FileSpreadsheet,
    txt: FileText,
    html: Globe,
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsExporting(false);
    setExportSuccess(true);
    
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const renderExportTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Export Format</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockExportData.formats.map(format => {
            const Icon = formatIcons[format.id];
            return (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedFormat === format.id
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <Icon size={24} className={selectedFormat === format.id ? 'text-slate-800' : 'text-slate-400'} />
                <div className="mt-3 font-semibold text-slate-700">{format.name}</div>
                <div className="text-xs text-slate-500 mt-1">{format.description}</div>
                <div className="text-xs text-slate-400 mt-2 font-mono">{format.extension}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Date Range</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {mockExportData.dateRanges.map(range => (
            <button
              key={range.id}
              onClick={() => setSelectedRange(range.id)}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                selectedRange === range.id
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 mb-2">Start Date</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 mb-2">End Date</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Export Your Data</h3>
        <p className="text-sm text-slate-500 mb-6">
          Download your time records in the selected format. Your data will be exported as a compressed file.
        </p>
        
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
              <Download size={20} className="text-slate-600" />
            </div>
            <div>
              <div className="font-medium text-slate-700">TimeLedger Export</div>
              <div className="text-xs text-slate-500">
                {customStartDate} to {customEndDate} • {selectedFormat.toUpperCase()}
              </div>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Exporting...
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle size={18} />
                Exported!
              </>
            ) : (
              <>
                <Download size={18} />
                Export
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Exports</h3>
        {mockExportData.recentExports.length > 0 ? (
          <div className="space-y-3">
            {mockExportData.recentExports.map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <FileText size={18} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-700">{exp.format}</div>
                    <div className="text-xs text-slate-500">{exp.dateRange}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-slate-400">{exp.size}</span>
                  <span className="text-xs text-slate-400">{exp.date}</span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No exports yet. Create your first export above.
          </div>
        )}
      </div>
    </div>
  );

  const renderStaticTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Static Web Page</h3>
            <p className="text-sm text-slate-500 mt-1">
              Generate a self-contained HTML file that you can open in any browser to view your time data.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full">
            Recommended
          </span>
        </div>
        
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-slate-600">Date Range:</span>
              <span className="font-medium text-slate-800">Apr 1 - Apr 15, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span className="text-slate-600">Records:</span>
              <span className="font-medium text-slate-800">127 entries</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-slate-400" />
              <span className="text-slate-600">File Size:</span>
              <span className="font-medium text-slate-800">~5.2 MB</span>
            </div>
          </div>
        </div>

        <button className="px-6 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
          <Globe size={18} />
          Generate Web Page
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Preview</h3>
        <p className="text-sm text-slate-500 mb-6">
          The static page includes daily views, charts, and statistics in a beautiful, printable format.
        </p>
        
        <div className="bg-slate-100 rounded-xl border border-slate-200 p-8">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-lg mx-auto">
            <div className="h-4 w-32 bg-slate-200 rounded mb-4"></div>
            <div className="h-3 w-48 bg-slate-100 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-2 bg-slate-100 rounded w-full"></div>
              <div className="h-2 bg-slate-100 rounded w-4/5"></div>
              <div className="h-2 bg-slate-100 rounded w-3/5"></div>
              <div className="h-2 bg-slate-100 rounded w-full"></div>
              <div className="h-2 bg-slate-100 rounded w-2/5"></div>
            </div>
            <div className="flex gap-2 mt-6">
              <div className="h-8 flex-1 bg-slate-200 rounded"></div>
              <div className="h-8 flex-1 bg-slate-200 rounded"></div>
              <div className="h-8 flex-1 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAutoExportTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Auto Export</h3>
            <p className="text-sm text-slate-500 mt-1">
              Automatically export your data to your email on a schedule.
            </p>
          </div>
          <button className={`w-12 h-6 rounded-full transition-colors ${mockExportData.autoExportConfig.enabled ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${mockExportData.autoExportConfig.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Export Frequency</label>
            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200">
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <AlertCircle size={16} className="text-amber-500" />
              <span>Last export: {mockExportData.autoExportConfig.lastExport}</span>
            </div>
          </div>

          <button className="px-6 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
            <Settings size={18} />
            Save Configuration
          </button>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle size={24} className="text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800">Data Security</h4>
            <p className="text-sm text-amber-700 mt-1">
              Your data is exported locally and sent via secure email. We never store your exported files on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-800">Export Data</h2>
          <p className="text-slate-400 text-xs mt-2">Download your time data in various formats</p>
        </div>
      </div>

      <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
        {['export', 'static', 'auto-export'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'export' ? 'Export' : tab === 'static' ? 'Static Page' : 'Auto Export'}
          </button>
        ))}
      </div>

      {activeTab === 'export' && renderExportTab()}
      {activeTab === 'static' && renderStaticTab()}
      {activeTab === 'auto-export' && renderAutoExportTab()}
    </div>
  );
};

export default ExportView;
