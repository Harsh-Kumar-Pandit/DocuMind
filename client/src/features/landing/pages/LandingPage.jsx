import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/Navbar";
import FAQSection from "../components/FAQSection";
import FeaturesSection from "../components/FeaturesSection";
import FinalCTASection from "../components/FinalCTASection";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import PricingSection from "../components/PricingSection";
import TestimonialsSection from "../components/TestimonialsSection";
import UseCasesSection from "../components/UseCasesSection";

export default function LandingPage({ dark, setDark }) {
  return (
    <div className={`landing-root ${dark ? "dark-theme" : "light-theme"}`}>
      {/* Decorative ambient background blur orbs */}
      <div className="ambient-orb ambient-orb-1" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-2" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-3" aria-hidden="true" />

      <Navbar dark={dark} setDark={setDark} />
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <UseCasesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
