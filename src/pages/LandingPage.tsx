import { HeroCover } from '../features/landing/components/HeroCover';
import { ToolsGrid } from '../features/landing/components/ToolsGrid';
import { HowItWorks } from '../features/landing/components/HowItWorks';
import { WhyEvhub } from '../features/landing/components/WhyEvhub';
import { FAQSection } from '../features/landing/components/FAQSection';
import { FinalCTA } from '../features/landing/components/FinalCTA';
import { LandingFooter } from '../features/landing/components/LandingFooter';

export default function LandingPage() {
  return (
    <div className="relative w-full">
      <HeroCover />
      <ToolsGrid />
      <HowItWorks />
      <WhyEvhub />
      <FAQSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
