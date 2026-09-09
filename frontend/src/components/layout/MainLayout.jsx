import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import ReportLookupModal from '../common/ReportLookupModal';

const MainLayout = () => {
  const [reportModalOpen, setReportModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Header onOpenReportModal={() => setReportModalOpen(true)} />
      <main className="flex-1 w-full pt-[120px]">
        <Outlet context={{ openReportModal: () => setReportModalOpen(true) }} />
      </main>
      <Footer />
      <ReportLookupModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />
    </div>
  );
};

export default MainLayout;
