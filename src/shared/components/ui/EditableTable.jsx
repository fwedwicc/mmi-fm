import React from 'react'
import { IconArrowDown } from '@tabler/icons-react'

const EditableTable = ({
  columns,
  rows,
  onCellChange,
  addRowsValue,
  onAddRowsValueChange,
  onAddRows,
  className = '',
}) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className='overflow-x-auto bg-white rounded-t-2xl'>
        <table className='min-w-full border-separate border-spacing-0'>
          <thead>
            <tr className='bg-[#edece5]'>
              <th className='w-10 rounded-tl-2xl px-3 py-2.75 border-b border-[#e3e3db]' />
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`px-4 py-2.75 text-left text-xs font-bold font-chivo uppercase text-[#2B2923] border-b border-[#e3e3db] ${index === columns.length - 1 ? 'rounded-tr-2xl' : ''
                    }`}
                >
                  <span className='inline-flex items-center gap-2'>
                    {column.label}
                    <IconArrowDown className='size-3.5 shrink-0 stroke-[2px]' />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F1]'}>
                <td className='w-10 px-3 py-1.5 text-sm text-[#3A3831] border-b border-[#eeeeeb]'>{rowIndex + 1}</td>
                {columns.map((column) => (
                  <td key={column.key} className='px-4 py-1.5 border-b border-[#eeeeeb]'>
                    <input
                      type='text'
                      value={row[column.key] ?? ''}
                      onChange={(event) => onCellChange(rowIndex, column.key, event.target.value)}
                      placeholder={column.placeholder}
                      className='w-full border-0 bg-transparent py-1.5 px-3 text-[14px] text-[#2B2923] placeholder:text-[#A7A298] focus:outline-none focus:ring-2 rounded-md focus:ring-[#f4ede2] transition-smooth'
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-auto flex items-center gap-2 border-t border-[#F1EFE4] bg-white px-4 py-2.75 text-sm text-[#3D3A33]'>
        <span className='font-semibold me-3'>Add</span>
        <input
          type='number'
          min='1'
          value={addRowsValue}
          onChange={(event) => onAddRowsValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onAddRows()
            }
          }}
          className='h-6 w-10 rounded-md border border-[#dedddd] bg-white text-center text-sm text-[#2B2923] outline-none transition focus:border-[#CDBEAA] focus:ring-2 focus:ring-[#F3E6D7]'
        />
        <span className='text-[#73726c]'>more rows</span>
      </div>
    </div>
  )
}

export default EditableTable