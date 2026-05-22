export type ConsultantStatus = 'draft' | 'active' | 'archived'

export type BadgeStyle = 'default' | 'accent' | 'premium'

export interface Badge {
  label: string
  style?: BadgeStyle
}

export interface Contact {
  location: string
  email: string
  phone: string
  linkedin: string
  permitNumber: string
}

export interface Availability {
  status: string
  details: string
}

export interface Skill {
  category: string
  items: string[]
}

export interface Experience {
  title: string
  company: string
  location: string
  period: string
  duration?: string
  isCurrent?: boolean
  bullets: string[]
  achievement?: string
}

export interface Education {
  degree: string
  institution: string
  year: string
  highlight?: string
}

export interface Reference {
  name: string
  role: string
  company: string
  contact: string
}

export interface Consultant {
  id: string
  status: ConsultantStatus
  firstName: string
  surname: string
  suggestedRole: string
  currentRole: string
  summary: string
  avatar?: string
  videoUrl?: string
  videoEnabled: boolean
  contact: Contact
  badges: Badge[]
  availability: Availability
  readiness: string[]
  industries: string[]
  skills: Skill[]
  experience: Experience[]
  education: Education[]
  references: Reference[]
  rfpNotes?: string
}
