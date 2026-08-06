import React from 'react'

// Base styles
const base = 'inline-flex w-full font-chivo items-center justify-center rounded-lg text-sm font-medium transition duration-300 ease-in-out'

// Size styles
const sizes = {
  sm: 'h-[32px] gap-1',
  lg: 'h-[38px] gap-2',
}

// Variant styles
const variants = {
  primary: 'bg-[#121212] text-[#f3f3f3] hover:bg-[#292828] hover:text-[#f5ba4c]',
  secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300/60',
  // accentPrimary: 'bg-red-800 text-white hover:bg-red-700',
  // accentSecondary: 'bg-red-100 text-red-800 hover:bg-red-200 font-medium',
  ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-200/50',
  outline: 'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100',
  success: 'bg-green-100 text-green-700 hover:bg-green-200',
  info: 'text-blue-700 hover:bg-blue-300/30 bg-blue-200/30',
  warning: 'text-yellow-700 hover:bg-yellow-300/30 bg-yellow-200/30',
  danger: 'bg-red-100 text-red-700 hover:bg-red-200',
}

const Button = ({ type, styles = '', variant, size = 'sm', label, disabled, onClick, children }) => {
  const variantStyle = variants[variant] || ''
  const sizeStyle = sizes[size] || ''

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${base} 
        ${variantStyle} 
        ${sizeStyle} 
        ${styles} 
        ${disabled ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'}
      `}
    >
      {label}
      {children}
    </button>
  )
}

export default Button