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
    Eye
} from 'lucide-react';

const DashboardHome = () => {
    const recentApplications = [
        { id: 'APP-2023-001', company: 'Tech Corp India', service: 'ISO Certification', status: 'Pending Review', date: '21 Oct 2023' },
        { id: 'APP-2023-002', company: 'Global Exports', service: 'Audit Services', status: 'Approved', date: '19 Oct 2023' },
        { id: 'APP-2023-003', company: 'Sunrise Manufacturing', service: 'HRAA', status: 'In Progress', date: '15 Oct 2023' },
        { id: 'APP-2023-004', company: 'Apex IT Solutions', service: 'ISO Certification', status: 'Rejected', date: '12 Oct 2023' },
        { id: 'APP-2023-005', company: 'Dynamic Logistics', service: 'Inspection', status: 'Pending Review', date: '10 Oct 2023' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending Review': return <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> {status}</span>;
            case 'Approved': return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> {status}</span>;
            case 'In Progress': return <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> {status}</span>;
            case 'Rejected': return <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> {status}</span>;
            default: return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">{status}</span>;
        }
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
                        <h3 className="text-2xl font-bold text-slate-800">1,248</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">Pending</p>
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-xl"><Clock className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">45</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">Approved</p>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">892</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">Rejected</p>
                        <div className="p-2 bg-red-50 text-red-600 rounded-xl"><XCircle className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">12</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">In Progress</p>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Activity className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">299</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-semibold text-slate-500 whitespace-nowrap">Revenue</p>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><IndianRupee className="w-4 h-4" /></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">₹12.5M</h3>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                    <Filter className="w-4 h-4" /> FILTERS
                </div>
                <div className="flex flex-wrap gap-3">
                    <select className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
                        <option>All Services</option>
                        <option>ISO Certification</option>
                        <option>Audit / Inspection</option>
                        <option>HRAA</option>
                    </select>
                    <select className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
                        <option>All Status</option>
                        <option>Pending Review</option>
                        <option>In Progress</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium shadow-sm cursor-pointer hover:bg-slate-50">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>Date Range</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-slate-800 text-lg">Recent Applications</h3>
                    <button className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors">View All</button>
                </div>
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
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{app.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{app.company}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{app.service}</td>
                                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{app.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
