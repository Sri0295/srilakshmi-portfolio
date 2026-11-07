/**
 * Certifications — every entry below is backed by a real certificate PDF
 * supplied by the owner (public/certificates/). No fabricated credentials.
 */
export interface Certification {
  id: string
  title: string
  issuer: string
  /** Issue date exactly as printed on the certificate */
  issueDate: string | null
  /** Official verification link printed on the certificate, if any */
  credentialUrl: string | null
  /** Owner-supplied certificate PDF */
  pdf: string | null
  verified: boolean
}

export const certifications: Certification[] = [
  {
    id: 'aws-cloud-architecting',
    title: 'AWS Academy Graduate — Cloud Architecting',
    issuer: 'AWS Academy',
    issueDate: 'August 2025',
    credentialUrl: 'https://www.credly.com/go/6Ik4oWco',
    pdf: '/certificates/aws-academy-cloud-architecting.pdf',
    verified: true,
  },
  {
    id: 'cs50p',
    title: 'CS50P: Introduction to Programming with Python',
    issuer: 'Harvard University',
    issueDate: '2024',
    credentialUrl: 'https://cs50.harvard.edu/certificates/c2475684-2e9b-4fe2-ae64-cdf9731e8276',
    pdf: '/certificates/cs50p-harvard.pdf',
    verified: true,
  },
  {
    id: 'ibm-data-science',
    title: 'Digital Badge in Data Science — Data Science 101 (DS0101EN)',
    issuer: 'IBM SkillsBuild',
    issueDate: 'June 2023',
    credentialUrl:
      'https://courses.skillsbuild.skillsnetwork.site/certificates/217f60590e504ea8bfcdd2c92da72a95',
    pdf: '/certificates/ibm-data-science-101.pdf',
    verified: true,
  },
  {
    id: 'tata-dataviz',
    title: 'Data Visualisation: Empowering Business with Effective Insights',
    issuer: 'Tata — Forage Job Simulation',
    issueDate: 'December 2025',
    credentialUrl: null,
    pdf: '/certificates/tata-data-visualisation-forage.pdf',
    verified: true,
  },
]
