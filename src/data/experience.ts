/**
 * EXPERIENCE — with publication gating.
 *
 * The Doosan Bobcat internship was corrected by the owner (Nov 2026): the
 * confirmed entry is Full Stack Intern (movie booking web application),
 * Jun 2025 – Sep 2025, with the movie-ticket-booking-website repository.
 * The previously published Data Analytics description was removed entirely.
 *
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
  /** "View Internship Project" target — opens in a new tab */
  projectUrl?: string
  publish: boolean
  /** Draft-only note — never rendered while unpublished */
  conflictNote?: string
}

export const experience: ExperienceEntry[] = [
  {
    id: 'doosan-bobcat',
    org: 'Doosan Bobcat Pvt Ltd',
    location: 'Chennai',
    role: 'Full Stack Intern',
    period: 'Jun 2025 – Sep 2025',
    summary:
      'Built a responsive movie booking web application end to end — from interactive UI and form validation to testing, debugging and documentation.',
    responsibilities: [
      'Developed a responsive movie booking web application using HTML, CSS, and JavaScript, focusing on user-friendly UI and seamless navigation.',
      'Implemented interactive features, including login/signup functionality, booking forms, form validation, and dynamic user interactions.',
      'Applied responsive web design techniques, CSS media queries, and frontend development best practices to ensure cross-device compatibility.',
      'Gained foundational exposure to REST API integration, backend architecture, software development life cycle (SDLC), and deployment workflows.',
      'Performed iterative testing, debugging, code reviews, and project documentation to improve application functionality and maintainability.',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'REST APIs', 'Responsive Design'],
    github: 'https://github.com/Sri0295/movie-ticket-booking-website',
    projectUrl: 'https://github.com/Sri0295/movie-ticket-booking-website',
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
