import { ArrowRight, Check } from "lucide-react";
import Button from "../../../components/ui/Button";
import SectionHeading from "../../../components/ui/SectionHeading";

export default function PricingSection() {
  return (
    <section className="section shell pricing-section" id="pricing">
      <SectionHeading
        eyebrow="Simple, transparent pricing"
        title="Start with the essentials."
        text="We’re keeping pricing honest while we build the best document workspace for you."
        center
      />
      <div className="pricing-card">
        <div>
          <span className="plan-label">THE STARTING POINT</span>
          <h3>Free</h3>
          <p>Explore the core DocuMind experience at no cost.</p>
          <ul>
            <li>
              <Check size={15} />
              Chat with your documents
            </li>
            <li>
              <Check size={15} />
              Summaries and source-backed answers
            </li>
            <li>
              <Check size={15} />
              No payment details required
            </li>
          </ul>
        </div>
        <div className="price-side">
          <span className="price">$0</span>
          <span>to get started</span>
          <Button href="/signup">
            Create a free account <ArrowRight size={15} />
          </Button>
          <small>Paid plans are coming later.</small>
        </div>
      </div>
    </section>
  );
}
