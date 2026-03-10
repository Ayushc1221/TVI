import { useState, useEffect } from 'react';
import { Search, Filter, FileText, Download, FileBadge, Image as ImageIcon, Loader2 } from 'lucide-react';
import { applicationApi } from '../../../services';

const DocumentsModule = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                // Fetch all applications
                const response = await applicationApi.getAll({ limit: 1000 }); // Get max possible for now to build docs list
                if (response.success && response.data) {
                    const allDocs = [];
                    response.data.forEach(app => {
                        // Assuming app.documents is an array of strings or objects. Needs fallback if empty.
                        if (app.documents && app.documents.length > 0) {
                            app.documents.forEach((doc, index) => {
                                allDocs.push({
                                    id: `DOC-${app.applicationId}-${index}`,
                                    appId: app.applicationId,
                                    type: typeof doc === 'string' ? 'Upload' : (doc.type || 'Upload'),
                                    name: typeof doc === 'string' ? doc : (doc.name || `Document ${index + 1}`),
                                    url: typeof doc === 'string' ? doc : doc.url,
                                    icon: FileText
                                });
                            });
                        }
                    });
                    setDocuments(allDocs);
                }
            } catch (err) {
                console.error("Failed to load documents", err);
                setError('Failed to load documents');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.appId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType ? doc.type === filterType : true;
        return matchesSearch && matchesType;
    });

    // Unique types for filter
    const uniqueTypes = [...new Set(documents.map(d => d.type))];

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by App ID or Document Name..."
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
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none"
                    >
                        <option value="">All Types</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="ml-3 text-slate-500 font-medium">Loading documents...</span>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 text-red-500 font-medium">{error}</div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="text-center p-12 text-slate-400 font-medium">No documents found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 font-semibold">
                                    <th className="px-6 py-4 whitespace-nowrap">Application ID</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Document Type</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Document Name</th>
                                    <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredDocuments.map((doc) => {
                                    const Icon = doc.icon;
                                    return (
                                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 text-sm font-semibold text-blue-600 whitespace-nowrap">{doc.appId}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                                <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg">{doc.type}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    {doc.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {doc.url ? (
                                                    <a
                                                        href={doc.url.startsWith('http') ? doc.url : `http://localhost:5000${doc.url}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 transition-colors shadow-sm"
                                                    >
                                                        <Download className="w-4 h-4 mr-1.5" /> Download
                                                    </a>
                                                ) : (
                                                    <button disabled className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-slate-400 bg-slate-50 transition-colors shadow-sm cursor-not-allowed">
                                                        <Download className="w-4 h-4 mr-1.5" /> N/A
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentsModule;
