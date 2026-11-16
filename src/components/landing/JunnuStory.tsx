import React from 'react';
import { junnuStory } from '@/data/landingContent';
import { useScrollReveal } from './useScrollReveal';

const JunnuStory: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section className="kj-section kj-section--ivory">
      <div className="kj-section__inner" ref={ref}>
        <div className="kj-junnu-grid">
          {/* Visual */}
          <div className="kj-junnu-visual kj-fade-in">
            <img
              src="/landing/food/traditional-junnu.jpg"
              alt="Traditional South Indian Junnu colostrum milk dessert"
              loading="lazy"
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="kj-heading-section kj-fade-in">{junnuStory.heading}</h2>
            <div style={{ marginTop: '32px' }}>
              {junnuStory.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`kj-text-body kj-fade-in kj-fade-in-delay-${i + 1}`}
                  style={{ marginBottom: i < junnuStory.paragraphs.length - 1 ? '20px' : 0 }}
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

export default JunnuStory;
