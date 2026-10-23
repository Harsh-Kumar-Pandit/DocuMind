export default function Button({
  children,
  className = "",
  href,
  variant = "primary",
  onClick,
  type = "button",
  ...props
}) {
  if (href) {
    return (
      <a
        className={`button button-${variant} ${className}`}
        href={href}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      className={`button button-${variant} ${className}`}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
