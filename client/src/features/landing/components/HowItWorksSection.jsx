import SectionHeading from "../../../components/ui/SectionHeading";
import { workflowSteps } from "../../../lib/constants";

export default function HowItWorksSection() {
  return (
    <section className="section how-section" id="how-it-works">
      <div className="shell">
        <SectionHeading
          eyebrow="How it works"
          title="Your documents, in three simple steps."
          text="Spend less time searching and more time understanding what matters."
        />
        <div className="steps">
          <div className="step-line" />
          {workflowSteps.map(([number, title, text, Icon]) => (
            <div className="step" key={number}>
              <span className="step-number">{number}</span>
              <span className="step-icon">
                <Icon size={19} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
