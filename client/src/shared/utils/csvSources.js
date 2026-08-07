const normalizeHeader = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const splitCsvLine = (line) => {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

const escapeCsvCell = (value) => {
  const serialized = `${value ?? ''}`
  if (serialized.includes(',') || serialized.includes('"') || serialized.includes('\n')) {
    return `"${serialized.replace(/"/g, '""')}"`
  }

  return serialized
}

const fieldAliases = {
  x: ['twitter', 'x', 'xtwitter', 'xcom'],
  facebook: ['facebook', 'fb'],
  reddit: ['reddit'],
  youtube: ['youtube', 'yt'],
}

const resolveColumnIndex = (headers, aliases) => {
  for (let index = 0; index < headers.length; index += 1) {
    if (aliases.includes(headers[index])) {
      return index
    }
  }
  return -1
}

export const parseSourcesCsvText = (csvText) => {
  const cleaned = csvText.replace(/^\uFEFF/, '').trim()
  if (!cleaned) {
    return []
  }

  const lines = cleaned
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!lines.length) {
    return []
  }

  const headerCells = splitCsvLine(lines[0]).map(normalizeHeader)

  const xIndex = resolveColumnIndex(headerCells, fieldAliases.x)
  const facebookIndex = resolveColumnIndex(headerCells, fieldAliases.facebook)
  const redditIndex = resolveColumnIndex(headerCells, fieldAliases.reddit)
  const youtubeIndex = resolveColumnIndex(headerCells, fieldAliases.youtube)

  return lines.slice(1).map((line, rowIndex) => {
    const cells = splitCsvLine(line)

    return {
      id: rowIndex + 1,
      x: xIndex >= 0 ? (cells[xIndex] ?? '') : '',
      facebook: facebookIndex >= 0 ? (cells[facebookIndex] ?? '') : '',
      reddit: redditIndex >= 0 ? (cells[redditIndex] ?? '') : '',
      youtube: youtubeIndex >= 0 ? (cells[youtubeIndex] ?? '') : '',
    }
  })
}

export const parseSourcesCsvFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const text = `${reader.result ?? ''}`
        resolve(parseSourcesCsvText(text))
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('Unable to read CSV file.'))
    reader.readAsText(file)
  })

export const buildSourcesCsv = (rows) => {
  const header = 'twitter,facebook,reddit,youtube'
  const body = rows
    .map((row) => [
      escapeCsvCell(row.x),
      escapeCsvCell(row.facebook),
      escapeCsvCell(row.reddit),
      escapeCsvCell(row.youtube),
    ].join(','))
    .join('\n')

  return body ? `${header}\n${body}` : `${header}\n`
}

export const downloadSourcesCsvTemplate = () => {
  const template = buildSourcesCsv([
    { x: '', facebook: '', reddit: '', youtube: '' },
    { x: '', facebook: '', reddit: '', youtube: '' },
    { x: '', facebook: '', reddit: '', youtube: '' },
  ])

  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'sample-sources-template.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}