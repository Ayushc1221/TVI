import { useState } from 'react';
import {
    Search, Filter, Calendar, FileText, CheckCircle,
    UserPlus, ChevronDown, ChevronUp, FileBadge, Save, FileSignature, X, Eye, Award, Download
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import QRCode from 'react-qr-code';

const CertificationAuditManagement = () => {
    const [applications, setApplications] = useState([
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
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [certFormData, setCertFormData] = useState({
        certificateNumber: '',
        companyName: '',
        certificationType: 'ISO 9001',
        scope: '',
        issueDate: '',
        expiryDate: '',
        authorizedSignatory: '',
        notes: ''
    });

    const [sequenceCounters, setSequenceCounters] = useState({ iso: 1, audit: 1, hraa: 1 });

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleAssignComplete = (id) => {
        setApplications(prev => prev.map(app => {
            if (app.id === id) {
                return { ...app, status: 'Completed' };
            }
            return app;
        }));
        alert(`Application ${id} marked as Completed!`);
    };

    const selectedAppForModal = applications.find(app => app.id === showGenerateModal);

    const handleGenerateCertificate = async () => {
        const element = document.getElementById('certificate-template');
        if (element) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                await fetch(`${apiUrl}/certificates`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        applicationId: selectedAppForModal.id,
                        certificateNumber: certFormData.certificateNumber,
                        companyName: certFormData.companyName,
                        certificationType: certFormData.certificationType,
                        scopeOfBusiness: certFormData.scope,
                        issueDate: certFormData.issueDate,
                        expiryDate: certFormData.expiryDate,
                        authorizedSignatory: certFormData.authorizedSignatory,
                        certificateFileUrl: `https://techvimalinternational.com/docs/${certFormData.certificateNumber}.pdf`, // Mock URL for now
                        qrCodeUrl: `https://techvimalinternational.com/verify?cert=${certFormData.certificateNumber}`
                    })
                });
            } catch (err) {
                console.error("Failed to save certificate to DB", err);
            }

            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `${certFormData.companyName.replace(/\s+/g, '_')}_Certificate.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
            };

            // Generate and Download PDF
            html2pdf().set(opt).from(element).save().then(() => {
                // Update applications state to show Issued Section
                setApplications(prev => prev.map(app => {
                    if (app.id === selectedAppForModal.id) {
                        return {
                            ...app,
                            progress: 100, // Optional: auto complete progress
                            generatedCertificate: {
                                number: certFormData.certificateNumber,
                                issueDate: certFormData.issueDate,
                                expiryDate: certFormData.expiryDate,
                            }
                        };
                    }
                    return app;
                }));

                setShowPreviewModal(false);
                setShowGenerateModal(null);
            });
        }
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
                                        {app.status === 'Completed' ? (
                                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 rounded-lg">Completed</span>
                                        ) : (
                                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-lg">Approved</span>
                                        )}
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

                                        {/* Certificate Block */}
                                        {app.generatedCertificate ? (
                                            <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                        <h4 className="font-bold text-slate-800 text-sm">Certificate Issued</h4>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 mb-4">
                                                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                                        <span className="text-slate-500 font-medium">Certificate No:</span>
                                                        <span className="text-slate-800 font-bold">{app.generatedCertificate.number}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                                        <span className="text-slate-500 font-medium">Issue Date:</span>
                                                        <span className="text-slate-800 font-semibold">{app.generatedCertificate.issueDate}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500 font-medium">Expiry Date:</span>
                                                        <span className="text-slate-800 font-semibold">{app.generatedCertificate.expiryDate}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => alert(`Downloading latest copy for ${app.id}...`)}
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-sm shadow-sm transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download Certificate
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileSignature className="w-4 h-4 text-blue-600" />
                                                        <h4 className="font-semibold text-slate-800 text-sm">Generate Certificate / Report</h4>
                                                    </div>
                                                </div>
                                                <div className="pt-2">
                                                    <button
                                                        onClick={() => {
                                                            const seqType = app.serviceCategory || 'iso';
                                                            const typeMap = { iso: 'ISO', audit: 'AUD', hraa: 'HRAA' };
                                                            const typeCode = typeMap[seqType] || 'ISO';
                                                            const year = new Date().getFullYear();
                                                            const seqStr = String(sequenceCounters[seqType] || 1).padStart(4, '0');
                                                            const generatedCertNumber = `TVI-${typeCode}-${year}-${seqStr}`;

                                                            setSequenceCounters(prev => ({
                                                                ...prev,
                                                                [seqType]: (prev[seqType] || 1) + 1
                                                            }));

                                                            setCertFormData({
                                                                certificateNumber: generatedCertNumber,
                                                                companyName: app.company,
                                                                certificationType: app.serviceCategory === 'audit' ? 'Audit Report' : app.serviceCategory === 'hraa' ? 'HRAA Report' : 'ISO 9001',
                                                                scope: '',
                                                                issueDate: '',
                                                                expiryDate: '',
                                                                authorizedSignatory: '',
                                                                notes: ''
                                                            });
                                                            setShowGenerateModal(app.id);
                                                        }}
                                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl font-bold text-sm shadow-sm transition-colors"
                                                    >
                                                        <FileBadge className="w-4 h-4" />
                                                        Generate Certificate
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Complete Action */}
                                        <div className="pt-2">
                                            <button
                                                onClick={() => handleAssignComplete(app.id)}
                                                disabled={!app.generatedCertificate || app.progress !== 100 || app.status === 'Completed'}
                                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors ${(!app.generatedCertificate || app.progress !== 100 || app.status === 'Completed') ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                {app.status === 'Completed' ? 'Application Completed' : 'Mark Application as Completed'}
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
            {showGenerateModal && selectedAppForModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 delay-150 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 shrink-0">
                            <div>
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                    <FileSignature className="w-5 h-5 text-blue-600" />
                                    Generate Certificate
                                </h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">Application ID: {selectedAppForModal.id}</p>
                            </div>
                            <button
                                onClick={() => setShowGenerateModal(null)}
                                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                        Certificate Number <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Auto-Generated</span>
                                    </label>
                                    <input type="text" value={certFormData.certificateNumber} onChange={e => setCertFormData({ ...certFormData, certificateNumber: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                        Company Name <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">From Application</span>
                                    </label>
                                    <input type="text" value={certFormData.companyName} readOnly className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none cursor-not-allowed" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Certification Type</label>
                                <select value={certFormData.certificationType} onChange={e => setCertFormData({ ...certFormData, certificationType: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>ISO 9001</option>
                                    <option>ISO 14001</option>
                                    <option>ISO 27001</option>
                                    <option>Audit Report</option>
                                    <option>HRAA Report</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Scope of Business</label>
                                <textarea rows="3" value={certFormData.scope} onChange={e => setCertFormData({ ...certFormData, scope: e.target.value })} placeholder="Enter scope of business..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Issue Date</label>
                                    <input type="date" value={certFormData.issueDate} onChange={e => setCertFormData({ ...certFormData, issueDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Expiry Date</label>
                                    <input type="date" value={certFormData.expiryDate} onChange={e => setCertFormData({ ...certFormData, expiryDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Authorized Signatory</label>
                                    <input type="text" value={certFormData.authorizedSignatory} onChange={e => setCertFormData({ ...certFormData, authorizedSignatory: e.target.value })} placeholder="e.g. Director Name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Certificate Notes <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <textarea rows="2" value={certFormData.notes} onChange={e => setCertFormData({ ...certFormData, notes: e.target.value })} placeholder="Any additional remarks to appear on certificate..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"></textarea>
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap justify-between gap-3 shrink-0">
                            <button
                                onClick={() => setShowGenerateModal(null)}
                                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors text-sm bg-white shadow-sm"
                            >
                                Cancel
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowPreviewModal(true);
                                    }}
                                    className="px-5 py-2.5 border border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-sm flex items-center gap-2 bg-white"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview Certificate
                                </button>
                                <button
                                    onClick={() => {
                                        alert(`Certificate Generated for ${certFormData.companyName}`);
                                        setShowGenerateModal(null);
                                    }}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm flex items-center gap-2"
                                >
                                    <FileBadge className="w-4 h-4" />
                                    Generate Certificate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Certificate Preview Modal */}
            {showPreviewModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 sticky top-0 z-10 shrink-0">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                <Eye className="w-5 h-5 text-blue-600" />
                                Certificate Preview
                            </h3>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Certificate Template Body */}
                        <div className="p-8 bg-slate-100 flex justify-center flex-1 overflow-y-auto">
                            {selectedAppForModal?.serviceCategory === 'audit' ? (
                                <div id="certificate-template" className="w-full max-w-[800px] min-h-[560px] p-10 border-[12px] border-slate-700 bg-white relative shadow-none">
                                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 border-b-4 border-slate-800 pb-2 mb-6 uppercase tracking-widest text-left">Official Audit Report</h1>

                                    <div className="flex justify-between items-start mb-8">
                                        <div className="grid grid-cols-2 gap-8 flex-1">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-500 uppercase">Report No:</p>
                                                <p className="text-lg font-bold text-slate-800">{certFormData.certificateNumber}</p>
                                            </div>
                                            <div className="text-right sm:text-left">
                                                <p className="text-sm font-semibold text-slate-500 uppercase">Type:</p>
                                                <p className="text-lg font-bold text-slate-800">{certFormData.certificationType}</p>
                                            </div>
                                        </div>
                                        <div className="ml-6 shrink-0 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                                            <QRCode value={`https://techvimalinternational.com/verify?cert=${certFormData.certificateNumber}`} size={64} level="M" />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 border border-slate-200 mb-8 rounded">
                                        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-1">Company Evaluated:</h2>
                                        <p className="text-2xl font-bold text-blue-900">{certFormData.companyName || '[Company Name]'}</p>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Scope of Audit:</h3>
                                        <p className="text-md text-slate-700 leading-relaxed">{certFormData.scope || '[Scope summary]'}</p>
                                    </div>

                                    <div className="flex justify-between items-end mt-16 pt-8 border-t border-slate-300">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Issue Date: <span className="font-normal">{certFormData.issueDate || 'DD/MM/YYYY'}</span></p>
                                            <p className="text-sm font-bold text-slate-800">Valid Until: <span className="font-normal">{certFormData.expiryDate || 'DD/MM/YYYY'}</span></p>
                                        </div>
                                        <div className="text-center w-48 border-t-2 border-slate-800 pt-2">
                                            <p className="font-serif italic text-xl text-slate-800 block mb-1">{certFormData.authorizedSignatory || 'Signatory'}</p>
                                            <p className="text-xs font-bold text-slate-600 uppercase">Lead Auditor</p>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedAppForModal?.serviceCategory === 'hraa' ? (
                                <div id="certificate-template" className="w-full max-w-[800px] min-h-[560px] p-10 border-8 border-orange-500 bg-orange-50 relative shadow-none text-center rounded-xl">
                                    <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-orange-900 mb-4 uppercase tracking-wider">HRAA Compliance Certificate</h1>
                                    <p className="text-sm font-semibold text-orange-600 tracking-widest uppercase mb-8">Registration No: {certFormData.certificateNumber}</p>

                                    <div className="absolute top-10 right-10 p-2 bg-white border border-orange-200 rounded-xl shadow-sm">
                                        <QRCode value={`https://techvimalinternational.com/verify?cert=${certFormData.certificateNumber}`} size={72} level="M" />
                                    </div>

                                    <p className="text-lg text-slate-700 italic mb-4">This certifies that</p>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-6">{certFormData.companyName || '[Company Name]'}</h2>

                                    <p className="text-lg text-slate-700 italic mb-4">has successfully met the requirements for</p>
                                    <h3 className="text-2xl font-bold text-orange-800 mb-8">{certFormData.certificationType}</h3>

                                    <p className="text-md text-slate-600 italic mb-2">Approved Scope:</p>
                                    <p className="text-lg font-medium text-slate-800 mb-12">{certFormData.scope || '[Scope of Business]'}</p>

                                    <div className="flex justify-between items-end mt-8 border-t border-orange-200 pt-6 text-left">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Issued On: <span className="font-normal text-slate-600">{certFormData.issueDate || 'DD/MM/YYYY'}</span></p>
                                            <p className="text-sm font-bold text-slate-800">Expiry Date: <span className="font-normal text-slate-600">{certFormData.expiryDate || 'DD/MM/YYYY'}</span></p>
                                        </div>
                                        <div className="text-center w-48">
                                            <p className="font-serif italic text-xl text-slate-800 block border-b border-slate-800 pb-1 mb-1">{certFormData.authorizedSignatory || 'Signatory'}</p>
                                            <p className="text-xs font-bold text-slate-600 uppercase">Assessing Officer</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div id="certificate-template" className="w-full max-w-[800px] min-h-[560px] p-10 border-[12px] border-double border-blue-200 bg-white text-center relative shadow-none">
                                    <div className="absolute top-8 left-8 text-blue-100">
                                        <Award className="w-16 h-16" />
                                    </div>
                                    <div className="absolute top-8 right-8 text-blue-100">
                                        <Award className="w-16 h-16" />
                                    </div>

                                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-blue-900 mt-2 mb-2 uppercase tracking-widest text-center">Certificate of Registration</h1>
                                    <p className="text-sm font-semibold text-slate-500 tracking-widest uppercase mb-10 text-center">Certificate No: <span className="text-slate-700">{certFormData.certificateNumber}</span></p>

                                    <p className="text-lg text-slate-600 italic mb-4 text-center">This is to certify that the management system of</p>
                                    <h2 className="text-3xl font-serif font-bold text-blue-800 mb-6 text-center">{certFormData.companyName || '[Company Name]'}</h2>

                                    <p className="text-lg text-slate-600 italic mb-4 text-center">has been assessed and found to be in accordance with the requirements of</p>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">{certFormData.certificationType}</h3>

                                    <p className="text-md text-slate-600 italic mb-2 text-center">For the following scope:</p>
                                    <p className="text-lg font-medium text-slate-800 mb-10 px-12 text-center">{certFormData.scope || '[Scope of Business]'}</p>

                                    <div className="flex flex-col sm:flex-row justify-between items-end mt-12 pt-8 border-t border-slate-200 gap-8">
                                        <div className="text-left w-full sm:w-1/3">
                                            <p className="text-sm font-bold text-slate-800">Issue Date: <span className="font-normal text-slate-600">{certFormData.issueDate || 'DD/MM/YYYY'}</span></p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">Expiry Date: <span className="font-normal text-slate-600">{certFormData.expiryDate || 'DD/MM/YYYY'}</span></p>
                                        </div>
                                        <div className="w-full sm:w-1/3 text-center order-first sm:order-none mb-6 sm:mb-0 flex justify-center">
                                            <div className="p-2 bg-white border border-slate-200 shadow-sm rounded-lg inline-block">
                                                <QRCode value={`https://techvimalinternational.com/verify?cert=${certFormData.certificateNumber}`} size={80} level="M" />
                                            </div>
                                        </div>
                                        <div className="text-center w-full sm:w-1/3 flex flex-col items-center">
                                            <div className="border-b-2 border-slate-800 mb-2 pb-2 w-48 mx-auto">
                                                <span className="font-serif italic text-2xl text-blue-900">{certFormData.authorizedSignatory || 'Signatory'}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">Authorized Signatory</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0 z-10 shrink-0">
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors text-sm bg-white shadow-sm"
                            >
                                Back to Edit
                            </button>
                            <button
                                onClick={handleGenerateCertificate}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Confirm & Generate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificationAuditManagement;
