import { Star } from "lucide-react";
import ananyaImg from "../../../assets/avatars/ananya.jpg";
import priyaImg from "../../../assets/avatars/priya.jpg";
import rohitImg from "../../../assets/avatars/rohit.jpg";
import SectionHeading from "../../../components/ui/SectionHeading";

const testimonialsData = [
  {
    quote: '"DocuMind saved me hours of reading. The cited answers are incredibly helpful!"',
    name: "Priya Sharma",
    role: "Computer Science Student",
    avatar: priyaImg,
  },
  {
    quote: '"As a researcher, this is a game changer. I can summarize and compare papers in minutes."',
    name: "Rohit Mehta",
    role: "Research Scholar",
    avatar: rohitImg,
  },
  {
    quote: '"Our team uses DocuMind to go through long reports. It\'s fast, accurate and easy to use."',
    name: "Ananya Verma",
    role: "Product Manager",
    avatar: ananyaImg,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="shell">
        <SectionHeading
          eyebrow="WHAT USERS SAY"
          title="Loved by learners and professionals."
          center
        />

        <div className="testimonials-grid">
          {testimonialsData.map(({ quote, name, role, avatar }) => (
            <div className="testimonial-card" key={name}>
              <p className="testimonial-quote">{quote}</p>
              <div className="testimonial-author">
                <img
                  src={avatar}
                  alt={name}
                  className="testimonial-avatar"
                  loading="lazy"
                />
                <div className="testimonial-meta">
                  <h4 className="author-name">{name}</h4>
                  <span className="author-role">{role}</span>
                  <div className="star-rating" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className="star-icon"
                        fill="#F59E0B"
                        stroke="#F59E0B"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
