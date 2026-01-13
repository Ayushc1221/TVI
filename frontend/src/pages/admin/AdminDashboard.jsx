import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    LogOut,
    Menu,
    X,
    User,
    Mail,
    Phone,
    Building,
    Clock,
    CheckCircle,
    Eye,
    Archive,
    Trash2,
    Search,
    Filter,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    Users,
    MessageCircle,
    TrendingUp
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { dashboardApi, contactApi, authApi } from '../../services';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        page: 1,
    });

    // Get admin info
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Fetch contacts when filters change
    useEffect(() => {
        if (activeTab === 'contacts') {
            fetchContacts();
        }
    }, [activeTab, filters]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const response = await dashboardApi.getStats();
            if (response.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            if (error.message?.includes('401')) {
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const params = {
                page: filters.page,
                limit: 10,
                ...(filters.status !== 'all' && { status: filters.status }),
                ...(filters.search && { search: filters.search }),
            };
            const response = await contactApi.getAll(params);
            if (response.success) {
                setContacts(response.data.contacts);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (contactId, newStatus) => {
        try {
            await contactApi.updateStatus(contactId, { status: newStatus });
            fetchContacts();
            if (selectedContact?._id === contactId) {
                setSelectedContact(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async (contactId) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;

        try {
            await contactApi.delete(contactId);
            fetchContacts();
            if (selectedContact?._id === contactId) {
                setSelectedContact(null);
            }
        } catch (error) {
            console.error('Failed to delete contact:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin/login');
    };

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            read: 'bg-yellow-100 text-yellow-800',
            replied: 'bg-green-100 text-green-800',
            archived: 'bg-slate-100 text-slate-800',
        };
        return colors[status] || colors.new;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Sidebar Menu Items
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'contacts', label: 'Contact Messages', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3">
                            <img
                                src="/Tech_Vimal_International.webp"
                                alt="Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <span className="font-bold text-white">TVI Admin</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Menu */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* User & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3 mb-4 px-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">{adminUser.name || 'Admin'}</p>
                                <p className="text-slate-400 text-xs">{adminUser.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ${!sidebarOpen && 'justify-center'
                            }`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                    <h1 className="text-xl font-bold text-slate-900">
                        {activeTab === 'dashboard' ? 'Dashboard Overview' : 'Contact Messages'}
                    </h1>
                    <Button
                        onClick={() => activeTab === 'dashboard' ? fetchDashboardData() : fetchContacts()}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </header>

                {/* Content */}
                <div className="p-6">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="border-0 shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-600">Total Contacts</p>
                                                <p className="text-3xl font-bold text-slate-900">
                                                    {stats?.totalContacts || 0}
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <Users className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-600">New Messages</p>
                                                <p className="text-3xl font-bold text-blue-600">
                                                    {stats?.newContacts || 0}
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <MessageCircle className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-600">This Week</p>
                                                <p className="text-3xl font-bold text-green-600">
                                                    {stats?.weeklyContacts || 0}
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                <TrendingUp className="w-6 h-6 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-600">This Month</p>
                                                <p className="text-3xl font-bold text-purple-600">
                                                    {stats?.monthlyContacts || 0}
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                                <BarChart3 className="w-6 h-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Status Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card className="border-l-4 border-l-blue-500">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <span className="text-slate-600">New</span>
                                        <Badge className="bg-blue-100 text-blue-800">{stats?.newContacts || 0}</Badge>
                                    </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-yellow-500">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <span className="text-slate-600">Read</span>
                                        <Badge className="bg-yellow-100 text-yellow-800">{stats?.readContacts || 0}</Badge>
                                    </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-green-500">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <span className="text-slate-600">Replied</span>
                                        <Badge className="bg-green-100 text-green-800">{stats?.repliedContacts || 0}</Badge>
                                    </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-slate-500">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <span className="text-slate-600">Archived</span>
                                        <Badge className="bg-slate-100 text-slate-800">{stats?.archivedContacts || 0}</Badge>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4">
                                        <Button
                                            onClick={() => setActiveTab('contacts')}
                                            className="bg-blue-900 hover:bg-blue-800"
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            View All Messages
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, status: 'new' }));
                                                setActiveTab('contacts');
                                            }}
                                            variant="outline"
                                        >
                                            View New Messages ({stats?.newContacts || 0})
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Contacts Tab */}
                    {activeTab === 'contacts' && (
                        <div className="space-y-6">
                            {/* Filters */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex-1 min-w-[200px]">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input
                                                    placeholder="Search by name, email, company..."
                                                    value={filters.search}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <Select
                                            value={filters.status}
                                            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}
                                        >
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="new">New</SelectItem>
                                                <SelectItem value="read">Read</SelectItem>
                                                <SelectItem value="replied">Replied</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contacts List */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* List */}
                                <div className="lg:col-span-2 space-y-4">
                                    {isLoading ? (
                                        <Card className="p-8 text-center">
                                            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                            <p className="mt-4 text-slate-600">Loading contacts...</p>
                                        </Card>
                                    ) : contacts.length === 0 ? (
                                        <Card className="p-8 text-center">
                                            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                                            <p className="mt-4 text-slate-600">No contacts found</p>
                                        </Card>
                                    ) : (
                                        contacts.map((contact) => (
                                            <Card
                                                key={contact._id}
                                                className={`cursor-pointer transition-all hover:shadow-md ${selectedContact?._id === contact._id ? 'ring-2 ring-blue-500' : ''
                                                    }`}
                                                onClick={() => setSelectedContact(contact)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold text-slate-900">{contact.name}</h3>
                                                                <Badge className={getStatusColor(contact.status)}>
                                                                    {contact.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-slate-600">{contact.email}</p>
                                                            {contact.company && (
                                                                <p className="text-sm text-slate-500">{contact.company}</p>
                                                            )}
                                                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                                                {contact.message}
                                                            </p>
                                                        </div>
                                                        <div className="text-right text-xs text-slate-400">
                                                            {formatDate(contact.createdAt)}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}

                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-600">
                                                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} items)
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={pagination.currentPage === 1}
                                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={pagination.currentPage === pagination.totalPages}
                                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Detail View */}
                                <div className="lg:col-span-1">
                                    {selectedContact ? (
                                        <Card className="sticky top-6">
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle>Contact Details</CardTitle>
                                                    <Badge className={getStatusColor(selectedContact.status)}>
                                                        {selectedContact.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{selectedContact.name}</p>
                                                        <p className="text-sm text-slate-500">Contact</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="w-4 h-4 text-slate-400" />
                                                        <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                                                            {selectedContact.email}
                                                        </a>
                                                    </div>
                                                    {selectedContact.phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-4 h-4 text-slate-400" />
                                                            <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                                                                {selectedContact.phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {selectedContact.company && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Building className="w-4 h-4 text-slate-400" />
                                                            <span>{selectedContact.company}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        <span>{formatDate(selectedContact.createdAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="border-t pt-4">
                                                    <p className="text-sm font-medium text-slate-700 mb-2">Message:</p>
                                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                                        {selectedContact.message}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="border-t pt-4 space-y-3">
                                                    <p className="text-sm font-medium text-slate-700 mb-2">Update Status:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant={selectedContact.status === 'read' ? 'default' : 'outline'}
                                                            onClick={() => handleStatusChange(selectedContact._id, 'read')}
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            Read
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant={selectedContact.status === 'replied' ? 'default' : 'outline'}
                                                            onClick={() => handleStatusChange(selectedContact._id, 'replied')}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Replied
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant={selectedContact.status === 'archived' ? 'default' : 'outline'}
                                                            onClick={() => handleStatusChange(selectedContact._id, 'archived')}
                                                        >
                                                            <Archive className="w-4 h-4 mr-1" />
                                                            Archive
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="w-full"
                                                        onClick={() => handleDelete(selectedContact._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete Contact
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="p-8 text-center">
                                            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                                            <p className="mt-4 text-slate-600">Select a contact to view details</p>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
