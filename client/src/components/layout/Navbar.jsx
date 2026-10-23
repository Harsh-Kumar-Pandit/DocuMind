import { ArrowRight, Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

export function Logo() {
  return (
    <a className="logo" href="/" aria-label="DocuMind home">
      <span className="logo-mark">
        <Sparkles size={13} strokeWidth={2.4} />
      </span>
      <span className="logo-text">
        Docu<span>Mind</span>
      </span>
    </a>
  );
}

export default function Navbar({ dark, setDark }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section scrollspy
      const sections = [
        { id: "top", threshold: 0 },
        { id: "features", threshold: document.getElementById("features")?.offsetTop || 600 },
        { id: "how-it-works", threshold: document.getElementById("how-it-works")?.offsetTop || 1200 },
        { id: "pricing", threshold: document.getElementById("pricing")?.offsetTop || 2200 },
        { id: "faq", threshold: document.getElementById("faq")?.offsetTop || 2800 },
      ];

      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPos >= sections[i].threshold - 80) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home", href: "#top", id: "top" },
    { label: "Features", href: "#features", id: "features" },
    { label: "How it works", href: "#how-it-works", id: "how-it-works" },
    { label: "Pricing", href: "#pricing", id: "pricing" },
    { label: "FAQs", href: "#faq", id: "faq" },
  ];

  const handleLinkClick = (e, href, id) => {
    setOpen(false);
    setActiveSection(id);
    if (href.startsWith("#")) {
      e.preventDefault();
      if (href === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.querySelector(href);
        if (el) {
          const navOffset = 76;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    }
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar shell">
        <Logo />

        <nav
          className={`nav-links ${open ? "open" : ""}`}
          aria-label="Main navigation"
        >
          {links.map(({ label, href, id }) => (
            <a
              key={label}
              href={href}
              className={activeSection === id ? "active" : ""}
              onClick={(e) => handleLinkClick(e, href, id)}
            >
              {label}
            </a>
          ))}
          <div className="mobile-only-actions">
            <Button
              href="/signin"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Button>
            <Button href="/signup" onClick={() => setOpen(false)}>
              Get started <ArrowRight size={14} />
            </Button>
          </div>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label="Toggle color theme"
            onClick={() => setDark(!dark)}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Button href="/signin" variant="ghost" className="nav-signin-btn">
            Sign in
          </Button>
          <Button href="/signup" className="nav-cta-btn">
            Get started <ArrowRight size={14} />
          </Button>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
