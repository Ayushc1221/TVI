import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Calendar,
    ChevronDown,
} from 'lucide-react';

// eslint-disable-next-line react/prop-types
const Payments = ({ onViewApplication }) => {
    const getPaymentBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">Paid</span>;
            case 'Pending': return <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Pending</span>;
            case 'Failed': return <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Failed</span>;
            default: return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">{status}</span>;
        }
    };

    const paymentsList = [
        { payId: 'PAY-8923Z9X', appId: 'APP-2023-001', company: 'Tech Corp India', service: 'ISO Certification', amount: '₹ 25,000.00', method: 'Razorpay', status: 'Paid', date: '21 Oct 2023' },
        { payId: 'PAY-1123P4Q', appId: 'APP-2023-002', company: 'Global Exports', service: 'Audit', amount: '₹ 15,000.00', method: 'UPI', status: 'Paid', date: '19 Oct 2023' },
        { payId: 'PAY-9045K8M', appId: 'APP-2023-003', company: 'Sunrise Manufacturing', service: 'HRAA', amount: '₹ 30,000.00', method: 'Card', status: 'Pending', date: '15 Oct 2023' },
        { payId: 'PAY-8821L6J', appId: 'APP-2023-004', company: 'Apex IT Solutions', service: 'ISO Certification', amount: '₹ 25,000.00', method: 'Razorpay', status: 'Failed', date: '12 Oct 2023' },
        { payId: 'PAY-5532N9L', appId: 'APP-2023-005', company: 'Dynamic Logistics', service: 'Audit', amount: '₹ 15,000.00', method: 'UPI', status: 'Paid', date: '10 Oct 2023' },
        { payId: 'PAY-7711B3Y', appId: 'APP-2023-006', company: 'Vertex Solutions', service: 'ISO Certification', amount: '₹ 25,000.00', method: 'Card', status: 'Paid', date: '08 Oct 2023' },
    ];

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Payment ID or App ID..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mr-2 hidden sm:flex">
                        <Filter className="w-4 h-4" /> FILTERS
                    </div>
                    <select className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none">
                        <option>All Services</option>
                        <option>ISO Certification</option>
                        <option>Audit / Inspection</option>
                        <option>HRAA</option>
                    </select>
                    <select className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer flex-1 sm:flex-none">
                        <option>All Status</option>
                        <option>Paid</option>
                        <option>Pending</option>
                        <option>Failed</option>
                    </select>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 font-medium shadow-sm cursor-pointer hover:bg-slate-50">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>Date Range</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 font-semibold">
                                <th className="px-6 py-4 whitespace-nowrap">Payment ID</th>
                                <th className="px-6 py-4 whitespace-nowrap">App ID</th>
                                <th className="px-6 py-4 whitespace-nowrap">Company Name</th>
                                <th className="px-6 py-4 whitespace-nowrap">Service Type</th>
                                <th className="px-6 py-4 whitespace-nowrap">Amount</th>
                                <th className="px-6 py-4 whitespace-nowrap">Method</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paymentsList.map((payment) => (
                                <tr key={payment.payId} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{payment.payId}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-blue-600 whitespace-nowrap">{payment.appId}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">{payment.company}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{payment.service}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{payment.amount}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{payment.method}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getPaymentBadge(payment.status)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{payment.date}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <button
                                            onClick={() => onViewApplication(payment.appId)}
                                            className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                                        >
                                            <Eye className="w-4 h-4 mr-1.5" /> View App
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Box */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">Showing 1 to 6 of 842 entries</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm transition-colors">1</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors">2</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors">3</button>
                        <span className="text-slate-400">...</span>
                        <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
