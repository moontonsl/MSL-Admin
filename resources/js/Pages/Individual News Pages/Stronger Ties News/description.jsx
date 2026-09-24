import React from "react";

export default function MCCNewsIndividualPageColumnDescription() {
    return (
        <div className="flex flex-col gap-8">
            {/* Main Image */}
            <div className="w-full">
                <img
                    src="/images/MCC/IndivNews/image_3.jpg"
                    alt="Stronger Ties Partnership"
                    className="w-full h-auto rounded-lg object-cover max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-none"
                    onError={(e) => {
                        e.target.src = '/images/MCC/IndivNews/News - Holder.jpg';
                    }}
                />
            </div>
            
            {/* Article Content */}
            <div className="flex flex-col gap-6">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight font-montserrat">
                    Stronger Ties: Moonton Philippines, UMAK Seals Partnership
                </h1>
                
                {/* Subtitle */}
                <p className="text-sm md:text-base lg:text-xl text-gray-300 leading-relaxed font-montserrat">
                    Renewed and empowered – linkage has been created as University of Makati (UMaK) and Moonton Philippines
                    Technologies, Inc. ties close connection, pursuant to knowledge acquisition and innovation of
                    industry-university endeavors.
                </p>
                
                {/* Author and Date */}
                <p className="text-xs md:text-sm lg:text-base text-gray-400 italic font-montserrat">
                    By Nestor T. Quilop III • December 17, 2024
                </p>
                
                {/* Article Body */}
                <div className="text-xs md:text-sm lg:text-lg text-gray-200 leading-relaxed space-y-4 font-montserrat">                  
                    <p>
                        Through a memorandum of understanding (MOU) that was signed last November 27, 2024, both parties (UMaK and
                        Moonton) sealed great opportunities to secure outstanding partnership benefits with a promise of mutual
                        growth. This abridgement came to existence through the power vested upon the industry partner network of
                        UMaK, a strategic program that strengthens the school's ties affiliations outside its premises.
                    </p>
                    
                    <p>
                        As part of the memo, encapsulated hereafter (within the MOU) are positively viewed future collaborations of
                        the parties mentioned, particularly in regard to the school's curriculum development, experts career
                        coaching, scholarship programs, contests, internship, and many more. A prerequisite is not just confined nor
                        limited to the aforementioned endeavors, but within the MOU, numerous such as faculty training,
                        project development, job placement, etc.
                    </p>
                    
                    <p>
                        This is such a milestone as this seeded a new partnership, a new beginning of hope for esports industry and
                        scholastic fields to meet at the middle, a very crucial aspect that would negate misalignments and provide
                        hefty opportunities for students, faculty, and graduates of UMaK, allowing them to necessitate the
                        exploration of the real of esports.
                    </p>
                    
                    <p>
                        Moonton is a globally renowned gaming company, famous for the century breaking e-game, "Mobile Legends: Bang
                        Bang." With its worldwide collaborations and women collaborates, industry and university endeavors will be uplifted
                        in pursuit of stronger affiliation and will be hovering upward, a perceived mutual growth for each and
                        everyone.
                    </p>
                </div>
            </div>
        </div>
    );
}
