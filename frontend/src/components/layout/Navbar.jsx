import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { navbarConfig } from './navbar.config';

/**
 * Navbar Component
 * 
 * A fully customizable navigation bar.
 * All settings can be modified in navbar.config.js
 * 
 * @param {Object} props - Optional prop overrides
 * @param {Object} props.logo - Override logo settings
 * @param {Array} props.navLinks - Override navigation links
 * @param {Object} props.ctaButton - Override CTA button settings
 */
const Navbar = ({
    logo = navbarConfig.logo,
    brand = navbarConfig.brand,
    navLinks = navbarConfig.navLinks,
    ctaButton = navbarConfig.ctaButton,
    styles = navbarConfig.styles,
}) => {
    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 ${styles.background} ${styles.borderBottom}`}
        >
            <div className={`max-w-7xl mx-auto px-6 ${styles.height}`}>
                <div className="flex items-center justify-between">
                    {/* Logo & Brand */}
                    <a href="#home" className="flex items-center space-x-3">
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            style={{
                                width: `${logo.width}px`,
                                height: `${logo.height}px`
                            }}
                            className="object-cover"
                        />
                        {brand.show && (
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">{brand.title}</h1>
                                <p className="text-xs text-slate-600">{brand.subtitle}</p>
                            </div>
                        )}
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`${styles.linkColor} ${styles.linkHoverColor} font-medium transition-colors`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA Button */}
                    {ctaButton.show && (
                        <a href={ctaButton.href}>
                            <Button className={`${styles.buttonBg} ${styles.buttonText}`}>
                                {ctaButton.text}
                            </Button>
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
