import React from 'react';
import { hero, brand } from '@/data/landingContent';

interface HeroProps {
  onExploreStory: () => void;
  onDiscoverProduct: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExploreStory, onDiscoverProduct }) => {
  return (
    <section id="home" className="kj-hero">
      {/* Background */}
      <div className="kj-hero__bg">
        <div className="kj-hero__decor-1" />
        <div className="kj-hero__decor-2" />
      </div>
      <div className="kj-hero__overlay" />

      {/* Content */}
      <div className="kj-hero__content">
        <span className="kj-hero__badge">{brand.tagline}</span>

        <div className="kj-hero__headline">
          <h1 className="kj-heading-display">
            {hero.headline.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < hero.headline.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
        </div>

        <p className="kj-hero__supporting">{hero.supporting}</p>

        <div className="kj-hero__actions">
          <button
            className="kj-btn-primary"
            onClick={onExploreStory}
            type="button"
          >
            {hero.primaryCta}
          </button>
          <button
            className="kj-btn-secondary"
            onClick={onDiscoverProduct}
            type="button"
          >
            {hero.secondaryCta}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="kj-hero__scroll-indicator" aria-hidden="true">
        <span>Scroll</span>
        <div className="kj-hero__scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
