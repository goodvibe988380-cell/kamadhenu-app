import React from 'react';
import { milkJourney } from '@/data/landingContent';
import { useScrollReveal } from './useScrollReveal';

const MilkJourney: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section id="milk-journey" className="kj-section kj-section--cream">
      <div className="kj-section__inner" ref={ref}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="kj-heading-section kj-fade-in" style={{ display: 'inline-block' }}>
            {milkJourney.heading}
          </h2>
          <div
            className="kj-fade-in kj-fade-in-delay-1"
            style={{ display: 'flex', justifyContent: 'center', marginTop: '-8px' }}
          />
        </div>

        <div className="kj-journey-timeline">
          {milkJourney.steps.map((step) => (
            <div
              key={step.number}
              className={`kj-journey-step kj-fade-in kj-fade-in-delay-${Math.min(step.number, 4)}`}
            >
              <div className="kj-journey-step__number">{step.number}</div>
              <h3 className="kj-journey-step__title">{step.title}</h3>
              <p className="kj-journey-step__desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MilkJourney;
