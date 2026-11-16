import React from 'react';
import { quality } from '@/data/landingContent';
import { useScrollReveal } from './useScrollReveal';
import { Shield } from 'lucide-react';

const QualitySection: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section id="quality" className="kj-section kj-section--green">
      <div className="kj-section__inner" ref={ref}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="kj-fade-in" style={{ marginBottom: '20px' }}>
            <Shield
              style={{
                width: '40px',
                height: '40px',
                color: 'var(--kj-gold-light)',
                margin: '0 auto',
              }}
            />
          </div>
          <h2 className="kj-heading-section kj-fade-in kj-fade-in-delay-1" style={{ display: 'inline-block' }}>
            {quality.heading}
          </h2>
        </div>

        <div className="kj-quality-grid">
          {quality.items.map((item, i) => (
            <div
              key={i}
              className={`kj-quality-card kj-fade-in kj-fade-in-delay-${Math.min(i + 1, 4)}`}
            >
              <h3 className="kj-quality-card__title">{item.title}</h3>
              <p className="kj-quality-card__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
