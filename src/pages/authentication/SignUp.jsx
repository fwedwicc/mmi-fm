import React, { useState } from 'react'
import { IconEye, IconEyeClosed } from '@tabler/icons-react'
import { Button, Input } from '../../shared/components/ui'
import { Logomark } from '../../assets'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <main className='flex-center h-screen'>
      <div className='flex-col flex-center w-full gap-2'>
        {/* Header */}
        <div className='flex-col flex-center gap-0.5 mb-4'>
          <img src={Logomark} alt='Logo' className='w-11 h-auto mb-4.5' />
          <h1>Create an Account</h1>
          <p className='text-base leading-none'>Get instant access and start creating today.</p>
        </div>
        {/* Sign up form */}
        <div className='w-full max-w-md p-6.75 space-y-4 bg-[#FAF9F5] border border-[#1F1E1D]/15 shadow-[0px_4px_4px_0px_#00000003,0px_16px_32px_0px_#00000003,0px_2px_64px_0px_#00000005,0px_4px_32px_0px_#00000005] rounded-3xl'>
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            // value={username}
            // onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your email address"
            required
          />
          <div className='relative'>
            <Input
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              // value={username}
              // onChange={(e) => setUsername(e.target.value)}
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
          <div className='relative'>
            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              // value={username}
              // onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter password"
              inputStyles='pr-10'
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              className="absolute right-3 top-9 flex items-center text-neutral-400 transition-colors hover:text-neutral-700"
            >
              {showConfirmPassword ? <IconEye className='size-5 stroke-[1.8px]' /> : <IconEyeClosed className='size-5 stroke-[1.8px]' />}
            </button>
          </div>
          <Button
            type='submit'
            variant='primary'
            label='CREATE ACCOUNT'
            // label={isLoading ? 'Logging in…' : 'Log me in'}
            // disabled={isLoading}
            styles='w-full flex-center mt-0 h-9.5'
          >
            {/* {isLoading && <Spinner size='18' />} */}
          </Button>
          <div className='flex-center pt-2'>
            <p className='text-[#73726C]'>Already have an account? <a href='/login' className='text-[#141413] hover:text-[#d59215] font-semibold transition-smooth'>Log in</a></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SignUp