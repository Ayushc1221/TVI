import { useState } from 'react';
import { Settings as SettingsIcon, Bell, DollarSign, Power, Save, FileBadge, ArrowRight } from 'lucide-react';
import CertificateTemplates from './CertificateTemplates';

const Settings = () => {
    const [currentView, setCurrentView] = useState('settings');
    // Mock settings state
    const [services, setServices] = useState({
        iso: true,
        audit: true,
        hraa: false,
    });

    const [pricing] = useState({
        iso: 25000,
        audit: 15000,
        inspection: 15000,
        hraa: 30000,
    });

    const [notifications, setNotifications] = useState({
        email: true,
        statusUpdates: true,
    });

    const handleToggleService = (key) => {
        setServices(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleToggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (currentView === 'certificate-templates') {
        return <CertificateTemplates onBack={() => setCurrentView('settings')} />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start justify-between pb-4 border-b border-slate-200 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <SettingsIcon className="w-6 h-6 text-slate-500" /> Platform Settings
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Manage platform configuration and preferences</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setCurrentView('certificate-templates')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-xl font-semibold shadow-sm transition-colors text-sm text-slate-700"
                    >
                        <FileBadge className="w-4 h-4" /> Manage Certificate Templates <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-colors text-sm">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">

                {/* 1. Service Configuration */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
                        <Power className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-800">Service Configuration</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4 max-w-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-700 text-sm">Enable ISO Certification</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={services.iso} onChange={() => handleToggleService('iso')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-700 text-sm">Enable Audit / Inspection</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={services.audit} onChange={() => handleToggleService('audit')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-700 text-sm">Enable HRAA</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={services.hraa} onChange={() => handleToggleService('hraa')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Pricing Configuration */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-slate-800">Pricing Configuration (View Only)</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">ISO Fee (₹)</label>
                                <input type="text" readOnly value={pricing.iso.toLocaleString()} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-500 bg-slate-50 font-medium focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Audit Fee (₹)</label>
                                <input type="text" readOnly value={pricing.audit.toLocaleString()} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-500 bg-slate-50 font-medium focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Inspection Fee (₹)</label>
                                <input type="text" readOnly value={pricing.inspection.toLocaleString()} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-500 bg-slate-50 font-medium focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">HRAA Fee (₹)</label>
                                <input type="text" readOnly value={pricing.hraa.toLocaleString()} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-500 bg-slate-50 font-medium focus:outline-none" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Notification Settings */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-slate-800">Notification Settings</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4 max-w-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-700 text-sm">Email Notifications</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={notifications.email} onChange={() => handleToggleNotification('email')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-700 text-sm">Application Status Updates</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={notifications.statusUpdates} onChange={() => handleToggleNotification('statusUpdates')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
