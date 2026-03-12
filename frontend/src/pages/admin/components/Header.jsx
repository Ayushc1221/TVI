/* eslint-disable react/prop-types */
import { Search, Bell, ChevronDown, Settings, LogOut } from 'lucide-react';
const Header = ({ activeTab, profileDropdownOpen, setProfileDropdownOpen, adminUser, handleLogout, setActiveTab }) => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
            {/* Header Left */}
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-slate-800 capitalize hidden sm:block">
                    {activeTab.replace('-', ' ')}
                </h1>
            </div>

            {/* Header Right */}
            <div className="flex items-center gap-2 sm:gap-4">

                {/* Notifications */}
                {/* <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button> */}

                <div className="h-8 w-px bg-slate-200 mx-2"></div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 focus:outline-none"
                    >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                            {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="font-semibold text-sm text-slate-700 leading-tight">{adminUser.name || 'Admin'}</p>
                            <p className="text-xs text-slate-500 leading-tight border-none">Administrator</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                    </button>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 flex flex-col z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-3 border-b border-slate-100 md:hidden">
                                <p className="font-semibold text-sm text-slate-700">{adminUser.name || 'Admin'}</p>
                                <p className="text-xs text-slate-500 truncate">{adminUser.email}</p>
                            </div>
                            <button
                                className="text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                            >
                                <Settings className="w-4 h-4" /> Account Settings
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Explicit Logout Button */}
                <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;
