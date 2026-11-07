export interface Certification {
  id: string
  title: string
  issuer: string
  /** Left null on purpose — no credential URLs/IDs were supplied. Do not fabricate. */
  credentialUrl: string | null
  /** Date only shown when verified by the owner. */
  date: string | null
  accent: 'brand' | 'coral' | 'aqua' | 'lime'
}

export const certifications: Certification[] = [
  {
    id: 'aws-cloud-architecting',
    title: 'AWS Academy Graduate — Cloud Architecting',
    issuer: 'AWS Academy',
    credentialUrl: null,
    date: null,
    accent: 'coral',
  },
  {
    id: 'cs50p',
    title: 'CS50P: Introduction to Programming with Python',
    issuer: 'Harvard University',
    credentialUrl: null,
    date: null,
    accent: 'brand',
  },
  {
    id: 'ibm-data-science',
    title: 'Digital Badge in Data Science',
    issuer: 'IBM SkillsBuild / Credly',
    credentialUrl: null,
    date: null,
    accent: 'aqua',
  },
  {
    id: 'tata-dataviz',
    title: 'Data Visualization: Empowering Business with Effective Insights',
    issuer: 'Tata (Forage Job Simulation)',
    credentialUrl: null,
    date: null,
    accent: 'lime',
  },
]
