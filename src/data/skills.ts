/**
 * Skills — only technologies established by the two résumés (and the verified
 * deployment on Render). No Django / React / TypeScript / PostgreSQL etc.
 */

export interface SkillCategory {
  id: string
  num: string
  title: string
  blurb: string
  accent: 'brand' | 'aqua' | 'coral' | 'peach'
  skills: string[]
  projectSlugs: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'backend',
    num: '01',
    title: 'Python & Backend Development',
    blurb: 'Designing, debugging and shipping Python services and web applications.',
    accent: 'brand',
    skills: ['Python', 'Django', 'Flask', 'REST APIs', 'Debugging', 'Static Code Analysis'],
    projectSlugs: ['code-quality-platform'],
  },
  {
    id: 'analytics',
    num: '02',
    title: 'Data Analytics',
    blurb: 'Turning raw records into reliable datasets, queries and dashboards.',
    accent: 'aqua',
    skills: [
      'SQL',
      'Pandas',
      'NumPy',
      'Data Cleaning',
      'Exploratory Data Analysis',
      'Microsoft Excel',
      'Power BI',
    ],
    projectSlugs: ['sales-data-analysis'],
  },
  {
    id: 'ml',
    num: '03',
    title: 'Machine Learning',
    blurb: 'Training, evaluating and tuning models end to end.',
    accent: 'coral',
    skills: ['XGBoost', 'CNN', 'Machine Learning', 'Model Evaluation'],
    projectSlugs: ['code-quality-platform', 'diabetic-retinopathy'],
  },
  {
    id: 'cv',
    num: '04',
    title: 'Computer Vision',
    blurb: 'Image pipelines, detection systems and dataset annotation.',
    accent: 'peach',
    skills: ['OpenCV', 'Haar Cascade', 'Image Preprocessing', 'Roboflow (Image Annotation)'],
    projectSlugs: ['haar-cascades', 'diabetic-retinopathy'],
  },
]

/** Continuous technology ticker — verified technologies only. */
export const marqueeTech = [
  'Python',
  'SQL',
  'Flask',
  'Django',
  'REST APIs',
  'HTML5',
  'CSS3',
  'JavaScript',
  'Pandas',
  'NumPy',
  'XGBoost',
  'CNN',
  'OpenCV',
  'Power BI',
  'Git',
  'GitHub',
]

/* ------------------------------------------------------------------ */
/* FEATURE A — Interactive Skill Constellation                         */
/* Hand-laid coordinates on a 1000×560 viewBox.                        */
/* ------------------------------------------------------------------ */

export type ConstellationGroup = 'core' | 'web' | 'data' | 'ml' | 'cv' | 'tools'

export interface ConstellationNode {
  id: string
  label: string
  group: ConstellationGroup
  x: number
  y: number
  projectSlugs: string[]
}

export interface ConstellationEdge {
  from: string
  to: string
}

export const constellationNodes: ConstellationNode[] = [
  { id: 'python', label: 'Python', group: 'core', x: 500, y: 268, projectSlugs: ['code-quality-platform', 'diabetic-retinopathy', 'haar-cascades', 'sales-data-analysis'] },
  { id: 'django', label: 'Django', group: 'web', x: 330, y: 54, projectSlugs: [] },
  { id: 'flask', label: 'Flask', group: 'web', x: 322, y: 148, projectSlugs: ['code-quality-platform', 'diabetic-retinopathy'] },
  { id: 'rest', label: 'REST APIs', group: 'web', x: 236, y: 262, projectSlugs: ['code-quality-platform'] },
  { id: 'html', label: 'HTML5', group: 'web', x: 118, y: 148, projectSlugs: [] },
  { id: 'css', label: 'CSS3', group: 'web', x: 96, y: 288, projectSlugs: [] },
  { id: 'js', label: 'JavaScript', group: 'web', x: 178, y: 66, projectSlugs: [] },
  { id: 'sql', label: 'SQL', group: 'data', x: 682, y: 148, projectSlugs: ['sales-data-analysis'] },
  { id: 'pandas', label: 'Pandas', group: 'data', x: 764, y: 258, projectSlugs: ['sales-data-analysis'] },
  { id: 'numpy', label: 'NumPy', group: 'data', x: 726, y: 366, projectSlugs: ['sales-data-analysis'] },
  { id: 'powerbi', label: 'Power BI', group: 'data', x: 886, y: 372, projectSlugs: ['sales-data-analysis'] },
  { id: 'excel', label: 'Excel', group: 'data', x: 852, y: 480, projectSlugs: ['sales-data-analysis'] },
  { id: 'xgboost', label: 'XGBoost', group: 'ml', x: 318, y: 384, projectSlugs: ['code-quality-platform'] },
  { id: 'cnn', label: 'CNN', group: 'ml', x: 428, y: 470, projectSlugs: ['diabetic-retinopathy'] },
  { id: 'opencv', label: 'OpenCV', group: 'cv', x: 592, y: 452, projectSlugs: ['haar-cascades', 'diabetic-retinopathy'] },
  { id: 'haar', label: 'Haar Cascade', group: 'cv', x: 646, y: 336, projectSlugs: ['haar-cascades'] },
  { id: 'roboflow', label: 'Roboflow', group: 'cv', x: 452, y: 120, projectSlugs: ['haar-cascades'] },
  { id: 'git', label: 'Git', group: 'tools', x: 880, y: 120, projectSlugs: ['code-quality-platform', 'diabetic-retinopathy', 'haar-cascades', 'sales-data-analysis'] },
  { id: 'github', label: 'GitHub', group: 'tools', x: 938, y: 232, projectSlugs: ['code-quality-platform', 'diabetic-retinopathy', 'haar-cascades', 'sales-data-analysis'] },
]

export const constellationEdges: ConstellationEdge[] = [
  { from: 'python', to: 'flask' },
  { from: 'python', to: 'django' },
  { from: 'django', to: 'flask' },
  { from: 'python', to: 'rest' },
  { from: 'python', to: 'sql' },
  { from: 'python', to: 'pandas' },
  { from: 'python', to: 'numpy' },
  { from: 'python', to: 'xgboost' },
  { from: 'python', to: 'cnn' },
  { from: 'python', to: 'opencv' },
  { from: 'python', to: 'roboflow' },
  { from: 'flask', to: 'rest' },
  { from: 'pandas', to: 'numpy' },
  { from: 'sql', to: 'pandas' },
  { from: 'pandas', to: 'powerbi' },
  { from: 'powerbi', to: 'excel' },
  { from: 'xgboost', to: 'cnn' },
  { from: 'cnn', to: 'opencv' },
  { from: 'opencv', to: 'haar' },
  { from: 'js', to: 'html' },
  { from: 'html', to: 'css' },
  { from: 'git', to: 'github' },
  { from: 'git', to: 'python' },
]
