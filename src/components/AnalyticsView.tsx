import React from 'react';
import { Lead, STATUS_OPTIONS, LeadStatus } from '../types/lead';
import { PieChart, TrendingUp, Trophy, Activity, CheckCircle, BarChart2 } from 'lucide-react';

interface AnalyticsViewProps {
  leads: Lead[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ leads }) => {
  const total = leads.length;

  // Category counts
  const catCounts: Record<string, number> = {};
  leads.forEach(l => {
    catCounts[l.category] = (catCounts[l.category] || 0) + 1;
  });

  // Status counts
  const statusCounts: Record<string, number> = {};
  leads.forEach(l => {
    statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
  });

  // Top score leads
  const topLeads = [...leads]
    .sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0))
    .slice(0, 8);

  const convertedCount = (statusCounts['websitesi_eklendi'] || 0) + (statusCounts['olumlu'] || 0);
  const conversionRate = total > 0 ? Math.round((convertedCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview highlight */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Toplam Hedef Kitle</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{total} İşletme</div>
          <p className="text-[11px] text-slate-500 mt-1">Malatya merkezli taranan firmalar</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Dönüşüm Oranı</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">%{conversionRate}</div>
          <p className="text-[11px] text-slate-500 mt-1">{convertedCount} işletme web sitesi/satışa dönüştü</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Arama Bekleyenler</span>
            <BarChart2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{statusCounts['aranmadi'] || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">Hemen aranabilecek sıcak fırsatlar</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Yüksek Fırsat (60+ Skor)</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {leads.filter(l => l.opportunityScore >= 60).length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Öncelikli iletişime geçilmesi gerekenler</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>İletişim & Satış Durumu Dağılımı</span>
            <span className="text-xs text-slate-400">6 Durum Tipi</span>
          </h3>

          <div className="space-y-3.5">
            {(Object.keys(STATUS_OPTIONS) as LeadStatus[]).map((st) => {
              const opt = STATUS_OPTIONS[st];
              const count = statusCounts[st] || 0;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={st} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{opt.label}</span>
                    <span className="text-slate-400">
                      <strong>{count}</strong> ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        st === 'websitesi_eklendi'
                          ? 'bg-emerald-500'
                          : st === 'olumlu'
                          ? 'bg-purple-500'
                          : st === 'arandi'
                          ? 'bg-blue-500'
                          : st === 'tekrar_iletisime_gecilecek'
                          ? 'bg-amber-500'
                          : st === 'red_alindi'
                          ? 'bg-rose-500'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>Sektör Dağılımı</span>
            <span className="text-xs text-slate-400">{Object.keys(catCounts).length} Sektör</span>
          </h3>

          <div className="space-y-4">
            {Object.entries(catCounts).map(([cat, count]) => {
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize text-slate-200 font-semibold">{cat}</span>
                    <span className="text-slate-400 font-mono">
                      {count} firma (%{percentage})
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.includes('diş')
                          ? 'bg-cyan-500'
                          : cat.includes('diyet')
                          ? 'bg-emerald-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Opportunity Leads table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>En Yüksek Fırsat Skoruna Sahip İşletmeler (İlk 8)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {topLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {lead.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Skor: {lead.opportunityScore}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-100 line-clamp-2" title={lead.name}>
                  {lead.name}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{lead.phone}</span>
                <span className="text-indigo-400">{STATUS_OPTIONS[lead.status]?.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
