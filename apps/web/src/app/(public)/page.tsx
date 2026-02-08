import CTASection from "./components/cta-section";
import FeaturesSection from "./components/features-section";
import HeroSection from "./components/hero-section";
import HowItWorks from "./components/how-it-works";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
    </main>
  );
}
