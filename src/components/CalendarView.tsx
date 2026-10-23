import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { StatusDropdown } from './StatusDropdown';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Phone, Sparkles, CalendarCheck } from 'lucide-react';
import { createGoogleCalendarUrl } from '../utils/calendar';

interface CalendarViewProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onOpenWhatsAppAi?: (lead: Lead) => void;
  onOpenGoogleCalendar?: (lead: Lead) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  leads,
  onUpdateStatus,
  onOpenWhatsAppAi,
  onOpenGoogleCalendar
}) => {
  // Center around October 2026 (matching data date 16.10.2026) or current system date
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDay, setSelectedDay] = useState<number | null>(24);

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Adjust so Monday is 0
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Format date string as YYYY-MM-DD
  const formatIsoDate = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  // Group leads by date
  const leadsByDate: Record<string, Lead[]> = {};
  leads.forEach(l => {
    if (l.followUpDate) {
      if (!leadsByDate[l.followUpDate]) {
        leadsByDate[l.followUpDate] = [];
      }
      leadsByDate[l.followUpDate].push(l);
    }
  });

  const selectedDateStr = selectedDay ? formatIsoDate(selectedDay) : null;
  const selectedDayLeads = selectedDateStr ? (leadsByDate[selectedDateStr] || []) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {monthNames[currentMonth]} {currentYear} Görüşme & Takip Takvimi
            </h2>
            <p className="text-xs text-slate-400">
              Görüşme planlanan tarihler ve takvim üzerinde randevu yönetimi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(9);
              setSelectedDay(24);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            Bugün / Ekim 2026
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Grid */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-xs font-semibold text-slate-400 py-1 uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[85px] rounded-xl bg-slate-950/20 opacity-30" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const iso = formatIsoDate(day);
              const dayLeads = leadsByDate[iso] || [];
              const isSelected = selectedDay === day;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[85px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : dayLeads.length > 0
                      ? 'bg-slate-950/80 border-slate-700/80 hover:border-slate-500'
                      : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {day}
                    </span>
                    {dayLeads.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    )}
                  </div>

                  {/* Badges preview */}
                  <div className="space-y-1 mt-1">
                    {dayLeads.slice(0, 2).map((l) => (
                      <div
                        key={l.id}
                        className="text-[10px] truncate px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
                        title={l.name}
                      >
                        {l.name}
                      </div>
                    ))}
                    {dayLeads.length > 2 && (
                      <div className="text-[9px] text-slate-400 text-center">
                        +{dayLeads.length - 2} daha
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details sidebar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                {selectedDay ? `${selectedDay} ${monthNames[currentMonth]} ${currentYear}` : 'Tarih Seçin'}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedDayLeads.length} planlanmış görüşme
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {selectedDayLeads.length} Kayıt
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {selectedDayLeads.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Bu tarihe atanmış bir takip veya arama randevusu bulunmuyor.
                <br />
                <span className="text-slate-600 block mt-2">
                  Tablo görünümünden bir işletmenin 3. sütunundaki (Takip/Randevu) tarihe bu günü atayabilirsiniz.
                </span>
              </div>
            ) : (
              selectedDayLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">{lead.name}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">{lead.category}</p>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400">
                      Skor: {lead.opportunityScore}
                    </span>
                  </div>

                  {lead.notes && (
                    <div className="p-2 rounded bg-slate-900 text-xs text-slate-300 italic border border-slate-800">
                      "{lead.notes}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <StatusDropdown
                      currentStatus={lead.status}
                      onSelect={(st) => onUpdateStatus(lead.id, st)}
                      compact
                    />
                    <div className="flex items-center gap-1.5">
                      {onOpenWhatsAppAi && (
                        <button
                          type="button"
                          onClick={() => onOpenWhatsAppAi(lead)}
                          className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                          title="Groq AI İle Mesaj Oluştur"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenGoogleCalendar) {
                            onOpenGoogleCalendar(lead);
                          } else {
                            window.open(createGoogleCalendarUrl(lead), '_blank');
                          }
                        }}
                        className="p-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                        title="Google Calendar'da Aç & Ekle"
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{lead.phone}</span>
                      </a>
                    </div>
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
