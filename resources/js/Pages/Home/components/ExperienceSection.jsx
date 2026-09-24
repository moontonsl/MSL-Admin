import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from "./ExperienceSection.module.scss"

import image1 from '../assets/experience/1.png';
import image2 from '../assets/experience/2.png';
import image3 from '../assets/experience/3.png';
import image4 from '../assets/experience/4.png';
import image5 from '../assets/experience/5.png';
import image6 from '../assets/experience/6.png';

const experienceItems = [
    {
        img: image1,
        title: 'MLBB online/offline tournament',
        subtitle: 'Show off your skills in playing with online/offline tournaments where you can compete with your fellow student gamers in your community.'
    },
    {
        img: image2,
        title: 'Inter-school activities',
        subtitle: 'Transcend beyond the borders of your school and connect with fellow student leaders and gamers with inter-school activities waiting for you.\n'
    },
    {
        img: image3,
        title: 'Academic activities (training & seminars)',
        subtitle: 'Don\'t just strive to improve your gamer\'s sense—academic activities await for you to be taught and trained to soar in your studies.'
    },
    {
        img: image4,
        title: 'Campus organization support',
        subtitle: 'Live up the greatest opportunities and experiences in esports with campus organization support offered for you to grab on.'
    },
    {
        img: image5,
        title: 'School\'s events partnerships',
        subtitle: 'From us to you, let\'s build greater bonds with opportunities to a firmer and stronger connection through the school\'s event partnerships programs that await you.'
    },
    {
        img: image6,
        title: 'On-site esports experience',
        subtitle: 'Virtual realm experience is great—but we\'re bringing you the thrill and enjoyment of the real world through the best offers in on-site esports experience.'
    }
];


const ExperienceSection = () => {
    return (
        <section className={`relative py-10 bg-neutral-950/20 overflow-hidden ${styles.experienceSection}`}>
  {/* Background Image / Graphic */}
  <div className={styles.expBackground} />
  {/* Blur + dim overlay */}
  <div className={styles.expBlurOverlay} />

{/* Overlay Content */}
<div className="container mx-auto w-[90vw] md:px-4 relative z-10">

                <div className="text-center mb-10 text-white">
                    <h2 className="text-[24px] md:text-[32px] lg:text-[40px] font-bold tracking-tight">
                        LEAD TO EXPERIENCE!
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-sm md:text-base">
                        Get ready to take on a journey full of opportunities for you to grab and thrive on the esports
                        scene with MSL Philippines!
                    </p>
                </div>

                <Swiper
                    modules={[Navigation]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={8}
                    breakpoints={{
                        320: {
                            slidesPerView: 2,
                            spaceBetween: 8
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 8
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 8
                        },
                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 16
                        },
                        1536: {
                            slidesPerView: 6,
                            spaceBetween: 16
                        }

                    }}
                    className="w-full"
                >
                    {experienceItems.map((item, index) => (
                        <SwiperSlide key={index}>
                            <article className={styles.expCard}>
                                <div className={styles.expImageWrap}>
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className={styles.expCardTitle}>{item.title}</h3>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default ExperienceSection;
