import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { SectionHeader } from '../common';
import { mockData } from '../../utils/mockData';

const IndustriesSection = () => {
    return (
        <section id="industries" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    badge="Industries We Serve"
                    title="Tailored Solutions for Every Sector"
                />

                {/* Industries Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockData.industries.map((industry, index) => (
                        <Card
                            key={index}
                            className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-slate-200 hover:border-blue-900"
                        >
                            <CardHeader>
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                    {industry.icon}
                                </div>
                                <CardTitle className="text-lg">{industry.name}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default IndustriesSection;
