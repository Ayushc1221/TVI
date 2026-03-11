/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Eye, Upload, FileBadge, Loader2 } from 'lucide-react';
import { templateApi } from '../../../services';
import { API_BASE_URL } from '../../../config/api.config';

const CertificateTemplates = ({ onBack }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(null);

    const serviceTypes = ['ISO', 'Audit', 'HRAA'];

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const res = await templateApi.getAll();
            if (res.success) {
                setTemplates(res.data);
            }
        } catch (error) {
            console.error('Failed to load templates', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = (serviceType) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.html';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                setUploading(serviceType);
                try {
                    const formData = new FormData();
                    formData.append('template', file);
                    formData.append('serviceType', serviceType);

                    const res = await templateApi.upload(formData);

                    if (res.success) {
                        alert(`Template for ${serviceType} successfully updated!`);
                        fetchTemplates(); // Refresh templates list
                    }
                } catch (error) {
                    console.error('Failed to upload template', error);
                    alert(`Failed to upload template: ${error.response?.data?.message || error.message}`);
                } finally {
                    setUploading(null);
                }
            }
        };
        fileInput.click();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        title="Back to Settings"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            Certificate Templates
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">Manage and upload templates for certificates and reports</p>
                    </div>
                </div>
            </div>

            {/* Templates List */}
            {loading ? (
                <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="ml-3 text-slate-500 font-medium">Loading templates...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceTypes.map(service => {
                        const activeTemplate = templates.find(t => t.serviceType === service);
                        return (
                            <div key={service} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <FileBadge className="w-5 h-5" />
                                        <h3 className="font-bold text-slate-800">{service} Service</h3>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        {activeTemplate ? (
                                            <div className="mb-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm leading-tight break-all">{activeTemplate.templateName}</h4>
                                                        <p className="text-xs text-slate-500 font-medium mt-1 truncate max-w-[150px]" title={activeTemplate.fileUrl}>File: {activeTemplate.fileUrl}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
                                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">Active</span>
                                                    <span className="text-slate-400">Updated: {formatDate(activeTemplate.updatedAt || activeTemplate.createdAt)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-6 py-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                                <p className="text-sm text-slate-500 font-medium">No active template found</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => window.open(activeTemplate?.fileUrl?.startsWith('http') ? activeTemplate.fileUrl : `${API_BASE_URL.replace('/api', '')}${activeTemplate.fileUrl}`, '_blank')}
                                            disabled={!activeTemplate}
                                            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors w-full ${!activeTemplate ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200'}`}
                                            title="Preview Template"
                                        >
                                            <Eye className="w-4 h-4" /> Preview
                                        </button>

                                        <button
                                            onClick={() => handleUpload(service)}
                                            disabled={uploading === service}
                                            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 disabled:opacity-50"
                                        >
                                            {uploading === service ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                            {activeTemplate ? 'Replace' : 'Upload'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3 mt-6">
                <div className="text-blue-600 mt-0.5"><FileBadge className="w-5 h-5" /></div>
                <div>
                    <h4 className="font-semibold text-blue-900 text-sm">Template Guidelines</h4>
                    <p className="text-xs text-blue-700 font-medium mt-1 leading-relaxed">
                        Only <b>.pdf</b> and <b>.html</b> file formats are accepted. Uploading a new template will instantly replace the currently active one for that specific service type. All future generated certificates will use this latest template.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CertificateTemplates;
