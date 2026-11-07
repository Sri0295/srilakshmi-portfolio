/**
 * Skills — static editorial groupings (no auto-scrolling ticker).
 * Only technologies established by the résumés and owner approvals.
 */

export interface SkillGroup {
  id: string
  title: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'programming',
    title: 'Programming',
    skills: ['Python', 'SQL', 'JavaScript', 'HTML5', 'CSS3'],
  },
  {
    id: 'backend',
    title: 'Backend',
    skills: ['Django', 'Flask', 'REST APIs'],
  },
  {
    id: 'analytics',
    title: 'Data Analytics',
    skills: ['Pandas', 'NumPy', 'Microsoft Excel', 'Power BI'],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    skills: ['XGBoost', 'CNN', 'Machine Learning'],
  },
  {
    id: 'cv',
    title: 'Computer Vision',
    skills: ['OpenCV', 'Roboflow'],
  },
  {
    id: 'tools',
    title: 'Tools',
    skills: ['Git', 'GitHub'],
  },
]
