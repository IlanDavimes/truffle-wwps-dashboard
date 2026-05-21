import type { Consultant } from './types'

export const consultants: Consultant[] = [
  {
    id: 'sidumisile-siziba',
    status: 'active',
    firstName: 'Sidumisile S.',
    surname: 'Siziba',
    suggestedRole: 'Senior Construction Project Manager',
    currentRole: 'Construction Manager & Urban Planner',
    summary:
      "Motivated and detail-oriented professional with a Bachelor of Social Science and Honours Degree in Regional and Urban Planning, and a Master's Degree in Construction Management. Strong understanding of urban development, construction processes, and sustainability within the built environment. Equipped with excellent analytical, project management, and problem-solving skills. Able to adapt quickly to new technologies and industry practices, including BIM.",
    avatar: undefined,
    videoUrl: '',
    videoEnabled: false,
    contact: {
      location: 'Kempton Park, South Africa',
      email: 'sidumisilesiziba@gmail.com',
      phone: '+27 75 27211 69',
      linkedin: 'linkedin.com/in/sidumisile-siziba',
      permitNumber: 'ZAF/BUQ070126/0026/01',
    },
    badges: [
      { label: 'Construction Management', style: 'premium' },
      { label: 'Urban Planner', style: 'accent' },
      { label: 'BIM', style: 'default' },
    ],
    availability: {
      status: 'Available now',
      details: 'Remote from South Africa or open to relocate',
    },
    readiness: [
      'MSc Construction Management',
      'Hons Regional & Urban Planning',
      'AI in 4IR certified',
      'TEFL English certified',
    ],
    industries: [
      'Construction & built environment',
      'Urban & regional planning',
      'Data collection & ops',
    ],
    skills: [
      {
        category: 'CAD & BIM software',
        items: ['AutoCAD', 'ArchiCAD', 'Revit', 'BIM Principles'],
      },
      {
        category: 'Project management',
        items: ['MS Project', 'Primavera P6', 'JBCC Contracts', 'BOQ', 'Cost Estimation'],
      },
      {
        category: 'Data & research',
        items: ['COMM Care Tool', 'Field surveys', 'Urban research'],
      },
      {
        category: 'Competencies',
        items: ['Analytical', 'Problem-solving', 'Community engagement', 'Sustainability'],
      },
    ],
    experience: [
      {
        title: 'Construction Manager Intern',
        company: 'Tsalach Construction',
        location: 'South Africa',
        period: 'Feb 2025 – Aug 2025',
        duration: '7 months',
        isCurrent: true,
        bullets: [
          'Assisted in site supervision and daily construction activities, ensuring work aligned with drawings and specifications.',
          'Prepared Bills of Quantities (BOQs), site reports, and assisted with site measurements and survey tracking.',
          'Supported tender preparation including quantity take-offs, BOQ compilation, and pricing under JBCC contract conditions.',
          'Sourced supplier quotations and compared subcontractor bids during cost estimation and tender evaluation.',
        ],
        achievement: 'Compiled quantity take-offs and pricing schedules for JBCC-compliant tenders.',
      },
      {
        title: 'Field Data Collector & Data Entry Assistant',
        company: 'Caritas',
        location: 'South Africa',
        period: 'Oct 2023',
        duration: '1 month',
        isCurrent: false,
        bullets: [
          'Conducted comprehensive data collection in assigned regions with strict accuracy standards.',
          'Used face-to-face interviews and digital survey tools to gather essential data.',
          'Adhered to ethical guidelines and confidentiality principles around sensitive information.',
        ],
        achievement: 'Coordinated face-to-face and digital data gathering under tight timelines.',
      },
      {
        title: 'Urban Planning Attachée',
        company: 'Municipality of Beitbridge',
        location: 'Zimbabwe',
        period: 'Feb 2021 – Dec 2021',
        duration: '11 months',
        isCurrent: false,
        bullets: [
          'Assisted in development and implementation of urban planning projects and programs.',
          'Conducted research and data analysis on urban development trends.',
          'Reviewed and processed planning applications and compliance permits.',
        ],
        achievement: 'Reviewed and successfully processed planning applications and permits.',
      },
    ],
    education: [
      {
        degree: 'MSc Construction Management',
        institution: 'University of Johannesburg',
        year: '2024',
        highlight: 'Active research in project delivery',
      },
      {
        degree: 'Certificate, AI in the 4IR',
        institution: 'University of Johannesburg',
        year: '2023',
      },
      {
        degree: 'BSocSci Honours, Regional & Urban Planning',
        institution: 'Great Zimbabwe University',
        year: '2020',
      },
      {
        degree: 'TEFL English Certificate',
        institution: 'Teachers Record',
        year: '2022',
      },
    ],
    references: [
      {
        name: 'Mr Sam M.',
        role: 'Director',
        company: 'Tsalach Construction',
        contact: '+27 72 380 3244 / info@tsalachconstruction.co.za',
      },
      {
        name: 'Dr Morena W. Nkomo',
        role: 'Lecturer',
        company: 'University of Johannesburg',
        contact: '+27 78 558 8492 / mnkomo@uj.ac.za',
      },
      {
        name: 'Thomas Muwani',
        role: 'Field Officer',
        company: 'Caritas',
        contact: '+263 77 338 6730',
      },
      {
        name: 'Mr L. Ramakgapola',
        role: 'Town Clerk',
        company: 'Municipality of Beitbridge',
        contact: '+263 85 232 3362',
      },
    ],
  },
  {
    id: 'template-consultant',
    status: 'draft',
    firstName: '[First name]',
    surname: '[Surname]',
    suggestedRole: '[Role Truffle is recommending for this RFP]',
    currentRole: '[Current role / professional title]',
    summary:
      "[Professional summary — 3 to 4 sentences covering the candidate's core expertise, years of experience, and the value they bring. Example: Senior actuary with 12 years across life insurance and pension valuation. Strong technical command of IFRS 17, with hands-on leadership of three regulatory implementation programmes.]",
    avatar: undefined,
    videoUrl: '',
    videoEnabled: false,
    contact: {
      location: '[City, Country]',
      email: '[name@domain.com]',
      phone: '[+## ## ### ####]',
      linkedin: '[linkedin.com/in/handle]',
      permitNumber: '[Work permit / visa reference]',
    },
    badges: [
      { label: '[Key area 1]', style: 'premium' },
      { label: '[Key area 2]', style: 'accent' },
      { label: '[Key area 3]', style: 'default' },
    ],
    availability: {
      status: '[e.g. Available now / Available from DD MMM]',
      details: '[e.g. Remote from city, open to relocate]',
    },
    readiness: [
      '[Headline qualification 1]',
      '[Headline qualification 2]',
      '[Headline qualification 3]',
    ],
    industries: ['[Focus industry 1]', '[Focus industry 2]', '[Focus industry 3]'],
    skills: [
      {
        category: '[Skill group 1 — e.g. Tools]',
        items: ['[Skill]', '[Skill]', '[Skill]'],
      },
      {
        category: '[Skill group 2 — e.g. Methodology]',
        items: ['[Skill]', '[Skill]'],
      },
    ],
    experience: [
      {
        title: '[Job title]',
        company: '[Company]',
        location: '[Location]',
        period: '[Start – End or Present]',
        duration: '[Duration]',
        isCurrent: true,
        bullets: [
          '[Responsibility or achievement #1 — what they did, scope, outcome]',
          '[Responsibility or achievement #2]',
          '[Responsibility or achievement #3]',
        ],
        achievement: '[Single standout achievement, one sentence]',
      },
    ],
    education: [
      {
        degree: '[Degree / certification]',
        institution: '[Institution]',
        year: '[Year]',
        highlight: '[Optional — distinction, specialism]',
      },
    ],
    references: [
      {
        name: '[Referee name]',
        role: '[Their role]',
        company: '[Their company]',
        contact: '[Phone / email]',
      },
    ],
  },
]

export function getConsultant(id: string): Consultant | undefined {
  return consultants.find((c) => c.id === id)
}
