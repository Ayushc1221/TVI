import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion';
import { SectionHeader } from '../common';
import { mockData } from '../../utils/mockData';

const FAQSection = () => {
    return (
        <section className="py-20 px-6 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <SectionHeader
                    badge="FAQ"
                    title="Frequently Asked Questions"
                />

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible className="space-y-4">
                    {mockData.faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="bg-white rounded-xl border-2 border-slate-200 px-6"
                        >
                            <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:text-blue-900">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 text-base leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default FAQSection;
