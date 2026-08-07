import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { IconDownload } from '@tabler/icons-react'
import { Button, EditableTable } from '../../shared/components/ui'
import { ImportPublishersModal } from '../../shared/components/custom'

const Publishers = () => {
  const columns = useMemo(
    () => [
      { key: 'website-link', label: 'WEBSITE LINK', placeholder: 'https://example.com' },
      { key: 'publication-name', label: 'PUBLICATION NAME', placeholder: 'Publication Name' },
    ],
    []
  )

  const [rows, setRows] = useState([
    { id: 1, 'website-link': '', 'publication-name': '' },
  ])
  const [rowsToAdd, setRowsToAdd] = useState('1')
  const [isImportOpen, setIsImportOpen] = useState(false)

  const hasContent = rows.some((row) => columns.some((column) => row[column.key]?.trim()))

  const updateCell = (rowIndex, key, value) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex ? { ...row, [key]: value } : row
      )
    )
  }

  const addRows = () => {
    const parsedCount = Number.parseInt(rowsToAdd, 10)
    const count = Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 1

    setRows((current) => {
      const nextStartId = current.length > 0 ? Math.max(...current.map((row) => row.id)) + 1 : 1
      const nextRows = Array.from({ length: count }, (_, index) => ({
        id: nextStartId + index,
        'website-link': '',
        'publication-name': '',
      }))

      return [...current, ...nextRows]
    })
  }

  const handleImportRows = (importedRows) => {
    if (!importedRows.length) {
      return
    }

    setRows(
      importedRows.map((row, index) => ({
        id: index + 1,
        'website-link': row['website-link'] ?? '',
        'publication-name': row['publication-name'] ?? '',
      }))
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-center min-h-screen p-4 pt-5 pl-20"
    >
      <div className='mx-auto flex min-h-[calc(99vh-1rem)] w-full max-w-3xl flex-col gap-5'>
        <div className='flex gap-4 justify-between'>
          <div className='flex-1'>
            <h3>Publishers</h3>
            <p className='text-base'>Upload an Excel file with your social media followers</p>
          </div>
          <div className='flex items-center flex-1 justify-end gap-2'>
            <Button
              type='button'
              variant='accent'
              label='IMPORT CSV/EXCEL'
              onClick={() => setIsImportOpen(true)}
              styles='!w-auto px-4 flex-row-reverse'
              size='lg'
            >
              <IconDownload className='size-4 stroke-[2.5px]' />
            </Button>
            <Button
              type='submit'
              variant='primary'
              label='NEXT'
              disabled={!hasContent}
              styles='w-full max-w-36'
              size='lg'
            >
            </Button>
          </div>
        </div>
        <EditableTable
          columns={columns}
          rows={rows}
          onCellChange={updateCell}
          addRowsValue={rowsToAdd}
          onAddRowsValueChange={setRowsToAdd}
          onAddRows={addRows}
          className='flex flex-col flex-1 justify-between h-full'
        />
        <ImportPublishersModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImport={handleImportRows}
        />
      </div>
    </motion.section>
  )
}

export default Publishers