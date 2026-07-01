'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const slides = [
  '/assets/project-1.png',
  '/assets/project-2.png',
  '/assets/project-3.png',
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollToCountdown = () => {
    document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      {/* Slideshow background */}
      <div className="hero-bg-slider">
        {slides.map((src, i) => (
          <div
            key={src}
            className={`hero-slide${i === current ? ' active' : ''}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>

      {/* Blueprint grid background */}
      <div className="hero-blueprint-bg" />
      <div className="hero-overlay" />
      <div className="hero-vignette" />

      <div className="hero-content">
        {/* Invite Badge */}
        <div className="hero-badge">YOU&apos;RE INVITED TO</div>

        {/* EDRA Logo */}
        <Image
          src="/assets/edra-logo.png"
          alt="Edra Arsitek Indonesia"
          width={110}
          height={110}
          className="hero-logo"
          style={{ width: 110, height: 'auto' }}
          priority
        />

        {/* 25th Anniversary Main Image */}
        <div className="hero-anniv-img-wrap">
          <Image
            src="/assets/25anniv.png"
            alt="25th Anniversary EDRA"
            width={360}
            height={270}
            className="hero-anniv-img"
            style={{ width: '100%', height: 'auto', maxWidth: 360 }}
            priority
          />
        </div>

        {/* Architectural divider */}
        <div className="hero-divider-arch">
          <div className="hero-divider-line" />
          <span className="hero-divider-diamond" />
          <div className="hero-divider-line" />
        </div>

        {/* Date */}
        <div className="hero-date">SABTU · 4 JULI 2026</div>

        {/* Scroll indicator */}
        <button className="scroll-indicator" onClick={scrollToCountdown} aria-label="Scroll ke bawah">
          <span className="scroll-text">SCROLL</span>
          <span className="scroll-line" />
        </button>
      </div>
    </section>
  );
}
