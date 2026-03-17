import { useState, useEffect } from 'react';
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Activity,
    IndianRupee,
    Filter,
    Calendar,
    ChevronDown,
    Eye,
    Loader2
} from 'lucide-react';
import { applicationApi, dashboardApi } from '../../../services';

const DashboardHome = ({ onViewApplication, onViewAll }) => {
    const [recentApplications, setRecentApplications] = useState([]);
    const [stats, setStats] = useState({ total: 0, submitted: 0, approved: 0, rejected: 0, inProgress: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ serviceType: '', status: '' });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Recent Applications for the table
                const params = { page: 1, limit: 5 };
                if (filters.serviceType) params.serviceType = filters.serviceType;
                if (filters.status) params.status = filters.status;

                const appResponse = await applicationApi.getAll(params);
                if (appResponse.success) {
                    setRecentApplications(appResponse.data);
                }

                // Fetch real stats ONLY if no filters are applied
                // If filters are applied, the KPIs might not accurately reflect the filtered list
                // but keep the main KPIs as overall business stats
                if (!filters.serviceType && !filters.status) {
                    const statsResponse = await dashboardApi.getStats();
                    if (statsResponse.success) {
                        setStats(statsResponse.data.stats);
                        // Also update recent apps from stats if they are returned there
                        if (statsResponse.data.recentApplications) {
                            setRecentApplications(statsResponse.data.recentApplications);
                        }
                    }
                }
            } catch (err) {
                console.error('Dashboard load error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filters]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'submitted': return <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Submitted</span>;
            case 'under_review': return <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> Under Review</span>;
            case 'approved': return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Approved</span>;
            case 'audit_assigned': return <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> Audit Assigned</span>;
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

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">Total Apps</p>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><FileText className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.total}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">Pending</p>
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-xl"><Clock className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.submitted}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">Approved</p>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.approved}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">Rejected</p>
                        <div className="p-2 bg-red-50 text-red-600 rounded-xl"><XCircle className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.rejected}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">In Progress</p>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Activity className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.inProgress}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">Revenue</p>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><IndianRupee className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                            ₹{loading ? '...' : (stats.totalRevenue || 0).toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                    <Filter className="w-4 h-4" /> FILTERS
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filters.serviceType}
                        onChange={(e) => setFilters(prev => ({ ...prev, serviceType: e.target.value }))}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                    >
                        <option value="">All Services</option>
                        <option value="iso">ISO Certification</option>
                        <option value="audit">Audit / Inspection</option>
                        <option value="hraa">HRAA</option>
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
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

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-slate-800 text-lg">Recent Applications</h3>
                    <button
                        onClick={onViewAll}
                        className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                    >
                        View All
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="ml-3 text-slate-500 font-medium">Loading...</span>
                    </div>
                ) : recentApplications.length === 0 ? (
                    <div className="text-center p-12 text-slate-400 font-medium">No applications yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 font-semibold">
                                    <th className="px-6 py-4">Application ID</th>
                                    <th className="px-6 py-4">Company Name</th>
                                    <th className="px-6 py-4">Service Type</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Submitted Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentApplications.map((app) => (
                                    <tr key={app.applicationId} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">{app.applicationId}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{app.companyName}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{app.serviceType}</td>
                                        <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{formatDate(app.createdAt)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => onViewApplication(app.applicationId)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;
