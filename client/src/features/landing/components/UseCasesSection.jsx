import SectionHeading from "../../../components/ui/SectionHeading";
import { useCases } from "../../../lib/constants";

export default function UseCasesSection() {
  return (
    <section className="section use-cases-section" id="use-cases">
      <div className="shell">
        <SectionHeading
          eyebrow="USE CASES"
          title="Built for every curious mind."
          center
        />

        <div className="use-cases-grid">
          {useCases.map(({ title, text, icon: Icon, colorTheme }) => (
            <div className="use-case-card" key={title}>
              <div className={`use-case-icon-wrap theme-${colorTheme}`}>
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <h3 className="use-case-title">{title}</h3>
              <p className="use-case-text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
