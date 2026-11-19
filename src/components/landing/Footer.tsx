import React from 'react';
import { footer, navLinks } from '@/data/landingContent';

interface FooterProps {
  onLoginClick: () => void;
  isAuthenticated?: boolean;
}

const Footer: React.FC<FooterProps> = ({ onLoginClick, isAuthenticated = false }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="kj-footer">
      <div className="kj-footer__inner">
        <div className="kj-footer__grid">
          {/* Brand column */}
          <div>
            <div className="kj-footer__brand">{footer.brand}</div>
            <p className="kj-footer__desc">{footer.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="kj-footer__heading">Quick Links</div>
            {navLinks.slice(0, 5).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="kj-footer__link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Information & Access */}
          <div>
            <div className="kj-footer__heading">Information & Contact</div>
            {navLinks.slice(5).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="kj-footer__link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onLoginClick}
              type="button"
              className="kj-footer__link"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Login / Order'}
            </button>

            {/* Proprietor Contact Details in Footer */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(245, 235, 215, 0.1)' }}>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--kj-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '4px',
                  fontWeight: 600,
                }}
              >
                Proprietor
              </p>
              <p className="kj-footer__link" style={{ cursor: 'default', color: 'var(--kj-ivory)', fontWeight: 600 }}>
                {footer.contact.proprietor}
              </p>
              <a
                href={`tel:${footer.contact.rawPhone}`}
                className="kj-footer__link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Call proprietor"
              >
                <span>📞 {footer.contact.phone}</span>
              </a>
              <a
                href={`https://wa.me/91${footer.contact.rawPhone}?text=Hello%20Mahesh%20Pampa%20ji%2C%20I%20would%20like%20to%20inquire%20about%20Kamadhenu%20Junnu.`}
                target="_blank"
                rel="noopener noreferrer"
                className="kj-footer__link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#25D366' }}
                title="Chat on WhatsApp"
              >
                <span>💬 WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>

        <hr className="kj-footer__divider" />
        <p className="kj-footer__copyright">{footer.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
