import { useEffect, useRef } from 'react';
import styles from "./NetworkSection.module.scss";

import Logo1 from "../assets/network/362272378_6573424279387299_5112645492191823321_n.png";
import Logo2 from "../assets/network/Copy of Rektikano White.png";
import Logo3 from "../assets/network/DESIGN 1 PNG.png";
import Logo4 from "../assets/network/FINAL.png";
import Logo5 from "../assets/network/WA Logo Official (ESPORTS USE).png";

const logos = [
    Logo1,
    Logo2,
    Logo3,
    Logo4,
    Logo5,
    Logo1,
    Logo2,
    Logo3,
    Logo4,
    Logo5,
    Logo1,
    Logo2,
    Logo3,
    Logo4,
    Logo5,
];

const NetworkSection = () => {
    const logoSliderRef = useRef(null);
    const logoSlideRef = useRef(null);
    const hasClonedRef = useRef(false);

    useEffect(() => {
        let rafId = 0;

        if (!hasClonedRef.current && logoSlideRef.current && logoSliderRef.current) {
            const copy = logoSlideRef.current.cloneNode(true);
            logoSliderRef.current.appendChild(copy);
            hasClonedRef.current = true;
        }

        const sliderEl = logoSliderRef.current;
        if (!sliderEl) return;

        const logoEls = Array.from(
            sliderEl.querySelectorAll(`.${styles.networkLogos}`)
        );

        const animate = () => {
            const sliderRect = sliderEl.getBoundingClientRect();
            const centerX = sliderRect.left + sliderRect.width / 2;
            const zoneHalfWidth = Math.min(200, sliderRect.width * 0.28);
            const leftBound = centerX - zoneHalfWidth;
            const rightBound = centerX + zoneHalfWidth;

            for (const el of logoEls) {
                const rect = el.getBoundingClientRect();
                const elCenterX = rect.left + rect.width / 2;
                const inZone = elCenterX >= leftBound && elCenterX <= rightBound;
                el.classList.toggle(styles.isCenter, inZone);
            }

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            const slider = logoSliderRef.current;
            if (slider) {
                const slides = slider.querySelectorAll(`.${styles.logosSlide}`);
                for (let i = 1; i < slides.length; i += 1) {
                    slider.removeChild(slides[i]);
                }
            }
            hasClonedRef.current = false;
        };
    }, []);

    return (
        <section className={`py-16 relative ${styles.networkSection}`}>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-0 pointer-events-none" />

            <div className={`sm:px-4 mx-auto grid gap-5 md:gap-14 z-10`}>
                <h2 className="text-[24px] md:text-[32px] lg:text-[40px] text-center font-bold z-10">MSL NETWORK ORGANIZATIONS</h2>

                <div className={styles.logoSlider} ref={logoSliderRef}>
                    <div className={styles.logosSlide} ref={logoSlideRef}>
                        {logos.map((src, index) => (
                            <div key={index} className={`${styles.networkLogos} mx-4 xl:mx-10`}>
                                <img src={src} alt={`Logo ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NetworkSection;
