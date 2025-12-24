'use client';

import React, { useState } from "react";
import PrimaryBtn from "@/components/primary_btn";
import { MailCheckIcon } from "lucide-react";

interface ContactFormProps {
    appName: string;
    contactEmail: string;
}

export default function ContactForm({ appName, contactEmail }: ContactFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Encode subject and body for mailto
        const subject = encodeURIComponent(`Contact Form Message from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

        // Open user's email client
        window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    };

    return (
        <section className="bg-white rounded-lg shadow-sm p-6 md:p-10 text-gray-700 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
            <p className="mb-6">
                Have questions or need assistance? Send us a message and we will get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <PrimaryBtn
                    icon={MailCheckIcon}
                    title="Send Message"
                    type="submit"
                    ariaLabel={`Send message to ${appName}`}
                />

                <p className="text-gray-500 mt-2 text-sm">
                    This will open your default email client to send the message directly.
                </p>
            </form>
        </section>
    );
}
