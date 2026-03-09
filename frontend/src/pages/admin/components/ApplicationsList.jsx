import {
    Clock,
    CheckCircle,
    Activity,
    XCircle,
    Search,
    Filter,
    Eye,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// eslint-disable-next-line react/prop-types
const ApplicationsList = ({ onViewDetails }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending Review': return <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> {status}</span>;
            case 'Approved': return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> {status}</span>;
            case 'In Progress': return <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> {status}</span>;
            case 'Rejected': return <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> {status}</span>;
            default: return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">{status}</span>;
        }
    };

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">Paid</span>;
            case 'Pending': return <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Pending</span>;
            case 'Failed': return <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Failed</span>;
            default: return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">{status}</span>;
        }
    };

    const appList = [
        { id: 'APP-2023-001', company: 'Tech Corp India', service: 'ISO Certification', subType: 'ISO 9001', payStatus: 'Paid', appStatus: 'Pending Review', date: '21 Oct 2023' },
        { id: 'APP-2023-002', company: 'Global Exports', service: 'Audit', subType: 'Safety Audit', payStatus: 'Paid', appStatus: 'Approved', date: '19 Oct 2023' },
        { id: 'APP-2023-003', company: 'Sunrise Manufacturing', service: 'HRAA', subType: 'HR Policy Audit', payStatus: 'Paid', appStatus: 'In Progress', date: '15 Oct 2023' },
        { id: 'APP-2023-004', company: 'Apex IT Solutions', service: 'ISO Certification', subType: 'ISO 27001', payStatus: 'Failed', appStatus: 'Rejected', date: '12 Oct 2023' },
        { id: 'APP-2023-005', company: 'Dynamic Logistics', service: 'Audit', subType: 'Compliance Audit', payStatus: 'Pending', appStatus: 'Pending Review', date: '10 Oct 2023' },
        { id: 'APP-2023-006', company: 'Vertex Solutions', service: 'ISO Certification', subType: 'ISO 14001', payStatus: 'Paid', appStatus: 'Approved', date: '08 Oct 2023' },
    ];

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Company or ID..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mr-2 hidden sm:flex">
                        <Filter className="w-4 h-4" /> FILTERS
                    </div>
                    <select className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none">
                        <option>All Services</option>
                        <option>ISO Certification</option>
                        <option>Audit / Inspection</option>
                        <option>HRAA</option>
                    </select>
                    <select className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none">
                        <option>All Status</option>
                        <option>Pending Review</option>
                        <option>In Progress</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 font-semibold">
                                <th className="px-6 py-4 whitespace-nowrap">Application ID</th>
                                <th className="px-6 py-4 whitespace-nowrap">Company Name</th>
                                <th className="px-6 py-4 whitespace-nowrap">Service Type</th>
                                <th className="px-6 py-4 whitespace-nowrap">Sub Type</th>
                                <th className="px-6 py-4 whitespace-nowrap">Payment</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 whitespace-nowrap">Submitted Date</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {appList.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{app.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">{app.company}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{app.service}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{app.subType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getPaymentBadge(app.payStatus)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.appStatus)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{app.date}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <button
                                            onClick={() => onViewDetails(app.id)}
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

                {/* Pagination Box */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">Showing 1 to 6 of 1,248 entries</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm transition-colors">1</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors">2</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors">3</button>
                        <span className="text-slate-400">...</span>
                        <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsList;
