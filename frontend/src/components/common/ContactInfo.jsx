import React from 'react';

const ContactInfo = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-blue-900" />
            </div>
            <div>
                <div className="font-semibold text-slate-900">{label}</div>
                <div className="text-slate-600">{value}</div>
            </div>
        </div>
    );
};

export default ContactInfo;
