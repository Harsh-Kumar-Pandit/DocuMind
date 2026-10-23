import { Logo } from "./Navbar";

export default function Footer() {
  return (
    <footer className="footer shell">
      <div>
        <Logo />
        <p>A calmer way to understand the documents that matter.</p>
      </div>
      <nav className="footer-links" aria-label="Footer navigation">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQs</a>
      </nav>
      <span className="copyright">© 2026 DocuMind</span>
    </footer>
  );
}
