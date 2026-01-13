import React from 'react';
import { 
  BarChart, 
  Wifi, 
  Calendar, 
  CreditCard, 
  QrCode,
  CheckCircle,
  ClipboardCheck,
  Award,
  Star,
  Factory,
  ShoppingCart,
  Building,
  Utensils,
  Pill,
  Car,
  Shirt,
  Package
} from 'lucide-react';

export const mockData = {
  usps: [
    {
      icon: <BarChart className="w-7 h-7 text-white" />,
      title: "Measurable Business Impact",
      description: "Certification that drives real business results and growth"
    },
    {
      icon: <Wifi className="w-7 h-7 text-white" />,
      title: "Live Digital Dashboard",
      description: "Track your compliance status in real-time from anywhere"
    },
    {
      icon: <Calendar className="w-7 h-7 text-white" />,
      title: "Hybrid & Remote Audits",
      description: "Minimize downtime with flexible audit scheduling"
    },
    {
      icon: <CreditCard className="w-7 h-7 text-white" />,
      title: "Subscription Model",
      description: "Affordable, predictable pricing for continuous compliance"
    },
    {
      icon: <QrCode className="w-7 h-7 text-white" />,
      title: "QR Verification",
      description: "Public verification system - zero fake certificates"
    }
  ],

  services: [
    {
      icon: <ClipboardCheck className="w-6 h-6 text-white" />,
      title: "Third-Party Inspection",
      description: "Comprehensive on-site inspections ensuring quality standards and regulatory compliance",
      image: "https://images.pexels.com/photos/8201183/pexels-photo-8201183.jpeg"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      title: "Audit Services",
      description: "Thorough assessment of processes, systems, and operations for continuous improvement",
      image: "https://images.pexels.com/photos/5778658/pexels-photo-5778658.jpeg"
    },
    {
      icon: <Award className="w-6 h-6 text-white" />,
      title: "ISO Certification",
      description: "Complete ISO certification services from gap analysis to final certification",
      image: "https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg"
    },
    {
      icon: <Star className="w-6 h-6 text-white" />,
      title: "Hygiene Rating",
      description: "Food safety and hygiene rating services for hospitality and food businesses",
      image: "https://images.pexels.com/photos/257703/pexels-photo-257703.jpeg"
    }
  ],

  industries: [
    {
      icon: <Factory className="w-7 h-7 text-blue-900" />,
      name: "Manufacturing"
    },
    {
      icon: <ShoppingCart className="w-7 h-7 text-blue-900" />,
      name: "Export & Trade"
    },
    {
      icon: <Building className="w-7 h-7 text-blue-900" />,
      name: "Construction"
    },
    {
      icon: <Utensils className="w-7 h-7 text-blue-900" />,
      name: "Food & Beverage"
    },
    {
      icon: <Pill className="w-7 h-7 text-blue-900" />,
      name: "Pharmaceuticals"
    },
    {
      icon: <Car className="w-7 h-7 text-blue-900" />,
      name: "Automotive"
    },
    {
      icon: <Shirt className="w-7 h-7 text-blue-900" />,
      name: "Textiles & Apparel"
    },
    {
      icon: <Package className="w-7 h-7 text-blue-900" />,
      name: "Packaging"
    }
  ],

  certificates: [
    {
      id: "CERT-2024-001",
      company: "ABC Manufacturing Pvt. Ltd.",
      standard: "ISO 9001:2015",
      issueDate: "2024-01-15",
      expiryDate: "2027-01-14",
      valid: true
    },
    {
      id: "CERT-2024-002",
      company: "XYZ Exports Ltd.",
      standard: "ISO 14001:2015",
      issueDate: "2024-02-20",
      expiryDate: "2027-02-19",
      valid: true
    },
    {
      id: "CERT-2024-003",
      company: "Global Foods Industries",
      standard: "HACCP Certification",
      issueDate: "2024-03-10",
      expiryDate: "2025-03-09",
      valid: true
    }
  ],

  faqs: [
    {
      question: "What is the certification process timeline?",
      answer: "The certification process typically takes 4-8 weeks depending on the standard and organization size. This includes gap analysis, documentation review, audit scheduling, on-site audit, and certificate issuance."
    },
    {
      question: "How does the digital compliance dashboard work?",
      answer: "Our digital dashboard provides real-time access to your certification status, audit schedules, compliance documents, and improvement recommendations. You can access it 24/7 from any device with secure login credentials."
    },
    {
      question: "What makes your QR verification unique?",
      answer: "Every certificate issued by Tech Vimal includes a unique QR code that can be scanned by anyone to verify authenticity instantly. This ensures complete transparency and eliminates fake certificates."
    },
    {
      question: "Do you offer remote audits?",
      answer: "Yes, we offer hybrid and fully remote audits using advanced video conferencing and document sharing technologies. This minimizes business disruption and reduces audit costs while maintaining audit quality."
    },
    {
      question: "What is the subscription-based compliance model?",
      answer: "Our subscription model provides continuous compliance support with regular check-ins, updates on regulatory changes, annual surveillance audits, and access to our digital dashboard - all for a predictable monthly fee."
    },
    {
      question: "Which industries do you serve?",
      answer: "We serve a wide range of industries including manufacturing, export & trade, construction, food & beverage, pharmaceuticals, automotive, textiles, and packaging. Our services are tailored to meet specific industry requirements."
    }
  ]
};
