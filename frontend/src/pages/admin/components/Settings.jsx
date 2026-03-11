import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, DollarSign, Power, Save, FileBadge, ArrowRight, Shield, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import CertificateTemplates from './CertificateTemplates';
import { authApi, settingsApi } from '../../../services';

const Settings = () => {
    const [currentView, setCurrentView] = useState('settings');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

    // Password state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

    // Platform settings state
    const [services, setServices] = useState({ iso: true, audit: true, hraa: true });
    const [pricing, setPricing] = useState({
        iso: 25000,
        audit: 15000,
        inspection: 15000,
        hraa: 30000,
        isoDetails: {},
        auditDetails: {},
        hraaDetails: {}
    });
    const [notifications, setNotifications] = useState({ email: true, statusUpdates: true });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setFetching(true);
        try {
            const res = await settingsApi.get();
            if (res.success && res.data) {
                setServices(res.data.services || services);
                setPricing(res.data.pricing || pricing);
                setNotifications(res.data.notifications || notifications);
            }
        } catch (err) {
            console.error('Failed to fetch settings', err);
        } finally {
            setFetching(false);
        }
    };

    const handleToggleService = (key) => {
        setServices(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleToggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePricingChange = (key, value) => {
        setPricing(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
    };

    const handleDetailPricingChange = (category, item, value) => {
        setPricing(prev => ({
            ...prev,
            [`${category}Details`]: {
                ...prev[`${category}Details`],
                [item]: parseInt(value) || 0
            }
        }));
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setStatusMsg({ text: '', type: '' });
        try {
            const res = await settingsApi.update({
                services,
                notifications,
                pricing
            });
            if (res.success) {
                setStatusMsg({ text: 'Platform settings saved successfully!', type: 'success' });
                setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
            }
        } catch (err) {
            setStatusMsg({ text: 'Failed to save settings', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwdMsg({ text: '', type: '' });

        if (!passwords.currentPassword || !passwords.newPassword) {
            setPwdMsg({ text: 'Please fill in all fields', type: 'error' });
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPwdMsg({ text: 'New passwords do not match', type: 'error' });
            return;
        }

        if (passwords.newPassword.length < 6) {
            setPwdMsg({ text: 'Password must be at least 6 characters', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const res = await authApi.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (res.success) {
                setPwdMsg({ text: 'Password updated successfully!', type: 'success' });
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPwdMsg({ text: res.message || 'Failed to update password', type: 'error' });
            }
        } catch (err) {
            console.error(err);
            setPwdMsg({ text: err.response?.data?.message || 'Server error', type: 'error' });
        } finally {
            setLoading(false);
        }
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
                    <button
                        onClick={handleSaveChanges}
                        disabled={loading || fetching}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-colors text-sm disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {statusMsg.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-4 duration-300 ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                    {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-semibold text-sm">{statusMsg.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">


                {/* 1. Service Configuration & 2. Pricing Configuration (Connected) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Service Toggles */}
                    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Power className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Service Control</h3>
                                <p className="text-[11px] text-slate-500 font-medium">Activate or deactivate platform services</p>
                            </div>
                        </div>
                        <div className="p-8 space-y-6 flex-1">
                            {/* ISO Toggle */}
                            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${services.iso ? 'bg-blue-50/30 border-blue-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${services.iso ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">ISO Certification</p>
                                        <p className="text-xs text-slate-500 font-medium">ISO 9001, 14001, 45001 etc.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer scale-110">
                                    <input type="checkbox" className="sr-only peer" checked={services.iso} onChange={() => handleToggleService('iso')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Audit Toggle */}
                            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${services.audit ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${services.audit ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        <FileBadge className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">Audit & Inspection</p>
                                        <p className="text-xs text-slate-500 font-medium">Safety Audits & Compliance</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer scale-110">
                                    <input type="checkbox" className="sr-only peer" checked={services.audit} onChange={() => handleToggleService('audit')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            {/* HRAA Toggle */}
                            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${services.hraa ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${services.hraa ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        <SettingsIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">HRAA Services</p>
                                        <p className="text-xs text-slate-500 font-medium">Hotel/Restaurant Ratings</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer scale-110">
                                    <input type="checkbox" className="sr-only peer" checked={services.hraa} onChange={() => handleToggleService('hraa')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Config */}
                    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Fee Structure</h3>
                                <p className="text-[11px] text-slate-500 font-medium">Set standard pricing for each service</p>
                            </div>
                        </div>
                        <div className="p-8 space-y-6 flex-1">
                            <div className="grid grid-cols-1 gap-6">
                                <div className={services.iso ? "" : "opacity-40 grayscale pointer-events-none"}>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="p-1 bg-blue-50 text-blue-600 rounded">ISO Certification Fee (Base)</div>
                                        {!services.iso && <span className="text-[10px] text-red-500 font-black">DISABLED</span>}
                                    </label>
                                    <div className="relative mb-4">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={pricing.iso}
                                            onChange={(e) => handlePricingChange('iso', e.target.value)}
                                            disabled={!services.iso}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>
                                    {/* ISO Detailed Pricing */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <div className="col-span-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Standard Specific Pricing</div>
                                        {[
                                            'ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 27001', 'ISO 22000',
                                            'ISO 20000-1', 'ISO 50001', 'ISO 22301', 'ISO 37001', 'ISO 21001'
                                        ].map(std => (
                                            <div key={std} className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{std}</span>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={pricing.isoDetails?.[std] || 0}
                                                        onChange={(e) => handleDetailPricingChange('iso', std, e.target.value)}
                                                        className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={services.audit ? "" : "opacity-40 grayscale pointer-events-none"}>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="p-1 bg-amber-50 text-amber-600 rounded">Audit & Inspection Fee (Base)</div>
                                        {!services.audit && <span className="text-[10px] text-red-500 font-black">DISABLED</span>}
                                    </label>
                                    <div className="relative mb-4">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={pricing.audit}
                                            onChange={(e) => handlePricingChange('audit', e.target.value)}
                                            disabled={!services.audit}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>
                                    {/* Audit Detailed Pricing */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <div className="col-span-2 text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Category Specific Pricing</div>
                                        {[
                                            'Internal Audit', 'External Audit', 'Supplier Audit', 'Safety Audit',
                                            'Fire Safety Audit', 'Energy Audit', 'Compliance Audit', 'Site Inspection'
                                        ].map(std => (
                                            <div key={std} className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{std}</span>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={pricing.auditDetails?.[std] || 0}
                                                        onChange={(e) => handleDetailPricingChange('audit', std, e.target.value)}
                                                        className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={services.hraa ? "" : "opacity-40 grayscale pointer-events-none"}>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="p-1 bg-emerald-50 text-emerald-600 rounded">HRAA Service Fee (Base)</div>
                                        {!services.hraa && <span className="text-[10px] text-red-500 font-black">DISABLED</span>}
                                    </label>
                                    <div className="relative mb-4">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={pricing.hraa}
                                            onChange={(e) => handlePricingChange('hraa', e.target.value)}
                                            disabled={!services.hraa}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>
                                    {/* HRAA Detailed Pricing */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <div className="col-span-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Type Specific Pricing</div>
                                        {[
                                            'HR Compliance Audit', 'HR Policy Audit', 'Payroll Audit',
                                            'Labour Law Compliance Audit', 'HR Documentation Audit'
                                        ].map(std => (
                                            <div key={std} className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{std}</span>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={pricing.hraaDetails?.[std] || 0}
                                                        onChange={(e) => handleDetailPricingChange('hraa', std, e.target.value)}
                                                        className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Account Security (Backend Connected) */}
                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Account Access</h3>
                            <p className="text-[11px] text-slate-500 font-medium">Secure your administrator account</p>
                        </div>
                    </div>
                    <div className="p-8">
                        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Min. 6 chars"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-2">Confirm & Save</label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="flex-1 min-w-0 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 whitespace-nowrap"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
                                    </button>
                                </div>
                            </div>
                            {pwdMsg.text && (
                                <div className={`lg:col-span-3 p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${pwdMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                    {pwdMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {pwdMsg.text}
                                </div>
                            )}
                        </form>
                    </div>
                </section>

                {/* 3. Notification Settings */}
                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Alert Preferences</h3>
                            <p className="text-[11px] text-slate-500 font-medium">Control how you stay informed</p>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-700 text-sm italic">Email Notifications</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Send daily summaries to admin email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer scale-110">
                                    <input type="checkbox" className="sr-only peer" checked={notifications.email} onChange={() => handleToggleNotification('email')} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-700 text-sm italic">Status Push Updates</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Notify clients upon application progress</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer scale-110">
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
