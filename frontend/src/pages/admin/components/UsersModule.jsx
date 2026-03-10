import { useState, useEffect } from 'react';
import { Search, Eye, Filter, User, Loader2 } from 'lucide-react';
import { applicationApi } from '../../../services';

const UsersModule = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                // Fetch all applications to extract unique clients
                const response = await applicationApi.getAll({ limit: 1000 });
                if (response.success && response.data) {
                    const clientMap = new Map();

                    response.data.forEach(app => {
                        // Use email or company name as unique identifier
                        const key = app.email || app.companyName;
                        if (!key) return;

                        if (clientMap.has(key)) {
                            const existing = clientMap.get(key);
                            existing.totalApps += 1;
                            clientMap.set(key, existing);
                        } else {
                            clientMap.set(key, {
                                id: `CLI-${app.applicationId}`,
                                name: app.contactPerson || 'N/A',
                                company: app.companyName,
                                email: app.email,
                                mobile: app.phone || 'N/A',
                                totalApps: 1,
                                appId: app.applicationId
                            });
                        }
                    });

                    setClients(Array.from(clientMap.values()));
                }
            } catch (err) {
                console.error("Failed to load clients", err);
                setError('Failed to load clients');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Client Name or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                    </select>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="ml-3 text-slate-500 font-medium">Loading clients...</span>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 text-red-500 font-medium">{error}</div>
                ) : filteredClients.length === 0 ? (
                    <div className="text-center p-12 text-slate-400 font-medium">No clients found.</div>
                ) : (
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
                                {filteredClients.map((client) => (
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
                                            <button
                                                className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                                                onClick={() => alert(`View details for client: ${client.name}`)}
                                            >
                                                <Eye className="w-4 h-4 mr-1.5" /> View Client
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

export default UsersModule;
