import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Footer = () => {
    const footerLinks = {
        services: [
            { href: '#services', label: 'Inspection' },
            { href: '#services', label: 'Audit' },
            { href: '#services', label: 'Certification' },
            { href: '#services', label: 'Hygiene Rating' },
        ],
        company: [
            { href: '#about', label: 'About Us' },
            { href: '#industries', label: 'Industries' },
            { href: '#verification', label: 'Verify Certificate' },
            { href: '#contact', label: 'Contact' },
        ],
        legal: [
            { href: '#', label: 'Privacy Policy' },
            { href: '#', label: 'Terms of Service' },
            { href: '#', label: 'Accreditations' },
        ],
    };

    return (
        <footer className="bg-slate-900 text-white py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src="/Tech_Vimal_International.webp"
                                alt="Tech Vimal International Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <div>
                                <h3 className="font-bold">Tech Vimal</h3>
                                <p className="text-xs text-slate-400">International Certification</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Building India's most trusted inspection & certification ecosystem.
                        </p>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Services</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {footerLinks.services.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Tech Vimal International Inspection & Certification Pvt. Ltd. All rights reserved.</p>
                    <Link to="/admin/login" className="flex items-center gap-2 hover:text-white transition-colors opacity-50 hover:opacity-100" title="Admin Login">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs">Admin Login</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
