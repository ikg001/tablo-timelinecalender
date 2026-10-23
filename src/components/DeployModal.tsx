import React from 'react';
import { X, Globe, GitBranch, CheckCircle2, ArrowRight, ExternalLink, Terminal, ShieldCheck } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  repoUrl?: string;
  vercelUrl?: string;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  repoUrl,
  vercelUrl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                GitHub & Vercel Canlı Dağıtım
              </h3>
              <p className="text-xs text-slate-400">
                Uygulamanın GitHub ve Vercel entegrasyonu
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

        <div className="mt-4 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Proje Mimarisi Hazırlandı</span>
            </div>
            <p className="text-xs text-slate-300">
              React + TypeScript + Vite + Tailwind CSS mimarisi ile 64 işletme verisi, 3 ekstra CRM sütunu, Zaman Çizelgesi ve Takvim modülü eksiksiz entegre edildi.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Entegrasyon Adımları:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <GitBranch className="w-4 h-4 text-indigo-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">1. GitHub Deposu (Repository)</div>
                  <div className="text-slate-400 mt-0.5">
                    {repoUrl ? (
                      <a href={repoUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                        {repoUrl} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      'Terminal üzerinden gh repo create tablo-timelinecalender ile senkronize ediliyor.'
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <Globe className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">2. Vercel Canlı Dağıtım</div>
                  <div className="text-slate-400 mt-0.5">
                    {vercelUrl ? (
                      <a href={vercelUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                        Canlı Siteye Git: {vercelUrl} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      'Vercel CLI veya vercel.com üzerinden GitHub reposu bağlanarak anında canlıya alınır.'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
