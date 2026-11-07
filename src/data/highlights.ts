import type { MetricId } from './contentVerification'

/**
 * PROFESSIONAL HIGHLIGHTS
 * Cards with a `metricId` render ONLY when that metric is flipped to
 * 'verified' in contentVerification.ts. Self-evident cards (counts that the
 * page itself demonstrates, or model design facts stated identically in both
 * résumés) are published directly.
 */
export interface Highlight {
  id: string
  label: string
  value?: number
  display?: string
  metricId?: MetricId
  verified: boolean
  /** Shown on click — methodology or pointer to the relevant project. */
  detail: string
  /** Where "view project" takes the visitor */
  projectSlug?: string
  accent: 'brand' | 'coral' | 'aqua' | 'lime' | 'peach'
}

export const highlights: Highlight[] = [
  {
    id: 'core-projects',
    label: 'Core Python & ML projects designed, built and deployed end to end',
    value: 3,
    display: '3',
    verified: true,
    detail:
      'Code-quality platform, diabetic-retinopathy classifier and face-detection system — each listed in the Projects section with links.',
    accent: 'brand',
  },
  {
    id: 'certifications',
    label: 'Professional certifications across cloud, programming and data',
    value: 4,
    display: '4',
    verified: true,
    detail: 'AWS Academy, Harvard CS50P, IBM SkillsBuild and Tata — listed in the Certifications section.',
    accent: 'aqua',
  },
  {
    id: 'dr-stages',
    label: 'Diabetic-retinopathy severity stages the CNN distinguishes',
    value: 5,
    display: '5',
    verified: true,
    detail:
      'A design characteristic of the classifier (five-stage DR scale) stated in both résumés — not a performance metric.',
    projectSlug: 'diabetic-retinopathy',
    accent: 'coral',
  },
  {
    id: 'code-samples',
    label: 'Labelled Python code samples curated for model training',
    metricId: 'codePlatformSamples',
    verified: false,
    detail: 'Pending verification of the dataset in the project repository.',
    projectSlug: 'code-quality-platform',
    accent: 'lime',
  },
  {
    id: 'sales-records',
    label: 'Sales records cleaned, validated and analysed',
    metricId: 'salesRecords',
    verified: false,
    detail: 'Pending verification against the source dataset.',
    projectSlug: 'sales-data-analysis',
    accent: 'peach',
  },
]
