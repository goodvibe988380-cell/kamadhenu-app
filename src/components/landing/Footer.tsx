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
    <footer id="contact" className="kj-footer">
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
            <div className="kj-footer__heading">Information</div>
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

            {/* Contact details — shown only when provided */}
            {(footer.contact.email || footer.contact.phone) && (
              <div style={{ marginTop: '16px' }}>
                {footer.contact.email && (
                  <p className="kj-footer__link" style={{ cursor: 'default' }}>
                    {footer.contact.email}
                  </p>
                )}
                {footer.contact.phone && (
                  <p className="kj-footer__link" style={{ cursor: 'default' }}>
                    {footer.contact.phone}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <hr className="kj-footer__divider" />
        <p className="kj-footer__copyright">{footer.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
