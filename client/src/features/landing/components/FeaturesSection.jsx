import SectionHeading from "../../../components/ui/SectionHeading";
import { features } from "../../../lib/constants";

export default function FeaturesSection() {
  return (
    <section className="section features-section" id="features">
      <div className="shell">
        <SectionHeading
          eyebrow="FEATURES"
          title="Everything you need to understand documents faster."
          text="DocuMind brings the power of AI and source-backed answers to your documents."
          center
        />

        <div className="features-grid">
          {features.map(({ icon: Icon, title, text, colorTheme }) => (
            <div className="feature-card" key={title}>
              <div className={`feature-icon-wrapper theme-${colorTheme}`}>
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
