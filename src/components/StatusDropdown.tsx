import React, { useState, useRef, useEffect } from 'react';
import { LeadStatus, STATUS_OPTIONS } from '../types/lead';
import { ChevronDown, Check, PhoneCall, Globe, Clock, XCircle, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StatusDropdownProps {
  currentStatus: LeadStatus;
  onSelect: (status: LeadStatus) => void;
  compact?: boolean;
}

const STATUS_ICONS: Record<LeadStatus, React.ReactNode> = {
  aranmadi: <Clock className="w-3.5 h-3.5" />,
  arandi: <PhoneCall className="w-3.5 h-3.5" />,
  tekrar_iletisime_gecilecek: <AlertCircle className="w-3.5 h-3.5" />,
  websitesi_eklendi: <Globe className="w-3.5 h-3.5" />,
  red_alindi: <XCircle className="w-3.5 h-3.5" />,
  olumlu: <Sparkles className="w-3.5 h-3.5" />
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  onSelect,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConfig = STATUS_OPTIONS[currentStatus] || STATUS_OPTIONS.aranmadi;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (status: LeadStatus) => {
    onSelect(status);
    setIsOpen(false);

    if (status === 'websitesi_eklendi' || status === 'olumlu') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 font-medium rounded-lg border transition-all duration-150 ${
          activeConfig.badge
        } ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm'} hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-indigo-500/40`}
      >
        <span>{STATUS_ICONS[currentStatus]}</span>
        <span>{activeConfig.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-56 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 py-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            Durumu Güncelle
          </div>
          <div className="py-1">
            {(Object.keys(STATUS_OPTIONS) as LeadStatus[]).map((key) => {
              const opt = STATUS_OPTIONS[key];
              const isSelected = key === currentStatus;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelect(key)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-slate-800/90 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={opt.color}>{STATUS_ICONS[key]}</span>
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
