import React from 'react'
import Button from '../../ui/Button'

const TableAddRows = ({ value, onChange, onAdd, label = 'Add', suffix = 'more rows' }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onAdd()
    }
  }

  return (
    <div className='mt-auto flex items-center gap-2 border-t border-[#F1EFE4] bg-white px-4 py-2.75 text-sm text-[#3D3A33]'>
      <Button
        type='button'
        variant='ghost'
        label={label}
        onClick={onAdd}
        styles='!w-auto px-2.5 !h-7.5 text-sm font-semibold text-[#2B2923] hover:bg-[#f4f1e8]'
      />
      <input
        type='number'
        min='1'
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        className='h-6 w-10 rounded-md border border-[#dedddd] bg-white px-0 text-center text-sm text-[#2B2923] outline-none transition focus:border-[#CDBEAA] focus:ring-2 focus:ring-[#F3E6D7]'
      />
      <span className='text-[#73726c]'>{suffix}</span>
    </div>
  )
}

export default TableAddRows