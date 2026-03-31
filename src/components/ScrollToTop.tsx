import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls the window to the top whenever the route changes.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes (no smooth scroll)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
