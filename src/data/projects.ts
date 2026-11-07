import type { MetricId } from './contentVerification'

export type Accent = 'brand' | 'coral' | 'aqua' | 'peach'

export interface ArchitectureStep {
  id: string
  title: string
  detail: string
  tech: string[]
}

export interface Project {
  slug: string
  num: string
  title: string
  shortTitle: string
  category: string
  /** One-liner for cards and the recruiter view */
  tagline: string
  description: string
  /** Résumé-grounded engineering contributions */
  contributions: string[]
  tech: string[]
  accent: Accent
  github: string | null
  demo: string | null
  /** Optional note next to the demo link (e.g. cold start behaviour) */
  demoNote?: string
  /** Gated metric ids — rendered only when verified in contentVerification.ts */
  metricIds: MetricId[]
  /** Interactive architecture walkthrough (résumé-grounded pipeline) */
  architecture: ArchitectureStep[]
  /** Case-study overview text */
  overview: string
  /**
   * Extra context shown in the case study (e.g. disputed-internship note).
   * Keep honest and neutral.
   */
  contextNote?: string
  /** Stylised placeholder visual id — used only when no real screenshot exists */
  visual: 'sentinel' | 'dr' | 'haar' | 'sales'
  /** Owner-supplied screenshot; when set it replaces the stylised visual */
  image?: string
  imageWidth?: number
  imageHeight?: number
}

export const projects: Project[] = [
  {
    slug: 'code-quality-platform',
    num: '01',
    title: 'AI-Assisted Python Code Quality & Bug Analysis Platform',
    shortTitle: 'Code Quality Platform',
    category: 'Machine Learning · Flask Web Application',
    tagline: 'A deployed Flask app that predicts bug types, severity and fixes for submitted Python code.',
    description:
      'Developed and deployed a Flask web application that analyses user-submitted Python code and returns predicted bug types, severity levels, explanations and suggested fixes.',
    contributions: [
      'Extracted code metrics using static analysis — lines of code, cyclomatic complexity, maintainability index and Halstead metrics.',
      'Built an XGBoost model for machine-learning-based bug risk prediction across many bug categories.',
      'Collected and preprocessed a large dataset of labelled Python code samples to train and validate the model.',
      'Built an interactive web application for real-time code analysis, bug prediction and automated quality reporting.',
      'Deployed the application publicly on Render.',
    ],
    tech: ['Python', 'Flask', 'XGBoost', 'Static Code Analysis', 'Render'],
    accent: 'brand',
    github: 'https://github.com/Sri0295/NEW_SRI',
    demo: 'https://new-sri.onrender.com',
    demoNote: 'Live demo verified during build — free-tier hosting wakes in ~1 minute.',
    visual: 'sentinel',
    image: '/images/projects/code-quality-platform.jpg',
    imageWidth: 313,
    imageHeight: 149,
    metricIds: ['codePlatformSamples', 'codePlatformAccuracy', 'codePlatformF1', 'codePlatformCategories'],
    architecture: [
      {
        id: 'input',
        title: 'Code Input',
        detail:
          'The visitor submits Python source code through the Flask web interface for analysis.',
        tech: ['Flask'],
      },
      {
        id: 'static',
        title: 'Static Analysis',
        detail:
          'The backend parses the code without executing it and measures structural properties of the program.',
        tech: ['Static Code Analysis'],
      },
      {
        id: 'features',
        title: 'Feature Extraction',
        detail:
          'Software metrics are computed from the parse — lines of code, cyclomatic complexity, maintainability index and Halstead metrics — forming the model’s feature vector.',
        tech: ['Software Metrics'],
      },
      {
        id: 'model',
        title: 'XGBoost Prediction',
        detail:
          'The feature vector is passed to the trained XGBoost model, which predicts the likely bug category and risk level.',
        tech: ['XGBoost'],
      },
      {
        id: 'report',
        title: 'Bug Severity & Suggestions',
        detail:
          'Predictions are rendered back to the user with severity levels, explanations and suggested fixes, plus automated quality reporting.',
        tech: ['Flask'],
      },
    ],
    overview:
      'This platform combines classical static analysis with gradient-boosted machine learning to review Python code automatically. Instead of only linting syntax, it extracts quantitative software metrics and predicts the kinds of defects a file is likely to contain, with explanations and suggested fixes.',
    contextNote:
      'Deployment verified live at new-sri.onrender.com during the portfolio build (title: “SENTINEL AI — Predictive Code Analysis”). Numeric results are withheld until verified.',
  },
  {
    slug: 'diabetic-retinopathy',
    num: '02',
    title: 'Detection of Diabetic Retinopathy',
    shortTitle: 'Diabetic Retinopathy',
    category: 'Deep Learning · Healthcare AI',
    tagline: 'A CNN that grades retinal fundus images across five DR severity stages.',
    description:
      'Designed and trained a CNN-based system to classify diabetic retinopathy into five severity stages using retinal fundus images.',
    contributions: [
      'Performed image preprocessing, normalization and data augmentation to enhance feature extraction on a larger dataset.',
      'Designed and trained a convolutional neural network for five-stage classification.',
      'Tuned model hyperparameters to reduce misclassification across stages.',
      'Integrated the model into a Flask web interface for real-time image upload and prediction.',
    ],
    tech: ['Python', 'CNN', 'Deep Learning', 'Flask'],
    accent: 'coral',
    github: null,
    demo: null,
    visual: 'dr',
    image: '/images/projects/diabetic-retinopathy.jpg',
    imageWidth: 447,
    imageHeight: 257,
    metricIds: ['drAccuracy'],
    architecture: [
      {
        id: 'upload',
        title: 'Fundus Image Upload',
        detail: 'A retinal fundus photograph is uploaded through the Flask web interface.',
        tech: ['Flask'],
      },
      {
        id: 'preprocess',
        title: 'Preprocessing & Normalization',
        detail:
          'Images are cleaned, resized and normalized so that brightness and scale differences across cameras do not distort learning.',
        tech: ['Image Preprocessing'],
      },
      {
        id: 'augment',
        title: 'Data Augmentation',
        detail:
          'Augmentation expands the effective training set to improve generalisation on unseen fundus images.',
        tech: ['Data Augmentation'],
      },
      {
        id: 'cnn',
        title: 'CNN Model',
        detail:
          'The convolutional network learns lesion and texture patterns; hyperparameters were tuned to reduce misclassification between adjacent stages.',
        tech: ['CNN', 'Model Evaluation'],
      },
      {
        id: 'predict',
        title: 'Five-Stage Prediction',
        detail:
          'The interface displays the predicted severity stage out of the five-stage DR scale in real time.',
        tech: ['Flask'],
      },
    ],
    overview:
      'Diabetic retinopathy grading is an ordinal image-classification problem: mistakes between adjacent stages matter less than skipped stages. This project builds the full pipeline — dataset preparation, augmentation, CNN training and a web interface that makes the model usable by non-engineers.',
  },
  {
    slug: 'haar-cascades',
    num: '03',
    title: 'Enhanced Haar Cascades for Face Detection',
    shortTitle: 'Haar Cascade Detection',
    category: 'Computer Vision',
    tagline: 'A tuned OpenCV Haar Cascade detector with fewer false positives under varied lighting.',
    description:
      'Implemented an OpenCV Haar Cascade face detector on annotated grayscale datasets and fine-tuned detection parameters to improve detection performance.',
    contributions: [
      'Implemented a Haar Cascade classifier-based object detection system for grayscale images.',
      'Fine-tuned the scale factor, minimum-neighbours and detection size parameters to reduce false positives while staying efficient.',
      'Evaluated results across varying lighting conditions and scales, showing improved accuracy over default settings.',
      'Explored real-time deep-learning integration (CNNs / YOLO) as a next step.',
    ],
    tech: ['Python', 'OpenCV', 'Haar Cascade'],
    accent: 'aqua',
    github: null,
    demo: null,
    visual: 'haar',
    image: '/images/projects/haar-cascades.jpg',
    imageWidth: 398,
    imageHeight: 398,
    metricIds: ['haarAccuracy'],
    architecture: [
      {
        id: 'input',
        title: 'Input Image',
        detail: 'A grayscale image (or video frame) is provided to the detector.',
        tech: ['OpenCV'],
      },
      {
        id: 'grayscale',
        title: 'Grayscale Conversion',
        detail:
          'Haar-like features operate on luminance contrasts, so frames are converted to grayscale first.',
        tech: ['OpenCV'],
      },
      {
        id: 'detect',
        title: 'Cascade Detection',
        detail:
          'The cascaded classifier scans the image at multiple scales, rejecting non-face regions stage by stage for speed.',
        tech: ['Haar Cascade'],
      },
      {
        id: 'tune',
        title: 'Parameter Tuning',
        detail:
          'Scale factor, minimum neighbours and detection window sizes were tuned to trade sensitivity against false positives.',
        tech: ['Parameter Tuning'],
      },
      {
        id: 'output',
        title: 'Detected Regions',
        detail:
          'Detected faces are returned with bounding boxes, validated across varying lighting conditions and scales.',
        tech: ['OpenCV'],
      },
    ],
    overview:
      'A focused study on getting the most out of Viola–Jones style detection: rather than swapping in a heavier model, this project systematically tunes the classical cascade and quantifies the effect on false positives and robustness to lighting.',
    contextNote:
      'A related repository (lbp-cascade) uses the LBP variant of cascades; it is intentionally not linked here until the owner confirms which repository represents this project.',
  },
  {
    slug: 'sales-data-analysis',
    num: '04',
    title: 'Sales Data Analysis',
    shortTitle: 'Sales Data Analysis',
    category: 'Data Analytics Case Study',
    tagline: 'From raw sales records to an interactive Power BI dashboard.',
    description:
      'Performed data cleaning, SQL analysis and exploratory data analysis on sales records, and developed an interactive Power BI dashboard for business insights.',
    contributions: [
      'Wrote Python (Pandas, NumPy) scripts to clean and validate sales records — removing duplicates and handling missing values.',
      'Developed SQL queries across the sales, products, complaints and tickets tables for faster retrieval and KPI analysis.',
      'Performed EDA and statistical analysis (outliers, skewness, correlation).',
      'Built Excel reports and a 3-page Power BI dashboard with interactive KPIs.',
    ],
    tech: ['Python', 'Pandas', 'NumPy', 'SQL', 'Microsoft Excel', 'Power BI'],
    accent: 'peach',
    github: 'https://github.com/Sri0295/Sales-Data-Analysis',
    demo: null,
    visual: 'sales',
    metricIds: [
      'salesRecords',
      'salesProfitCorrelation',
      'laptopSalesShare',
      'westRegionShare',
    ],
    architecture: [
      {
        id: 'raw',
        title: 'Raw Sales Records',
        detail: 'Source tables: sales, products, complaints and tickets.',
        tech: ['CSV / SQL'],
      },
      {
        id: 'clean',
        title: 'Data Cleaning',
        detail:
          'Pandas/NumPy scripts remove duplicates and handle missing values so downstream analysis is trustworthy.',
        tech: ['Pandas', 'NumPy'],
      },
      {
        id: 'sql',
        title: 'SQL Analysis',
        detail:
          'Queries join and aggregate the four tables to compute KPIs efficiently.',
        tech: ['SQL'],
      },
      {
        id: 'eda',
        title: 'Exploratory Analysis',
        detail:
          'Outlier detection, skewness checks and correlation analysis to understand relationships in the data.',
        tech: ['EDA'],
      },
      {
        id: 'dashboard',
        title: 'Power BI Dashboard',
        detail:
          'A three-page interactive dashboard with KPIs, complemented by Excel reports for shareable summaries.',
        tech: ['Power BI', 'Excel'],
      },
    ],
    overview:
      'A complete analytics workflow on real sales data: validate and clean the records, query them relationally, explore them statistically, and communicate the findings through dashboards a business user can drive.',
    contextNote:
      'Both résumés place this work at Doosan Bobcat, Chennai in 2025; the internship’s exact title and dates are pending the owner’s confirmation, so no affiliation is published here.',
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

/** Featured first, then supporting projects. */
export const featuredProject = projects[0]
export const supportingProjects = projects.slice(1)
