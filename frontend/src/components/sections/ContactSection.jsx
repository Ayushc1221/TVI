import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ContactInfo } from '../common';
import { contactApi } from '../../services';

const ContactSection = () => {
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleInputChange = (field) => (e) => {
        setContactForm(prev => ({ ...prev, [field]: e.target.value }));
        // Clear status when user starts typing
        if (submitStatus) setSubmitStatus(null);
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await contactApi.submit(contactForm);

            if (response.success) {
                setSubmitStatus('success');
                setContactForm({ name: '', email: '', phone: '', company: '', message: '' });
            }
        } catch (error) {
            console.error('Contact submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactDetails = [
        { icon: Mail, label: 'Email', value: 'info@techvimal.com' },
        { icon: Phone, label: 'Phone', value: '+91 1234 567 890' },
        { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India' },
    ];

    return (
        <section id="contact" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <Badge className="bg-blue-100 text-blue-900 mb-4">Contact Us</Badge>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">Get in Touch</h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Ready to ensure compliance excellence? Our team is here to help you navigate the certification process.
                        </p>

                        <div className="space-y-6">
                            {contactDetails.map((detail) => (
                                <ContactInfo
                                    key={detail.label}
                                    icon={detail.icon}
                                    label={detail.label}
                                    value={detail.value}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="shadow-xl border-0">
                        <CardHeader>
                            <CardTitle className="text-2xl">Send us a Message</CardTitle>
                            <CardDescription>We'll get back to you within 24 hours</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Success Message */}
                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-800">Message Sent Successfully!</p>
                                        <p className="text-sm text-green-700">Thank you for contacting us. We'll get back to you soon.</p>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-800">Failed to Send Message</p>
                                        <p className="text-sm text-red-700">Please try again or contact us directly.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <Input
                                    placeholder="Your Name"
                                    value={contactForm.name}
                                    onChange={handleInputChange('name')}
                                    required
                                    disabled={isSubmitting}
                                    className="h-12"
                                />
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    value={contactForm.email}
                                    onChange={handleInputChange('email')}
                                    required
                                    disabled={isSubmitting}
                                    className="h-12"
                                />
                                <Input
                                    placeholder="Phone Number"
                                    value={contactForm.phone}
                                    onChange={handleInputChange('phone')}
                                    disabled={isSubmitting}
                                    className="h-12"
                                />
                                <Input
                                    placeholder="Company Name"
                                    value={contactForm.company}
                                    onChange={handleInputChange('company')}
                                    disabled={isSubmitting}
                                    className="h-12"
                                />
                                <Textarea
                                    placeholder="Your Message"
                                    value={contactForm.message}
                                    onChange={handleInputChange('message')}
                                    required
                                    disabled={isSubmitting}
                                    rows={4}
                                    className="resize-none"
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-900 hover:bg-blue-800 h-12 text-lg"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
