import { Check } from "lucide-react";
import Button from "../../../components/ui/Button";
import SectionHeading from "../../../components/ui/SectionHeading";
import { pricingPlans } from "../../../lib/constants";

export default function PricingSection() {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="shell">
        <SectionHeading
          eyebrow="PRICING"
          title="Simple, transparent pricing."
          text="Start free, upgrade when you need more."
          center
        />

        <div className="pricing-cards-grid">
          {pricingPlans.map(
            ({
              name,
              badge,
              subtitle,
              price,
              period,
              popular,
              features,
              ctaText,
              ctaVariant,
            }) => (
              <div
                className={`pricing-plan-card ${popular ? "popular" : ""}`}
                key={name}
              >
                {badge && <span className="pricing-popular-badge">{badge}</span>}

                <div className="pricing-plan-header">
                  <h3 className="pricing-plan-name">{name}</h3>
                  <p className="pricing-plan-sub">{subtitle}</p>
                </div>

                <div className="pricing-amount-row">
                  <span className="pricing-price">{price}</span>
                  <span className="pricing-period">{period}</span>
                </div>

                <ul className="pricing-features-list">
                  {features.map((feature) => (
                    <li key={feature} className="pricing-feature-item">
                      <span className="feature-check-icon">
                        <Check size={13} strokeWidth={2.8} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pricing-action">
                  <Button
                    href="/signup"
                    variant={ctaVariant}
                    className={`pricing-btn ${popular ? "popular-btn" : ""}`}
                  >
                    {ctaText}
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
