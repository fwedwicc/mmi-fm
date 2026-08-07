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
  websiteLink: ['website-link', 'websitelink', 'url', 'link'].map(normalizeHeader),
  publicationName: ['publication-name', 'publicationname', 'name', 'publication'].map(normalizeHeader),
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

  const websiteLinkIndex = resolveColumnIndex(headerCells, fieldAliases.websiteLink)
  const publicationNameIndex = resolveColumnIndex(headerCells, fieldAliases.publicationName)

  return lines.slice(1).map((line, rowIndex) => {
    const cells = splitCsvLine(line)

    return {
      id: rowIndex + 1,
      websiteLink: websiteLinkIndex >= 0 ? (cells[websiteLinkIndex] ?? '') : '',
      publicationName: publicationNameIndex >= 0 ? (cells[publicationNameIndex] ?? '') : '',
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
      escapeCsvCell(row.websiteLink),
      escapeCsvCell(row.publicationName),
    ].join(','))
    .join('\n')

  return body ? `${header}\n${body}` : `${header}\n`
}

export const downloadPublishersCsvTemplate = () => {
  const template = buildPublishersCsv([
    { websiteLink: '', publicationName: '' },
    { websiteLink: '', publicationName: '' },
    { websiteLink: '', publicationName: '' },
  ])

  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'sample-publishers-template.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}