import { ArrowRight, Check, Play, Sparkles, X } from "lucide-react";
import { useState } from "react";
import Button from "../../../components/ui/Button";
import { benefits } from "../../../lib/constants";
import ProductPreview from "./ProductPreview";

export default function HeroSection() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="hero-section" id="hero">
      {/* Scenic Alpine Mountain & Lake Background */}
      <div className="hero-scenic-bg" aria-hidden="true">
        <div className="scenic-image-layer" />
        <div className="scenic-gradient-overlay" />
        <div className="scenic-ambient-glow glow-1" />
        <div className="scenic-ambient-glow glow-2" />
      </div>

      <div className="shell hero-grid">
        {/* Left Column: Typography & CTAs */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-spark">
              <Sparkles size={13} strokeWidth={2.4} />
            </span>
            <span>Powered by Advanced AI</span>
          </div>

          <h1 className="hero-headline">
            Turn Your
            <br />
            Documents Into
            <br />
            <span className="hero-gradient-text">Knowledge.</span>
          </h1>

          <p className="hero-subtext">
            Chat with your PDFs, get instant answers, summarize content, and find
            key insights — all in one place. Powered by AI, grounded with real
            citations.
          </p>

          <div className="hero-benefits-grid">
            {benefits.map(({ label, icon: Icon }) => (
              <div className="hero-benefit-item" key={label}>
                <span className="hero-benefit-icon">
                  <Icon size={14} />
                </span>
                <span className="hero-benefit-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <Button href="/signup" className="hero-primary-btn">
              Get Started — It's Free <ArrowRight size={15} />
            </Button>
            <Button
              variant="secondary"
              className="hero-demo-btn"
              onClick={() => setDemoOpen(true)}
            >
              <Play size={13} fill="currentColor" /> Watch Demo
            </Button>
          </div>

          <div className="hero-trust-row">
            <div className="trust-item">
              <span className="trust-check">
                <Check size={12} strokeWidth={3} />
              </span>
              <span>No credit card required</span>
            </div>
            <div className="trust-item">
              <span className="trust-check">
                <Check size={12} strokeWidth={3} />
              </span>
              <span>Free plan available</span>
            </div>
            <div className="trust-item">
              <span className="trust-check">
                <Check size={12} strokeWidth={3} />
              </span>
              <span>Your data stays private</span>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic Product Mockup */}
        <div className="hero-visual">
          <ProductPreview />
        </div>
      </div>

      {/* Interactive Demo Modal */}
      {demoOpen && (
        <div
          className="demo-modal-backdrop"
          onClick={() => setDemoOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="demo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="demo-modal-header">
              <div className="demo-modal-title">
                <Sparkles size={16} className="text-purple" />
                <b>DocuMind Product Tour</b>
              </div>
              <button
                className="demo-close-btn"
                type="button"
                onClick={() => setDemoOpen(false)}
                aria-label="Close demo"
              >
                <X size={18} />
              </button>
            </div>
            <div className="demo-modal-body">
              <div className="demo-video-placeholder">
                <div className="demo-play-circle">
                  <Play size={32} fill="white" />
                </div>
                <h3>Experience DocuMind in 60 Seconds</h3>
                <p>
                  Watch how researchers and professionals index hundreds of pages
                  and extract exact, cited answers instantly.
                </p>
                <div className="demo-modal-actions">
                  <Button href="/signup">
                    Try Free Now <ArrowRight size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setDemoOpen(false)}
                  >
                    Close Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
