import SectionHeading from "../../../components/ui/SectionHeading";
import { workflowSteps } from "../../../lib/constants";

export default function HowItWorksSection() {
  return (
    <section className="section how-it-works-section" id="how-it-works">
      {/* Hand drawn arrow on the left */}
      <div className="how-arrow-decoration" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="#7C5CF9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 44C24 48 38 42 46 28C49 22 50 14 50 8" />
          <path d="M22 34L12 44L14 56" />
        </svg>
      </div>

      {/* Floating document illustration on the right */}
      <div className="how-doc-decoration" aria-hidden="true">
        <div className="doc-deco-card">
          <div className="doc-deco-line w-3/4" />
          <div className="doc-deco-line w-full" />
          <div className="doc-deco-line w-2/3" />
          <div className="doc-deco-line w-4/5" />
          <div className="doc-deco-line w-1/2" />
        </div>
      </div>

      <div className="shell">
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="Your documents, in three simple steps."
          text="Go from PDF to powerful insights in just a few clicks."
          center
        />

        <div className="how-steps-container">
          <div className="how-steps-line" aria-hidden="true" />

          {workflowSteps.map(({ number, title, text, icon: Icon }) => (
            <div className="how-step-card" key={number}>
              <span className="how-step-badge">{number}</span>
              <div className="how-icon-circle">
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <h3 className="how-step-title">{title}</h3>
              <p className="how-step-text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
