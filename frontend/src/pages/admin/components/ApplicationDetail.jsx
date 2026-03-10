/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, User, FileJson, CheckCircle, FileText, Download, Eye, CreditCard, Activity, CheckSquare, Square, FileBadge, Loader2 } from 'lucide-react';
import { applicationApi } from '../../../services';

// Fallback mock data for fields not yet in backend
const fallbackDetails = {
    company: {
        businessType: '-',
        industryType: '-',
        address: '-',
        city: '-',
        state: '-',
        country: 'India',
        pincode: '-',
        gstNumber: '-',
        website: '-'
    },
    contact: {
        name: '-',
        designation: '-',
        email: '-',
        mobile: '-',
        altMobile: '-'
    },
    documents: [],
    payment: {
        serviceFee: '-',
        paymentMethod: '-',
        paymentId: '-',
        paymentStatus: '-'
    },
    serviceDetails: {
        isoStandards: [],
        numberOfEmployees: '-',
        scopeOfBusiness: '-',
        certificationDuration: '-',
        existingCertification: '-',
    }
};

const ApplicationDetail = ({ applicationId, onBack }) => {
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStatus, setCurrentStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const fetchApp = async () => {
            setLoading(true);
            try {
                const response = await applicationApi.getById(applicationId);
                if (response.success && response.data) {
                    const d = response.data;
                    setApp({
                        id: d.applicationId,
                        status: d.status,
                        serviceType: d.serviceType?.toLowerCase() || 'iso',
                        company: {
                            name: d.companyName || '-',
                            businessType: d.businessType || '-',
                            industryType: d.industryType || '-',
                            address: d.companyAddress || '-',
                            city: d.city || '-',
                            state: d.state || '-',
                            country: d.country || 'India',
                            pincode: d.pinCode || '-',
                            gstNumber: d.gstNumber || '-',
                            website: d.companyWebsite || '-'
                        },
                        contact: {
                            name: d.contactPerson || '-',
                            designation: d.designation || '-',
                            email: d.email || '-',
                            mobile: d.phone || '-',
                            altMobile: d.alternateMobile || '-'
                        },
                        documents: d.documents || [],
                        payment: {
                            serviceFee: d.serviceFee || '-',
                            paymentMethod: d.paymentMethod || '-',
                            paymentId: d.paymentId || '-',
                            paymentStatus: d.paymentStatus || 'Completed'
                        },
                        serviceDetails: {
                            // ISO
                            isoStandards: Array.isArray(d.certificationType) ? d.certificationType : (d.certificationType ? [d.certificationType] : []),
                            numberOfEmployees: d.numEmployees || '-',
                            scopeOfBusiness: d.scopeOfBusiness || '-',
                            certificationDuration: d.certificationDuration || '-',
                            existingCertification: d.existingIso || '-',
                            // Audit
                            auditType: d.auditServiceType || '-',
                            auditCategory: Array.isArray(d.auditCategories) ? d.auditCategories.join(', ') : (d.auditCategories || '-'),
                            siteLocation: d.siteLocation || '-',
                            numberOfLocations: d.numLocations || '-',
                            mode: d.preferredMode || '-',
                            tentativeDate: d.tentativeDate || '-',
                            // HRAA
                            hraaType: d.hraaType || '-',
                            totalEmployees: d.hraaEmployees || '-',
                            payrollMode: d.payrollManaged || '-',
                            hrPoliciesAvailable: d.hrPolicies || '-',
                            complianceStatus: d.labourLawCompliance || '-'
                        },
                    });
                    setCurrentStatus(d.status);
                }
            } catch (err) {
                console.error('Failed to fetch application:', err);
            } finally {
                setLoading(false);
            }
        };
        if (applicationId) fetchApp();
    }, [applicationId]);

    const handleSaveStatus = async () => {
        try {
            await applicationApi.updateStatus({ applicationId, status: currentStatus });
            alert(`Status updated to: ${currentStatus}` + (currentStatus === 'rejected' ? `\nReason: ${rejectionReason}` : ''));
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-16">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-3 text-slate-500 font-medium">Loading application...</span>
            </div>
        );
    }

    if (!app) {
        return (
            <div className="text-center p-16">
                <p className="text-red-500 font-medium">Application not found.</p>
                <button onClick={onBack} className="mt-4 text-blue-600 underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        title="Back to Applications"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            {app.id}
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg w-max ${['approved', 'completed', 'certificate_generated'].includes(currentStatus) ? 'bg-emerald-100 text-emerald-700' :
                                    currentStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                                        ['under_review', 'audit_assigned'].includes(currentStatus) ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                }`}>
                                {currentStatus.replace('_', ' ')}
                            </span>
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">Application Details</p>
                    </div>
                </div>

                {/* Could add action buttons here like Approve/Reject */}
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors shadow-sm">
                        Download PDF
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Take Action
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Column 1: Company & Contact (Left/Main Side) */}
                <div className="xl:col-span-2 space-y-6">

                    {/* SECTION 1: Company Details */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-slate-800">Company Details</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company Name</p>
                                    <p className="font-medium text-slate-800">{app.company.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Business Type</p>
                                    <p className="font-medium text-slate-800">{app.company.businessType}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Industry Type</p>
                                    <p className="font-medium text-slate-800">{app.company.industryType}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">GST Number</p>
                                    <p className="font-medium text-slate-800">{app.company.gstNumber}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Address</p>
                                    <p className="font-medium text-slate-800">{app.company.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">City</p>
                                    <p className="font-medium text-slate-800">{app.company.city}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">State</p>
                                    <p className="font-medium text-slate-800">{app.company.state}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Country</p>
                                    <p className="font-medium text-slate-800">{app.company.country}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">PIN Code</p>
                                    <p className="font-medium text-slate-800">{app.company.pincode}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Website</p>
                                    <a href={`https://${app.company.website}`} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                                        {app.company.website}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Contact Person Details */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-slate-800">Contact Person Details</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Name</p>
                                    <p className="font-medium text-slate-800">{app.contact.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Designation</p>
                                    <p className="font-medium text-slate-800">{app.contact.designation}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                                    <a href={`mailto:${app.contact.email}`} className="font-medium text-blue-600 hover:underline">
                                        {app.contact.email}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mobile</p>
                                    <p className="font-medium text-slate-800">{app.contact.mobile}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Alternate Mobile</p>
                                    <p className="font-medium text-slate-800">{app.contact.altMobile || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: Uploaded Documents */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-slate-800">Uploaded Documents</h3>
                        </div>
                        <div className="p-0">
                            <ul className="divide-y divide-slate-100">
                                {app.documents.map((doc) => (
                                    <li key={doc.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800 text-sm">{doc.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="flex items-center gap-1.5 mr-2">
                                                <button className={`flex items-center gap-1.5 text-xs font-semibold px-2. py-1 rounded-md transition-colors ${doc.verified ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>
                                                    {doc.verified ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                                    Verified
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => window.open(`http://localhost:5000${doc.url}`, '_blank')}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 hover:border-blue-200 bg-white shadow-sm"
                                                    title="Preview"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => window.open(`http://localhost:5000${doc.url}`, '_blank')}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 hover:border-blue-200 bg-white shadow-sm"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* SECTION 4.5: Generated Certificate (If Completed) */}
                    {currentStatus === 'Completed' && (
                        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden mt-6">
                            <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-4 flex items-center gap-2">
                                <FileBadge className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800">Generated Certificate</h3>
                            </div>
                            <div className="p-4 sm:px-6 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <FileBadge className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Official Certificate.pdf</p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Application: {app.id}</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors transition-all">
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SECTION 5: Payment Information */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-slate-800">Payment Information</h3>
                            </div>
                            <button className="text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1">
                                <Download className="w-4 h-4" /> Invoice
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Service Fee</p>
                                    <p className="font-bold text-slate-800 text-lg">{app.payment.serviceFee}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Payment Method</p>
                                    <p className="font-medium text-slate-800">{app.payment.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Payment ID</p>
                                    <p className="font-medium text-slate-800 break-all">{app.payment.paymentId}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                                    <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full inline-block mt-1">
                                        {app.payment.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Column 2: Service Details & Actions (Right/Sidebar Side) */}
                <div className="space-y-6">

                    {/* SECTION 6: Application Status Actions */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-slate-800">Application Status</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Status</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm cursor-pointer"
                                    value={currentStatus}
                                    onChange={(e) => setCurrentStatus(e.target.value)}
                                >
                                    <option value="submitted">Submitted</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="audit_assigned">Audit Assigned</option>
                                    <option value="certificate_generated">Cert Generated</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            {currentStatus === 'Rejected' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Rejection Reason <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-sm resize-y"
                                        rows="3"
                                        placeholder="Please provide a clear reason for rejection..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            )}

                            <button
                                onClick={handleSaveStatus}
                                disabled={currentStatus === 'Rejected' && !rejectionReason.trim()}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" /> Save Status
                            </button>
                        </div>
                    </div>

                    {/* SECTION 3: Service-Specific Details */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-max sticky top-24">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
                            <FileJson className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-slate-800">
                                {app.serviceType === 'iso' && 'ISO Certification Details'}
                                {app.serviceType === 'audit' && 'Audit / Inspection Details'}
                                {app.serviceType === 'hraa' && 'HRAA Details'}
                            </h3>
                        </div>
                        <div className="p-6">

                            {/* ISO DETAILS */}
                            {app.serviceType === 'iso' && (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">ISO Standard(s)</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {app.serviceDetails.isoStandards.map((std, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                                                    {std}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Scope of Business</p>
                                        <p className="font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">{app.serviceDetails.scopeOfBusiness}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Number of Employees</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.numberOfEmployees}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Certification Duration</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.certificationDuration}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Existing Certification</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.existingCertification}</p>
                                    </div>
                                </div>
                            )}

                            {/* AUDIT DETAILS */}
                            {app.serviceType === 'audit' && (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Service Type</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.auditType}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Audit / Inspection Category</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.auditCategory}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Site Location</p>
                                        <p className="font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">{app.serviceDetails.siteLocation}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Number of Locations</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.numberOfLocations}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mode</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.mode}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tentative Date</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.tentativeDate}</p>
                                    </div>
                                </div>
                            )}

                            {/* HRAA DETAILS */}
                            {app.serviceType === 'hraa' && (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">HRAA Type</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.hraaType}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Employees</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.totalEmployees}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Payroll Mode</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.payrollMode}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">HR Policies Available</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.hrPoliciesAvailable}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Compliance Status</p>
                                        <p className="font-medium text-slate-800">{app.serviceDetails.complianceStatus}</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ApplicationDetail;
