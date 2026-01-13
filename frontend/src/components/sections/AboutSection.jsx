import React from 'react';
import { Badge } from '../ui/badge';

const AboutSection = () => {
    const stats = [
        { value: '500+', label: 'Certified Clients' },
        { value: '15+', label: 'Industries Served' },
        { value: '99.8%', label: 'Client Satisfaction' },
    ];

    return (
        <section id="about" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                        <Badge className="bg-blue-100 text-blue-900 mb-4">About Us</Badge>

                        <h2 className="text-4xl font-bold text-slate-900 mb-6">
                            Building India's Most Trusted Inspection & Certification Ecosystem
                        </h2>

                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Tech Vimal International Inspection & Certification Pvt. Ltd. is a technology-enabled, compliance-focused entity dedicated to serving MSMEs, startups, exporters, and manufacturers across India.
                        </p>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            We combine trust, integrity, and innovation to deliver certification services that create measurable business impact. Our mission is to transform compliance from a checkbox exercise into a strategic advantage.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-6">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center p-4 bg-blue-50 rounded-xl">
                                    <div className="text-3xl font-bold text-blue-900 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Images Grid */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="https://images.pexels.com/photos/8201183/pexels-photo-8201183.jpeg"
                                alt="Inspection"
                                className="rounded-2xl shadow-xl object-cover h-64"
                            />
                            <img
                                src="https://images.pexels.com/photos/5778658/pexels-photo-5778658.jpeg"
                                alt="Audit"
                                className="rounded-2xl shadow-xl object-cover h-64 mt-8"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
