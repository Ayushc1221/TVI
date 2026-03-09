import { Search, Eye, Filter, User } from 'lucide-react';

const UsersModule = () => {
    // Mock clients
    const clients = [
        { id: 'CLI-001', name: 'Rajesh Kumar', company: 'Tech Corp India Pvt. Ltd.', email: 'rajesh.k@techcorp.example.com', mobile: '+91 9876543210', totalApps: 3 },
        { id: 'CLI-002', name: 'Amit Singh', company: 'Global Exports', email: 'amit.singh@globalexports.in', mobile: '+91 8765432109', totalApps: 1 },
        { id: 'CLI-003', name: 'Priya Sharma', company: 'Sunrise Manufacturing', email: 'psharma@sunrisemfg.co.in', mobile: '+91 7654321098', totalApps: 2 },
        { id: 'CLI-004', name: 'Vikram Mehta', company: 'Apex IT Solutions', email: 'v.mehta@apexit.com', mobile: '+91 9988776655', totalApps: 1 },
        { id: 'CLI-005', name: 'Neha Gupta', company: 'Dynamic Logistics', email: 'neha.g@dynamiclogistics.in', mobile: '+91 9898989898', totalApps: 4 },
    ];

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Client Name or Email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mr-2 hidden sm:flex">
                        <Filter className="w-4 h-4" /> FILTERS
                    </div>
                    <select className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none">
                        <option>All Clients</option>
                        <option>Active (1+ Apps)</option>
                        <option>Inactive (0 Apps)</option>
                    </select>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 font-semibold">
                                <th className="px-6 py-4 whitespace-nowrap">Client Name</th>
                                <th className="px-6 py-4 whitespace-nowrap">Email</th>
                                <th className="px-6 py-4 whitespace-nowrap">Mobile</th>
                                <th className="px-6 py-4 whitespace-nowrap text-center">Total Applications</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{client.name}</p>
                                                <p className="text-xs font-medium text-slate-500">{client.company}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap">{client.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{client.mobile}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-700 font-bold rounded-full text-xs">
                                            {client.totalApps}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <button className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm">
                                            <Eye className="w-4 h-4 mr-1.5" /> View Client
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

export default UsersModule;
