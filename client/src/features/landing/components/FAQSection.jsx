import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import SectionHeading from "../../../components/ui/SectionHeading";
import { faqsCol1, faqsCol2 } from "../../../lib/constants";

export default function FAQSection() {
  // Column 1 active index (-1 for none)
  const [col1Active, setCol1Active] = useState(-1);
  // Column 2 active index (0 is open by default: "Do you offer a free plan?")
  const [col2Active, setCol2Active] = useState(0);

  const toggleCol1 = (index) => {
    setCol1Active((prev) => (prev === index ? -1 : index));
  };

  const toggleCol2 = (index) => {
    setCol2Active((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="section faq-section" id="faq">
      <div className="shell">
        <SectionHeading
          eyebrow="FAQS"
          title="Got questions? We've got answers."
          center
        />

        <div className="faq-two-columns">
          {/* Column 1 */}
          <div className="faq-column">
            {faqsCol1.map(({ question, answer }, index) => {
              const isOpen = col1Active === index;
              return (
                <div
                  className={`faq-accordion-item ${isOpen ? "open" : ""}`}
                  key={question}
                >
                  <button
                    className="faq-question-btn"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleCol1(index)}
                  >
                    <span className="faq-question-text">{question}</span>
                    <span className="faq-toggle-icon">
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 2 */}
          <div className="faq-column">
            {faqsCol2.map(({ question, answer }, index) => {
              const isOpen = col2Active === index;
              return (
                <div
                  className={`faq-accordion-item ${isOpen ? "open" : ""}`}
                  key={question}
                >
                  <button
                    className="faq-question-btn"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleCol2(index)}
                  >
                    <span className="faq-question-text">{question}</span>
                    <span className="faq-toggle-icon">
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
