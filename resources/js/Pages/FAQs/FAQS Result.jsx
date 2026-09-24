import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Header, Footer } from '@/Components';
import { Search, ChevronDown } from 'lucide-react';

const FAQsResult = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [openFAQs, setOpenFAQs] = useState({});

    const categories = ['ALL', 'Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum'];

    const faqData = [
        {
            category: 'Lorem Ipsum',
            icon: '/images/FAQs/megaphone 1.png',
            questions: [
                {
                    id: 1,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 2,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 3,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 4,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 5,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                }
            ]
        },
        {
            category: 'Lorem Ipsum',
            icon: '/images/FAQs/megaphone 1.png',
            questions: [
                {
                    id: 6,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 7,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 8,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 9,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 10,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                }
            ]
        },
        {
            category: 'Lorem Ipsum',
            icon: '/images/FAQs/megaphone 1.png',
            questions: [
                {
                    id: 11,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 12,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 13,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 14,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                },
                {
                    id: 15,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
                    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae interdum aliquam, felis arcu varius nisl, ut convallis nibh metus id metus. Maecenas at lectus orci. Proin sit amet lorem risque. Pellentesque habitant.'
                }
            ]
        }
    ];

    const toggleFAQ = (id) => {
        setOpenFAQs(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredFAQs = faqData.filter(section => 
        selectedCategory === 'ALL' || section.category === selectedCategory
    );

    return (
        <>
            <Head title="FAQs - MSL Philippines" />
            <div className="min-h-screen bg-black text-white" style={{
                backgroundImage: "url('/images/FAQs/Main BG.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}>
                <Header />

                {/* Hero Section with Search - Full Width */}
                <div 
                    className="w-full h-[200px] md:h-[250px] relative overflow-hidden"
                    style={{
                        backgroundImage: "url('/images/FAQs/SearchBG.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Left Character - Esmeralda - Mobile */}
                    <img 
                        src="/images/FAQs/Esmeralda Astral Muse Allstars 2024 render 1.png"
                        alt="Esmeralda"
                        className="absolute h-[100%] w-auto object-contain opacity-30 md:hidden"
                        style={{ maxWidth: '75%', left: '-20%', bottom: '-13%' }}
                    />
                    {/* Left Character - Esmeralda - Desktop */}
                    <img 
                        src="/images/FAQs/Esmeralda Astral Muse Allstars 2024 render 1.png"
                        alt="Esmeralda"
                        className="hidden md:block absolute left-0 bottom-0 h-[120%] w-auto object-contain"
                        style={{ maxWidth: '35%' }}
                    />
                    
                    {/* Right Character - Silvanna - Mobile */}
                    <img 
                        src="/images/FAQs/silvanaa classroom charm render (1) 1.png"
                        alt="Silvanna"
                        className="absolute h-[100%] w-auto object-contain opacity-30 md:hidden"
                        style={{ maxWidth: '75%', right: '-10%', bottom: '-13%' }}
                    />
                    {/* Right Character - Silvanna - Desktop */}
                    <img 
                        src="/images/FAQs/silvanaa classroom charm render (1) 1.png"
                        alt="Silvanna"
                        className="hidden md:block absolute right-0 bottom-0 h-[120%] w-auto object-contain"
                        style={{ maxWidth: '35%' }}
                    />

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
                        <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 font-['Montserrat'] tracking-wider">
                            HOW CAN WE HELP?
                        </h1>
                        
                        {/* Search Bar */}
                        <div className="w-full max-w-2xl relative">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Diamond Compensation"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-['Space Grotesk']"
                                />
                            </div>
                            <p className="text-xs md:text-sm text-black mt-2 text-center font-['Space Grotesk']">
                                Popular topics: <span className="underline">Diamonds</span>, <span className="underline">MCC</span>, <span className="underline">Compensation</span>, <span className="underline">Tournament</span>
                            </p>
                        </div>
                    </div>
                </div>

                <main className="relative z-10 pt-8 pb-20 px-4 md:px-8 lg:px-16">

                    {/* Category Pills */}
                    <div className="max-w-7xl mx-auto mb-8 px-4">
                        <div className="flex flex-wrap gap-3 justify-start">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-2 rounded-full font-['Montserrat'] font-medium transition-all duration-300 ${
                                        selectedCategory === category
                                            ? 'bg-yellow-400 text-black'
                                            : 'bg-neutral-800 text-white hover:bg-neutral-700'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Sections */}
                    <div className="max-w-7xl mx-auto space-y-12 px-4">
                        {filteredFAQs.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="py-2.5 bg-neutral-950/60 rounded-[20px] inline-flex flex-col justify-center items-start w-full">
                                {/* Section Header */}
                                <div className="px-3 inline-flex justify-center items-end overflow-hidden">
                                    <div className="text-center justify-start text-white text-2xl font-bold font-['Montserrat'] leading-7">
                                        {section.category}
                                    </div>
                                </div>

                                {/* Questions */}
                                <div className="p-2.5 flex flex-col justify-start items-center gap-3.5 overflow-hidden w-full">
                                    {section.questions.map((faq) => (
                                        <div
                                            key={faq.id}
                                            className="self-stretch p-2.5 flex flex-col justify-start items-start gap-2.5 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleFAQ(faq.id)}
                                                className="w-full min-h-[32px] flex justify-start items-start gap-2.5 hover:opacity-80 transition-opacity py-1"
                                            >
                                                <ChevronDown
                                                    className={`flex-shrink-0 text-yellow-400 transition-transform duration-300 mt-0.5 ${
                                                        openFAQs[faq.id] ? 'rotate-180' : 'rotate-0'
                                                    }`}
                                                    size={20}
                                                />
                                                <img src={section.icon} alt="Icon" className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1 justify-start text-white text-sm md:text-base font-medium font-['Montserrat'] leading-snug text-left break-words">
                                                    {faq.question}
                                                </div>
                                            </button>

                                            {/* Answer */}
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${
                                                    openFAQs[faq.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="self-stretch justify-start text-white text-base font-medium font-['Montserrat'] leading-snug pb-2.5">
                                                    {faq.answer}
                                                </div>
                                            </div>

                                            {/* Yellow divider line */}
                                            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-yellow-400"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA Section */}
                    <div className="max-w-7xl mx-auto mt-16 flex justify-center px-4">
                        <div className="py-3.5 rounded-[20px] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                            <div className="w-full md:w-[495px] px-2.5 inline-flex justify-start items-start">
                                <div className="w-16 h-20 inline-flex flex-col justify-center items-center gap-2.5 flex-shrink-0">
                                    <img className="w-16 h-16 object-contain" src="/images/FAQs/customer-service (1) 1.png" alt="Customer Service" />
                                </div>
                                <div className="flex-1 md:w-[549px] inline-flex flex-col justify-start items-start gap-0">
                                    <div className="px-2.5 py-1 inline-flex justify-start items-start gap-2 overflow-hidden">
                                        <div className="justify-start text-neutral-100 text-2xl font-bold font-['Montserrat'] leading-loose">
                                            Solve your issue
                                        </div>
                                    </div>
                                    <div className="px-3 py-0 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                                        <div className="w-full md:w-[462px] justify-start">
                                            <span className="text-neutral-100 text-base font-medium font-['Montserrat'] leading-snug">Need help fast? </span>
                                            <a 
                                                href="mailto:contact@moontonslph.org"
                                                className="text-neutral-100 text-base font-medium font-['Montserrat'] underline leading-snug hover:text-yellow-400 transition-colors"
                                            >
                                                Send us an email.
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default FAQsResult;

