import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutFooter.jsx";
import { Helmet } from "react-helmet";

const TermsAndConditions = () => {
    return (
        <AuthenticatedLayout>
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <Head title="Terms and Conditions" />

            {/* The main container with Tailwind classes for layout */}
            <div className="font-montserrat text-white px-4 md:px-8 py-8 max-w-6xl mx-auto">
                <h1 className="font-bold text-3xl md:text-5xl text-center mb-8">
                    Terms and Conditions
                </h1>

                {/* Main content sections with space between them */}
                <div className="space-y-6">
                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Account:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            The MSL Philippines website allows you to log in using your Google account and access the MSL Guide. This access is exclusively for MLBB Student Leaders only. Players may only use the website for registration and content viewing purposes.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Assets:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            The MSL Philippines website is the property of MSL Philippines. Unauthorized use of graphic designs and content and posing them as your own is strictly prohibited.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Country:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            MSL Philippines is an organization that mainly caters to MLBB Student Leaders and gamers residing in the Philippines. Users located outside the Philippines may not have access to all website features.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Device:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            The MSL Philippines website is available on desktop and mobile devices. However, certain website features may not be available on all devices.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Feedback:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            MSL Philippines welcomes user feedback, including reviews, innovations, and suggestions. Please contact us through our email at contact@moontonslph.org.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Website:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            Contents of this website may only be accessed on the official MSL Philippines website link and the official MSL Philippines Facebook page. Any unauthorized reproduction or distribution of website content is strictly prohibited.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">User Conduct:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            Users of the MSL Philippines website must comply with all applicable laws and regulations. Users are prohibited from using the website for any illegal or unauthorized purpose, including but not limited to the following:
                        </p>
                        <ul className="list-disc list-inside mt-2 font-medium leading-relaxed">
                            <li>Interfering with the security or integrity of the website</li>
                            <li>Modifying or altering any content on the website</li>
                            <li>Impersonating another person or entity</li>
                            <li>Collecting the personal information of other users without their consent</li>
                            <li>Engaging in any activity that may harm or disrupt the website or its users</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Limitation of Liability:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            MSL Philippines is not liable for any damages or losses incurred by website users, including but not limited to direct, indirect, or consequential damages arising from the use or inability to use the website or its content.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Modification of Terms:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            MSL Philippines reserves the right to modify these Terms and Conditions at any time. Users are responsible for regularly reviewing these Terms and Conditions to stay informed of any changes.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Intellectual Property:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            All trademarks, service marks, trade names, logos, and other intellectual property rights used on the MSL Philippines website are owned by MSL Philippines or its licensors. Users may not use these marks without the prior written permission of MSL Philippines.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Indemnification:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            Users agree to indemnify and hold MSL Philippines and its affiliates, officers, agents, and employees harmless from any claim or demand, including reasonable attorneys' fees, arising out of or related to their use of the website, violation of these Terms and Conditions, or infringement of any intellectual property or other rights of any person or entity.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Governing Law and Dispute Resolution:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            These Terms and Conditions shall be governed by and construed in accordance with the laws of the Philippines. Any dispute arising from or related to the use of the MSL Philippines website shall be resolved through arbitration in accordance with the rules of the Philippine Dispute Resolution Center, Inc.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-xl md:text-2xl mb-2">Entire Agreement:</h2>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            These Terms and Conditions constitute the entire agreement between MSL Philippines and website users and supersede all prior agreements or understandings, whether written or oral.
                        </p>
                    </div>

                    <div>
                        <p className="font-medium leading-relaxed text-justify max-w-6xl">
                            If you have any questions or concerns about these Terms and Conditions, please contact us at contact@moontonslph.org.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TermsAndConditions;