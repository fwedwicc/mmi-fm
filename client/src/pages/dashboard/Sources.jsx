import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { IconDownload } from '@tabler/icons-react'
import { Button, EditableTable } from '../../shared/components/ui'
import { ImportSourcesModal } from '../../shared/components/custom'
import { dashboardService } from '../../shared/service/dashboardService'
import { useDashboardStore } from '../../shared/store'
import { showToast } from '../../shared/utils/toast'

// Accepted domains per platform (checked against the URL's hostname)
const domainsByKey = {
  x: ['x.com', 'twitter.com'],
  facebook: ['facebook.com', 'fb.com'],
  reddit: ['reddit.com'],
  youtube: ['youtube.com', 'youtu.be'],
}

const isValidPlatformUrl = (value, key) => {
  if (!value?.trim()) {
    return false
  }

  let parsedUrl

  try {
    parsedUrl = new URL(value.trim())
  } catch {
    return false
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return false
  }

  const allowedDomains = domainsByKey[key]

  if (!allowedDomains) {
    return true
  }

  const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, '')

  return allowedDomains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  )
}

const Sources = () => {
  const navigate = useNavigate()
  const completeStep = useDashboardStore(
    (state) => state.completeStep
  )

  const columns = useMemo(
    () => [
      { key: 'x', label: 'X (TWITTER)', placeholder: 'https://x.com/example' },
      { key: 'facebook', label: 'FACEBOOK', placeholder: 'https://facebook.com/example' },
      { key: 'reddit', label: 'REDDIT', placeholder: 'https://reddit.com/r/example' },
      { key: 'youtube', label: 'YOUTUBE', placeholder: 'https://youtube.com/example' },
    ],
    []
  )

  const [rows, setRows] = useState([
    { id: 1, x: '', facebook: '', reddit: '', youtube: '' },
  ])
  const [rowsToAdd, setRowsToAdd] = useState('1')
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid =
    rows.length > 0 &&
    rows.every((row) =>
      columns.every((column) => isValidPlatformUrl(row[column.key], column.key))
    )

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
        x: '',
        facebook: '',
        reddit: '',
        youtube: '',
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
        x: row.x ?? '',
        facebook: row.facebook ?? '',
        reddit: row.reddit ?? '',
        youtube: row.youtube ?? '',
      }))
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isLoading) {
      return
    }

    if (!isFormValid) {
      const invalidRowIndex = rows.findIndex((row) =>
        columns.some((column) => !isValidPlatformUrl(row[column.key], column.key))
      )
      const invalidColumn = columns.find(
        (column) => !isValidPlatformUrl(rows[invalidRowIndex]?.[column.key], column.key)
      )

      showToast.warning(
        `Row ${invalidRowIndex + 1}: enter a valid ${invalidColumn?.label ?? ''} link.`
      )
      return
    }

    setIsLoading(true)

    try {
      await dashboardService.saveSources({
        sources: rows.map(({ id, ...source }) => source),
      })

      // Mark sources step as completed
      completeStep('sources')

      showToast.success(
        'Sources saved successfully!'
      )

      // Move to next onboarding step
      navigate('/onboarding/publishers')

    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to save sources. Please try again.'

      showToast.error(message)

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-center min-h-screen p-4 pt-5 pl-20"
    >
      <form onSubmit={handleSubmit} className='mx-auto flex min-h-[calc(99vh-1rem)] w-full max-w-5xl flex-col gap-5'>
        <div className='flex gap-4 justify-between'>
          <div className='flex-1'>
            <h3>Sources</h3>
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
              label={isLoading ? 'SAVING...' : 'NEXT'}
              disabled={!isFormValid || isLoading}
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
        <ImportSourcesModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImport={handleImportRows}
        />
      </form>
    </motion.section>
  )
}

export default Sources