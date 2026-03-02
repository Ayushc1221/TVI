import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, UploadCloud, FileText, ChevronRight, Shield, ScrollText, Users } from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const SERVICES = [
    {
        id: 'iso',
        title: 'ISO Certification',
        desc: 'Get certified for ISO 9001, 14001, 27001, and other international standards.',
        icon: Shield,
        color: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'audit',
        title: 'Audit / Inspection Services',
        desc: 'Comprehensive internal, external, and compliance audit & inspection services.',
        icon: ScrollText,
        color: 'from-emerald-500 to-teal-600',
    },
    {
        id: 'hraa',
        title: 'HRAA',
        desc: 'Human Resource Assessment & Audit for your organization.',
        icon: Users,
        color: 'from-orange-500 to-red-600',
    },
];

const ISO_STANDARDS = [
    'ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 27001', 'ISO 22000',
    'ISO 20000-1', 'ISO 50001', 'ISO 22301', 'ISO 37001', 'ISO 21001'
];

const AUDIT_CATEGORIES = [
    'Internal Audit', 'External Audit', 'Supplier Audit', 'Factory Audit',
    'Safety Audit', 'Fire Safety Audit', 'Energy Audit', 'Compliance Audit',
    'Process Audit', 'Pre-shipment Inspection', 'In-process Inspection',
    'Final Inspection', 'Quality Inspection', 'Site Inspection'
];

const Application = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Company Details
        companyName: '',
        businessType: '',
        industryType: '',
        companyAddress: '',
        city: '',
        state: '',
        country: 'India',
        pinCode: '',
        gstNumber: '',
        companyWebsite: '',

        // Step 2: Contact Person
        contactName: '',
        designation: '',
        email: '',
        mobile: '',
        alternateMobile: '',

        // Step 3: ISO Specific
        isoStandards: [],
        numEmployees: '',
        scopeOfBusiness: '',
        certificationDuration: '',
        existingIso: '',

        // Step 3: Audit Specific
        auditServiceType: '',
        auditCategories: [],
        siteLocation: '',
        numLocations: '',
        preferredMode: '',
        tentativeDate: '',

        // Step 3: HRAA Specific
        hraaType: '',
        hraaEmployees: '',
        payrollManaged: '',
        hrPolicies: '',
        labourLawCompliance: '',

        // Step 4: Documents (storing file object or name)
        docs: {},

        // Step 5: Payment
        paymentMethod: '',
        termsAgreed: false,
    });

    const [errors, setErrors] = useState({});

    // Dynamic fee calculation
    const calculateFee = () => {
        if (selectedService === 'iso') {
            return formData.isoStandards.length > 1 ? 8999 : 4999;
        } else if (selectedService === 'audit') {
            return formData.auditServiceType === 'Inspection' ? 5499 : 6999;
        } else if (selectedService === 'hraa') {
            return 7499;
        }
        return 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleMultiSelect = (field, value) => {
        setFormData(prev => {
            const currentList = prev[field] || [];
            if (currentList.includes(value)) {
                return { ...prev, [field]: currentList.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...currentList, value] };
            }
        });
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleFileChange = (field, file) => {
        if (!file) return;
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            alert("Only PDF or JPG formats are allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB");
            return;
        }
        setFormData(prev => ({
            ...prev,
            docs: { ...prev.docs, [field]: file }
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateStep = () => {
        const newErrors = {};
        let isValid = true;

        if (currentStep === 1) {
            const req1 = ['companyName', 'businessType', 'industryType', 'companyAddress', 'city', 'state', 'country', 'pinCode'];
            req1.forEach(f => {
                if (!formData[f] || !String(formData[f]).trim()) {
                    newErrors[f] = 'Required';
                    isValid = false;
                }
            });
        }
        if (currentStep === 2) {
            const req2 = ['contactName', 'designation', 'email', 'mobile'];
            req2.forEach(f => {
                if (!formData[f] || !String(formData[f]).trim()) {
                    newErrors[f] = 'Required';
                    isValid = false;
                }
            });
        }
        if (currentStep === 3) {
            if (selectedService === 'iso') {
                const reqIso = ['numEmployees', 'scopeOfBusiness', 'certificationDuration', 'existingIso'];
                reqIso.forEach(f => {
                    if (!formData[f] || !String(formData[f]).trim()) {
                        newErrors[f] = 'Required';
                        isValid = false;
                    }
                });
                if (formData.isoStandards.length === 0) {
                    newErrors.isoStandards = 'Select at least one standard';
                    isValid = false;
                }
            } else if (selectedService === 'audit') {
                const reqAudit = ['auditServiceType', 'siteLocation', 'numLocations', 'preferredMode', 'tentativeDate'];
                reqAudit.forEach(f => {
                    if (!formData[f] || !String(formData[f]).trim()) {
                        newErrors[f] = 'Required';
                        isValid = false;
                    }
                });
                if (formData.auditCategories.length === 0) {
                    newErrors.auditCategories = 'Select at least one category';
                    isValid = false;
                }
            } else if (selectedService === 'hraa') {
                const reqHraa = ['hraaType', 'hraaEmployees', 'payrollManaged', 'hrPolicies', 'labourLawCompliance'];
                reqHraa.forEach(f => {
                    if (!formData[f] || !String(formData[f]).trim()) {
                        newErrors[f] = 'Required';
                        isValid = false;
                    }
                });
            }
        }
        if (currentStep === 4) {
            const reqDocsIso = ['companyRegCert', 'addressProof'];
            const reqDocsAudit = ['companyRegCert', 'siteAddressProof'];
            const reqDocsHraa = ['companyRegCert'];

            let toCheck = [];
            if (selectedService === 'iso') toCheck = reqDocsIso;
            else if (selectedService === 'audit') toCheck = reqDocsAudit;
            else if (selectedService === 'hraa') toCheck = reqDocsHraa;

            toCheck.forEach(f => {
                if (!formData.docs[f]) {
                    newErrors[f] = 'Document Required';
                    isValid = false;
                }
            });
        }
        if (currentStep === 5) {
            if (!formData.paymentMethod) {
                newErrors.paymentMethod = 'Required';
                isValid = false;
            }
            if (!formData.termsAgreed) {
                newErrors.termsAgreed = 'You must agree to terms';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = () => {
        if (validateStep()) {
            console.log("Submitted Data: ", formData);
            alert("Application Submitted Successfully!");
            // Reset or Redirect logic here
            setSelectedService(null);
            setCurrentStep(1);
        }
    };

    const renderServiceSelection = () => (
        <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <Badge className="bg-blue-100 text-blue-900 border-0 mb-4 px-4 py-1 text-sm font-semibold rounded-full">Application Portal</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Select Service to Apply</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">Choose the certification or audit service you need, and follow our streamlined 5-step process.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {SERVICES.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.id}
                            onClick={() => setSelectedService(s.id)}
                            className="bg-white border rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group flex flex-col h-full"
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                <Icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                            <p className="text-slate-600 flex-grow mb-8 leading-relaxed">
                                {s.desc}
                            </p>
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white group-hover:bg-blue-600 transition-colors">
                                Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderStepper = () => (
        <div className="mb-12">
            <div className="flex justify-between items-center relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
                <div className="absolute left-0 top-1/2 h-1 bg-blue-600 -z-10 transform -translate-y-1/2 transition-all duration-500" style={{ width: `${((currentStep - 1) / 4) * 100}%` }}></div>

                {[1, 2, 3, 4, 5].map(step => (
                    <div key={step} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep > step ? 'bg-blue-600 text-white' :
                            currentStep === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                                'bg-white text-slate-400 border-2 border-slate-200'
                            }`}>
                            {currentStep > step ? <CheckCircle2 size={20} /> : step}
                        </div>
                        <span className={`text-xs mt-3 font-medium hidden sm:block ${currentStep >= step ? 'text-blue-900' : 'text-slate-400'}`}>
                            {step === 1 ? 'Company' : step === 2 ? 'Contact' : step === 3 ? 'Details' : step === 4 ? 'Documents' : 'Payment'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInput = (label, field, type = "text", required = false, options = {}) => {
        const error = errors[field];
        return (
            <div className="mb-6 flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {type === 'textarea' ? (
                    <textarea
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`}
                        rows={4}
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        placeholder={options.placeholder}
                    />
                ) : type === 'select' ? (
                    <select
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`}
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                    >
                        <option value="">Select option</option>
                        {options.list?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : (
                    <input
                        type={type}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`}
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        placeholder={options.placeholder}
                        disabled={options.disabled}
                    />
                )}
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        );
    };

    const renderRadioGroup = (label, field, opts, required = true) => {
        const error = errors[field];
        return (
            <div className="mb-6 flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex gap-4 flex-wrap">
                    {opts.map(opt => (
                        <label key={opt} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData[field] === opt ? 'bg-blue-50 border-blue-600 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}>
                            <input
                                type="radio"
                                name={field}
                                value={opt}
                                checked={formData[field] === opt}
                                onChange={(e) => handleInputChange(field, e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-slate-700 font-medium">{opt}</span>
                        </label>
                    ))}
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        );
    };

    const renderFileUpload = (label, field, required = false) => {
        const error = errors[field];
        return (
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${error ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-blue-500 bg-slate-50'}`}>
                    <UploadCloud className={`mx-auto w-10 h-10 mb-3 ${error ? 'text-red-400' : 'text-slate-400'}`} />
                    <p className="text-sm text-slate-600 mb-2">Drag & drop or click to upload</p>
                    <p className="text-xs text-slate-400 mb-4">Max 5MB (PDF or JPG only)</p>
                    <input
                        type="file"
                        accept=".pdf, .jpg, .jpeg"
                        onChange={(e) => handleFileChange(field, e.target.files[0])}
                        className="hidden"
                        id={`file-${field}`}
                    />
                    <label htmlFor={`file-${field}`} className="inline-block px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer shadow-sm hover:bg-slate-50">
                        {formData.docs[field] ? 'Change File' : 'Browse Files'}
                    </label>
                    {formData.docs[field] && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50 py-2 px-3 rounded-lg w-max mx-auto border border-emerald-100">
                            <FileText size={16} /> {formData.docs[field].name}
                        </div>
                    )}
                </div>
                {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24 pb-12">
                {!selectedService ? renderServiceSelection() : (
                    <div className="max-w-4xl mx-auto px-4 md:px-0">
                        <div className="mb-8">
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to go back? All entered data will be lost.")) {
                                        setSelectedService(null);
                                        setCurrentStep(1);
                                    }
                                }}
                                className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors mt-2"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="bg-blue-900 text-white px-8 py-6">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    {SERVICES.find(s => s.id === selectedService)?.title} Application
                                </h2>
                                <p className="text-blue-200 mt-2 text-sm">Please fill out all the required details to proceed with your application.</p>
                            </div>

                            <div className="p-8 md:p-12">
                                {renderStepper()}

                                {/* FORM CONTENT */}
                                <div className="space-y-6">
                                    {/* STEP 1 */}
                                    {currentStep === 1 && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Company Details</h3>
                                            <div className="grid md:grid-cols-2 gap-x-6">
                                                <div className="md:col-span-2">
                                                    {renderInput('Company Name', 'companyName', 'text', true)}
                                                </div>
                                                {renderInput('Business Type', 'businessType', 'select', true, { list: ['Pvt Ltd', 'LLP', 'Proprietorship', 'Partnership', 'Other'] })}
                                                {renderInput('Industry Type', 'industryType', 'select', true, { list: ['Manufacturing', 'IT', 'Service', 'Trading', 'Healthcare', 'Education', 'Other'] })}
                                                <div className="md:col-span-2">
                                                    {renderInput('Company Address', 'companyAddress', 'textarea', true)}
                                                </div>
                                                {renderInput('City', 'city', 'text', true)}
                                                {renderInput('State', 'state', 'text', true)}
                                                {renderInput('Country', 'country', 'text', true)}
                                                {renderInput('PIN Code', 'pinCode', 'number', true)}
                                                {renderInput('GST Number', 'gstNumber', 'text', false)}
                                                {renderInput('Company Website', 'companyWebsite', 'text', false)}
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2 */}
                                    {currentStep === 2 && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Contact Person Details</h3>
                                            <div className="grid md:grid-cols-2 gap-x-6">
                                                {renderInput('Contact Person Name', 'contactName', 'text', true)}
                                                {renderInput('Designation', 'designation', 'text', true)}
                                                <div className="md:col-span-2">
                                                    {renderInput('Email Address', 'email', 'email', true)}
                                                </div>
                                                {renderInput('Mobile Number', 'mobile', 'number', true)}
                                                {renderInput('Alternate Mobile', 'alternateMobile', 'number', false)}
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3 */}
                                    {currentStep === 3 && selectedService === 'iso' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">ISO Service Details</h3>

                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                                    ISO Standard(s) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {ISO_STANDARDS.map(std => (
                                                        <label key={std} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${formData.isoStandards.includes(std) ? 'bg-blue-50 border-blue-500' : 'hover:border-blue-200'}`}>
                                                            <input
                                                                type="checkbox"
                                                                className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                                checked={formData.isoStandards.includes(std)}
                                                                onChange={() => handleMultiSelect('isoStandards', std)}
                                                            />
                                                            <span className="text-sm font-medium text-slate-700">{std}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.isoStandards && <p className="text-red-500 text-sm mt-2">{errors.isoStandards}</p>}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-x-6">
                                                {renderInput('Number of Employees', 'numEmployees', 'number', true)}
                                                <div className="hidden md:block"></div>
                                                <div className="md:col-span-2">
                                                    {renderInput('Scope of Business', 'scopeOfBusiness', 'textarea', true)}
                                                </div>
                                                {renderRadioGroup('Certification Duration', 'certificationDuration', ['1 Year', '3 Years'])}
                                                {renderRadioGroup('Existing ISO Certification?', 'existingIso', ['Yes', 'No'])}
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && selectedService === 'audit' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Audit / Inspection Details</h3>

                                            {renderRadioGroup('Service Type', 'auditServiceType', ['Audit', 'Inspection'])}

                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                                    Audit / Inspection Category <span className="text-red-500">*</span>
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {AUDIT_CATEGORIES.map(cat => (
                                                        <label key={cat} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${formData.auditCategories.includes(cat) ? 'bg-blue-50 border-blue-500' : 'hover:border-blue-200'}`}>
                                                            <input
                                                                type="checkbox"
                                                                className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                                checked={formData.auditCategories.includes(cat)}
                                                                onChange={() => handleMultiSelect('auditCategories', cat)}
                                                            />
                                                            <span className="text-sm font-medium text-slate-700">{cat}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.auditCategories && <p className="text-red-500 text-sm mt-2">{errors.auditCategories}</p>}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-x-6">
                                                <div className="md:col-span-2">
                                                    {renderInput('Site Location', 'siteLocation', 'textarea', true)}
                                                </div>
                                                {renderInput('Number of Locations', 'numLocations', 'number', true)}
                                                {renderInput('Tentative Audit / Inspection Date', 'tentativeDate', 'date', true)}
                                                {renderRadioGroup('Preferred Mode', 'preferredMode', ['On-site', 'Remote'])}
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && selectedService === 'hraa' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">HRAA Service Details</h3>

                                            <div className="grid md:grid-cols-2 gap-x-6">
                                                <div className="md:col-span-2">
                                                    {renderInput('HRAA Type', 'hraaType', 'select', true, {
                                                        list: [
                                                            'HR Compliance Audit', 'HR Policy Audit', 'Payroll Audit',
                                                            'Labour Law Compliance Audit', 'HR Process Assessment',
                                                            'Skill & Competency Assessment', 'HR Documentation Audit'
                                                        ]
                                                    })}
                                                </div>
                                                {renderInput('Total Employees', 'hraaEmployees', 'number', true)}
                                                <div className="hidden md:block"></div>
                                                {renderRadioGroup('Payroll Managed In-house?', 'payrollManaged', ['Yes', 'No'])}
                                                {renderRadioGroup('HR Policies Available?', 'hrPolicies', ['Yes', 'No'])}
                                                <div className="md:col-span-2">
                                                    {renderInput('Labour Law Compliance Status', 'labourLawCompliance', 'select', true, { list: ['Fully Compliant', 'Partially Compliant', 'Need Assistance'] })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 4 */}
                                    {currentStep === 4 && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Document Uploads</h3>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                {selectedService === 'iso' && (
                                                    <>
                                                        {renderFileUpload('Company Registration Certificate', 'companyRegCert', true)}
                                                        {renderFileUpload('Address Proof', 'addressProof', true)}
                                                        {renderFileUpload('GST Certificate', 'gstCert', false)}
                                                        {renderFileUpload('Previous ISO Certificate', 'prevIsoCert', false)}
                                                    </>
                                                )}
                                                {selectedService === 'audit' && (
                                                    <>
                                                        {renderFileUpload('Company Registration Certificate', 'companyRegCert', true)}
                                                        {renderFileUpload('Site Address Proof / Layout', 'siteAddressProof', true)}
                                                        {renderFileUpload('Previous Audit Report', 'prevAuditReport', false)}
                                                    </>
                                                )}
                                                {selectedService === 'hraa' && (
                                                    <>
                                                        {renderFileUpload('Company Registration Certificate', 'companyRegCert', true)}
                                                        {renderFileUpload('HR Policy Documents', 'hrPolicyDocs', false)}
                                                        {renderFileUpload('Payroll Sample', 'payrollSample', false)}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 5 */}
                                    {currentStep === 5 && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Payment & Declaration</h3>

                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                                                <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Service Fee Summary</p>
                                                <div className="flex items-end gap-2">
                                                    <span className="text-4xl font-extrabold text-slate-900">₹{calculateFee()}</span>
                                                    <span className="text-slate-500 font-medium mb-1">inclusive of all taxes</span>
                                                </div>
                                            </div>

                                            {renderRadioGroup('Payment Method', 'paymentMethod', ['Razorpay', 'UPI', 'Card'])}

                                            <div className="mt-8">
                                                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer bg-slate-50 transition-all ${errors.termsAgreed ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                                                    <input
                                                        type="checkbox"
                                                        className="mt-1 w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                        checked={formData.termsAgreed}
                                                        onChange={(e) => {
                                                            setFormData(p => ({ ...p, termsAgreed: e.target.checked }));
                                                            if (errors.termsAgreed) setErrors(p => ({ ...p, termsAgreed: null }));
                                                        }}
                                                    />
                                                    <div>
                                                        <span className="text-slate-700 font-semibold block mb-1">I agree to the Terms & Conditions <span className="text-red-500">*</span></span>
                                                        <p className="text-sm text-slate-500">I declare that the information provided is true and correct to the best of my knowledge and belief.</p>
                                                    </div>
                                                </label>
                                                {errors.termsAgreed && <p className="text-red-500 text-sm mt-2 font-medium">{errors.termsAgreed}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* NAVIGATION BUTTONS */}
                                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                                    {currentStep > 1 ? (
                                        <Button variant="outline" onClick={handlePrev} className="px-6 py-6 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold">
                                            Previous Step
                                        </Button>
                                    ) : (
                                        <div></div>
                                    )}

                                    {currentStep < 5 ? (
                                        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                                            Proceed Next Step <ChevronRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    ) : (
                                        <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-lg">
                                            Submit & Pay
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Application;
