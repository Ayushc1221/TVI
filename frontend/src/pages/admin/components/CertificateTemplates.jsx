/* eslint-disable react/prop-types */
import { useState } from 'react';
import { ArrowLeft, FileText, Eye, Upload, FileBadge } from 'lucide-react';

const CertificateTemplates = ({ onBack }) => {
    // Mock templates state
    const [templates, setTemplates] = useState([
        {
            id: 'TPL-ISO-01',
            name: 'Standard ISO Certificate v1.2',
            serviceType: 'ISO',
            lastUpdated: '2023-10-15',
            status: 'Active',
            file: 'ISO_Standard_Template.pdf'
        },
        {
            id: 'TPL-AUD-01',
            name: 'Inspection & Audit Report Format',
            serviceType: 'Audit',
            lastUpdated: '2023-09-22',
            status: 'Active',
            file: 'Audit_Report_v2.html'
        },
        {
            id: 'TPL-HRA-01',
            name: 'HRAA Compliance Certificate',
            serviceType: 'HRAA',
            lastUpdated: '2023-11-05',
            status: 'Active',
            file: 'HRAA_Format.pdf'
        }
    ]);

    const serviceTypes = ['ISO', 'Audit', 'HRAA'];

    const handleUpload = (serviceType) => {
        // Mock upload logic
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.html';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                alert(`Template for ${serviceType} successfully uploaded: ${file.name}`);
                setTemplates(prev => {
                    const existing = prev.find(t => t.serviceType === serviceType);
                    if (existing) {
                        return prev.map(t => t.serviceType === serviceType ? { ...t, name: 'New Uploaded Template', lastUpdated: new Date().toISOString().split('T')[0], file: file.name } : t);
                    } else {
                        return [...prev, {
                            id: `TPL-${serviceType}-NEW`,
                            name: 'New Uploaded Template',
                            serviceType: serviceType,
                            lastUpdated: new Date().toISOString().split('T')[0],
                            status: 'Active',
                            file: file.name
                        }];
                    }
                });
            }
        };
        fileInput.click();
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
                                                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{activeTemplate.name}</h4>
                                                    <p className="text-xs text-slate-500 font-medium mt-1">File: {activeTemplate.file}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">Active</span>
                                                <span className="text-slate-400">Updated: {activeTemplate.lastUpdated}</span>
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
                                        onClick={() => alert(`Previewing ${activeTemplate?.name || 'No template'}`)}
                                        disabled={!activeTemplate}
                                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors w-full ${!activeTemplate ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200'}`}
                                        title="Preview Template"
                                    >
                                        <Eye className="w-4 h-4" /> Preview
                                    </button>

                                    <button
                                        onClick={() => handleUpload(service)}
                                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                                        title="Upload or Replace Template (PDF/HTML)"
                                    >
                                        <Upload className="w-4 h-4" /> {activeTemplate ? 'Replace' : 'Upload'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

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
