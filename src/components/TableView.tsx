import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { StatusDropdown } from './StatusDropdown';
import { NoteModal } from './NoteModal';
import { 
  Phone, 
  MessageCircle, 
  Trash2, 
  Edit3, 
  Calendar, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown,
  Info,
  StickyNote,
  Maximize2
} from 'lucide-react';

interface TableViewProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateFollowUpDate: (id: string, date: string) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
}

type SortField = 'name' | 'opportunityScore' | 'addedDate' | 'status' | 'category';

export const TableView: React.FC<TableViewProps> = ({
  leads,
  onUpdateStatus,
  onUpdateNotes,
  onUpdateFollowUpDate,
  onEditLead,
  onDeleteLead
}) => {
  const [sortField, setSortField] = useState<SortField>('opportunityScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [activeNoteLead, setActiveNoteLead] = useState<Lead | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'name');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'opportunityScore') {
      comparison = (a.opportunityScore || 0) - (b.opportunityScore || 0);
    } else if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name, 'tr');
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category, 'tr');
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status, 'tr');
    } else if (sortField === 'addedDate') {
      comparison = a.addedDate.localeCompare(b.addedDate);
    }
    return sortAsc ? comparison : -comparison;
  });

  const getCategoryBadge = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('diş')) {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
    if (lower.includes('diyet')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (lower.includes('sigorta')) {
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
    return 'bg-slate-700/30 text-slate-300 border-slate-600/30';
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 35) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-slate-400 bg-slate-800 border-slate-700';
  };

  const formatCleanPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return `9${cleaned}`;
    }
    return `90${cleaned}`;
  };

  return (
    <>
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        {/* Table Information banner */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>
              Toplam <strong className="text-white">{leads.length}</strong> işletme listeleniyor. 
              <strong>Notlar</strong> sütunundaki metin kutusuna doğrudan yazabilir veya büyüteç simgesine tıklayarak hazır şablonlu detaylı not penceresini açabilirsiniz.
            </span>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>İşletme Adı</span>
                    {sortField === 'name' ? (
                      sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Kategori</span>
                    {sortField === 'category' ? (
                      sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4">Şehir</th>
                <th className="py-3 px-4">İletişim</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none text-center"
                  onClick={() => handleSort('opportunityScore')}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Fırsat Skoru</span>
                    {sortField === 'opportunityScore' ? (
                      sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>

                {/* SÜTUN 1: İletişim Durumu Dropdown */}
                <th className="py-3 px-4 bg-indigo-950/30 border-l border-indigo-900/30 text-indigo-300">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    <span>İletişim Durumu (Dropdown)</span>
                  </div>
                </th>

                {/* SÜTUN 2: NOTLAR (Belirginleştirilmiş Notlar Bölümü) */}
                <th className="py-3 px-4 bg-amber-950/20 border-l border-r border-amber-900/30 text-amber-300 min-w-[280px]">
                  <div className="flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                    <span>📝 Notlar (Görüşme Notları)</span>
                  </div>
                </th>

                {/* SÜTUN 3: Takip / Randevu */}
                <th className="py-3 px-4 bg-indigo-950/30 border-r border-indigo-900/30 text-indigo-300 min-w-[150px]">
                  <span>Takip / Randevu</span>
                </th>

                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    Aramanıza veya filtrenize uygun işletme bulunamadı.
                  </td>
                </tr>
              ) : (
                sortedLeads.map((lead, idx) => {
                  const hasValidPhone = lead.phone && lead.phone !== '-';
                  const hasNotes = Boolean(lead.notes && lead.notes.trim().length > 0);

                  return (
                    <tr 
                      key={lead.id} 
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-medium text-slate-100 max-w-[240px]">
                        <div className="flex flex-col">
                          <span className="truncate font-semibold text-[13px] group-hover:text-indigo-300 transition-colors" title={lead.name}>
                            {lead.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Kayıt: {lead.addedDate}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getCategoryBadge(lead.category)}`}>
                          {lead.category}
                        </span>
                      </td>

                      {/* City */}
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {lead.city}
                      </td>

                      {/* Phone & quick contact */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {hasValidPhone ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                              className="text-slate-300 hover:text-white font-mono hover:underline flex items-center gap-1"
                              title="Doğrudan Ara"
                            >
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span>{lead.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/${formatCleanPhone(lead.phone)}?text=${encodeURIComponent(
                                `Merhaba ${lead.name}, web sitesi ve dijital çözümlerimiz hakkında iletişime geçmek istemiştik.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-md text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                              title="WhatsApp Mesajı Gönder"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">Telefon Yok</span>
                        )}
                      </td>

                      {/* Opportunity Score */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getScoreColor(lead.opportunityScore)}`}>
                            {lead.opportunityScore}
                          </span>
                        </div>
                      </td>

                      {/* SÜTUN 1: İletişim Durumu Dropdown */}
                      <td className="py-2.5 px-4 bg-indigo-950/20 border-l border-indigo-900/30 whitespace-nowrap">
                        <StatusDropdown
                          currentStatus={lead.status}
                          onSelect={(newStatus) => onUpdateStatus(lead.id, newStatus)}
                        />
                      </td>

                      {/* SÜTUN 2: NOTLAR (Belirgin, Zengin Notlar Alanı) */}
                      <td className="py-2 px-4 bg-amber-950/10 border-l border-r border-amber-900/20">
                        <div className="relative flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Not ekle (örn: Fiyat verildi, arandı)..."
                            value={lead.notes || ''}
                            onChange={(e) => onUpdateNotes(lead.id, e.target.value)}
                            className={`w-full pl-2.5 pr-8 py-1.5 rounded-lg border text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-all ${
                              hasNotes
                                ? 'bg-amber-950/30 border-amber-500/40 focus:border-amber-400 focus:bg-slate-900'
                                : 'bg-slate-950/70 border-slate-700/60 focus:border-indigo-500 focus:bg-slate-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setActiveNoteLead(lead)}
                            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                              hasNotes
                                ? 'text-amber-400 hover:bg-amber-500/20'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                            }`}
                            title="Detaylı Not Penceresini Aç / Hazır Şablon Ekle"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* SÜTUN 3: Takip / Randevu Tarihi */}
                      <td className="py-2 px-4 bg-indigo-950/20 border-r border-indigo-900/30 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="date"
                            value={lead.followUpDate || ''}
                            onChange={(e) => onUpdateFollowUpDate(lead.id, e.target.value)}
                            className="px-2 py-1 rounded-lg bg-slate-950/60 border border-slate-700/60 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditLead(lead)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                            title="Düzenle"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteLead(lead.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note Details Modal */}
      <NoteModal
        isOpen={Boolean(activeNoteLead)}
        onClose={() => setActiveNoteLead(null)}
        lead={activeNoteLead}
        onSaveNotes={onUpdateNotes}
      />
    </>
  );
};
