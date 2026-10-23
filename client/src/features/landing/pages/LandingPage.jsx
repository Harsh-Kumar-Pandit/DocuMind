import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import HeroSection from "../components/HeroSection";
import TrustSection from "../components/TrustSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import FinalCTASection from "../components/FinalCTASection";

export default function LandingPage({ dark, setDark }) {
  return (
    <>
      <Navbar dark={dark} setDark={setDark} />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
