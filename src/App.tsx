import React, { useState, useMemo } from 'react';
import { useLeads } from './hooks/useLeads';
import { Header } from './components/Header';
import type { ViewMode } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { TableView } from './components/TableView';
import { KanbanView } from './components/KanbanView';
import { TimelineView } from './components/TimelineView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { LeadModal } from './components/LeadModal';
import { DeployModal } from './components/DeployModal';
import { WhatsAppAiModal } from './components/WhatsAppAiModal';
import { GoogleCalendarModal } from './components/GoogleCalendarModal';
import { ImportModal } from './components/ImportModal';
import { ProposalModal } from './components/ProposalModal';
import { DialerModal } from './components/DialerModal';
import type { Lead } from './types/lead';

export function App() {
  const {
    leads,
    updateLeadStatus,
    updateLeadNotes,
    updateLeadFollowUpDate,
    updateLeadDealValue,
    updateLead,
    addLead,
    deleteLead,
    resetToInitial,
    exportToCSV,
    importLeads
  } = useLeads();

  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // WhatsApp AI Modal State
  const [isWhatsAppAiModalOpen, setIsWhatsAppAiModalOpen] = useState(false);
  const [activeWhatsAppLead, setActiveWhatsAppLead] = useState<Lead | null>(null);

  // Google Calendar Modal State
  const [isGoogleCalendarModalOpen, setIsGoogleCalendarModalOpen] = useState(false);
  const [activeCalendarLead, setActiveCalendarLead] = useState<Lead | null>(null);

  // Proposal Modal State
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [activeProposalLead, setActiveProposalLead] = useState<Lead | null>(null);

  // Quick Dialer Modal State
  const [isDialerModalOpen, setIsDialerModalOpen] = useState(false);

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    leads.forEach(l => {
      if (l.category) set.add(l.category);
    });
    return Array.from(set).sort();
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Category filter
      if (selectedCategory !== 'all' && lead.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && lead.status !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = lead.name.toLowerCase().includes(q);
        const matchPhone = lead.phone.toLowerCase().includes(q);
        const matchNotes = (lead.notes || '').toLowerCase().includes(q);
        const matchCategory = lead.category.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchNotes && !matchCategory) {
          return false;
        }
      }

      return true;
    });
  }, [leads, selectedCategory, selectedStatus, searchQuery]);

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleAddNewLead = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (leadData: any) => {
    if (editingLead) {
      updateLead(leadData);
    } else {
      addLead(leadData);
    }
  };

  const handleOpenWhatsAppAi = (lead?: Lead) => {
    setActiveWhatsAppLead(lead || filteredLeads[0] || leads[0]);
    setIsWhatsAppAiModalOpen(true);
  };

  const handleOpenGoogleCalendar = (lead?: Lead) => {
    setActiveCalendarLead(lead || filteredLeads[0] || leads[0]);
    setIsGoogleCalendarModalOpen(true);
  };

  const handleOpenProposal = (lead?: Lead) => {
    setActiveProposalLead(lead || filteredLeads[0] || leads[0]);
    setIsProposalModalOpen(true);
  };

  const handleAppendNotes = (id: string, newNote: string) => {
    const target = leads.find(l => l.id === id);
    if (!target) return;
    const combined = target.notes ? `${target.notes}\n${newNote}` : newNote;
    updateLeadNotes(id, combined);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        categories={categories}
        totalLeads={leads.length}
        filteredCount={filteredLeads.length}
        onAddLead={handleAddNewLead}
        onExport={exportToCSV}
        onReset={resetToInitial}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenGoogleCalendarModal={() => handleOpenGoogleCalendar()}
        onOpenWhatsAppAiModal={() => handleOpenWhatsAppAi()}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenDialerModal={() => setIsDialerModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI / Stats Overview */}
        <StatsCards
          leads={leads}
          onFilterByStatus={(st) => setSelectedStatus(st)}
          activeStatus={selectedStatus}
        />

        {/* View switching */}
        {currentView === 'table' && (
          <TableView
            leads={filteredLeads}
            onUpdateStatus={updateLeadStatus}
            onUpdateNotes={updateLeadNotes}
            onUpdateFollowUpDate={updateLeadFollowUpDate}
            onEditLead={handleEditLead}
            onDeleteLead={deleteLead}
            onOpenWhatsAppAi={handleOpenWhatsAppAi}
            onOpenGoogleCalendar={handleOpenGoogleCalendar}
            onOpenProposal={handleOpenProposal}
          />
        )}

        {currentView === 'kanban' && (
          <KanbanView
            leads={filteredLeads}
            onUpdateStatus={updateLeadStatus}
            onOpenWhatsAppAi={handleOpenWhatsAppAi}
            onOpenProposal={handleOpenProposal}
            onOpenGoogleCalendar={handleOpenGoogleCalendar}
            onEditLead={handleEditLead}
          />
        )}

        {currentView === 'timeline' && (
          <TimelineView
            leads={filteredLeads}
            onUpdateStatus={updateLeadStatus}
            onOpenWhatsAppAi={handleOpenWhatsAppAi}
            onOpenGoogleCalendar={handleOpenGoogleCalendar}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            leads={filteredLeads}
            onUpdateStatus={updateLeadStatus}
            onOpenWhatsAppAi={handleOpenWhatsAppAi}
            onOpenGoogleCalendar={handleOpenGoogleCalendar}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView leads={leads} />
        )}
      </main>

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSave={handleSaveLead}
        initialLead={editingLead}
      />

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      <WhatsAppAiModal
        isOpen={isWhatsAppAiModalOpen}
        onClose={() => setIsWhatsAppAiModalOpen(false)}
        lead={activeWhatsAppLead}
        onAppendNotes={handleAppendNotes}
      />

      <GoogleCalendarModal
        isOpen={isGoogleCalendarModalOpen}
        onClose={() => setIsGoogleCalendarModalOpen(false)}
        leads={leads}
        selectedLead={activeCalendarLead}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={importLeads}
        currentCount={leads.length}
      />

      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        lead={activeProposalLead}
        onSaveDealValue={(id, val) => updateLeadDealValue(id, val)}
        onAppendNotes={handleAppendNotes}
      />

      <DialerModal
        isOpen={isDialerModalOpen}
        onClose={() => setIsDialerModalOpen(false)}
        leads={filteredLeads}
        onUpdateStatus={updateLeadStatus}
        onUpdateNotes={updateLeadNotes}
        onOpenWhatsAppAi={handleOpenWhatsAppAi}
        onOpenProposal={handleOpenProposal}
        onOpenGoogleCalendar={handleOpenGoogleCalendar}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Malatya İşletme CRM & Web Sitesi Satış Takip Sistemi • 64 İşletme Kayıtlı</span>
          <span className="text-[11px] text-slate-600">
            Groq AI Destekli WhatsApp Mesaj Oluşturucu & Google Calendar Entegrasyonu
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
