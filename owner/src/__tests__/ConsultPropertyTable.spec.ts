import { describe, expect, it } from 'vitest'
import source from '../components/property/ConsultProperty.vue?raw'
import {
  APPLICANT_COLUMNS,
  APPLICANT_TABLE_COLUMN_COUNT
} from '../components/property/applicantColumns'

function sliceBetween(text: string, opening: string, closing: string) {
  const start = text.indexOf(opening)
  return text.slice(start, text.indexOf(closing, start))
}

function countCells(markup: string, tag: 'td' | 'th') {
  return markup.match(new RegExp(`<${tag}[\\s>]`, 'g'))?.length ?? 0
}

const header = sliceBetween(source, '<thead>', '</thead>')
const applicantRow = sliceBetween(sliceBetween(source, '<tbody', '</tbody>'), '<tr ', '</tr>')

describe('applicant table layout', () => {
  it('gives the applicant row one cell per declared column', () => {
    expect(countCells(applicantRow, 'td')).toBe(APPLICANT_TABLE_COLUMN_COUNT)
  })

  it('heads the selection column so headers stay aligned with cells', () => {
    expect(header).toContain('<th scope="col">')
    expect(header).toContain("v-for=\"(_, col) of APPLICANT_COLUMNS\"")
  })

  it('names every header cell as a column header', () => {
    expect(countCells(header, 'th')).toBe(header.match(/scope="col"/g)?.length ?? 0)
  })

  it('spans the expanded row over every column rather than a fixed width', () => {
    expect(source).toContain(':colspan="APPLICANT_TABLE_COLUMN_COUNT"')
    expect(source).not.toMatch(/colspan="\d/)
  })

  it('sorts on columns backed by an applicant field', () => {
    const fields = Object.values(APPLICANT_COLUMNS)
    expect(new Set(fields).size).toBe(fields.length)
  })
})
