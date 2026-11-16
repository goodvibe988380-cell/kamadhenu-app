import React from 'react';
import { product } from '@/data/landingContent';
import { useScrollReveal } from './useScrollReveal';
import { CheckCircle } from 'lucide-react';

interface ProductShowcaseProps {
  onLoginClick: () => void;
  isAuthenticated?: boolean;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onLoginClick, isAuthenticated = false }) => {
  const ref = useScrollReveal();

  return (
    <section id="our-product" className="kj-section kj-section--cream">
      <div className="kj-section__inner" ref={ref}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="kj-heading-section kj-fade-in" style={{ display: 'inline-block' }}>
            {product.heading}
          </h2>
        </div>

        <div className="kj-product-showcase">
          {/* Product Image */}
          <div className="kj-product-image-wrapper kj-fade-in">
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              width={400}
              height={400}
            />
          </div>

          {/* Product Info */}
          <div className="kj-product-info kj-fade-in kj-fade-in-delay-2">
            <h3 className="kj-product-info__name">{product.name}</h3>
            <div className="kj-product-info__pack">{product.pack}</div>

            <p className="kj-text-body" style={{ marginTop: '8px' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {product.features.map((feature, i) => (
                <div key={i} className="kj-product-feature">
                  <CheckCircle className="kj-product-feature__icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                className="kj-btn-green"
                onClick={onLoginClick}
                type="button"
              >
                {isAuthenticated ? 'ORDER NOW' : product.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
