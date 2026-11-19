import React from 'react';
import { proprietor } from '@/data/landingContent';
import { useScrollReveal } from './useScrollReveal';
import { PhoneCall, ShieldCheck, Clock, MapPin, Sparkles, User, MessageCircle } from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 20,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.414z" />
  </svg>
);

const ProprietorContact: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section id="contact" className="kj-section kj-contact-section kj-section--cream">
      <div className="kj-section__inner" ref={ref}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="kj-contact__tag kj-fade-in">
            <Sparkles size={14} style={{ color: 'var(--kj-gold)' }} />
            <span>{proprietor.sectionTag}</span>
          </div>
          <h2
            className="kj-heading-section kj-fade-in kj-fade-in-delay-1"
            style={{ display: 'inline-block' }}
          >
            {proprietor.heading}
          </h2>
          <p
            className="kj-text-body-center kj-fade-in kj-fade-in-delay-2"
            style={{ marginTop: '20px' }}
          >
            {proprietor.supporting}
          </p>
        </div>

        {/* Master Proprietor Card */}
        <div className="kj-contact-card kj-fade-in kj-fade-in-delay-2">
          {/* Decorative Corner Flairs */}
          <div className="kj-contact-card__flair-tl" aria-hidden="true" />
          <div className="kj-contact-card__flair-br" aria-hidden="true" />

          <div className="kj-contact-card__content">
            {/* Top Identity Row */}
            <div className="kj-contact-card__header">
              <div className="kj-contact-avatar" aria-hidden="true">
                <div className="kj-contact-avatar__inner">
                  <User size={36} strokeWidth={1.8} />
                </div>
              </div>

              <div className="kj-contact-identity">
                <div className="kj-contact-badge">
                  <ShieldCheck size={14} />
                  <span>Authorized Proprietor</span>
                </div>
                <h3 className="kj-contact-name">{proprietor.name}</h3>
                <p className="kj-contact-title">
                  {proprietor.title} • Kamadhenu Junnu
                </p>
              </div>
            </div>

            {/* Clickable Phone Number Display */}
            <div className="kj-contact-phone-block">
              <span className="kj-contact-phone-label">Direct Contact Number</span>
              <a
                href={proprietor.callUrl}
                className="kj-contact-phone-link"
                title="Click to call Mahesh Pampa"
                aria-label={`Call proprietor Mahesh Pampa at ${proprietor.displayPhone}`}
              >
                <PhoneCall size={24} className="kj-contact-phone-icon" />
                <span className="kj-contact-phone-number">{proprietor.displayPhone}</span>
              </a>
              <span className="kj-contact-phone-hint">Available for calls and direct dialer</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="kj-contact-actions">
              <a
                href={proprietor.callUrl}
                className="kj-btn-contact-call"
                aria-label="Call proprietor Mahesh Pampa now"
              >
                <PhoneCall size={18} />
                <span>Call Now</span>
              </a>

              <a
                href={proprietor.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="kj-btn-contact-whatsapp"
                aria-label="Contact Mahesh Pampa on WhatsApp"
              >
                <WhatsAppIcon size={19} />
                <span>WhatsApp Contact</span>
              </a>
            </div>

            {/* Operational Metadata */}
            <div className="kj-contact-meta">
              <div className="kj-contact-meta__item">
                <Clock size={16} className="kj-contact-meta__icon" />
                <div>
                  <div className="kj-contact-meta__label">Response Hours</div>
                  <div className="kj-contact-meta__value">{proprietor.availability}</div>
                </div>
              </div>

              <div className="kj-contact-meta__divider" aria-hidden="true" />

              <div className="kj-contact-meta__item">
                <MapPin size={16} className="kj-contact-meta__icon" />
                <div>
                  <div className="kj-contact-meta__label">Origin & Service</div>
                  <div className="kj-contact-meta__value">{proprietor.location}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Feature Cards */}
        <div className="kj-contact-features-grid">
          {proprietor.features.map((feat, index) => {
            const icons = [User, MessageCircle, ShieldCheck];
            const IconComp = icons[index % icons.length];
            return (
              <div
                key={feat.title}
                className={`kj-contact-feature-card kj-fade-in kj-fade-in-delay-${index + 1}`}
              >
                <div className="kj-contact-feature-card__icon-wrap">
                  <IconComp size={22} />
                </div>
                <h4 className="kj-contact-feature-card__title">{feat.title}</h4>
                <p className="kj-contact-feature-card__desc">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProprietorContact;
