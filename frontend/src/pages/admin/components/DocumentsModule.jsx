import { Search, Filter, FileText, Download, FileBadge, Image as ImageIcon } from 'lucide-react';

const DocumentsModule = () => {
    // Mock documents
    const documents = [
        { id: 'DOC-001', appId: 'APP-2023-001', type: 'Registration', name: 'Company Registration Certificate.pdf', icon: FileText },
        { id: 'DOC-002', appId: 'APP-2023-001', type: 'Tax Document', name: 'GST Certificate.pdf', icon: FileBadge },
        { id: 'DOC-003', appId: 'APP-2023-002', type: 'Certificate', name: 'Previous ISO Certificate 9001.pdf', icon: FileText },
        { id: 'DOC-004', appId: 'APP-2023-003', type: 'Report', name: 'Internal Audit Report Q3.pdf', icon: FileText },
        { id: 'DOC-005', appId: 'APP-2023-003', type: 'Policy', name: 'HR Policy Manual.pdf', icon: FileText },
        { id: 'DOC-006', appId: 'APP-2023-005', type: 'Identity', name: 'Director PAN Card.jpg', icon: ImageIcon },
    ];

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by App ID or Document Name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mr-2 hidden sm:flex">
                        <Filter className="w-4 h-4" /> FILTERS
                    </div>
                    <select className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none">
                        <option>All Types</option>
                        <option>Registration</option>
                        <option>Certificate</option>
                        <option>Report</option>
                    </select>
                </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
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
                            {documents.map((doc) => {
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
                                            <button className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 transition-colors shadow-sm">
                                                <Download className="w-4 h-4 mr-1.5" /> Download
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DocumentsModule;
