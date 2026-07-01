'use client';
import { useEffect } from 'react';

// Client component that handles scroll reveal animations
export default function ScrollReveal() {
  useEffect(() => {
    const revealMap = [
      { sel: '#countdown .section-label', cls: 'reveal-blur', delay: 0 },
      { sel: '#countdown .section-heading', cls: 'reveal-up', delay: 1 },
      { sel: '.countdown-card:nth-child(1)', cls: 'reveal-scale', delay: 1 },
      { sel: '.countdown-card:nth-child(3)', cls: 'reveal-scale', delay: 2 },
      { sel: '.countdown-card:nth-child(5)', cls: 'reveal-scale', delay: 3 },
      { sel: '.countdown-card:nth-child(7)', cls: 'reveal-scale', delay: 4 },
      { sel: '.event-info-row', cls: 'reveal-up', delay: 5 },
      { sel: '#detail .section-label', cls: 'reveal-fade', delay: 0 },
      { sel: '#detail .section-heading', cls: 'reveal-blur', delay: 1 },
      { sel: '.detail-desc', cls: 'reveal-left', delay: 2 },
      { sel: '.detail-divider', cls: 'reveal-scale', delay: 3 },
      { sel: '.detail-venue', cls: 'reveal-right', delay: 3 },
      { sel: '#map .section-label', cls: 'reveal-fade', delay: 0 },
      { sel: '#map .section-heading', cls: 'reveal-up', delay: 1 },
      { sel: '.map-wrapper', cls: 'reveal-blur', delay: 2 },
      { sel: '#btn-open-maps', cls: 'reveal-up', delay: 3 },
      { sel: '#rsvp .section-label', cls: 'reveal-fade', delay: 0 },
      { sel: '#rsvp .section-heading', cls: 'reveal-blur', delay: 1 },
      { sel: '.rsvp-form', cls: 'reveal-up', delay: 2 },
    ];

    const allEls: Element[] = [];

    revealMap.forEach(({ sel, cls, delay }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.classList.add('reveal', cls);
      if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
      allEls.push(el);
    });

    document.querySelectorAll('.form-group').forEach((el, i) => {
      el.classList.add('reveal', 'reveal-up', `reveal-delay-${Math.min(i + 2, 5)}`);
      allEls.push(el);
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    allEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
