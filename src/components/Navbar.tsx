import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Zap, MapPin, Route, Calculator, Users, Wallet } from 'lucide-react';

const navLinks = [
  { label: 'Beranda', href: '/', icon: null },
  { label: 'Kalkulator', href: '/kalkulator', icon: Calculator },
  { label: 'Peta SPKLU', href: '/peta-spklu', icon: MapPin },
  { label: 'Trip Planner', href: '/trip-planner', icon: Route },
  { label: 'TCO Calculator', href: '/tco-calculator', icon: Wallet },
  { label: 'Komunitas', href: '/komunitas', icon: Users },
];

// NavLink component that forces navigation
function NavLink({ href, children, className, isActive }: { href: string; children: React.ReactNode; className?: string; isActive?: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Force navigation with window.location for reliability
    if (window.location.pathname !== href) {
      window.location.href = href;
    }
  };
  
  return (
    <a 
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'bg-forest-dark/95 backdrop-blur-md border-b border-white/10'
            : 'bg-forest-dark'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <NavLink href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#FFC300] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <Zap className="w-6 h-6 text-forest-dark" />
              </div>
              <span className="text-white font-sans font-bold text-xl tracking-tight">
                evhub<span className="text-[#FFC300]">.id</span>
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  isActive={isActive(link.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-[#FFC300] text-forest-dark'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-20 left-4 right-4 bg-forest-mid rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  isActive={isActive(link.href)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-[#FFC300] text-forest-dark'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {link.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
}
