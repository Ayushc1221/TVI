import React from 'react';
import { Badge } from '../ui/badge';

const SectionHeader = ({
    badge,
    title,
    subtitle,
    centered = true,
    className = ''
}) => {
    return (
        <div className={`${centered ? 'text-center' : ''} mb-16 ${className}`}>
            {badge && (
                <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-200 border-0 mb-4">
                    {badge}
                </Badge>
            )}
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;
