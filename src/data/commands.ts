import { profile } from './profile'
import { projects } from './projects'

/**
 * CENTRAL COMMAND REGISTRY (command palette)
 * ------------------------------------------
 * Every command has a unique id, label, description, category, search
 * keywords and a declarative action. Execution lives in App.runCommandAction
 * so the palette can close and release the scroll lock before any scrolling
 * happens — navigating while Lenis is stopped is a silent no-op.
 */

export type CommandAction =
  | { type: 'scroll'; sectionId: string }
  | { type: 'download-resume' }
  | { type: 'recruiter' }
  | { type: 'case-study'; slug: string }
  | { type: 'link'; url: string }
  | { type: 'copy-email' }

export interface CommandDefinition {
  id: string
  label: string
  description: string
  category: 'Navigate' | 'Actions' | 'Case studies' | 'Connect'
  keywords: string
  action: CommandAction
}

export const commandDefinitions: CommandDefinition[] = [
  {
    id: 'go-about',
    label: 'Go to About',
    description: 'Profile, interests and certification overview',
    category: 'Navigate',
    keywords: 'about bio profile introduction more than just code',
    action: { type: 'scroll', sectionId: 'about' },
  },
  {
    id: 'go-projects',
    label: 'View Projects',
    description: 'Four end-to-end builds across ML, CV and analytics',
    category: 'Navigate',
    keywords: 'projects work portfolio selected builds shipped',
    action: { type: 'scroll', sectionId: 'projects' },
  },
  {
    id: 'go-experience',
    label: 'View Experience',
    description: 'Internship and career timeline',
    category: 'Navigate',
    keywords: 'experience journey internship timeline career doosan',
    action: { type: 'scroll', sectionId: 'experience' },
  },
  {
    id: 'go-expertise',
    label: 'View Expertise',
    description: 'Capability areas and the skill constellation',
    category: 'Navigate',
    keywords: 'expertise skills stack technologies capabilities services',
    action: { type: 'scroll', sectionId: 'expertise' },
  },
  {
    id: 'go-education',
    label: 'View Education',
    description: 'Degree, institution and academic record',
    category: 'Navigate',
    keywords: 'education degree university college study foundations cgpa',
    action: { type: 'scroll', sectionId: 'education' },
  },
  {
    id: 'go-certifications',
    label: 'View Certifications',
    description: 'AWS, Harvard CS50P, IBM and Tata credentials',
    category: 'Navigate',
    keywords: 'certifications credentials awards certificates courses backed by proof',
    action: { type: 'scroll', sectionId: 'certifications' },
  },
  {
    id: 'download-resume',
    label: 'Download Résumé',
    description: 'Srilakshmi-S-Resume.pdf',
    category: 'Actions',
    keywords: 'resume cv download pdf résumé file',
    action: { type: 'download-resume' },
  },
  {
    id: 'open-recruiter',
    label: 'Open Recruiter View',
    description: 'Compact professional summary in one panel',
    category: 'Actions',
    keywords: 'recruiter quick view summary hr hiring manager print',
    action: { type: 'recruiter' },
  },
  ...projects.map<CommandDefinition>((p) => ({
    id: `case-${p.slug}`,
    label: `Case study: ${p.shortTitle}`,
    description: p.tagline,
    category: 'Case studies',
    keywords: `case study project ${p.title} ${p.category} ${p.tech.join(' ')}`,
    action: { type: 'case-study', slug: p.slug },
  })),
  {
    id: 'open-github',
    label: 'Open GitHub',
    description: profile.contact.githubHandle,
    category: 'Connect',
    keywords: 'github code repositories source new_sri',
    action: { type: 'link', url: profile.contact.github },
  },
  {
    id: 'open-linkedin',
    label: 'Open LinkedIn',
    description: 'Professional profile',
    category: 'Connect',
    keywords: 'linkedin profile network connect',
    action: { type: 'link', url: profile.contact.linkedin },
  },
  {
    id: 'copy-email',
    label: 'Copy email address',
    description: profile.contact.email,
    category: 'Connect',
    keywords: 'email contact copy mail address write',
    action: { type: 'copy-email' },
  },
]
