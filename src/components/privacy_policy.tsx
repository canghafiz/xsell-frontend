export default function PrivacyPolicy() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "XSELL";
    const contactEmail =
        process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@example.com";

    return (
        <section className="mb-4 bg-white rounded-lg shadow-sm p-6 md:p-10 text-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Privacy Policy
            </h1>

            <p className="mb-2 text-sm text-gray-500">
                Effective Date: {new Date().toLocaleDateString("id-ID")}
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Your privacy is important to us
            </h2>
            <p className="mb-4">
                At <strong>{appName}</strong>, we are committed to protecting the privacy
                of our users. This Privacy Policy explains what information we collect,
                how we use it, and how we keep it safe.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Information We Collect
            </h2>
            <p className="mb-4">
                We collect information from you when you create an account, place an
                order, subscribe to updates, or fill out forms on our platform.
                This may include your name, email address, phone number, profile
                information, and payment-related details.
            </p>
            <p className="mb-4">
                We also collect non-personal information such as pages visited,
                products viewed, and interactions on {appName}. This data may be
                collected using cookies and similar tracking technologies.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To provide, operate, and improve our services</li>
                {/*<li>To process transactions and provide customer support</li>*/}
                <li>To personalize your experience on {appName}</li>
                <li>To send service-related notifications and promotional offers</li>
                <li>To maintain security and prevent fraud</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                How We Protect Your Information
            </h2>
            <p className="mb-4">
                We take reasonable technical and organizational measures to protect
                your personal data, including encryption, access control, and secure
                infrastructure. Access to personal information is limited to authorized
                personnel only.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Links to External Sites
            </h2>
            <p className="mb-4">
                Our platform may contain links to third-party websites or services.
                We do not control and are not responsible for the privacy practices
                or content of those third-party sites. We encourage you to review
                their privacy policies before providing any information.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Privacy Policy Updates
            </h2>
            <p className="mb-4">
                {appName} reserves the right to update this Privacy Policy at any time.
                Any changes will be posted on this page and the effective date will
                be updated accordingly.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Contact Us
            </h2>
            <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us
                at{" "}
                <a
                    href={`mailto:${contactEmail}`}
                    className="text-red-600 underline"
                >
                    {contactEmail}
                </a>.
            </p>
        </section>
    );
}
