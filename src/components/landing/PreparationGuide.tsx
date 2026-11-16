import React from 'react';
import { preparation } from '@/data/landingContent';
import { useScrollReveal } from './useScrollReveal';

const PreparationGuide: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section id="preparation" className="kj-section kj-section--ivory">
      <div className="kj-section__inner" ref={ref}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="kj-heading-section kj-fade-in" style={{ display: 'inline-block' }}>
            {preparation.heading}
          </h2>
          {preparation.note && (
            <p
              className="kj-text-body-center kj-fade-in kj-fade-in-delay-1"
              style={{
                marginTop: '24px',
                fontSize: '0.875rem',
                fontStyle: 'italic',
                color: 'var(--kj-terracotta)',
              }}
            >
              {preparation.note}
            </p>
          )}
        </div>

        <div className="kj-prep-steps">
          {preparation.steps.map((step) => (
            <div
              key={step.number}
              className={`kj-prep-step kj-fade-in kj-fade-in-delay-${Math.min(step.number, 4)}`}
            >
              <div className="kj-prep-step__number">{step.number}</div>
              <div>
                <h3 className="kj-prep-step__title">{step.title}</h3>
                <p className="kj-prep-step__instruction">{step.instruction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreparationGuide;
