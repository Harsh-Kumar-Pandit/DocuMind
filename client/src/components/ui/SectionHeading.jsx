export default function SectionHeading({
  eyebrow,
  title,
  text,
  center = true,
  className = "",
}) {
  return (
    <div className={`section-heading ${center ? "center" : ""} ${className}`}>
      {eyebrow && <span className="eyebrow-pill">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
