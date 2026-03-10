import React from 'react';
import { Navbar, Footer } from '../components/layout';
import VerificationSection from '../components/sections/VerificationSection';

const VerifyPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-16">
                <VerificationSection />
            </main>
            <Footer />
        </div>
    );
};

export default VerifyPage;
