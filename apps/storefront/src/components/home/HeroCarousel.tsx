"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";

export interface HeroSlide {
  id: string;
  /** Tailwind gradient classes used as the slide background. */
  gradientClassName: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  /** Featured product shown in the dedicated image panel on the right. */
  product?: {
    name: string;
    imageUrl: string;
    href: string;
  };
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

/**
 * Rotating promo-banner carousel for the homepage, in the style of
 * Jumia / Beauty Kenya seasonal-sale hero sections: text + CTA on the
 * left, a dedicated product image panel on the right. Autoplays with
 * pagination dots.
 */
export function HeroCarousel({ slides }: HeroCarouselProps): ReactElement {
  if (slides.length === 0) {
    return <></>;
  }

  return (
    <section className="border-b border-gray-200">
      <SwiperComponent
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={slides.length > 1}
        className="hero-carousel"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative flex items-center min-h-[420px] md:min-h-[480px] ${slide.gradientClassName}`}
            >
              <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 items-center gap-8">
                  {/* Left: copy + CTA */}
                  <div className="text-white text-center md:text-left">
                    <span className="inline-block text-sm font-semibold tracking-wide uppercase bg-white/15 px-3 py-1 rounded-full mb-4">
                      {slide.eyebrow}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-base md:text-lg text-white/90 max-w-md mx-auto md:mx-0">
                      {slide.subtitle}
                    </p>
                    <div className="mt-8">
                      <Button size="lg" asChild>
                        <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Right: dedicated product image panel */}
                  {slide.product && (
                    <Link
                      href={slide.product.href}
                      className="hidden md:flex items-center justify-center"
                      aria-label={slide.product.name}
                    >
                      <div className="relative w-full max-w-sm aspect-square bg-white/95 rounded-2xl shadow-xl p-6">
                        <Image
                          src={slide.product.imageUrl}
                          alt={slide.product.name}
                          fill
                          className="object-contain p-6"
                          sizes="(min-width: 768px) 384px, 0px"
                        />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </section>
  );
}
