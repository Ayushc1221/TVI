import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { SectionHeader } from '../common';
import { mockData } from '../../utils/mockData';

const ServicesSection = () => {
    return (
        <section id="services" className="py-20 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    badge="Our Services"
                    title="Comprehensive Compliance Solutions"
                    subtitle="From inspection to certification, we provide end-to-end compliance services tailored to your business needs"
                />

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {mockData.services.map((service, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white"
                        >
                            {/* Service Image */}
                            <div className="overflow-hidden rounded-t-xl">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>

                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                                    {service.icon}
                                </div>
                                <CardTitle className="text-xl text-slate-900">
                                    {service.title}
                                </CardTitle>
                                <CardDescription className="text-slate-600">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <Button
                                    variant="link"
                                    className="text-blue-900 p-0 group-hover:gap-2 transition-all"
                                >
                                    Learn More
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
