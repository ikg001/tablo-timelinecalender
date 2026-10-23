import React from 'react';
import { Lead, LeadStatus, STATUS_OPTIONS } from '../types/lead';
import { StatusDropdown } from './StatusDropdown';
import { Calendar, Phone, MessageCircle, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface TimelineViewProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  leads,
  onUpdateStatus,
  onUpdateNotes
}) => {
  // Sort leads: those with follow-up dates first, then by score
  const followUpLeads = leads
    .filter(l => l.followUpDate)
    .sort((a, b) => (a.followUpDate || '').localeCompare(b.followUpDate || ''));

  const pendingCalls = leads.filter(l => l.status === 'aranmadi' || l.status === 'tekrar_iletisime_gecilecek');
  const completedLeads = leads.filter(l => l.status === 'websitesi_eklendi' || l.status === 'olumlu');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">İletişim & Randevu Zaman Çizelgesi</h2>
            <p className="text-xs text-slate-400">
              Planlanmış takipler, aranacak firmalar ve tamamlanan web sitesi süreçleri
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs">
            {followUpLeads.length} Planlı Takip
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs">
            {completedLeads.length} Başarılı Dönüşüm
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Takip / Randevular (With Date) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Planlanmış Takipler & Randevular</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {followUpLeads.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
            {followUpLeads.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                Henüz takip tarihi belirlenmiş işletme yok. Tablo üzerinden tarih seçebilirsiniz.
              </p>
            ) : (
              followUpLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">{lead.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="capitalize">{lead.category}</span>
                        <span>•</span>
                        <span className="font-mono">{lead.phone}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {lead.followUpDate}
                    </span>
                  </div>

                  {lead.notes && (
                    <p className="text-xs text-slate-300 bg-slate-900/90 p-2 rounded-lg border border-slate-800/80 italic">
                      "{lead.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <StatusDropdown
                      currentStatus={lead.status}
                      onSelect={(st) => onUpdateStatus(lead.id, st)}
                      compact
                    />
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Ara"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                      <a
                        href={`https://wa.me/90${lead.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Aranacak / Bekleyenler */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Arama Bekleyenler</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
              {pendingCalls.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
            {pendingCalls.slice(0, 15).map((lead) => (
              <div
                key={lead.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100">{lead.name}</h4>
                    <span className="text-[11px] text-slate-400">{lead.category}</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Skor: {lead.opportunityScore}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <StatusDropdown
                    currentStatus={lead.status}
                    onSelect={(st) => onUpdateStatus(lead.id, st)}
                    compact
                  />
                  <a
                    href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-mono"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Hemen Ara</span>
                  </a>
                </div>
              </div>
            ))}
            {pendingCalls.length > 15 && (
              <p className="text-center text-xs text-slate-500 pt-2">
                +{pendingCalls.length - 15} işletme daha Tablo görünümünde listelenmektedir.
              </p>
            )}
          </div>
        </div>

        {/* Column 3: Başarılı / Web Sitesi Eklenenler */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Web Sitesi Eklenen / Olumlu</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              {completedLeads.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
            {completedLeads.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                Henüz web sitesi eklenen işletme yok. Durum açılır menüsünden "Websitesi Eklendi" seçebilirsiniz.
              </p>
            ) : (
              completedLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-emerald-900/30 hover:border-emerald-600/40 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">{lead.name}</h4>
                      <span className="text-[11px] text-emerald-400/80">
                        {lead.status === 'websitesi_eklendi' ? '✓ Web Sitesi Yayında' : '★ Satış Anlaşıldı'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {lead.addedDate}
                    </span>
                  </div>

                  {lead.notes && (
                    <p className="text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                      {lead.notes}
                    </p>
                  )}

                  <div className="pt-1 flex items-center justify-between">
                    <StatusDropdown
                      currentStatus={lead.status}
                      onSelect={(st) => onUpdateStatus(lead.id, st)}
                      compact
                    />
                    <span className="text-[11px] font-bold text-emerald-400">
                      Başarılı
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
