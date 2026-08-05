import React from 'react'
import { Button, Input } from '../../shared/components/ui'

const Login = () => {
  return (
    <div>Login
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
      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        // value={username}
        // onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter password"
        required
      />
    </div>
  )
}

export default Login