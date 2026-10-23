import { ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function FinalCTASection() {
  return (
    <section className="final-cta-section" aria-label="Call to action">
      <div className="shell">
        <div className="final-cta-card">
          <div className="final-cta-content">
            <h2 className="final-cta-title">
              Ready to unlock knowledge from your documents?
            </h2>
            <p className="final-cta-sub">
              Join thousands of learners, researchers and professionals using DocuMind.
            </p>
          </div>
          <div className="final-cta-action">
            <Button href="/signup" className="final-cta-btn">
              Get started — It's Free <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
