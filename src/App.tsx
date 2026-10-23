import React, { useState, useMemo } from 'react';
import { useLeads } from './hooks/useLeads';
import { Header, ViewMode } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { TableView } from './components/TableView';
import { TimelineView } from './components/TimelineView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { LeadModal } from './components/LeadModal';
import { DeployModal } from './components/DeployModal';
import { Lead } from './types/lead';

export function App() {
  const {
    leads,
    updateLeadStatus,
    updateLeadNotes,
    updateLeadFollowUpDate,
    updateLead,
    addLead,
    deleteLead,
    resetToInitial,
    exportToCSV
  } = useLeads();

  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

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
          />
        )}

        {currentView === 'timeline' && (
          <TimelineView
            leads={filteredLeads}
            onUpdateStatus={updateLeadStatus}
            onUpdateNotes={updateLeadNotes}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            leads={filteredLeads}
            onUpdateStatus={updateLeadStatus}
            onUpdateNotes={updateLeadNotes}
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Malatya İşletme CRM & Web Sitesi Satış Takip Sistemi • 64 İşletme Kayıtlı</span>
          <span className="text-[11px] text-slate-600">
            Ekstra Sütunlar: İletişim Durumu (Dropdown) + Görüşme Notları + Randevu Takvimi
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
