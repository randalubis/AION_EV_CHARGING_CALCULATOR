import { HeroCover } from '../features/landing/components/HeroCover';
import { BrandMarquee } from '../features/landing/components/BrandMarquee';
import { ToolsBento } from '../features/landing/components/ToolsBento';
import { MapTeaser } from '../features/landing/components/MapTeaser';
import { HowItWorks } from '../features/landing/components/HowItWorks';
import { Testimonials } from '../features/landing/components/Testimonials';
import { WhyEvhub } from '../features/landing/components/WhyEvhub';
import { FAQSection } from '../features/landing/components/FAQSection';
import { FinalCTA } from '../features/landing/components/FinalCTA';
import { LandingFooter } from '../features/landing/components/LandingFooter';

export default function LandingPage() {
  return (
    <div className="relative w-full">
      <HeroCover />
      <BrandMarquee />
      <ToolsBento />
      <MapTeaser />
      <HowItWorks />
      <Testimonials />
      <WhyEvhub />
      <FAQSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
