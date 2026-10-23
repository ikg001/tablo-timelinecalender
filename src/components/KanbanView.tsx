import React, { useState } from 'react';
import { Lead, LeadStatus, STATUS_OPTIONS } from '../types/lead';
import { StatusDropdown } from './StatusDropdown';
import { 
  Phone, 
  MessageCircle, 
  Sparkles, 
  FileText, 
  Calendar, 
  Clock, 
  DollarSign, 
  MoveRight, 
  ChevronRight, 
  ChevronLeft,
  GripVertical
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KanbanViewProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onOpenWhatsAppAi: (lead: Lead) => void;
  onOpenProposal: (lead: Lead) => void;
  onOpenGoogleCalendar: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
}

const KANBAN_COLUMNS: LeadStatus[] = [
  'aranmadi',
  'arandi',
  'tekrar_iletisime_gecilecek',
  'websitesi_eklendi',
  'olumlu',
  'red_alindi'
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  leads,
  onUpdateStatus,
  onOpenWhatsAppAi,
  onOpenProposal,
  onOpenGoogleCalendar,
  onEditLead
}) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedLeadId(id);
  };

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const id = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (id) {
      onUpdateStatus(id, newStatus);
      if (newStatus === 'websitesi_eklendi' || newStatus === 'olumlu') {
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch (e) {
          // ignore
        }
      }
    }
    setDraggedLeadId(null);
  };

  const getCategoryBadge = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('diş')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (lower.includes('diyet')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (lower.includes('sigorta')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-4">
      {/* Information Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <GripVertical className="w-4 h-4" />
          </div>
          <span className="text-slate-300">
            <strong>Satış Hunisi (Kanban Panosu):</strong> Kartları kolonlar arasında sürükleyip bırakarak (Drag & Drop) aşamalarını anında güncelleyebilirsiniz.
          </span>
        </div>
        <span className="text-slate-400 font-medium">
          Toplam {leads.length} İşletme
        </span>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 items-start">
        {KANBAN_COLUMNS.map((colStatus) => {
          const config = STATUS_OPTIONS[colStatus];
          const colLeads = leads.filter(l => l.status === colStatus);
          const isOver = dragOverColumn === colStatus;
          const totalScore = colLeads.reduce((acc, c) => acc + (c.opportunityScore || 0), 0);

          return (
            <div
              key={colStatus}
              onDragOver={(e) => handleDragOver(e, colStatus)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, colStatus)}
              className={`rounded-2xl border transition-all duration-200 flex flex-col max-h-[80vh] ${
                isOver
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    colStatus === 'websitesi_eklendi' ? 'bg-emerald-400' :
                    colStatus === 'olumlu' ? 'bg-purple-400' :
                    colStatus === 'arandi' ? 'bg-blue-400' :
                    colStatus === 'tekrar_iletisime_gecilecek' ? 'bg-amber-400' :
                    colStatus === 'red_alindi' ? 'bg-rose-400' : 'bg-slate-500'
                  }`} />
                  <h3 className="text-xs font-bold text-white truncate max-w-[140px]" title={config.label}>
                    {config.label}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1 min-h-[150px]">
                {colLeads.length === 0 ? (
                  <div className="py-8 text-center text-slate-600 text-[11px] border-2 border-dashed border-slate-800/50 rounded-xl">
                    Bu aşamada işletme yok
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-black/60 transition-all cursor-grab active:cursor-grabbing space-y-2 group"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border truncate max-w-[120px] ${getCategoryBadge(lead.category)}`}>
                          {lead.category}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                          Skor: {lead.opportunityScore}
                        </span>
                      </div>

                      {/* Lead Title */}
                      <h4 
                        onClick={() => onEditLead(lead)}
                        className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2"
                        title={lead.name}
                      >
                        {lead.name}
                      </h4>

                      {/* Notes snippet */}
                      {lead.notes && (
                        <p className="text-[11px] text-slate-400 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800/80 line-clamp-2 italic">
                          "{lead.notes}"
                        </p>
                      )}

                      {/* Follow-up date if set */}
                      {lead.followUpDate && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono w-fit">
                          <Clock className="w-3 h-3" />
                          <span>{lead.followUpDate}</span>
                        </div>
                      )}

                      {/* Actions Footer */}
                      <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenWhatsAppAi(lead)}
                            className="p-1 rounded-md text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Groq AI WhatsApp Mesajı"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenProposal(lead)}
                            className="p-1 rounded-md text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                            title="Teklif Mektubu / Fiyat Oluştur"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenGoogleCalendar(lead)}
                            className="p-1 rounded-md text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Google Calendar'da Planla"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Direct Call Button */}
                        <a
                          href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white font-mono"
                          title="Telefonla Ara"
                        >
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[85px]">{lead.phone}</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
