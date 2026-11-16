import React from 'react';
import { cowStory } from '@/data/landingContent';
import { useScrollReveal } from './useScrollReveal';

const CowStory: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section id="our-cow" className="kj-section kj-section--ivory">
      <div className="kj-section__inner" ref={ref}>
        <div className="kj-story-grid">
          {/* Text first on mobile, visual first on desktop via CSS order */}
          <div style={{ order: 1 }}>
            <h2 className="kj-heading-section kj-fade-in">{cowStory.heading}</h2>
            <div style={{ marginTop: '32px' }}>
              {cowStory.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`kj-text-body kj-fade-in kj-fade-in-delay-${i + 1}`}
                  style={{ marginBottom: i < cowStory.paragraphs.length - 1 ? '20px' : 0 }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="kj-story-visual kj-fade-in" style={{ order: 2 }}>
            <img
              src="/landing/cow/indigenous-cow.jpg"
              alt="Indigenous Indian cow in natural rural farm setting"
              loading="lazy"
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CowStory;
