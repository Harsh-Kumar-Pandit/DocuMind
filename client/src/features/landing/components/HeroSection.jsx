import { ArrowRight, Check, Sparkles } from "lucide-react";
import Button from "../../../components/ui/Button";
import { benefits } from "../../../lib/constants";
import ProductPreview from "./ProductPreview";

export default function HeroSection() {
  return (
    <section className="hero shell">
      <div className="hero-copy">
        <div className="badge">
          <span className="badge-dot">
            <Sparkles size={12} />
          </span>
          Powered by Advanced AI
        </div>
        <h1>
          Turn Your Documents <span>Into Knowledge.</span>
        </h1>
        <p className="hero-text">
          Chat with your PDFs, get instant answers, summarize content, and find
          key insights — all in one place with AI.
        </p>
        <div className="benefits">
          {benefits.map(([label, Icon]) => (
            <span key={label}>
              <Icon size={14} />
              {label}
            </span>
          ))}
        </div>
        <div className="hero-ctas">
          <Button href="/signup">
            Get Started — It's Free <ArrowRight size={16} />
          </Button>
          <Button href="#how-it-works" variant="secondary">
            <span>▶</span> Watch Demo
          </Button>
        </div>
        <div className="reassurance">
          <span>
            <Check size={13} />
            No credit card required
          </span>
          <span>
            <Check size={13} />
            Free plan available
          </span>
          <span>
            <Check size={13} />
            Secure & private
          </span>
        </div>
      </div>
      <ProductPreview />
    </section>
  );
}
