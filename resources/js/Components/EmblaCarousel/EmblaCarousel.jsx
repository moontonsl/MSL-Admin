import React, { useCallback } from 'react'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons.jsx'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

/**
 * @param {{ slides: string[], options?: any }} props
 */
const EmblaCarousel = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

    const onNavButtonClick = useCallback((emblaApi) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const resetOrStop =
            autoplay.options.stopOnInteraction === false
                ? autoplay.reset
                : autoplay.stop

        resetOrStop()
    }, [])

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
        emblaApi,
        onNavButtonClick
    )

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi, onNavButtonClick)

    return (
        <section className="embla z-20">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((src, index) => (
                        <div className="embla__slide" key={index}>
                            <img
                                className="embla__slide__img"
                                src={src}
                                alt={`Slide ${index + 1}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    ))}

                </div>
            </div>

            {/*<div className="embla__controls">*/}
            {/*    <div className="embla__buttons">*/}
            {/*        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />*/}
            {/*        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />*/}
            {/*    </div>*/}

            {/*    <div className="embla__dots">*/}
            {/*        {scrollSnaps.map((_, index) => (*/}
            {/*            <DotButton*/}
            {/*                key={index}*/}
            {/*                onClick={() => onDotButtonClick(index)}*/}
            {/*                className={'embla__dot'.concat(*/}
            {/*                    index === selectedIndex ? ' embla__dot--selected' : ''*/}
            {/*                )}*/}
            {/*            />*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </section>
    )
}

export default EmblaCarousel
