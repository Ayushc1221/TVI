import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, UserCheck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { clientApi } from '../../services';

const ClientLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await clientApi.login(formData);

            if (response.success) {
                // Store token and client info
                localStorage.setItem('client_token', response.data.token);
                localStorage.setItem('client_user', JSON.stringify(response.data.client));

                // Redirect to client dashboard
                navigate('/client/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

            <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    {/* Logo */}
                    <div className="mx-auto w-16 h-16 bg-indigo-800 rounded-2xl flex items-center justify-center">
                        <UserCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-900">
                            Client Portal Login
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Track your application and download certificates
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Registered Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Registered Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter your phone number (Password)"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-indigo-800 hover:bg-indigo-700 text-white text-lg font-medium"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verifying...
                                </div>
                            ) : (
                                'Access My Dashboard'
                            )}
                        </Button>
                    </form>

                    {/* Back to Website */}
                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-sm text-slate-600 hover:text-indigo-800 transition-colors"
                        >
                            ← Back to Website
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientLogin;
