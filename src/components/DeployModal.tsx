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
  repoUrl = 'https://github.com/ikg001/tablo-timelinecalender',
  vercelUrl
}) => {
  if (!isOpen) return null;

  const oneClickDeployUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(repoUrl)}`;

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
                GitHub & Vercel Canlı Dağıtım Paneli
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
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>GitHub Reposu Başarıyla Oluşturuldu ve İtildi</span>
            </div>
            <p className="text-xs text-slate-300">
              Kodlarınız ve 64 işletme veriniz GitHub üzerinde güvenle saklanmaktadır.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="font-semibold text-white">GitHub Reposu</div>
                  <div className="text-slate-400 font-mono text-[11px] truncate max-w-[240px]">
                    {repoUrl}
                  </div>
                </div>
              </div>
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Repoya Git</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs">
                <Globe className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Vercel Tek Tıkla Canlıya Al</div>
                  <div className="text-slate-400 text-[11px]">
                    Vercel hesabınızla anında bağlayıp ücretsiz yayınlayın
                  </div>
                </div>
              </div>
              <a
                href={oneClickDeployUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-md shadow-emerald-600/30 hover:scale-[1.02]"
              >
                <span>Vercel Deploy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
