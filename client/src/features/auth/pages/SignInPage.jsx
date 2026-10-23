import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthDivider from '../components/AuthDivider'
import AuthInput from '../components/AuthInput'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import useAuth from '../hooks/useAuth'

export default function SignInPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  if (loading) return <div className="auth-loading">Checking your session…</div>
  if (user) return <Navigate to="/app/chat" replace />
  const submit = async (event) => {
    event.preventDefault(); setServerError('')
    const nextErrors = {}
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.'
    if (!form.password) nextErrors.password = 'Enter your password.'
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    setErrors({}); setSubmitting(true)
    try { await login(form); navigate('/app/chat', { replace: true }) } catch (error) { setServerError(error.message) } finally { setSubmitting(false) }
  }
  return <AuthLayout eyebrow="Welcome back" title="Welcome back" description="Sign in to continue turning your documents into knowledge."><Link className="auth-back-btn" to="/"><ArrowLeft size={15} /> Back to home</Link><form className="auth-form" onSubmit={submit} noValidate><AuthInput label="Email address" id="signin-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} /><PasswordInput label="Password" id="signin-password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />{serverError && <div className="form-error" role="alert">{serverError}</div>}<button className="auth-submit" type="submit" disabled={submitting}>{submitting ? <><LoaderCircle className="spin" size={17} />Signing in…</> : <>Sign in <ArrowRight size={16} /></>}</button></form><AuthDivider /><p className="auth-switch">New to DocuMind? <Link to="/signup">Create an account</Link></p></AuthLayout>
}
