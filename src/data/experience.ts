/**
 * EXPERIENCE — with publication gating.
 *
 * The Doosan Bobcat internship was confirmed by the owner (Nov 2026) and is
 * published with the approved title, dates and responsibility points.
 * TVS Motors remains a draft (present in résumé v1 only) until confirmed.
 */

export interface ExperienceEntry {
  id: string
  org: string
  location: string
  role: string
  period: string
  summary: string
  /** Owner-approved responsibility points (rendered verbatim) */
  responsibilities?: string[]
  tech?: string[]
  github?: string
  /** Opens the matching case-study overlay */
  projectSlug?: string
  publish: boolean
  /** Draft-only note — never rendered while unpublished */
  conflictNote?: string
}

export const experience: ExperienceEntry[] = [
  {
    id: 'doosan-bobcat',
    org: 'Doosan Bobcat Pvt Ltd',
    location: 'Chennai',
    role: 'Data Analytics Intern',
    period: 'Jun 2025 – Sep 2025',
    summary:
      'Built the sales analytics pipeline end to end — from raw record validation to an interactive Power BI dashboard used for business insights.',
    responsibilities: [
      'Wrote Python (Pandas, NumPy) scripts to clean and validate 10,000+ sales records, removing duplicates and handling missing values to improve data quality.',
      'Developed SQL queries across sales, products, complaints, and tickets tables for faster data retrieval and KPI analysis.',
      'Performed EDA and statistical analysis (outliers, skewness, correlation), uncovering a strong Sales–Profit relationship (r = 0.83).',
      'Built Excel reports and a 3-page Power BI dashboard with interactive KPIs, identifying Laptop (22% of sales) and West region (28% of sales) as key contributors.',
    ],
    tech: ['Python', 'Pandas', 'NumPy', 'SQL', 'Excel', 'Power BI'],
    github: 'https://github.com/Sri0295/Sales-Data-Analysis',
    projectSlug: 'sales-data-analysis',
    publish: true,
  },
  {
    id: 'tvs-motors',
    org: 'TVS Motors',
    location: 'Hosur',
    role: 'Trainee',
    period: 'Feb 2024',
    summary:
      'Practical exposure to IoT and automation tools in the automobile sector; observed technology integration in production lines and learned about corporate processes and team structures.',
    publish: false,
    conflictNote:
      'Present in résumé v1 only — absent from the newer résumé v2. Confirm before publishing.',
  },
]

export const publishedExperience = experience.filter((e) => e.publish)
