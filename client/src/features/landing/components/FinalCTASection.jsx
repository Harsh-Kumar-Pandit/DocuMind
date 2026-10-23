import { ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function FinalCTASection() {
  return (
    <section className="final-cta shell">
      <div>
        <span className="eyebrow">Ready when you are</span>
        <h2>Turn your PDFs into answers.</h2>
        <p>Give your documents a little more room to think.</p>
      </div>
      <div className="cta-actions">
        <Button href="/signup">
          Get started <ArrowRight size={16} />
        </Button>
        <Button href="/signin" variant="light">
          Sign in
        </Button>
      </div>
    </section>
  );
}
