import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function PasswordInput({ label, id, error, ...props }) {
  const [visible, setVisible] = useState(false)
  return <div className="auth-field"><label htmlFor={id}>{label}</label><div className="password-wrap"><input id={id} type={visible ? 'text' : 'password'} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} /><button type="button" className="password-toggle" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{error && <span className="field-error" id={`${id}-error`}>{error}</span>}</div>
}
