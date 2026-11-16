import React, { useState, useEffect, useCallback } from 'react';

interface NavbarProps {
  onLoginClick: () => void;
  onDashboardClick?: () => void;
  isAuthenticated?: boolean;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#our-story' },
  { label: 'Our Cow', href: '#our-cow' },
  { label: 'Milk Journey', href: '#milk-journey' },
  { label: 'Our Product', href: '#our-product' },
  { label: 'Preparation', href: '#preparation' },
  { label: 'Quality', href: '#quality' },
  { label: 'Contact', href: '#contact' },
];

const Navbar: React.FC<NavbarProps> = ({
  onLoginClick,
  onDashboardClick,
  isAuthenticated = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsMobileOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    },
    []
  );

  const handleActionClick = useCallback(() => {
    setIsMobileOpen(false);
    if (isAuthenticated && onDashboardClick) {
      onDashboardClick();
    } else {
      onLoginClick();
    }
  }, [isAuthenticated, onDashboardClick, onLoginClick]);

  const actionButtonText = isAuthenticated ? 'Dashboard' : 'Login';

  return (
    <>
      <nav
        className={`kj-navbar ${
          isScrolled ? 'kj-navbar--solid' : 'kj-navbar--transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="kj-navbar__inner">
          <a href="#home" className="kj-navbar__brand" onClick={(e) => handleNavClick(e, '#home')}>
            KAMADHENU JUNNU
          </a>

          <ul className="kj-navbar__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="kj-navbar__link"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                className="kj-navbar__login-btn"
                onClick={handleActionClick}
                type="button"
              >
                {actionButtonText}
              </button>
            </li>
          </ul>

          <button
            className={`kj-navbar__hamburger ${
              isMobileOpen ? 'kj-navbar__hamburger--open' : ''
            }`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-label="Toggle navigation menu"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`kj-mobile-menu ${isMobileOpen ? 'kj-mobile-menu--open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="kj-mobile-menu__link"
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
        <button
          className="kj-navbar__login-btn"
          onClick={handleActionClick}
          type="button"
          style={{ marginTop: '16px' }}
        >
          {actionButtonText}
        </button>
      </div>
    </>
  );
};

export default Navbar;
