import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutFooter.jsx";
import { Helmet } from "react-helmet";

const PrivacyPolicy = () => {
    return (
        <AuthenticatedLayout>
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <Head title="Privacy Policy" />

            {/* Main container */}
            <div className="font-montserrat text-white px-4 md:px-8 py-8 max-w-6xl mx-auto">
                <h1 className="font-bold text-3xl md:text-5xl text-center mb-8">
                    Privacy Policy
                </h1>

                {/* Sections */}
                <div className="space-y-6">
                    <div>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            Moonton Student Leaders Philippines (MSL PH) values your privacy and is committed to protecting your personal information. 
                            This privacy policy explains how we collect, use, and disclose your data concerning participating in our events and activities.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Information We Collect:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            MSL PH collects personal information when you register for our events and activities. This may include your name, email address, phone number, 
                            school name, and other information you provide to us.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">How We Use Your Information:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            MSL PH uses your personal information to communicate with you about our events and activities, send you updates, and provide you with rewards or incentives. 
                            We may also use your data for our research and analysis.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Disclosure of Your Information:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            MSL PH will not disclose your personal information to third parties without your consent, except as required by law or as necessary to provide you with the services you have requested. 
                            We may disclose your personal information to our service providers, who assist us in organizing events and activities.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Security of Your Information:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            MSL PH takes reasonable steps to protect your personal information from unauthorized access, use, or disclosure. 
                            We have implemented appropriate physical, technical, and administrative safeguards to secure your personal information.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Your Rights:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            You have the right to access, correct, or delete your personal information held by MSL PH. 
                            You can also withdraw your consent to collecting and using your data at any time by contacting us at 
                            <span className="font-semibold"> contact@moontonslph.org</span>.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Changes to this Privacy Policy:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            MSL PH may update this privacy policy from time to time to reflect changes in our practices or to comply with legal requirements. 
                            We encourage you to review this policy periodically.
                        </p>
                    </div>

                    <div>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            If you have any questions or concerns about our privacy policy, please contact us at 
                            <span className="font-semibold"> contact@moontonslph.org</span>.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default PrivacyPolicy;