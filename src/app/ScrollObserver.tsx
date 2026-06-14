'use client';

import { useEffect } from 'react';

export default function ScrollObserver() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          // Set per-element delay just before the transition fires
          el.style.transitionDelay = `${el.dataset.delay ?? '0'}ms`;
          el.classList.add('is-visible');
          io.unobserve(el);
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -48px 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
