'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import GlassCard from '@/components/GlassCard'

export default function AdminLogin() {
  const [step, setStep] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePassword = async () => {
    setLoading(true)
    try {
      await axios.post('/api/admin/login', { email, password })
      setStep('otp')
      setError('')
    } catch (e: any) {
      setError(e.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleOTP = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/admin/verify-otp', { email, otp })
      localStorage.setItem('admin_token', data.token)
      router.push('/admin')
    } catch (e: any) {
      setError(e.response?.data?.error || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-black">
      <GlassCard className="w-96">
        <h2 className="text-2xl text-gold-400 mb-6">Admin Login</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {step === 'password' ? (
          <>
            <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full mb-4 p-3 bg-white/10 rounded" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full mb-4 p-3 bg-white/10 rounded" />
            <button onClick={handlePassword} disabled={loading}
              className="w-full bg-gold-500 text-black py-2 rounded font-semibold hover:bg-gold-400 transition">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <input type="text" placeholder="6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)}
              className="w-full mb-4 p-3 bg-white/10 rounded" />
            <button onClick={handleOTP} disabled={loading}
              className="w-full bg-gold-500 text-black py-2 rounded font-semibold hover:bg-gold-400 transition">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button onClick={() => setStep('password')} className="text-sm text-gold-400 mt-2 block">Back to login</button>
          </>
        )}
      </GlassCard>
    </div>
  )
}