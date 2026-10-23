export default function TrustSection() {
  return (
    <section className="trust-strip-section" aria-label="Trusted by">
      <div className="shell">
        <p className="trust-strip-title">
          TRUSTED BY LEARNERS, RESEARCHERS AND BUILDERS
        </p>

        <div className="trust-logos-row">
          {/* Google */}
          <div className="trust-logo-item" title="Google">
            <svg height="24" viewBox="0 0 74 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.24 10.15v3.85h5.83c-.24 1.25-.94 2.31-2 3.01-1.07.71-2.43 1.13-3.83 1.13-2.97 0-5.46-2.02-6.36-4.73a6.76 6.76 0 010-4.82c.9-2.71 3.39-4.73 6.36-4.73 1.63 0 3.1.6 4.25 1.7l2.87-2.87C17.65 1.05 15.09 0 12.24 0 7.46 0 3.33 2.74 1.34 6.75a12.04 12.04 0 000 10.5C3.33 21.26 7.46 24 12.24 24c3.27 0 6.02-1.08 8.04-2.94 2.06-1.9 3.23-4.72 3.23-8.06 0-.8-.07-1.57-.2-2.31l-11.07-.54z" fill="#4285F4"/>
              <path d="M30.45 8.16c-3.56 0-6.45 2.72-6.45 6.34 0 3.6 2.89 6.34 6.45 6.34 3.55 0 6.45-2.74 6.45-6.34s-2.9-6.34-6.45-6.34zm0 10.18c-1.96 0-3.64-1.61-3.64-3.84 0-2.26 1.68-3.84 3.64-3.84 1.93 0 3.64 1.58 3.64 3.84 0 2.23-1.71 3.84-3.64 3.84z" fill="#EA4335"/>
              <path d="M44.45 8.16c-3.56 0-6.45 2.72-6.45 6.34 0 3.6 2.89 6.34 6.45 6.34 3.55 0 6.45-2.74 6.45-6.34s-2.9-6.34-6.45-6.34zm0 10.18c-1.96 0-3.64-1.61-3.64-3.84 0-2.26 1.68-3.84 3.64-3.84 1.93 0 3.64 1.58 3.64 3.84 0 2.23-1.71 3.84-3.64 3.84z" fill="#FBBC05"/>
              <path d="M57.65 8.16c-3.4 0-6.26 2.75-6.26 6.34 0 3.56 2.86 6.34 6.26 6.34 1.98 0 3.09-.8 3.86-1.72v1.33c0 2.42-1.3 3.72-3.38 3.72-1.7 0-2.76-1.22-3.2-2.26l-2.44 1.02c.71 1.7 2.58 3.74 5.64 3.74 3.28 0 6.06-1.93 6.06-6.61V8.56h-2.69v1.3c-.77-.92-1.89-1.7-3.85-1.7zm.31 10.18c-1.93 0-3.46-1.61-3.46-3.84 0-2.26 1.53-3.84 3.46-3.84 1.9 0 3.43 1.61 3.43 3.87 0 2.23-1.53 3.81-3.43 3.81z" fill="#4285F4"/>
              <path d="M66.45.85h2.81v19.49h-2.81V.85z" fill="#34A853"/>
            </svg>
          </div>

          {/* Microsoft */}
          <div className="trust-logo-item" title="Microsoft">
            <svg height="21" viewBox="0 0 110 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="1" width="10" height="10" fill="#F25022"/>
              <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
              <rect x="0" y="13" width="10" height="10" fill="#00A4EF"/>
              <rect x="12" y="13" width="10" height="10" fill="#FFB900"/>
              <text x="28" y="17" fill="#5F6368" fontFamily="Segoe UI, -apple-system, sans-serif" fontSize="15" fontWeight="600" letterSpacing="-0.3">Microsoft</text>
            </svg>
          </div>

          {/* Stanford */}
          <div className="trust-logo-item" title="Stanford">
            <span className="stanford-logo">Stanford</span>
          </div>

          {/* MIT */}
          <div className="trust-logo-item" title="MIT">
            <svg height="21" viewBox="0 0 54 24" fill="#A31F34" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="7" height="24" />
              <rect x="11.5" y="0" width="7" height="15" />
              <rect x="23" y="0" width="7" height="24" />
              <rect x="34.5" y="0" width="7" height="24" />
              <rect x="46" y="9" width="7" height="15" />
              <rect x="34.5" y="0" width="19" height="5" />
            </svg>
          </div>

          {/* Notion */}
          <div className="trust-logo-item" title="Notion">
            <svg height="22" viewBox="0 0 95 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.2 3.6L14.7 2c1.4-.2 2.5.5 3 1.9l4.5 13.7c.4 1.3-.2 2.5-1.5 2.7l-12.8 1.6c-1.3.2-2.5-.5-2.9-1.9L.7 6.3C.3 5 .9 3.8 2.2 3.6z" fill="#000"/>
              <path d="M5.5 6.5l8-.9c.6-.1 1.1.2 1.3.8l3 9.4c.2.6-.1 1.2-.7 1.3l-8 .9c-.6.1-1.1-.2-1.3-.8l-3-9.4c-.2-.6.1-1.2.7-1.3z" fill="#fff"/>
              <path d="M7.7 8.2l4.8-.5c.4 0 .7.2.8.6l1.8 5.7c.1.4 0 .8-.4.8l-4.8.5c-.4 0-.7-.2-.8-.6L7.3 9c-.1-.4 0-.8.4-.8z" fill="#000"/>
              <text x="27" y="17" fill="#000" fontFamily="sans-serif" fontSize="15" fontWeight="700">Notion</text>
            </svg>
          </div>

          {/* OpenAI */}
          <div className="trust-logo-item" title="OpenAI">
            <svg height="22" viewBox="0 0 95 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.6 1.2a6.4 6.4 0 00-5.7 3.5 6.2 6.2 0 00-3.6 2.6 6.3 6.3 0 00.9 7.4 6.3 6.3 0 00.1 4.4 6.3 6.3 0 005.7 3.5 6.2 6.2 0 003.6-2.6 6.3 6.3 0 00-.9-7.4 6.3 6.3 0 00-.1-4.4zm.1 2.3c.7 0 1.4.2 2 .6l-4.1 2.4a.9.9 0 00-.4.7v5.8l-1.9-1.1V6.2a4.1 4.1 0 014.4-2.7zm-6.2 4.4a4.1 4.1 0 012.3-1.3l-.1 4.7a.9.9 0 00.4.7l5 2.9-1.9 1.1-5-2.9a4.1 4.1 0 01-.7-5.2zm1.6 7.7l4.1-2.4a.9.9 0 00.4-.7V6.6l1.9 1.1v5.7a4.1 4.1 0 01-6.4 3.4zm10.7-3.8a4.1 4.1 0 01-2.3 1.3l.1-4.7a.9.9 0 00-.4-.7l-5-2.9 1.9-1.1 5 2.9a4.1 4.1 0 01.7 5.2zm-2.4-5.3l-4.1 2.4a.9.9 0 00-.4.7v5.8l-1.9-1.1V7.8a4.1 4.1 0 016.4-3.4z" fill="#000"/>
              <text x="26" y="17" fill="#000" fontFamily="sans-serif" fontSize="15" fontWeight="600">OpenAI</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
