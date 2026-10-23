export default function AuthInput({ label, id, error, ...props }) {
  return <div className="auth-field"><label htmlFor={id}>{label}</label><input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />{error && <span className="field-error" id={`${id}-error`}>{error}</span>}</div>
}
