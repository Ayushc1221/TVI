import { useState, useEffect } from 'react';
import {
    Search, Filter, Calendar, FileText, CheckCircle,
    UserPlus, ChevronDown, ChevronUp, FileBadge, Save, FileSignature, X, Eye, Award, Download, Upload, Loader2
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import QRCode from 'react-qr-code';
import { certificateApi, applicationApi } from '../../../services';

const CertificationAuditManagement = ({ onViewDetails }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterService, setFilterService] = useState('All Services');

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

    useEffect(() => {
        fetchWorkflowApps();
    }, []);

    const fetchWorkflowApps = async () => {
        setLoading(true);
        try {
            // Fetch applications that are past "submitted" (meaning they need workflow, audit, or cert)
            const res = await applicationApi.getAll({ limit: 500 });
            if (res.success) {
                const workflowApps = res.data
                    .filter(app => ['approved', 'under_review', 'audit_assigned', 'certificate_generated', 'completed'].includes(app.status))
                    .map(app => {
                        let progress = 25;
                        if (app.status === 'audit_assigned') progress = 50;
                        if (app.status === 'certificate_generated') progress = 80;
                        if (app.status === 'completed') progress = 100;

                        return {
                            id: app.applicationId,
                            company: app.companyName,
                            service: app.serviceType,
                            status: app.status,
                            progress,
                            auditor: app.assignedAuditor || '',
                            notes: app.adminNotes || '',
                            documentUploaded: app.documents && app.documents.length > 0
                        };
                    });
                setApplications(workflowApps);
            }
        } catch (err) {
            console.error('Failed to load workflow apps', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleAssignAuditor = async (appId, auditorName) => {
        if (!auditorName) return;
        try {
            const res = await applicationApi.assignAuditor({ applicationId: appId, assignedAuditor: auditorName });
            if (res.success) {
                setApplications(prev => prev.map(app => app.id === appId ? { ...app, auditor: auditorName, status: 'audit_assigned', progress: 50 } : app));
                alert('Auditor assigned successfully!');
            }
        } catch (error) {
            alert('Failed to assign auditor');
        }
    };

    const handleAssignComplete = async (appId) => {
        try {
            const res = await applicationApi.updateStatus({ applicationId: appId, status: 'completed' });
            if (res.success) {
                setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: 'completed', progress: 100 } : app));
                alert(`Application ${appId} marked as Completed!`);
            }
        } catch (error) {
            alert('Failed to complete application');
        }
    };

    const selectedAppForModal = applications.find(app => app.id === showGenerateModal);

    const handleGenerateCertificate = async () => {
        const element = document.getElementById('certificate-template');
        if (element) {
            // Map service to backend serviceType
            const mapType = { 'iso': 'ISO', 'audit': 'AUDIT', 'hraa': 'HRAA' };
            const serviceType = mapType[selectedAppForModal?.service?.toLowerCase()] || 'ISO';

            try {
                const response = await certificateApi.generate({
                    applicationId: selectedAppForModal.id,
                    companyName: certFormData.companyName,
                    certificationType: certFormData.certificationType,
                    scope: certFormData.scope,
                    issueDate: certFormData.issueDate,
                    expiryDate: certFormData.expiryDate,
                    serviceType,
                });

                if (response.success) {
                    // Also update application status
                    await applicationApi.updateStatus({ applicationId: selectedAppForModal.id, status: 'certificate_generated' });

                    console.log('Certificate generated via backend:', response.data);
                    alert("Certificate Generated and Saved Successfully!");
                    fetchWorkflowApps(); // Refresh to update status progress
                }
            } catch (err) {
                console.error('Failed to generate certificate via backend', err);
                alert("Failed to save certificate data to Database");
            }

            const opt = {
                margin: 0,
                filename: `${certFormData.certificateNumber || selectedAppForModal.id}-Certificate.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 3, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().from(element).set(opt).save().then(() => {
                setShowPreviewModal(false);
                setShowGenerateModal(null);
            });
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterService === 'All Services' ? true : app.service.toLowerCase() === filterService.split(' ')[0].toLowerCase(); // E.g. "ISO Certification" -> "ISO"
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Approved Apps..."
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
                        value={filterService}
                        onChange={(e) => setFilterService(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none"
                    >
                        <option>All Services</option>
                        <option>ISO Certification</option>
                        <option>Audit</option>
                        <option>HRAA</option>
                    </select>
                </div>
            </div>

            {/* Workflow List */}
            {loading ? (
                <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="ml-3 text-slate-500 font-medium">Loading workflows...</span>
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-medium shadow-sm">
                    No active workflows found. Apply filters or wait for new applications to be approved.
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredApplications.map((app) => (
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
                                            {app.status === 'completed' ? (
                                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 rounded-lg">Completed</span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-lg">{app.status.replace('_', ' ')}</span>
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
                                                        id={`auditor-${app.id}`}
                                                        placeholder="Enter name or email..."
                                                        defaultValue={app.auditor}
                                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        onClick={() => handleAssignAuditor(app.id, document.getElementById(`auditor-${app.id}`).value)}
                                                        className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm hover:bg-slate-200 transition-colors"
                                                    >
                                                        Assign
                                                    </button>
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
                                                    readOnly  // Removed complex backend update since it needs a dedicated endpoint
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* Action Column 2: Dates, Doc & Completion */}
                                        <div className="space-y-5">

                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <FileSignature className="w-4 h-4 text-amber-500" />
                                                        <h4 className="font-semibold text-slate-800 text-sm">Certificate Generation</h4>
                                                    </div>
                                                    {app.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                                </div>

                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => {
                                                            setCertFormData({
                                                                certificateNumber: `TVI-${app.service}-${new Date().getFullYear()}-${sequenceCounters[app.service] || '001'}`,
                                                                companyName: app.company,
                                                                certificationType: app.service,
                                                                scope: '',
                                                                issueDate: new Date().toISOString().split('T')[0],
                                                                expiryDate: '',
                                                                authorizedSignatory: 'Director',
                                                                notes: ''
                                                            });
                                                            setShowGenerateModal(app.id);
                                                        }}
                                                        disabled={app.status === 'completed'}
                                                        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                                    >
                                                        <Award className="w-4 h-4" /> Generate {app.service} Certificate / Report
                                                    </button>

                                                    <div className="flex gap-3">
                                                        <button
                                                            disabled={true} // Usually link to doc module
                                                            className="flex-1 flex justify-center items-center gap-1.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                                                        >
                                                            <Upload className="w-4 h-4" /> Upload Doc
                                                        </button>
                                                        <button
                                                            onClick={() => handleAssignComplete(app.id)}
                                                            disabled={app.status === 'completed'}
                                                            className="flex-1 flex justify-center items-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                                                        >
                                                            <CheckCircle className="w-4 h-4" /> Complete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Actions (View Application) */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onViewDetails(app.id)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> Full Application
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* --- Modals Stay The Same as before mostly --- */}
            {/* Generate Certificate Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Generate {selectedAppForModal?.service} Certificate</h3>
                                <p className="text-xs font-medium text-slate-500 mt-0.5">Application: {selectedAppForModal?.id}</p>
                            </div>
                            <button onClick={() => setShowGenerateModal(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <FileBadge className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-blue-800 text-sm">Template Auto-Selected</h4>
                                    <p className="text-xs text-blue-600 mt-1 font-medium leading-relaxed">
                                        The system has automatically selected the base template for <b>{selectedAppForModal?.service}</b>.
                                        Fill in the specifics below, and a QR code with the verification link will be auto-generated on the PDF.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Certificate Number</label>
                                    <input type="text" value={certFormData.certificateNumber} onChange={e => setCertFormData({ ...certFormData, certificateNumber: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800" />
                                    <p className="text-[10px] text-slate-500 mt-1 font-medium italic">Auto-generated, editable if highly needed.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Company Name</label>
                                    <input type="text" value={certFormData.companyName} onChange={e => setCertFormData({ ...certFormData, companyName: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Scope of Certification / Business</label>
                                    <textarea value={certFormData.scope} onChange={e => setCertFormData({ ...certFormData, scope: e.target.value })} rows="2" placeholder="E.g., Manufacturing and Supply of..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Issue Date</label>
                                    <input type="date" value={certFormData.issueDate} onChange={e => setCertFormData({ ...certFormData, issueDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Expiry Date</label>
                                    <input type="date" value={certFormData.expiryDate} onChange={e => setCertFormData({ ...certFormData, expiryDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800" />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
                            <button onClick={() => setShowGenerateModal(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                            <button onClick={() => setShowPreviewModal(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 border border-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                                <Eye className="w-4 h-4" /> Preview & Generate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal for Generating PDF */}
            {showPreviewModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-hidden flex-col">
                    <div className="w-full max-w-4xl flex justify-between items-center mb-4 shrink-0">
                        <h3 className="text-white font-bold text-xl flex items-center gap-2"><Award className="w-6 h-6 text-yellow-400" /> Final Certificate Preview</h3>
                        <div className="flex gap-3">
                            <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-colors">Cancel / Edit</button>
                            <button onClick={handleGenerateCertificate} className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                <Download className="w-4 h-4" /> Download PDF & Save
                            </button>
                        </div>
                    </div>
                    <div className="w-full max-w-4xl bg-slate-100 rounded-lg overflow-hidden flex-1 relative flex justify-center p-4 md:p-8 custom-scrollbar pb-24 border border-slate-700 shadow-2xl overflow-y-auto">
                        {/* THE HIDDEN/VISIBLE TEMPLATE TO CONVERT TO PDF */}
                        <div id="certificate-template" className="bg-white w-[210mm] min-h-[297mm] p-[10mm] md:p-[20mm] relative shadow-[0_0_20px_rgba(0,0,0,0.1)] border border-slate-200 mx-auto" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                            {/* Decorative Border */}
                            <div className="absolute inset-4 border-[3px] border-double border-blue-900 pointer-events-none rounded-sm"></div>
                            <div className="absolute inset-6 border border-blue-800 pointer-events-none rounded-[1px]"></div>

                            {/* Header Layout */}
                            <div className="relative pt-6 z-10">
                                {/* TVI Logo Placeholder */}
                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 mx-auto bg-blue-900 rounded-full flex items-center justify-center mb-2 border-4 border-yellow-500 shadow-xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-700 to-blue-950"></div>
                                        <span className="text-white font-black text-4xl relative z-10 tracking-widest drop-shadow-md">TVI</span>
                                    </div>
                                    <h1 className="text-[28px] font-black tracking-widest text-blue-950 uppercase drop-shadow-sm mb-1" style={{ fontFamily: '"Arial Black", sans-serif' }}>TECH VIMAL INTERNATIONAL</h1>
                                    <p className="text-sm font-bold text-slate-800 uppercase tracking-[0.2em] border-b-2 border-slate-200 pb-4 mx-12">Certification & Audit Services</p>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="text-center mt-12 mb-10 relative z-10 px-8">
                                <p className="text-lg italic text-slate-600 mb-6 font-medium">This is to certify that the Quality Management System of</p>
                                <h2 className="text-4xl font-bold text-blue-950 mb-6 uppercase tracking-wider bg-slate-50 py-3 mx-10 border border-slate-200 shadow-sm rounded-sm">
                                    {certFormData.companyName.toUpperCase() || '[COMPANY NAME]'}
                                </h2>
                                <p className="text-lg italic text-slate-600 mb-6 font-medium">has been assessed and found entirely compliant with the requirements of</p>
                                <h3 className="text-[32px] font-black text-amber-600 mb-10 tracking-widest bg-amber-50/50 py-2 border-y border-amber-200 inline-block px-12 rounded-sm shadow-inner drop-shadow-sm">
                                    {certFormData.certificationType || 'ISO 9001:2015'}
                                </h3>

                                <div className="text-left mb-6 max-w-[80%] mx-auto bg-slate-50 p-6 border border-slate-200 rounded-sm shadow-sm relative">
                                    <p className="font-bold text-slate-800 text-sm tracking-widest uppercase mb-3 border-b-2 border-slate-300 inline-block">Scope of Certification:</p>
                                    <p className="text-lg font-medium text-slate-700 leading-relaxed italic">
                                        "{certFormData.scope || 'Specify Scope Here'}"
                                    </p>
                                </div>
                            </div>

                            {/* Footer & QR */}
                            <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] z-10">
                                <div className="flex justify-between items-end border-t border-slate-200 pt-6 px-4">
                                    <div className="text-left bg-slate-50 p-4 border border-slate-200 rounded-sm shadow-sm">
                                        <p className="text-sm font-bold tracking-wider text-slate-700 mb-2 uppercase border-b border-slate-300 pb-1">Certificate Details</p>
                                        <p className="text-[13px] text-slate-700 font-medium mb-1"><span className="w-28 inline-block font-bold">Certificate No.:</span> {certFormData.certificateNumber || '[CERT-NO]'}</p>
                                        <p className="text-[13px] text-slate-700 font-medium mb-1"><span className="w-28 inline-block font-bold">Date of Issue:</span> {certFormData.issueDate || '[ISSUE-DATE]'}</p>
                                        <p className="text-[13px] text-slate-700 font-medium"><span className="w-28 inline-block font-bold">Valid Until:</span> {certFormData.expiryDate || '[EXPIRY-DATE]'}</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="p-2 bg-white shadow-xl border border-slate-200 rounded-lg mb-4 transform hover:scale-105 transition-transform">
                                            <QRCode
                                                value={`https://techvimalinternational.com/verify?cert=${certFormData.certificateNumber || 'demo'}`}
                                                size={90}
                                                level={"Q"}
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Scan to Verify</p>
                                    </div>

                                    <div className="text-center w-56 relative">
                                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] pointer-events-none"></div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Signature_of_John_Hancock.svg" alt="Signature" className="h-16 mx-auto mb-2 opacity-80 mix-blend-multiply" />
                                        <div className="border-t-2 border-blue-900 pt-2 relative z-10 w-48 mx-auto">
                                            <p className="font-bold text-slate-800 uppercase tracking-widest">{certFormData.authorizedSignatory || 'Authorized'}</p>
                                            <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">Director / CEO</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 pointer-events-none">
                                <div className="text-[150px] font-bold text-slate-900 transform -rotate-45 tracking-widest origin-center">TVI</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificationAuditManagement;
