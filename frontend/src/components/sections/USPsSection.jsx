import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { mockData } from '../../utils/mockData';

const USPsSection = () => {
    return (
        <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Why Choose Tech Vimal?
                    </h2>
                    <p className="text-xl text-slate-300">
                        Our unique value propositions that set us apart
                    </p>
                </div>

                {/* USP Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {mockData.usps.map((usp, index) => (
                        <Card
                            key={index}
                            className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                        >
                            <CardHeader>
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    {usp.icon}
                                </div>
                                <CardTitle className="text-white text-lg">
                                    {usp.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">{usp.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default USPsSection;
