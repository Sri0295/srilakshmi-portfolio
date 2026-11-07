export interface EducationEntry {
  id: string
  degree: string
  institution: string
  period: string
  result: string
  /** Main entry gets a full card; earlier schooling is compact/collapsible. */
  primary?: boolean
}

export const education: EducationEntry[] = [
  {
    id: 'be-cse',
    degree: 'B.E. Computer Science Engineering',
    institution: 'PMC Tech, Hosur',
    period: '2022 – 2026',
    result: 'CGPA 8.0/10',
    primary: true,
  },
  {
    id: 'hsc',
    degree: 'HSC (Higher Secondary)',
    institution: 'GGHS, Bagalur',
    period: '2020 – 2022',
    result: '75%',
  },
  {
    id: 'sslc',
    degree: 'SSLC (Secondary School)',
    institution: 'GGHS, Bagalur',
    period: '2019 – 2020',
    result: '77%',
  },
]
