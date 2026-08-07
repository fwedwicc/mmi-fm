import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { IconEye, IconEyeClosed } from '@tabler/icons-react'
import { Button, Input } from '../../shared/components/ui'
import { Logomark } from '../../assets'
import { authService } from '../../shared/service/authService'
import { useUserStore } from '../../shared/store'
import { showToast } from '../../shared/utils/toast'

const Login = () => {
  const navigate = useNavigate()
  const setUser = useUserStore((state) => state.setUser)
  const setLoading = useUserStore((state) => state.setLoading)
  const setError = useUserStore((state) => state.setError)
  const isLoading = useUserStore((state) => state.isLoading)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isFormValid =
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    isValidEmail(formData.email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid || isLoading) {
      return
    }
    setLoading(true)
    try {
      const response = await authService.login({
        email: formData.email.trim(),
        password: formData.password
      })
      setUser(response.user, response.token)
      showToast.success('Login successful!')
      navigate('/home')
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to login. Please try again.'
      showToast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='flex-center h-screen'
    >
      <div className='flex-col flex-center w-full gap-2'>
        {/* Header */}
        <div className='flex-col flex-center gap-0.5 mb-4'>
          <img src={Logomark} alt='Logo' className='w-11 h-auto mb-4.5' />
          <h1>Login to your account</h1>
          <p className='text-base leading-none'>Welcome back! Please enter your details.</p>
        </div>
        {/* Sign up form */}
        <form onSubmit={handleSubmit} className='w-full max-w-md p-6.75 space-y-4 bg-[#FAF9F5] border border-[#1F1E1D]/15 shadow-[0px_4px_4px_0px_#00000003,0px_16px_32px_0px_#00000003,0px_2px_64px_0px_#00000005,0px_4px_32px_0px_#00000005] rounded-3xl'>
          <Input
            label="Email"
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
          <div className='relative'>
            <Input
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              inputStyles='pr-10'
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-9 flex items-center text-neutral-400 transition-colors hover:text-neutral-700"
            >
              {showPassword ? <IconEye className='size-5 stroke-[1.8px]' /> : <IconEyeClosed className='size-5 stroke-[1.8px]' />}
            </button>
          </div>
          <Button
            type='submit'
            variant='primary'
            label={isLoading ? 'LOGGING IN...' : 'SIGN IN'}
            disabled={isLoading || !isFormValid}
            styles='w-full'
          />
          <div className='flex-center pt-2'>
            <p className='text-[#73726C]'>Don't have an account? <Link to='/' className='text-[#141413] hover:text-[#d59215] font-semibold transition-smooth'>Sign up</Link></p>
          </div>
        </form>
      </div>
    </motion.main>
  )
}

export default Login