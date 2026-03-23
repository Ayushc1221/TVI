import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Briefcase, GraduationCap, FileText, CheckCircle2, 
    UploadCloud, ShieldCheck, MapPin, Building2 
} from 'lucide-react';
import { Navbar, Footer } from '../../components/layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { auditorApi } from '../../services';

const ISO_STANDARDS = [
    'ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 50001', 'ISO 27001', 'ISO 22000'
];

const AUDIT_CATEGORIES = [
    'Internal Audit', 'External Audit', 'Supplier Audit', 'Factory Audit',
    'Safety Audit', 'Fire Safety Audit', 'Energy Audit', 'Compliance Audit'
];

const AuditorRegistration = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Text Data
    const [formData, setFormData] = useState({
        fullName: '', dob: '', gender: 'Male', email: '', phone: '',
        city: '', state: '', country: '',
        degree: '', fieldOfStudy: '', university: '', yearOfPassing: '',
        certType: '', certNumber: '', issuingBody: '', issueDate: '', expiryDate: '',
        totalYears: '', currentOrg: '', designation: '', industry: '', auditsConducted: '',
        auditType: '', declaration: false
    });

    // Array Data
    const [selectedStandards, setSelectedStandards] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);

    // File Data
    const [files, setFiles] = useState({
        profilePhoto: null,
        educationCertificate: null,
        isoCertificate: null,
        idProof: null,
        resume: null,
        experienceLetters: null,
        pastAuditReports: null
    });

    const handleTextChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files: FileList } = e.target;
        if (FileList.length > 0) {
            setFiles(prev => ({ ...prev, [name]: FileList[0] }));
        }
    };

    const toggleArrayItem = (setter, item, currentArray) => {
        setter(prev => 
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.declaration) {
            alert('Please accept the declaration to proceed.');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            
            // Append Text Data
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            // Append Arrays
            submitData.append('isoStandards', JSON.stringify(selectedStandards));
            submitData.append('industries', JSON.stringify(selectedIndustries));

            // Append Files
            Object.keys(files).forEach(key => {
                if (files[key]) {
                    submitData.append(key, files[key]);
                }
            });

            const response = await auditorApi.register(submitData);

            if (response.success) {
                setIsSuccess(true);
                window.scrollTo(0, 0);
            } else {
                alert(response.message || 'Failed to submit registration');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center shadow-xl border border-slate-100">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
                        <p className="text-slate-600 mb-8">
                            Thank you for applying to become an auditor with Tech Vimal International. 
                            Our administration team will review your application and get back to you shortly.
                        </p>
                        <Button onClick={() => navigate('/')} className="w-full">
                            Return to Home
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
            <Navbar />
            
            <div className="flex-1 max-w-4xl w-full mx-auto p-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Register as an Auditor</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Join our global network of certified professionals. Please provide your details, qualifications, and experience to apply for an auditor role.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* section 1: Personal Info */}
                    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Personal Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Full Name *</label>
                                <Input required name="fullName" value={formData.fullName} onChange={handleTextChange} placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address *</label>
                                <Input required type="email" name="email" value={formData.email} onChange={handleTextChange} placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Phone Number *</label>
                                <Input required type="tel" name="phone" value={formData.phone} onChange={handleTextChange} placeholder="+91 9876543210" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Date of Birth *</label>
                                <Input required type="date" name="dob" value={formData.dob} onChange={handleTextChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Gender *</label>
                                <select required name="gender" value={formData.gender} onChange={handleTextChange} className="w-full flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><MapPin className="w-4 h-4"/> Address *</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input required name="city" value={formData.city} onChange={handleTextChange} placeholder="City" />
                                    <Input required name="state" value={formData.state} onChange={handleTextChange} placeholder="State" />
                                    <Input required name="country" value={formData.country} onChange={handleTextChange} placeholder="Country" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* section 2: Education */}
                    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Educational Qualifications</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Highest Degree *</label>
                                <Input required name="degree" value={formData.degree} onChange={handleTextChange} placeholder="e.g. B.Tech, MBA" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Field of Study *</label>
                                <Input required name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleTextChange} placeholder="e.g. Mechanical Engineering" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">University/Institute Name *</label>
                                <Input required name="university" value={formData.university} onChange={handleTextChange} placeholder="e.g. Delhi University" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Year of Passing *</label>
                                <Input required type="number" name="yearOfPassing" value={formData.yearOfPassing} onChange={handleTextChange} placeholder="YYYY" />
                            </div>
                        </div>
                    </section>

                    {/* section 3: Certification */}
                    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">ISO Auditor Certification Details</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Certification Type *</label>
                                <Input required name="certType" value={formData.certType} onChange={handleTextChange} placeholder="e.g. Lead Auditor ISO 9001" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Certification Number *</label>
                                <Input required name="certNumber" value={formData.certNumber} onChange={handleTextChange} placeholder="Certificate ID" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Issuing Body *</label>
                                <Input required name="issuingBody" value={formData.issuingBody} onChange={handleTextChange} placeholder="e.g. IRCA, CQI" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Issue Date *</label>
                                    <Input required type="date" name="issueDate" value={formData.issueDate} onChange={handleTextChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Expiry Date *</label>
                                    <Input required type="date" name="expiryDate" value={formData.expiryDate} onChange={handleTextChange} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* section 4: Experience */}
                    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Work Experience & Expertise</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Total Years of Experience *</label>
                                <Input required type="number" name="totalYears" value={formData.totalYears} onChange={handleTextChange} placeholder="e.g. 5" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Building2 className="w-4 h-4"/> Current Organization</label>
                                <Input name="currentOrg" value={formData.currentOrg} onChange={handleTextChange} placeholder="Optional" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Designation</label>
                                <Input name="designation" value={formData.designation} onChange={handleTextChange} placeholder="e.g. Senior Auditor" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Primary Industry/Sector *</label>
                                <Input required name="industry" value={formData.industry} onChange={handleTextChange} placeholder="e.g. Manufacturing, IT" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Audits Conducted Previously</label>
                                <Input type="number" name="auditsConducted" value={formData.auditsConducted} onChange={handleTextChange} placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Primary Audit Type *</label>
                                <select required name="auditType" value={formData.auditType} onChange={handleTextChange} className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500">
                                    <option value="" disabled>Select Core Audit Type</option>
                                    {AUDIT_CATEGORIES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-slate-700 block">Check ISO Standards you have expertise in:</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {ISO_STANDARDS.map(standard => (
                                    <label key={standard} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${selectedStandards.includes(standard) ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedStandards.includes(standard)}
                                            onChange={() => toggleArrayItem(setSelectedStandards, standard, selectedStandards)}
                                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium">{standard}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* section 5: Documents */}
                    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Documents Upload</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Government ID Proof *</label>
                                <span className="text-xs text-slate-500 block mb-3">Aadhar, Passport, or PAN (PDF/Image)</span>
                                <input required type="file" name="idProof" accept=".pdf,image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo</label>
                                <span className="text-xs text-slate-500 block mb-3">Professional Headshot (Image only)</span>
                                <input type="file" name="profilePhoto" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Resume / CV *</label>
                                <span className="text-xs text-slate-500 block mb-3">Updated detailed profile (PDF)</span>
                                <input required type="file" name="resume" accept=".pdf" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Highest Education Certificate *</label>
                                <span className="text-xs text-slate-500 block mb-3">Proof of top degree (PDF/Image)</span>
                                <input required type="file" name="educationCertificate" accept=".pdf,image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Auditor Certification *</label>
                                <span className="text-xs text-slate-500 block mb-3">Lead Auditor or related certificate (PDF/Image)</span>
                                <input required type="file" name="isoCertificate" accept=".pdf,image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Letters & Past Reports</label>
                                <span className="text-xs text-slate-500 block mb-3">Optional but recommended (PDF Zip)</span>
                                <input type="file" name="experienceLetters" accept=".pdf,.zip" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                        </div>
                    </section>

                    {/* Final Actions */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                        <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <input 
                                required
                                type="checkbox" 
                                name="declaration"
                                checked={formData.declaration}
                                onChange={handleTextChange}
                                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <div className="space-y-1 text-sm">
                                <span className="block font-semibold text-slate-800">Declaration & Terms</span>
                                <span className="block text-slate-600">I hereby declare that all the information and documents provided are true and accurate to the best of my knowledge. I agree to the terms and conditions of Tech Vimal International.</span>
                            </div>
                        </label>
                        
                        <div className="mt-6 flex justify-end">
                            <Button type="submit" disabled={isSubmitting || !formData.declaration} className="px-8 py-6 text-lg w-full md:w-auto">
                                {isSubmitting ? 'Submitting Application...' : 'Submit Auditor Application'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default AuditorRegistration;
