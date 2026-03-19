import { useState, useEffect } from 'react';
import { CheckCircle, FileText, UploadCloud, AlertCircle, Loader2, Building2, Download, ChevronDown, ChevronUp, User, MapPin, Award } from 'lucide-react';
import { auditorApi } from '../../../services';

const AuditorAssignedList = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [reportFile, setReportFile] = useState(null);
    const [observations, setObservations] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const response = await auditorApi.getAssignments();
            if (response.success) {
                setAssignments(response.data);
            }
        } catch (err) {
            console.error('Failed to load assignments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        if (!reportFile) return alert("Please select an audit report document to upload");
        
        setSubmitting(true);
        const formData = new FormData();
        formData.append('auditReportDocument', reportFile);
        formData.append('auditObservations', observations);

        try {
            await auditorApi.submitReport(selectedAudit.applicationId, formData);
            alert("Audit report submitted successfully!");
            setSelectedAudit(null);
            fetchAssignments();
        } catch(err) {
            console.error(err);
            alert("Failed to submit report.");
        } finally {
            setSubmitting(false);
        }
    };

    const getSLABadge = (assignedDate, status) => {
        if (status === 'audit_report_submitted' || status === 'review_approved' || status === 'completed') {
            return <span className="px-2 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-md">Report Uploaded</span>;
        }
        if (!assignedDate) return null;

        const daysElapsed = Math.floor((new Date() - new Date(assignedDate)) / (1000 * 60 * 60 * 24));
        const daysLeft = 5 - daysElapsed;

        if (daysLeft < 0) {
            return <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-md">OVERDUE BY {Math.abs(daysLeft)} DAYS</span>;
        } else if (daysLeft <= 1) {
            return <span className="px-2 py-1 text-xs font-bold bg-orange-100 text-orange-700 rounded-md">{daysLeft} Day Left</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-md">{daysLeft} Days Left</span>;
        }
    };

    const overdueCount = assignments.filter(a => {
        if (a.status !== 'audit_assigned') return false;
        const days = Math.floor((new Date() - new Date(a.auditAssignedDate)) / (1000 * 60 * 60 * 24));
        return days > 5;
    }).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center p-16">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-3 text-slate-500 font-medium">Loading assignments...</span>
            </div>
        );
    }

    // Report Submission View
    if (selectedAudit) {
        const docs = selectedAudit.documents || [];
        return (
            <div className="space-y-5">
                <button onClick={() => setSelectedAudit(null)} className="text-slate-500 hover:text-slate-800 font-semibold text-sm flex items-center gap-1">
                    ← Back to My Assignments
                </button>

                {/* Application Info Header */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{selectedAudit.companyName}</h2>
                            <p className="text-sm text-slate-500">{selectedAudit.applicationId} • {selectedAudit.serviceType?.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {[
                            { icon: Award, label: 'ISO Standard', value: selectedAudit.certificationType },
                            { icon: MapPin, label: 'Company City / State', value: [selectedAudit.city, selectedAudit.state].filter(Boolean).join(', ') || 'N/A' },
                            { icon: User, label: 'Contact Person', value: selectedAudit.contactPerson || 'N/A' },
                            { icon: Building2, label: 'Scope of Business', value: selectedAudit.scopeOfBusiness || 'N/A' },
                            { icon: FileText, label: 'Num. Employees', value: selectedAudit.numEmployees || 'N/A' },
                            { icon: FileText, label: 'Certification Duration', value: selectedAudit.certificationDuration || 'N/A' },
                        ].map(({icon: Icon, label, value}) => (
                            <div key={label} className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                                    <p className="font-semibold text-slate-800 mt-0.5">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client Uploaded Documents */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Application Documents</h3>
                        <span className="ml-auto text-xs font-semibold text-slate-400">{docs.length} file(s)</span>
                    </div>
                    <div className="p-5">
                        {docs.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">No documents were uploaded with this application.</p>
                        ) : (
                            <div className="grid gap-3">
                                {docs.map((doc, idx) => (
                                    <a
                                        key={idx}
                                        href={`http://localhost:5000${doc.url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">{doc.name}</p>
                                                {doc.uploadedAt && (
                                                    <p className="text-xs text-slate-400 mt-0.5">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Report Submission Form */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-slate-800">Submit Audit Report</h3>
                    </div>
                    <div className="p-5">
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-5">
                            <p className="text-sm text-blue-800 font-medium">
                                Please ensure your audit report conforms to the requested ISO standards ({selectedAudit.certificationType}).
                            </p>
                        </div>
                        <form onSubmit={handleSubmitReport} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Audit Report Document (PDF) <span className="text-red-500">*</span></label>
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    required
                                    onChange={(e) => setReportFile(e.target.files[0])}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Observations / Non-Conformities</label>
                                <textarea
                                    rows="4"
                                    value={observations}
                                    onChange={(e) => setObservations(e.target.value)}
                                    placeholder="Enter notes for the technical reviewer... (Optional)"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-y shadow-sm"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setSelectedAudit(null)} className="px-6 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 text-sm">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-sm disabled:opacity-70">
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <UploadCloud className="w-4 h-4"/>} 
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {overdueCount > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl shadow-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                        <h3 className="font-bold text-red-800">URGENT: Overdue Reports</h3>
                        <p className="text-red-700 text-sm mt-1 font-medium">
                            You have {overdueCount} audit report(s) that are past the 5-day submission deadline. Please submit them immediately.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {assignments.length === 0 ? (
                    <div className="text-center p-12 text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        You have no assigned applications at the moment.
                    </div>
                ) : (
                    assignments.map(app => (
                        <div key={app.applicationId} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-800 text-lg">{app.companyName}</h3>
                                    {getSLABadge(app.auditAssignedDate, app.status)}
                                </div>
                                <div className="text-sm font-medium text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                                    <span>ID: {app.applicationId}</span>
                                    <span>•</span>
                                    <span>Standard: {app.certificationType}</span>
                                    <span>•</span>
                                    <span>Location: {app.siteLocation || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {app.status === 'audit_assigned' ? (
                                    <button 
                                        onClick={() => setSelectedAudit(app)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm text-sm"
                                    >
                                        Draft Report
                                    </button>
                                ) : (
                                    <span className="px-4 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-xl font-semibold text-sm flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4"/>
                                        Submitted
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AuditorAssignedList;
