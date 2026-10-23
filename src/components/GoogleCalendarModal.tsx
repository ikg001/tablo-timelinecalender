import React, { useState } from 'react';
import { Lead } from '../types/lead';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { 
  X, 
  Calendar as CalendarIcon, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Phone, 
  Sparkles,
  Layers
} from 'lucide-react';

interface GoogleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  selectedLead?: Lead | null;
}

export const GoogleCalendarModal: React.FC<GoogleCalendarModalProps> = ({
  isOpen,
  onClose,
  leads,
  selectedLead
}) => {
  const [activeLeadId, setActiveLeadId] = useState<string>(selectedLead?.id || leads[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState<string>(() => {
    return selectedLead?.followUpDate || new Date().toISOString().slice(0, 10);
  });
  const [appointmentTime, setAppointmentTime] = useState<string>('14:00');

  if (!isOpen) return null;

  const currentLead = leads.find(l => l.id === activeLeadId) || selectedLead || leads[0];
  const scheduledLeads = leads.filter(l => l.followUpDate);

  const handleOpenGoogleCalendar = () => {
    if (!currentLead) return;
    const url = createGoogleCalendarUrl(currentLead, appointmentDate);
    window.open(url, '_blank');
  };

  const handleDownloadAllIcs = () => {
    downloadIcsFile(leads, `malatya-crm-randevular-${new Date().toISOString().slice(0, 10)}.ics`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Google Calendar Entegrasyonu & Testi</span>
              </h3>
              <p className="text-xs text-slate-400">
                Görüşme ve randevuları Google Calendar'a tek tıkla kaydedin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          {/* Test 1: Single Event Direct Google Calendar URL */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-4 h-4" /> 1. Yerelde Anında Test Et (Google Calendar):
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                API Key Gerektirmez
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Aşağıdaki işletmeyi seçip tarihi belirleyin. Butona bastığınızda Google Takvim sayfanız doğrudan açılacak ve randevu detayları hazır olarak gelecektir.
            </p>

            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  İşletme Seçin:
                </label>
                <select
                  value={activeLeadId}
                  onChange={(e) => setActiveLeadId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.category} - {l.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Görüşme Tarihi:
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Saat:
                  </label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {currentLead && (
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{currentLead.name}</span>
                    <span className="font-mono text-blue-400">{currentLead.phone}</span>
                  </div>
                  <div className="text-slate-400 truncate">
                    Not: {currentLead.notes || 'Not girilmemiş.'}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleOpenGoogleCalendar}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.01]"
              >
                <span>Google Calendar'da Randevu Oluştur</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Test 2: Bulk Export iCalendar (.ics) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Toplu Takvim Dosyası (.ics)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Takip tarihi girilmiş {scheduledLeads.length} işletmeyi tek seferde Google Calendar veya Outlook'a aktarın.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadAllIcs}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>.ICS İndir</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
