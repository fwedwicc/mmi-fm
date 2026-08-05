import React, { useState } from 'react'
import { Button, Input } from '../../shared/components/ui'

const AccountInformation = () => {

  return (
    <main className='flex-center h-screen'>
      <div className='flex-col flex-center w-full gap-2'>
        {/* Sign up form */}
        <div className='w-full max-w-124 p-6.75 space-y-6 bg-[#FAF9F5] border border-[#1F1E1D]/15 shadow-[0px_4px_4px_0px_#00000003,0px_16px_32px_0px_#00000003,0px_2px_64px_0px_#00000005,0px_4px_32px_0px_#00000005] rounded-3xl'>
          {/* Header */}
          <div className='flex-col space-y-0.5'>
            <h3>Account Information</h3>
            <p className='text-base leading-none'>Create your account to get started with your newsletter journey</p>
          </div>
          <div className='space-y-4'>
            <Input
              label="First Name"
              id="first-name"
              name="first-name"
              type="text"
              // value={username}
              // onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your first name"
              required
            />
            <Input
              label="Last Name"
              id="last-name"
              name="last-name"
              type="text"
              // value={username}
              // onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your last name"
              required
            />
            <Input
              label="Job Title"
              id="job-title"
              name="job-title"
              type="text"
              // value={username}
              // onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your job title"
              required
            />
          </div>
          <Button
            type='submit'
            variant='primary'
            label='NEXT'
            // label={isLoading ? 'Logging in…' : 'Log me in'}
            // disabled={isLoading}
            styles='w-full flex-center h-9.5'
          >
            {/* {isLoading && <Spinner size='18' />} */}
          </Button>
        </div>
      </div>
    </main>
  )
}

export default AccountInformation