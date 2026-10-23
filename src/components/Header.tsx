import React from 'react';
import { 
  Building2, 
  Table, 
  Calendar as CalendarIcon, 
  GitCommit, 
  BarChart3, 
  Plus, 
  Download, 
  RotateCcw, 
  Search,
  Globe2,
  ExternalLink,
  Sparkles,
  CalendarCheck,
  FileSpreadsheet
} from 'lucide-react';
import type { LeadStatus } from '../types/lead';
import { STATUS_OPTIONS } from '../types/lead';

export type ViewMode = 'table' | 'timeline' | 'calendar' | 'analytics';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  categories: string[];
  totalLeads: number;
  filteredCount: number;
  onAddLead: () => void;
  onExport: () => void;
  onReset: () => void;
  onOpenDeployModal: () => void;
  onOpenGoogleCalendarModal: () => void;
  onOpenWhatsAppAiModal: () => void;
  onOpenImportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  categories,
  totalLeads,
  filteredCount,
  onAddLead,
  onExport,
  onReset,
  onOpenDeployModal,
  onOpenGoogleCalendarModal,
  onOpenWhatsAppAiModal,
  onOpenImportModal
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Malatya İşletme CRM & Web Satış Paneli
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {totalLeads} İşletme
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Diş Klinikleri, Diyetisyenler ve Sigorta Acenteleri Satış & İletişim Takibi
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Groq AI WhatsApp Shortcut */}
            <button
              onClick={onOpenWhatsAppAiModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm"
              title="Groq AI ile Otomatik WhatsApp Mesajı Oluştur & Gönder"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Groq AI Mesaj</span>
            </button>

            {/* Google Calendar Master Modal */}
            <button
              onClick={onOpenGoogleCalendarModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all shadow-sm"
              title="Google Calendar ile Bağla ve Randevu Oluştur"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Calendar</span>
            </button>

            <button
              onClick={onOpenDeployModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
              title="GitHub & Vercel Yayın Durumu"
            >
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Vercel</span>
            </button>

            <button
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
              title="Excel (.xlsx) veya CSV dosyasından işletmeleri içeri aktar"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel Yükle</span>
            </button>

            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              title="Excel/CSV formatında indir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-800/40 text-xs font-medium transition-colors"
              title="Verileri orijinal listeye sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sıfırla</span>
            </button>

            <button
              onClick={onAddLead}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni İşletme</span>
            </button>
          </div>
        </div>

        {/* View Switcher & Filters */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* View tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 w-fit">
            <button
              onClick={() => onViewChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tablo Görünümü</span>
            </button>

            <button
              onClick={() => onViewChange('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Zaman Çizelgesi</span>
            </button>

            <button
              onClick={() => onViewChange('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Takvim</span>
            </button>

            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analiz</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="İşletme adı, telefon veya not ara..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Tüm Kategoriler ({totalLeads})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Tüm Durumlar</option>
              {(Object.keys(STATUS_OPTIONS) as LeadStatus[]).map((st) => (
                <option key={st} value={st}>
                  {STATUS_OPTIONS[st].label}
                </option>
              ))}
            </select>

            {filteredCount !== totalLeads && (
              <span className="text-[11px] text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                {filteredCount} sonuç bulundu
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
