import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { formatDate } from '../../utils/formatters';

const ReportLookupModal = ({ isOpen, onClose }) => {
  const [identifier, setIdentifier] = useState('MC-2024-88412');
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFetch = async (e) => {
    e?.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await reportService.lookupReports(identifier.trim());
      if (res.success && res.data) {
        setReports(res.data);
        if (res.data.length === 0) {
          setError('No verified reports found for the provided UHID / Mobile number.');
        }
      } else {
        setError(res.message || 'Failed to fetch reports');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to diagnostic database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-2xl border border-surface-container overflow-hidden">
        {/* Modal Header */}
        <div className="bg-surface-container p-space-md sm:p-space-lg flex items-center justify-between border-b border-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <div className="w-11 h-11 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">science</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Online Lab &amp; Diagnostic Reports
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Enter your Hospital UHID or Registered Mobile to retrieve NABL verified pathology results.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-low transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-space-md sm:p-space-lg bg-surface-container-low border-b border-surface-container">
          <form onSubmit={handleFetch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-3 text-secondary text-[20px]">
                badge
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Hospital UHID (e.g. MC-2024-88412) or Mobile"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-colors shrink-0 shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Fetching...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Fetch Reports</span>
                </>
              )}
            </button>
          </form>
          <p className="font-label-sm text-[11px] text-on-surface-variant mt-2">
            💡 Sample Demo UHID: <code className="bg-surface-container px-1 py-0.5 rounded font-mono font-bold text-primary">MC-2024-88412</code>
          </p>
        </div>

        {/* Results Body */}
        <div className="p-space-md sm:p-space-lg max-h-[400px] overflow-y-auto space-y-3">
          {error && (
            <div className="p-4 rounded-xl bg-error-container text-on-error-container font-body-sm text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {reports && reports.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pb-1">
                <span>Showing {reports.length} diagnostic records</span>
                <span className="text-secondary font-bold">NABL Accredited</span>
              </div>
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-surface-container-low p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-surface-container hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]">bloodtype</span>
                    </div>
                    <div>
                      <h4 className="font-title-md text-title-md text-primary font-bold">{report.testName}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Done {formatDate(report.testDate)} • Ref: {report.referringDoctorName || 'Dr. Arvind Mehra'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-label-sm text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
                          {report.statusBadge || 'NORMAL VALUES'}
                        </span>
                        {report.metricHighlight && (
                          <span className="font-body-sm text-xs text-on-surface-variant font-medium">
                            {report.metricHighlight}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <a
                    href={report.fileUrl || '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading official PDF for: ${report.testName} (${report.reportNumber})`);
                    }}
                    className="self-end sm:self-center flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container text-primary px-3.5 py-2 rounded-lg font-label-md text-xs font-semibold shadow-sm transition-colors border border-surface-container"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">picture_as_pdf</span>
                    <span>Download PDF</span>
                  </a>
                </div>
              ))}
            </div>
          )}

          {!reports && !error && (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-outline-variant">description</span>
              <p className="font-body-md mt-2">Enter your identifier above to search and download verified pathology reports.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportLookupModal;
