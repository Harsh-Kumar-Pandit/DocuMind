import { Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";

export function Logo() {
  return (
    <a className="logo" href="/" aria-label="DocuMind home">
      <span className="logo-mark">
        <Sparkles size={14} />
      </span>
      <span>
        Docu<span>Mind</span>
      </span>
    </a>
  );
}

export default function Navbar({ dark, setDark }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Features", "#features"],
    ["How it works", "#how-it-works"],
    ["Pricing", "#pricing"],
    ["FAQs", "#faq"],
  ];
  const close = () => setOpen(false);
  return (
    <header className="navbar shell">
      <Logo />
      <nav
        className={open ? "nav-links open" : "nav-links"}
        aria-label="Main navigation"
      >
        <a className="active" href="/" onClick={close}>
          Home
        </a>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={close}>
            {label}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <button
          className="theme-toggle"
          type="button"
          aria-label="Toggle color theme"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <Button href="/signin" variant="ghost">
          Sign in
        </Button>
        <Button href="/signup">Sign up</Button>
      </div>
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
