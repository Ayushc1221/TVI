import { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle,
    Activity,
    XCircle,
    Search,
    Filter,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { applicationApi } from '../../../services';

// eslint-disable-next-line react/prop-types
const ApplicationsList = ({ onViewDetails }) => {
    const [appList, setAppList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ serviceType: '', status: '' });

    const fetchApplications = async () => {
        setLoading(true);
        setError('');
        try {
            const params = { page, limit: 20 };
            if (filters.serviceType) params.serviceType = filters.serviceType;
            if (filters.status) params.status = filters.status;
            if (searchTerm) params.search = searchTerm;

            const response = await applicationApi.getAll(params);
            if (response.success) {
                setAppList(response.data);
                setTotalPages(response.pages || 1);
                setTotal(response.total || 0);
            }
        } catch (err) {
            setError('Failed to load applications');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchApplications();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, filters, searchTerm]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'submitted': return <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Submitted</span>;
            case 'under_review': return <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> Under Review</span>;
            case 'invoice_sent': return <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-100 text-cyan-700 rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> Invoice Sent</span>;
            case 'quotation_sent': return <span className="px-2.5 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> MOU Sent</span>;
            case 'mou_accepted': return <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Agreement Accepted</span>;
            case 'approved': return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Approved</span>;
            case 'audit_assigned': return <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> Audit Assigned</span>;
            case 'audit_report_submitted': return <span className="px-2.5 py-1 text-xs font-semibold bg-violet-100 text-violet-700 rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> Report Submitted</span>;
            case 'review_approved': return <span className="px-2.5 py-1 text-xs font-semibold bg-teal-100 text-teal-700 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Review Approved</span>;
            case 'certificate_generated': return <span className="px-2.5 py-1 text-xs font-semibold bg-teal-100 text-teal-700 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Cert Generated</span>;
            case 'completed': return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Completed</span>;
            case 'rejected': return <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> Rejected</span>;
            default: return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">{status}</span>;
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const overdueAudits = appList.filter(app => {
        if (app.status === 'audit_assigned' && app.auditAssignedDate) {
            const daysElapsed = (new Date() - new Date(app.auditAssignedDate)) / (1000 * 60 * 60 * 24);
            return daysElapsed > 5;
        }
        return false;
    });

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Company or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mr-2 hidden sm:flex">
                        <Filter className="w-4 h-4" /> FILTERS
                    </div>
                    <select
                        value={filters.serviceType}
                        onChange={(e) => { setFilters(f => ({ ...f, serviceType: e.target.value })); setPage(1); }}
                        className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none"
                    >
                        <option value="">All Services</option>
                        <option value="iso">ISO Certification</option>
                        <option value="audit">Audit / Inspection</option>
                        <option value="hraa">HRAA</option>
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
                        className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none"
                    >
                        <option value="">All Status</option>
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="quotation_sent">Invoice Sent</option>
                        <option value="mou_accepted">Agreement Accepted</option>
                        <option value="audit_assigned">Audit Assigned</option>
                        <option value="audit_report_submitted">Audit Report Submitted</option>
                        <option value="review_approved">Review Approved</option>
                        <option value="certificate_generated">Cert Generated</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* 5-Day SLA Warnings Banner */}
            {overdueAudits.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h3 className="font-bold text-red-800">Critical SLA Warnings - Auditor Reports Overdue</h3>
                    </div>
                    <ul className="space-y-1 pl-7 list-disc">
                        {overdueAudits.map(app => (
                            <li key={app.applicationId} className="text-sm text-red-700 font-medium">
                                Auditor <b>{app.assignedAuditor}</b> has missed the 5-day report submission deadline for <b>{app.applicationId}</b> ({app.companyName}).
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Applications Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="ml-3 text-slate-500 font-medium">Loading applications...</span>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 text-red-500 font-medium">{error}</div>
                ) : appList.length === 0 ? (
                    <div className="text-center p-12 text-slate-400 font-medium">No applications found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 font-semibold">
                                    <th className="px-6 py-4 whitespace-nowrap">Application ID</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Company Name</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Service Type</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Certification Type</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Auditor</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Submitted Date</th>
                                    <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {appList.map((app) => (
                                    <tr key={app.applicationId} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{app.applicationId}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                                            {app.companyName}
                                            {(() => {
                                                if (['completed', 'rejected', 'certificate_generated'].includes(app.status)) return null;
                                                const daysRunning = Math.floor((new Date() - new Date(app.createdAt)) / (1000 * 60 * 60 * 24));
                                                if (daysRunning >= 35 && daysRunning <= 42) {
                                                    return <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-md">Warning: {daysRunning}/42 Days</span>;
                                                } else if (daysRunning > 42) {
                                                    return <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-md">Breach: {daysRunning}/42 Days</span>;
                                                }
                                                return <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-md">{daysRunning}/42 Days</span>;
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{app.serviceType}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{app.certificationType}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{app.assignedAuditor || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{formatDate(app.createdAt)}</td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => onViewDetails(app.applicationId)}
                                                className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                                            >
                                                <Eye className="w-4 h-4 mr-1.5" /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Box */}
                {!loading && appList.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-sm text-slate-500 font-medium">
                            Page {page} of {totalPages} ({total} total)
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-medium flex items-center justify-center">{page}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationsList;
