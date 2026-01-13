/**
 * Navbar Configuration
 * 
 * This file contains all customizable settings for the Navbar component.
 * Modify values here to change navbar appearance without touching component code.
 */

export const navbarConfig = {
    // Logo Settings
    logo: {
        src: '/Tech_Vimal_International.webp',
        alt: 'Tech Vimal International Logo',
        width: 96,    // Logo width in pixels (adjust as needed: 40, 48, 56, 64)
        height: 96,   // Logo height in pixels
    },

    // Brand Text (optional - set to null to hide)
    brand: {
        show: false,  // Set to true to show brand text next to logo
        title: 'Tech Vimal',
        subtitle: 'International Certification',
    },

    // Navigation Links
    navLinks: [
        { href: '#home', label: 'Home' },
        { href: '#about', label: 'About' },
        { href: '#services', label: 'Services' },
        { href: '#industries', label: 'Industries' },
        { href: '#verification', label: 'Verify Certificate' },
        { href: '#contact', label: 'Contact' },
    ],

    // CTA Button
    ctaButton: {
        show: true,
        text: 'Get Started',
        href: '#contact',
    },

    // Navbar Styling
    styles: {
        height: '',           // Vertical padding: py-2, py-3, py-4, py-5
        background: 'bg-white/95 backdrop-blur-md',
        borderBottom: 'border-b border-slate-200',
        linkColor: 'text-slate-700',
        linkHoverColor: 'hover:text-blue-900',
        buttonBg: 'bg-blue-900 hover:bg-blue-800',
        buttonText: 'text-white',
    },
};
