import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

import Sidebar from '../admin/components/Sidebar';
import Header from '../admin/components/Header';
import AuditorAssignedList from './components/AuditorAssignedList';

const AuditorDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    // Get auditor info
    const auditorUser = JSON.parse(localStorage.getItem('auditor_user') || '{"name": "Auditor", "email": "auditor@example.com"}');

    const handleLogout = () => {
        localStorage.removeItem('auditor_token');
        localStorage.removeItem('auditor_user');
        navigate('/auditor/login');
    };

    // Sidebar Menu Items for Auditor
    const menuItems = [
        { id: 'dashboard', label: 'My Assignments', icon: LayoutDashboard },
    ];

    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return <AuditorAssignedList />;
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                menuItems={menuItems}
                title="TVI Auditor"
            />

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Header */}
                <Header
                    activeTab={activeTab}
                    profileDropdownOpen={profileDropdownOpen}
                    setProfileDropdownOpen={setProfileDropdownOpen}
                    adminUser={auditorUser}
                    handleLogout={handleLogout}
                    setActiveTab={setActiveTab}
                    roleLabel="Auditor"
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

export default AuditorDashboard;
