import { ArrowRight, LoaderCircle } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthDivider from '../components/AuthDivider'
import AuthInput from '../components/AuthInput'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import useAuth from '../hooks/useAuth'

export default function SignUpPage() {
  const { user, loading, register } = useAuth(); const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' }); const [errors, setErrors] = useState({}); const [serverError, setServerError] = useState(''); const [submitting, setSubmitting] = useState(false)
  if (loading) return <div className="auth-loading">Checking your session…</div>
  if (user) return <Navigate to="/app/chat" replace />
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })
  const submit = async (event) => {
    event.preventDefault(); setServerError(''); const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Enter your full name.'
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.'
    if (form.password.length < 10 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) nextErrors.password = 'Use 10+ characters with a letter and a number.'
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    setErrors({}); setSubmitting(true)
    try { await register({ name: form.name.trim(), email: form.email.trim(), password: form.password }); navigate('/app/chat', { replace: true }) } catch (error) { setServerError(error.message) } finally { setSubmitting(false) }
  }
  return <AuthLayout eyebrow="Start learning faster" title="Create your account" description="Upload documents, ask better questions, and keep your research moving forward."><form className="auth-form" onSubmit={submit} noValidate><AuthInput label="Full name" id="signup-name" type="text" autoComplete="name" placeholder="Your full name" value={form.name} onChange={update('name')} error={errors.name} /><AuthInput label="Email address" id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} /><PasswordInput label="Password" id="signup-password" autoComplete="new-password" placeholder="Create a password" value={form.password} onChange={update('password')} error={errors.password} /><p className="password-hint">Use at least 10 characters with one letter and one number.</p><PasswordInput label="Confirm password" id="signup-confirm" autoComplete="new-password" placeholder="Repeat your password" value={form.confirmPassword} onChange={update('confirmPassword')} error={errors.confirmPassword} />{serverError && <div className="form-error" role="alert">{serverError}</div>}<button className="auth-submit" type="submit" disabled={submitting}>{submitting ? <><LoaderCircle className="spin" size={17} />Creating account…</> : <>Create account <ArrowRight size={16} /></>}</button></form><AuthDivider /><p className="auth-switch">Already have an account? <Link to="/signin">Sign in</Link></p></AuthLayout>
}
