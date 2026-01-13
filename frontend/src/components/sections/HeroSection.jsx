import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const HeroSection = () => {
    return (
        <section id="home" className="pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50 -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-200 border-0">
                            India's Most Trusted Certification Body
                        </Badge>

                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                            Business Beyond Certification.
                            <span className="block text-blue-900 mt-2">
                                Into Compliance Excellence
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 leading-relaxed">
                            Technology-enabled inspection, audit, and certification services for MSMEs, exporters, and manufacturers across India.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-blue-900 hover:bg-blue-800 text-white text-lg px-8 py-6"
                            >
                                Request Certification
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-blue-900 text-blue-900 hover:bg-blue-50 text-lg px-8 py-6"
                            >
                                View Services
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent rounded-3xl blur-3xl" />
                        <img
                            src="https://images.unsplash.com/photo-1748255882537-cbe88b145305"
                            alt="Quality Inspection"
                            className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
