import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileText, 
    Download, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    Building2,
    Calendar
} from 'lucide-react';

import Sidebar from '../admin/components/Sidebar';
import Header from '../admin/components/Header';
import { clientApi } from '../../services';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const clientUser = JSON.parse(localStorage.getItem('client_user') || '{"name": "Client", "email": ""}');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setIsLoading(true);
            const response = await clientApi.getApplications();
            if (response.success) {
                setApplications(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('client_token');
        localStorage.removeItem('client_user');
        navigate('/client/login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'My Applications', icon: LayoutDashboard },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'submitted':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'under_review':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'audit_assigned':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'certificate_generated':
            case 'completed':
                return 'bg-green-50 text-green-700 border-green-200 shadow-sm border-2 font-bold';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const formatStatus = (status) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p>Loading your applications...</p>
                </div>
            );
        }

        if (applications.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">No Applications Found</h2>
                    <p className="text-slate-500 text-center">We couldn't find any applications associated with this email and phone number.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {applications.map((app) => (
                    <div key={app._id} className="bg-white border text-left border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {/* Header Area */}
                        <div className="border-b border-slate-100 bg-slate-50/50 p-5 flex flex-wrap gap-4 items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-indigo-600" />
                                    {app.companyName}
                                </h3>
                                <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">
                                    {app.applicationId} • {app.serviceType}
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-2 border ${getStatusStyle(app.status)}`}>
                                    {app.status === 'completed' || app.status === 'certificate_generated' ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <Clock className="w-4 h-4" />
                                    )}
                                    {formatStatus(app.status)}
                                </span>
                            </div>
                        </div>

                        {/* Details Area */}
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Service Type</p>
                                <p className="font-semibold text-slate-700">{app.serviceType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Submitted On</p>
                                <p className="font-semibold text-slate-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {app.adminNotes && (
                                <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-2">
                                    <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">Update / Notes from Admin:</p>
                                    <p className="text-sm text-yellow-900">{app.adminNotes}</p>
                                </div>
                            )}
                        </div>

                        {/* Action Area for Download */}
                        {(app.status === 'certificate_generated' || app.status === 'completed') && (
                            <div className="p-5 border-t border-slate-100 bg-indigo-50/30 flex justify-end">
                                <button 
                                    onClick={() => navigate('/verify')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Verify / View Certificate
                                </button>
                                {/* Note: Ideally, there would be a direct download link returned by the API if a file was stored, 
                                    but directing them to the verify page with their ID is a solid fallback for viewing the certificate */}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                menuItems={menuItems}
                title="Client Portal"
            />

            <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <Header
                    activeTab={activeTab}
                    profileDropdownOpen={profileDropdownOpen}
                    setProfileDropdownOpen={setProfileDropdownOpen}
                    adminUser={clientUser}
                    handleLogout={handleLogout}
                    setActiveTab={setActiveTab}
                    roleLabel="Client"
                />

                <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-800">Welcome back, {clientUser.name}</h1>
                            <p className="text-slate-500">Track your submitted applications and certificates.</p>
                        </div>
                        
                        {renderContent()}
                    </div>
                </div>
            </main>

            {profileDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default ClientDashboard;
