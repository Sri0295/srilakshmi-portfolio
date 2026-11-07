import { useState } from 'react'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import SkillConstellation from '../components/skills/SkillConstellation'
import { skillCategories } from '../data/skills'

const ACCENT: Record<string, { text: string; border: string; glow: string }> = {
  brand: { text: 'text-brand', border: 'hover:border-brand', glow: 'group-hover:shadow-brand/20' },
  aqua: { text: 'text-aqua', border: 'hover:border-aqua', glow: 'group-hover:shadow-aqua/20' },
  coral: { text: 'text-coral', border: 'hover:border-coral', glow: 'group-hover:shadow-coral/20' },
  peach: { text: 'text-peach', border: 'hover:border-peach', glow: 'group-hover:shadow-peach/20' },
}

/** Category skill labels → constellation node ids (null = not in the map) */
const SKILL_TO_NODE: Record<string, string | null> = {
  Python: 'python',
  Django: 'django',
  Flask: 'flask',
  'REST APIs': 'rest',
  SQL: 'sql',
  Pandas: 'pandas',
  NumPy: 'numpy',
  'Microsoft Excel': 'excel',
  'Power BI': 'powerbi',
  XGBoost: 'xgboost',
  CNN: 'cnn',
  OpenCV: 'opencv',
  'Haar Cascade': 'haar',
  'Roboflow (Image Annotation)': 'roboflow',
  Debugging: null,
  'Static Code Analysis': null,
  'Data Cleaning': null,
  'Exploratory Data Analysis': null,
  'Machine Learning': null,
  'Model Evaluation': null,
  'Image Preprocessing': null,
}

interface Props {
  onOpenProject: (slug: string) => void
}

/** Technical expertise — four numbered capability areas + skill constellation. */
export default function Expertise({ onOpenProject }: Props) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  return (
    <section id="expertise" aria-label="Technical expertise" className="section overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-aqua/10 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />

      <div className="container-site relative">
        <SectionHeading
          num="05"
          eyebrow="Expertise"
          title={
            <>
              WHAT I <span className="text-gradient">BRING.</span>
            </>
          }
          lead="Four capability areas, built through shipped projects — not borrowed from a syllabus. Select a skill to see exactly where it is applied."
        />

        <Reveal className="mt-14 grid gap-6 md:grid-cols-2" stagger>
          {skillCategories.map((cat) => {
            const a = ACCENT[cat.accent]
            return (
              <article
                key={cat.id}
                className={`card group relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${a.border} ${a.glow}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -top-6 -right-2 font-display text-[7rem] leading-none font-bold opacity-[0.08] transition-opacity duration-300 group-hover:opacity-[0.18] ${a.text}`}
                >
                  {cat.num}
                </span>
                <p className={`font-mono text-meta tracking-[0.3em] uppercase ${a.text}`}>{cat.num}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{cat.title}</h3>
                <p className="mt-2 text-sm text-muted">{cat.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {cat.skills.map((skill) => {
                    const nodeId = SKILL_TO_NODE[skill]
                    const active = nodeId !== null && nodeId !== undefined && selectedSkill === nodeId
                    return (
                      <li key={skill}>
                        {nodeId ? (
                          <button
                            type="button"
                            onClick={() => setSelectedSkill(active ? null : nodeId)}
                            aria-pressed={active}
                            className={`chip cursor-pointer transition-all hover:text-ink ${active ? 'border-aqua text-aqua' : ''}`}
                          >
                            {skill}
                          </button>
                        ) : (
                          <span className="chip">{skill}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </article>
            )
          })}
        </Reveal>

        <SkillConstellation
          selected={selectedSkill}
          onSelect={setSelectedSkill}
          onOpenProject={onOpenProject}
        />
      </div>
    </section>
  )
}
