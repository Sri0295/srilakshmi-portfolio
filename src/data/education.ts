export interface EducationEntry {
  id: string
  degree: string
  institution: string
  period: string
  result: string
}

/** University education only — school history removed by owner decision. */
export const education: EducationEntry[] = [
  {
    id: 'be-cse',
    degree: 'B.E. Computer Science Engineering',
    institution: 'PMC Tech, Hosur',
    period: '2022 – 2026',
    result: 'CGPA 8.0 / 10',
  },
]
