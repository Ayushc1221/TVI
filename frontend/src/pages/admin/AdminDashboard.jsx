import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    CreditCard,
    Award,
    FolderOpen,
    Users,
    Settings
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './components/DashboardHome';
import ApplicationsList from './components/ApplicationsList';
import ApplicationDetail from './components/ApplicationDetail';
import Payments from './components/Payments';
import CertificationAuditManagement from './components/CertificationAuditManagement';
import DocumentsModule from './components/DocumentsModule';
import UsersModule from './components/UsersModule';
import SettingsModule from './components/Settings';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);

    // Get admin info
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{"name": "Admin", "email": "admin@example.com"}');

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin/login');
    };

    // Sidebar Menu Items for Certification Platform
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'certifications', label: 'Certification / Audit', icon: Award },
        { id: 'documents', label: 'Documents', icon: FolderOpen },
        { id: 'users', label: 'Users / Clients', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const renderContent = () => {
        if (selectedApplicationId) {
            return (
                <ApplicationDetail
                    applicationId={selectedApplicationId}
                    onBack={() => setSelectedApplicationId(null)}
                />
            );
        }

        if (activeTab === 'dashboard') {
            return <DashboardHome />;
        }

        if (activeTab === 'applications') {
            return <ApplicationsList onViewDetails={(id) => setSelectedApplicationId(id)} />;
        }

        if (activeTab === 'payments') {
            return <Payments onViewApplication={(id) => setSelectedApplicationId(id)} />;
        }

        if (activeTab === 'certifications') {
            return <CertificationAuditManagement />;
        }

        if (activeTab === 'documents') {
            return <DocumentsModule />;
        }

        if (activeTab === 'users') {
            return <UsersModule />;
        }

        if (activeTab === 'settings') {
            return <SettingsModule />;
        }

        // Placeholder for other tabs
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl mt-6 bg-slate-50">
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                    {menuItems.find(m => m.id === activeTab)?.icon && (() => {
                        const Icon = menuItems.find(m => m.id === activeTab).icon;
                        return <Icon className="w-8 h-8 text-slate-400" />;
                    })()}
                </div>
                <h2 className="text-xl font-bold text-slate-700 capitalize mb-2">{activeTab.replace('-', ' ')}</h2>
                <p className="text-slate-500 font-medium">Content area structure ready. Data logic to be implemented.</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setSelectedApplicationId(null);
                }}
                menuItems={menuItems}
            />

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Header */}
                <Header
                    activeTab={activeTab}
                    profileDropdownOpen={profileDropdownOpen}
                    setProfileDropdownOpen={setProfileDropdownOpen}
                    adminUser={adminUser}
                    handleLogout={handleLogout}
                    setActiveTab={setActiveTab}
                />

                {/* Main Content Body */}
                <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[60vh]">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 pb-4 border-b border-slate-100">
                                {menuItems.find(m => m.id === activeTab)?.label}
                            </h2>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>

            {/* Overlay for mobile dropdowns to close when clicking outside */}
            {profileDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default AdminDashboard;
