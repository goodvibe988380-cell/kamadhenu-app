import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that uses IntersectionObserver to add the
 * `kj-fade-in--visible` class to children with `kj-fade-in`
 * when they scroll into view.
 *
 * Returns a ref to attach to the container element.
 */
export function useScrollReveal(threshold = 0.15) {
  const containerRef = useRef<HTMLDivElement>(null);

  const observe = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced-motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Immediately show all elements
      container.querySelectorAll('.kj-fade-in').forEach((el) => {
        el.classList.add('kj-fade-in--visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('kj-fade-in--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    container.querySelectorAll('.kj-fade-in').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(observe, 100);
    return () => clearTimeout(timer);
  }, [observe]);

  return containerRef;
}
