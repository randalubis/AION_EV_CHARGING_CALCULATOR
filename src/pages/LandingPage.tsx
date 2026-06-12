import { HeroSection } from '../features/landing/components/HeroSection';
import { StatsStrip } from '../features/landing/components/StatsStrip';
import { ToolsGrid } from '../features/landing/components/ToolsGrid';
import { HowItWorks } from '../features/landing/components/HowItWorks';
import { WhyEvhub } from '../features/landing/components/WhyEvhub';
import { FAQSection } from '../features/landing/components/FAQSection';
import { FinalCTA } from '../features/landing/components/FinalCTA';
import { LandingFooter } from '../features/landing/components/LandingFooter';

export default function LandingPage() {
  return (
    <div className="relative w-full">
      <HeroSection />
      <StatsStrip />
      <ToolsGrid />
      <HowItWorks />
      <WhyEvhub />
      <FAQSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
