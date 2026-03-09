import { useState } from 'react';
import {
    Search, Filter, Calendar, FileText, CheckCircle,
    UserPlus, ChevronDown, ChevronUp, FileBadge, Save, FileSignature, X
} from 'lucide-react';

const CertificationAuditManagement = () => {
    const [applications] = useState([
        {
            id: 'APP-2023-002',
            company: 'Global Exports',
            service: 'Audit Services (Safety Audit)',
            serviceCategory: 'audit',
            progress: 25,
            auditor: '',
            notes: '',
            issueDate: '',
            expiryDate: '',
            documentUploaded: false
        },
        {
            id: 'APP-2023-006',
            company: 'Vertex Solutions',
            service: 'ISO Certification (ISO 14001)',
            serviceCategory: 'iso',
            progress: 80,
            auditor: 'Vivek Sharma',
            notes: 'Document review completed. Pending final stage 2 clearance.',
            issueDate: '2023-10-15',
            expiryDate: '2026-10-14',
            documentUploaded: true
        }
    ]);

    const [expandedId, setExpandedId] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleAssignComplete = (id) => {
        alert(`Application ${id} marked as Completed!`);
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Approved Apps..."
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
                </div>
            </div>

            {/* Workflow List */}
            <div className="space-y-4">
                {applications.map((app) => (
                    <div key={app.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
                        {/* Summary Bar (Clickable) */}
                        <div
                            className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => toggleExpand(app.id)}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl hidden sm:block">
                                    <FileBadge className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800 text-lg">{app.id}</h3>
                                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-lg">Approved</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-600">{app.company}</p>
                                    <p className="text-sm text-slate-500">{app.service}</p>
                                </div>
                            </div>

                            <div className="flex-1 w-full max-w-sm hidden lg:block">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">Current Progress</span>
                                    <span className="text-xs font-bold text-blue-600">{app.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${app.progress}%` }}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                                    Manage Workflow
                                    {expandedId === app.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Expanded Actions Panel */}
                        {expandedId === app.id && (
                            <div className="border-t border-slate-100 bg-slate-50/50 p-6 animate-in slide-in-from-top-2 fade-in duration-200">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                    {/* Action Column 1: Team & Notes */}
                                    <div className="space-y-5">
                                        {/* Assign Auditor */}
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <UserPlus className="w-4 h-4 text-blue-600" />
                                                <h4 className="font-semibold text-slate-800 text-sm">Assign Auditor / Consultant</h4>
                                            </div>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Enter name or email..."
                                                    defaultValue={app.auditor}
                                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm hover:bg-slate-200 transition-colors">Assign</button>
                                            </div>
                                        </div>

                                        {/* Internal Notes */}
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                <h4 className="font-semibold text-slate-800 text-sm">Internal Notes</h4>
                                            </div>
                                            <textarea
                                                rows="3"
                                                placeholder="Add workflow remarks..."
                                                defaultValue={app.notes}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                            ></textarea>
                                            <div className="flex justify-end mt-2">
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 font-medium rounded-lg text-xs hover:bg-blue-100 transition-colors">
                                                    <Save className="w-3.5 h-3.5" /> Save Note
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Column 2: Dates, Doc & Completion */}
                                    <div className="space-y-5">

                                        {/* Dates (Visible mostly for ISO) */}
                                        {app.serviceCategory === 'iso' && (
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase mb-2">
                                                        <Calendar className="w-3.5 h-3.5" /> Issue Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        defaultValue={app.issueDate}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase mb-2">
                                                        <Calendar className="w-3.5 h-3.5" /> Expiry Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        defaultValue={app.expiryDate}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Generate Certificate */}
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <FileSignature className="w-4 h-4 text-blue-600" />
                                                    <h4 className="font-semibold text-slate-800 text-sm">Generate Certificate / Report</h4>
                                                </div>
                                                {app.documentUploaded && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Generated</span>}
                                            </div>
                                            <div className="pt-2">
                                                <button
                                                    onClick={() => setShowGenerateModal(app.id)}
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl font-bold text-sm shadow-sm transition-colors"
                                                >
                                                    <FileBadge className="w-4 h-4" />
                                                    Generate Certificate
                                                </button>
                                            </div>
                                        </div>

                                        {/* Complete Action */}
                                        <div className="pt-2">
                                            <button
                                                onClick={() => handleAssignComplete(app.id)}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Mark Application as Completed
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500 font-medium px-2 pt-2">
                Showing {applications.length} approved applications awaiting workflow
            </div>

            {/* Generate Certificate Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 delay-150">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <FileSignature className="w-5 h-5 text-blue-600" />
                                    Generate Certificate
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Application ID: {showGenerateModal}</p>
                            </div>
                            <button
                                onClick={() => setShowGenerateModal(null)}
                                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Certificate Type</label>
                                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>ISO 9001:2015</option>
                                    <option>ISO 14001:2015</option>
                                    <option>Safety Audit Report</option>
                                    <option>HR Audit Certificate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Issue Date</label>
                                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Valid Until</label>
                                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Authorized Signatory</label>
                                <input type="text" placeholder="e.g. Director Name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowGenerateModal(null)}
                                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert(`Certificate Generated for ${showGenerateModal}`);
                                    setShowGenerateModal(null);
                                }}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm flex items-center gap-2"
                            >
                                <FileBadge className="w-4 h-4" />
                                Generate & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificationAuditManagement;
