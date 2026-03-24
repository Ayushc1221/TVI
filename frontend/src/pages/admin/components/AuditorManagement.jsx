import React, { useState, useEffect } from 'react';
import {
    Search, Filter, CheckCircle, XCircle, FileText, Eye, Building2, User,
    Download, ShieldCheck, Calendar, Briefcase, Mail, Phone, Loader2, X
} from 'lucide-react';
import { auditorApi } from '../../../services';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

const AuditorManagement = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedAuditor, setSelectedAuditor] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchRegistrations();
    }, [filterStatus]);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterStatus) params.status = filterStatus;
            
            const res = await auditorApi.getRegistrations(params);
            if (res.success) {
                setRegistrations(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch auditor registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this auditor?`)) return;
        
        setIsUpdating(true);
        try {
            const res = await auditorApi.updateStatus(id, { status });
            if (res.success) {
                // Remove or update from list
                setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status } : r));
                if (selectedAuditor && selectedAuditor._id === id) {
                    setSelectedAuditor({ ...selectedAuditor, status });
                }
            }
        } catch (error) {
            console.error(`Failed to ${status} auditor:`, error);
            alert(`Failed to ${status} auditor.`);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredRegistrations = registrations.filter(r => 
        r.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.certification?.type && r.certification.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <Badge className="bg-emerald-100 text-emerald-800 border-none">Approved</Badge>;
            case 'rejected': return <Badge className="bg-red-100 text-red-800 border-none">Rejected</Badge>;
            default: return <Badge className="bg-amber-100 text-amber-800 border-none">Pending</Badge>;
        }
    };

    // Modal
    const renderModal = () => {
        if (!selectedAuditor) return null;

        const { personalInfo, education, certification, experience, expertise, documents, status } = selectedAuditor;

        // Helper to render file links
        const DocLink = ({ title, url }) => {
            if (!url) return null;
            return (
                <a href={`http://localhost:5000${url}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 transition-colors">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>{title}</span>
                </a>
            );
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                                {personalInfo.profilePhotoUrl ? (
                                    personalInfo.profilePhotoUrl.toLowerCase().endsWith('.pdf') ? (
                                        <User className="w-5 h-5 text-blue-500" />
                                    ) : (
                                        <img src={`http://localhost:5000${personalInfo.profilePhotoUrl}`} alt="Profile" className="w-full h-full object-cover" />
                                    )
                                ) : (
                                    <User className="w-5 h-5 text-blue-500" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{personalInfo.fullName}</h2>
                                <p className="text-sm text-slate-500">{personalInfo.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {getStatusBadge(status)}
                            <button onClick={() => setSelectedAuditor(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="text-xs font-semibold text-slate-500 uppercase">Experience</span>
                                <p className="text-lg font-bold text-slate-800 mt-1">{experience.totalYears} Years</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="text-xs font-semibold text-slate-500 uppercase">Primary Type</span>
                                <p className="text-lg font-bold text-slate-800 mt-1">{expertise.auditType || 'N/A'}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="text-xs font-semibold text-slate-500 uppercase">Industry</span>
                                <p className="text-lg font-bold text-slate-800 mt-1">{experience.industry}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="text-xs font-semibold text-slate-500 uppercase">Location</span>
                                <p className="text-lg font-bold text-slate-800 mt-1">{personalInfo.address.city}, {personalInfo.address.country}</p>
                            </div>
                        </div>

                        {/* Details Sections */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> Personal Details</h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li><strong>Phone:</strong> {personalInfo.phone}</li>
                                        <li><strong>DOB:</strong> {new Date(personalInfo.dob).toLocaleDateString()} ({personalInfo.gender})</li>
                                        <li><strong>Address:</strong> {personalInfo.address.city}, {personalInfo.address.state}, {personalInfo.address.country}</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-slate-400" /> Work & Expertise</h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li><strong>Designation:</strong> {experience.designation || 'N/A'} at {experience.currentOrg || 'N/A'}</li>
                                        <li><strong>Audits Conducted:</strong> {experience.auditsConducted}</li>
                                        <li>
                                            <strong>ISO Expertise:</strong>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {expertise.isoStandards.map(s => <span key={s} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{s}</span>)}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-slate-400" /> Certification</h3>
                                    <ul className="space-y-2 text-sm text-slate-600 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                                        <li><strong>Type:</strong> {certification.type}</li>
                                        <li><strong>Number:</strong> {certification.certificateNumber}</li>
                                        <li><strong>Issuing Body:</strong> {certification.issuingBody}</li>
                                        <li><strong>Validity:</strong> {new Date(certification.issueDate).toLocaleDateString()} to {new Date(certification.expiryDate).toLocaleDateString()}</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /> Verification Documents</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <DocLink title="ID Proof" url={documents.idProofUrl} />
                                        <DocLink title="Resume/CV" url={documents.resumeUrl} />
                                        <DocLink title="Degree Cert" url={education.certificateUrl} />
                                        <DocLink title="ISO Cert" url={certification.certificateUrl} />
                                        {documents.experienceLettersUrl && <DocLink title="Exp Letters" url={documents.experienceLettersUrl} />}
                                        {documents.pastAuditReportsUrl && <DocLink title="Past Reports" url={documents.pastAuditReportsUrl} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Applied on {new Date(selectedAuditor.createdAt).toLocaleString()}</span>
                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleUpdateStatus(selectedAuditor._id, 'rejected')}
                                disabled={isUpdating || status === 'rejected'}
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Reject
                            </Button>
                            <Button 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleUpdateStatus(selectedAuditor._id, 'approved')}
                                disabled={isUpdating || status === 'approved'}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Approve Auditor
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Auditor Registrations</h1>
                    <p className="text-sm text-slate-500 mt-1">Review and approve new auditor applications.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or cert type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-9 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm appearance-none bg-white"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Auditor</th>
                                <th className="px-6 py-4">Certification</th>
                                <th className="px-6 py-4">Experience</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Applied Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                                        <p>Loading registrations...</p>
                                    </td>
                                </tr>
                            ) : filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <p className="font-medium text-slate-700 mb-1">No auditors found</p>
                                        <p className="text-sm">Try adjusting your search or filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((auditor) => (
                                    <tr key={auditor._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {auditor.personalInfo.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{auditor.personalInfo.fullName}</p>
                                                    <p className="text-xs text-slate-500">{auditor.personalInfo.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-700">{auditor.certification.type}</p>
                                            <p className="text-xs text-slate-500">{auditor.expertise.auditType}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-700">{auditor.experience.totalYears} Years</p>
                                            <p className="text-xs text-slate-500">{auditor.experience.industry}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(auditor.status)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(auditor.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setSelectedAuditor(auditor)}
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                                <Eye className="w-4 h-4 mr-2" /> View Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {renderModal()}
        </div>
    );
};

export default AuditorManagement;
