import React from 'react';
import type { Lead } from '../types/lead';
import { Users, PhoneCall, Globe, TrendingUp, AlertCircle, DollarSign, Wallet } from 'lucide-react';

interface StatsCardsProps {
  leads: Lead[];
  onFilterByStatus: (status: string) => void;
  activeStatus: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  leads,
  onFilterByStatus,
  activeStatus
}) => {
  const total = leads.length;
  const uncalled = leads.filter(l => l.status === 'aranmadi').length;
  const inProgress = leads.filter(l => l.status === 'arandi' || l.status === 'tekrar_iletisime_gecilecek').length;
  const converted = leads.filter(l => l.status === 'websitesi_eklendi' || l.status === 'olumlu').length;
  const rejected = leads.filter(l => l.status === 'red_alindi').length;

  const avgOpportunity = Math.round(
    leads.reduce((acc, curr) => acc + (curr.opportunityScore || 0), 0) / (total || 1)
  );

  // Revenue calculations
  const wonRevenue = leads
    .filter(l => l.status === 'websitesi_eklendi' || l.status === 'olumlu')
    .reduce((acc, curr) => acc + (curr.closedValue || curr.dealValue || 19500), 0);

  const potentialRevenue = leads.reduce((acc, curr) => {
    return acc + (curr.dealValue || 15000);
  }, 0);

  const formatTL = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ₺`;
    if (amount >= 1000) return `${Math.round(amount / 1000)}K ₺`;
    return `${amount} ₺`;
  };

  const stats = [
    {
      id: 'all',
      title: 'Toplam İşletme',
      value: total,
      desc: 'Malatya merkezli potansiyel müşteriler',
      icon: <Users className="w-4 h-4 text-indigo-400" />,
      color: 'border-slate-800 hover:border-indigo-500/50',
      activeRing: activeStatus === 'all' ? 'ring-2 ring-indigo-500' : ''
    },
    {
      id: 'aranmadi',
      title: 'Henüz Aranmadı',
      value: uncalled,
      desc: 'Arama bekleyen yeni fırsatlar',
      icon: <AlertCircle className="w-4 h-4 text-slate-400" />,
      color: 'border-slate-800 hover:border-slate-600',
      activeRing: activeStatus === 'aranmadi' ? 'ring-2 ring-slate-400' : ''
    },
    {
      id: 'arandi',
      title: 'Görüşme Sürecinde',
      value: inProgress,
      desc: 'Arandı & Tekrar Aranacak',
      icon: <PhoneCall className="w-4 h-4 text-blue-400" />,
      color: 'border-slate-800 hover:border-blue-500/50',
      activeRing: activeStatus === 'arandi' || activeStatus === 'tekrar_iletisime_gecilecek' ? 'ring-2 ring-blue-500' : ''
    },
    {
      id: 'websitesi_eklendi',
      title: 'Kazanılan Ciro',
      value: converted > 0 ? formatTL(wonRevenue) : `${converted} Satış`,
      desc: `${converted} işletme web sitesine dönüştü`,
      icon: <Wallet className="w-4 h-4 text-emerald-400" />,
      color: 'border-slate-800 hover:border-emerald-500/50',
      activeRing: activeStatus === 'websitesi_eklendi' || activeStatus === 'olumlu' ? 'ring-2 ring-emerald-500' : ''
    },
    {
      id: 'potansiyel',
      title: 'Potansiyel Pipeline',
      value: formatTL(potentialRevenue),
      desc: `Ort. ${avgOpportunity}/100 fırsat skoru`,
      icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
      color: 'border-slate-800 hover:border-amber-500/50',
      activeRing: ''
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div
          key={s.title}
          onClick={() => s.id !== 'potansiyel' && onFilterByStatus(s.id)}
          className={`p-3.5 rounded-xl bg-slate-900/60 border ${s.color} ${s.activeRing} backdrop-blur-sm transition-all duration-200 cursor-pointer hover:bg-slate-900/90 hover:scale-[1.01]`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium truncate">{s.title}</span>
            {s.icon}
          </div>
          <div className="text-xl font-bold tracking-tight text-white mb-0.5">
            {s.value}
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            {s.desc}
          </div>
        </div>
      ))}
    </div>
  );
};
