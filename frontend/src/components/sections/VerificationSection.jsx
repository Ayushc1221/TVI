import React, { useState } from 'react';
import { QrCode, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { mockData } from '../../utils/mockData';

const VerificationSection = () => {
    const [certificateId, setCertificateId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

    const handleVerification = (e) => {
        e.preventDefault();
        const result = mockData.certificates.find(cert => cert.id === certificateId);
        setVerificationResult(result || { valid: false });
    };

    return (
        <section id="verification" className="py-20 px-6 bg-gradient-to-br from-blue-900 to-slate-900">
            <div className="max-w-4xl mx-auto text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl mb-6">
                    <QrCode className="w-10 h-10 text-white" />
                </div>

                {/* Header */}
                <h2 className="text-4xl font-bold text-white mb-4">
                    Verify Certificate Authenticity
                </h2>
                <p className="text-xl text-slate-300 mb-12">
                    Enter certificate ID or scan QR code to verify authenticity. Zero fake certificates guaranteed.
                </p>

                {/* Verification Form */}
                <form onSubmit={handleVerification} className="max-w-xl mx-auto">
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            placeholder="Enter Certificate ID (e.g., CERT-2024-001)"
                            value={certificateId}
                            onChange={(e) => setCertificateId(e.target.value)}
                            className="flex-1 h-14 text-lg bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-slate-400"
                        />
                        <Button
                            type="submit"
                            size="lg"
                            className="bg-white text-blue-900 hover:bg-slate-100 px-8"
                        >
                            Verify
                        </Button>
                    </div>
                </form>

                {/* Verification Result */}
                {verificationResult && (
                    <Card className="mt-8 bg-white/10 backdrop-blur-lg border-white/20">
                        <CardContent className="pt-6">
                            {verificationResult.valid !== false ? (
                                <div className="text-left space-y-3">
                                    <div className="flex items-center gap-2 text-green-400 text-lg font-semibold">
                                        <CheckCircle className="w-6 h-6" />
                                        Valid Certificate
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-white">
                                        <div>
                                            <div className="text-slate-400 text-sm">Company</div>
                                            <div className="font-medium">{verificationResult.company}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400 text-sm">Standard</div>
                                            <div className="font-medium">{verificationResult.standard}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400 text-sm">Issue Date</div>
                                            <div className="font-medium">{verificationResult.issueDate}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400 text-sm">Valid Until</div>
                                            <div className="font-medium">{verificationResult.expiryDate}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-red-400">
                                    <p className="text-lg font-semibold">Certificate not found or invalid</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
};

export default VerificationSection;
