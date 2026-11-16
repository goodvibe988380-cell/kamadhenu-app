import React from 'react';
import { ourStory } from '@/data/landingContent';
import { useScrollReveal } from './useScrollReveal';

const StorySection: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section id="our-story" className="kj-section kj-section--cream">
      <div className="kj-section__inner" ref={ref}>
        <div className="kj-story-grid">
          {/* Visual */}
          <div className="kj-story-visual kj-fade-in">
            <img
              src="/landing/milk/milk-sourcing.jpg"
              alt="Traditional Indian village dairy heritage and fresh milk collection"
              loading="lazy"
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="kj-heading-section kj-fade-in">{ourStory.heading}</h2>
            <div style={{ marginTop: '32px' }}>
              {ourStory.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`kj-text-body kj-fade-in kj-fade-in-delay-${i + 1}`}
                  style={{ marginBottom: i < ourStory.paragraphs.length - 1 ? '20px' : 0 }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
