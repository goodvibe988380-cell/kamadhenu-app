import React from 'react';
import { callToAction } from '@/data/landingContent';
import { useScrollReveal } from './useScrollReveal';

interface CallToActionProps {
  onExploreProduct: () => void;
  onLoginClick: () => void;
  isAuthenticated?: boolean;
}

const CallToAction: React.FC<CallToActionProps> = ({
  onExploreProduct,
  onLoginClick,
  isAuthenticated = false,
}) => {
  const ref = useScrollReveal();

  return (
    <section className="kj-section kj-cta-section">
      <div className="kj-section__inner" ref={ref} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <h2
            className="kj-heading-section kj-fade-in"
            style={{
              display: 'inline-block',
              color: 'var(--kj-ivory)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            }}
          >
            {callToAction.heading}
          </h2>

          <p
            className="kj-text-body-center kj-fade-in kj-fade-in-delay-1"
            style={{
              marginTop: '24px',
              color: 'rgba(245, 235, 215, 0.8)',
              maxWidth: '600px',
            }}
          >
            {callToAction.supporting}
          </p>

          <div
            className="kj-fade-in kj-fade-in-delay-2"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '40px',
            }}
          >
            <button className="kj-btn-primary" onClick={onExploreProduct} type="button">
              {callToAction.primaryCta}
            </button>
            <button className="kj-btn-secondary" onClick={onLoginClick} type="button">
              {isAuthenticated ? 'GO TO DASHBOARD' : callToAction.secondaryCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
