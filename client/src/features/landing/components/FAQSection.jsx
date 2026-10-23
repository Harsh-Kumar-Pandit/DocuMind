import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SectionHeading from "../../../components/ui/SectionHeading";
import { faqs } from "../../../lib/constants";

export default function FAQSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="section shell faq-section" id="faq">
      <SectionHeading eyebrow="Questions, answered" title="Good to know." />
      <div className="faq-list">
        {faqs.map(([question, answer], index) => (
          <div
            className={`faq-item ${active === index ? "expanded" : ""}`}
            key={question}
          >
            <button
              type="button"
              aria-expanded={active === index}
              onClick={() => setActive(active === index ? -1 : index)}
            >
              <span>{question}</span>
              <ChevronDown size={18} />
            </button>
            {active === index && <p>{answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
