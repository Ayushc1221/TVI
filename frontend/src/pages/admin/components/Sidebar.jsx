/* eslint-disable react/prop-types */
import { Menu, X, Award } from 'lucide-react';
const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, menuItems, title }) => {
    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 transition-all duration-300 flex flex-col shadow-xl ${sidebarOpen ? 'w-64' : 'w-20'
                }`}
        >
            {/* Logo Area */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 shrink-0">
                {sidebarOpen && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 border border-slate-700 bg-white/5 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                                src="/Tech_Vimal_International.webp"
                                alt="TVI Logo"
                                className="w-full h-full object-contain p-1"
                            />
                        </div>
                        <span className="font-bold text-white whitespace-nowrap">{title || 'TVI Admin'}</span>
                    </div>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ${!sidebarOpen && 'mx-auto'}`}
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${activeTab === item.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        title={!sidebarOpen ? item.label : ''}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
