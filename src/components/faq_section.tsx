'use client';

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    appName: string;
    faqItems: FAQItem[];
}

export default function FAQSection({ appName, faqItems }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="mb-4 bg-white rounded-lg shadow-sm p-6 md:p-10 text-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions (FAQ)
            </h1>
            <p className="mb-6">
                Common questions about buying and selling second-hand items and communicating safely on {appName}.
            </p>

            <div className="space-y-4">
                {faqItems.map((item, idx) => {
                    const isOpen = openIndex === idx;

                    return (
                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq(idx)}
                                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-900 font-medium bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                                {item.question}
                                <ChevronDown
                                    className={`w-5 h-5 text-red-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                                />
                            </button>

                            <div
                                ref={el => { contentRefs.current[idx] = el; }}
                                style={{
                                    height: isOpen
                                        ? contentRefs.current[idx]?.scrollHeight
                                            ? `${contentRefs.current[idx]?.scrollHeight}px`
                                            : 'auto'
                                        : 0,
                                }}
                                className="px-4 overflow-hidden transition-[height] duration-300 ease-in-out"
                            >
                                <p className="py-3 text-gray-700">{item.answer}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
