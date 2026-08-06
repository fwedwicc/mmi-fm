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
  'website-link': ['website-link', 'url', 'link'].map(normalizeHeader),
  'publication-name': ['publication-name', 'name', 'publication'].map(normalizeHeader),
}

const resolveColumnIndex = (headers, aliases) => {
  for (let index = 0; index < headers.length; index += 1) {
    if (aliases.includes(headers[index])) {
      return index
    }
  }
  return -1
}

export const parsePublishersCsvText = (csvText) => {
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

  const WebsiteLinkIndex = resolveColumnIndex(headerCells, fieldAliases['website-link'])
  const PublicationNameIndex = resolveColumnIndex(headerCells, fieldAliases['publication-name'])

  return lines.slice(1).map((line, rowIndex) => {
    const cells = splitCsvLine(line)

    return {
      id: rowIndex + 1,
      'website-link': WebsiteLinkIndex >= 0 ? (cells[WebsiteLinkIndex] ?? '') : '',
      'publication-name': PublicationNameIndex >= 0 ? (cells[PublicationNameIndex] ?? '') : '',
    }
  })
}

export const parsePublishersCsvFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const text = `${reader.result ?? ''}`
        resolve(parsePublishersCsvText(text))
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('Unable to read CSV file.'))
    reader.readAsText(file)
  })

export const buildPublishersCsv = (rows) => {
  const header = 'website-link,publication-name'
  const body = rows
    .map((row) => [
      escapeCsvCell(row['website-link']),
      escapeCsvCell(row['publication-name']),
    ].join(','))
    .join('\n')

  return body ? `${header}\n${body}` : `${header}\n`
}

export const downloadPublishersCsvTemplate = () => {
  const template = buildPublishersCsv([
    { 'website-link': '', 'publication-name': '' },
    { 'website-link': '', 'publication-name': '' },
    { 'website-link': '', 'publication-name': '' },
  ])

  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'sample-publishers-template.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}
