import { ArrowRight } from "lucide-react";
import SectionHeading from "../../../components/ui/SectionHeading";
import { features } from "../../../lib/constants";

export default function FeaturesSection() {
  return (
    <section className="section shell" id="features">
      <SectionHeading
        eyebrow="A better way to read"
        title="Everything you need to go from PDF to insight."
        text="DocuMind brings the most useful parts of document research into one calm, focused workspace."
        center
      />
      <div className="feature-grid">
        {features.map(({ icon: Icon, title, text }, index) => (
          <article className="feature-card" key={title}>
            <span className={`feature-icon icon-${index}`}>
              <Icon size={19} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
            <a href="#how-it-works">
              Learn more <ArrowRight size={14} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
