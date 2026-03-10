import { useState, useEffect } from 'react';
import { QrCode, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

const VerificationSection = () => {
    const [certificateId, setCertificateId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Auto-detect cert number from QR code URL (?cert=...)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const certParam = params.get('cert');
        if (certParam) {
            setCertificateId(certParam);
            // Auto-trigger verification
            (async () => {
                setLoading(true);
                setVerificationResult(null);
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const response = await fetch(`${apiUrl}/certificates/verify/${certParam}`);
                    const data = await response.json();
                    if (data.success) {
                        setVerificationResult({ ...data.data, valid: true });
                    } else {
                        setVerificationResult({ valid: false });
                    }
                } catch (error) {
                    console.error('Auto-verification error:', error);
                    setVerificationResult({ valid: false });
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, []);

    const handleVerification = async (e) => {
        e.preventDefault();
        if (!certificateId.trim()) return;

        setLoading(true);
        setVerificationResult(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/certificates/verify/${certificateId}`);
            const data = await response.json();

            if (data.success) {
                setVerificationResult({ ...data.data, valid: true });
            } else {
                setVerificationResult({ valid: false });
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationResult({ valid: false });
        } finally {
            setLoading(false);
        }
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
                            disabled={loading || !certificateId.trim()}
                            className="bg-white text-blue-900 hover:bg-slate-100 px-8 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </Button>
                    </div>
                </form>

                {/* Verification Result */}
                {verificationResult && (
                    <Card className="mt-8 bg-white/10 backdrop-blur-lg border-white/20">
                        <CardContent className="pt-6">
                            {verificationResult.valid ? (
                                <div className="text-left space-y-4">
                                    <div className="flex items-center gap-2 text-green-400 text-xl font-bold bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                                        <CheckCircle className="w-6 h-6" />
                                        Certificate Verified
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-900/40 p-5 rounded-xl border border-white/10">
                                        <div className="space-y-1">
                                            <div className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Company Name</div>
                                            <div className="text-white text-lg font-bold">{verificationResult.companyName}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Certification</div>
                                            <div className="text-white text-lg font-bold">{verificationResult.certificationType}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Certificate Number</div>
                                            <div className="text-white font-medium">{verificationResult.certificateNumber}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Status</div>
                                            <div className={`font-medium ${verificationResult.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{verificationResult.status}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Issue Date</div>
                                            <div className="text-white font-medium">{new Date(verificationResult.issueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Expiry Date</div>
                                            <div className="text-white font-medium">{new Date(verificationResult.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                                    <div className="inline-flex items-center gap-2 text-red-400 text-xl font-bold mb-2">
                                        Certificate Not Found <span role="img" aria-label="cross">❌</span>
                                    </div>
                                    <p className="text-slate-300">The certificate ID you entered does not exist in our records.</p>
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
