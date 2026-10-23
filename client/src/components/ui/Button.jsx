export default function Button({
  children,
  className = "",
  href = "#",
  variant = "primary",
  ...props
}) {
  return (
    <a
      className={`button button-${variant} ${className}`}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
}
