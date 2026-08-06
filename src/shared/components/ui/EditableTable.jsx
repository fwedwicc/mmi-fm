import React from 'react'
import { IconArrowDown } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import TableAddRows from '../custom/onboarding/TableAddRows'

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
            <AnimatePresence initial={false} mode='popLayout'>
              {rows.map((row, rowIndex) => (
                <motion.tr
                  key={row.id ?? rowIndex}
                  layout
                  initial={{ opacity: 0, y: -2, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -2, scale: 0.99 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f5f4ed]'}
                >
                  <td className='w-10 px-3 py-1.5 text-sm text-[#3A3831] border-b border-[#eeeeeb]'>{rowIndex + 1}</td>
                  {columns.map((column) => (
                    <td key={column.key} className='px-4 py-1.5 border-b border-[#eeeeeb]'>
                      <input
                        type='text'
                        value={row[column.key] ?? ''}
                        onChange={(event) => onCellChange(rowIndex, column.key, event.target.value)}
                        placeholder={column.placeholder}
                        className='w-full border-0 bg-transparent py-1.5 px-3 text-[14px] text-[#2B2923] placeholder:text-[#A7A298] focus:outline-none focus:ring-2 rounded-md focus:ring-[#f4ede2] hover:bg-[#fcf9f5] transition-smooth'
                      />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <TableAddRows
        value={addRowsValue}
        onChange={onAddRowsValueChange}
        onAdd={onAddRows}
      />
    </div>
  )
}

export default EditableTable