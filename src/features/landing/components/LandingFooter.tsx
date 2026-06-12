import { Link } from 'react-router-dom';
import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { FOOTER_NAV } from '../content';
import { footerConfig } from '../../../config';

// Map social iconName (from config) → lucide component; fall back to Mail.
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Instagram,
  Twitter,
  Linkedin,
  Mail,
};

export function LandingFooter() {
  return (
    <footer className="py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-volt rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-carbon-950" />
              </div>
              <span className="text-white font-sans font-bold text-xl">
                evhub<span className="text-volt">.id</span>
              </span>
            </Link>
            <p className="text-white/50 font-body max-w-sm mb-6">
              Platform lengkap untuk pemilik kendaraan listrik di Indonesia.
              Kalkulator, peta SPKLU, trip planner, dan komunitas dalam satu tempat.
            </p>
            <div className="flex gap-4">
              {footerConfig.socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.iconName] ?? Mail;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 hover:bg-volt rounded-lg flex items-center justify-center text-white hover:text-carbon-950 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-sans font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 font-body">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-volt transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-sans font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-white/50 font-body">
              <li>
                <a
                  href={`mailto:${footerConfig.email}`}
                  className="hover:text-volt transition-colors"
                >
                  {footerConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-volt flex-shrink-0" />
                {footerConfig.locationText}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm font-body">{footerConfig.copyright}</p>
          <div className="flex gap-6">
            {footerConfig.bottomLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white/30 hover:text-white/60 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
