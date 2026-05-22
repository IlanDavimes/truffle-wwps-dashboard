import type { Consultant } from './types'
import { getImportedConsultants } from '../lib/draftStore'

const seedConsultants: Consultant[] = [
  {
    id: 'sidumisile-siziba',
    status: 'active',
    firstName: 'Sidumisile S.',
    surname: 'Siziba',
    suggestedRole: 'Senior Construction Project Manager',
    currentRole: 'Construction Manager & Urban Planner',
    summary:
      "Motivated and detail-oriented professional with a Bachelor of Social Science and Honours Degree in Regional and Urban Planning, and a Master's Degree in Construction Management. Strong understanding of urban development, construction processes, and sustainability within the built environment. Equipped with excellent analytical, project management, and problem-solving skills. Able to adapt quickly to new technologies and industry practices, including BIM.",
    avatar: '/avatars/Sidumisile_Siziba.png',
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
      { category: 'CAD & BIM software', items: ['AutoCAD', 'ArchiCAD', 'Revit', 'BIM Principles'] },
      { category: 'Project management', items: ['MS Project', 'Primavera P6', 'JBCC Contracts', 'BOQ', 'Cost Estimation'] },
      { category: 'Data & research', items: ['COMM Care Tool', 'Field surveys', 'Urban research'] },
      { category: 'Competencies', items: ['Analytical', 'Problem-solving', 'Community engagement', 'Sustainability'] },
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
      { degree: 'MSc Construction Management', institution: 'University of Johannesburg', year: '2024', highlight: 'Active research in project delivery' },
      { degree: 'Certificate, AI in the 4IR', institution: 'University of Johannesburg', year: '2023' },
      { degree: 'BSocSci Honours, Regional & Urban Planning', institution: 'Great Zimbabwe University', year: '2020' },
      { degree: 'TEFL English Certificate', institution: 'Teachers Record', year: '2022' },
    ],
    references: [
      { name: 'Mr Sam M.', role: 'Director', company: 'Tsalach Construction', contact: '+27 72 380 3244 / info@tsalachconstruction.co.za' },
      { name: 'Dr Morena W. Nkomo', role: 'Lecturer', company: 'University of Johannesburg', contact: '+27 78 558 8492 / mnkomo@uj.ac.za' },
      { name: 'Thomas Muwani', role: 'Field Officer', company: 'Caritas', contact: '+263 77 338 6730' },
      { name: 'Mr L. Ramakgapola', role: 'Town Clerk', company: 'Municipality of Beitbridge', contact: '+263 85 232 3362' },
    ],
  },
  {
    id: 'aaron-phakathi',
    status: 'active',
    firstName: 'Aaron T.',
    surname: 'Phakathi',
    suggestedRole: 'Senior Project Planner — Construction & Infrastructure',
    currentRole: 'Project Planner',
    summary:
      "Construction and infrastructure project planner with a decade of progression from mechanical fitter to senior site planner. Strong command of Primavera P6, MS Projects, Earned Value Management, and FIDIC / NEC3 contract conditions. BA in Industrial & Organizational Psychology paired with hands-on technical certifications across construction PM, quantity surveying, and CAD. Currently planning live civils work at Regal Civil Projects Africa.",
    avatar: '/avatars/Aaron Phakathi.png',
    videoUrl: '',
    videoEnabled: false,
    contact: {
      location: 'Sasolburg, South Africa',
      email: 'seunaaron53@gmail.com',
      phone: '+27 79 664 9838',
      linkedin: 'linkedin.com/in/aaron-phakathi',
      permitNumber: 'RSA Citizen',
    },
    badges: [
      { label: 'Project Planning', style: 'premium' },
      { label: 'Primavera P6', style: 'accent' },
      { label: 'FIDIC / NEC3', style: 'default' },
    ],
    availability: {
      status: 'Available now',
      details: 'On-site in South Africa or remote',
    },
    readiness: [
      'PMP Exam preparation (2025)',
      'Construction Project Management certified',
      'Quantity Surveying & Estimation certified',
      'BA Industrial & Organizational Psychology',
    ],
    industries: [
      'Construction & built environment',
      'Renewable energy (solar / power)',
      'Industrial maintenance & operations',
    ],
    skills: [
      { category: 'Project planning', items: ['Primavera P6', 'MS Project', 'EVM', 'S-curves', 'CPM', 'Resource loading'] },
      { category: 'Contracts & compliance', items: ['FIDIC', 'NEC3', 'JBCC awareness', 'Risk assessments', 'MSDS'] },
      { category: 'CAD & technical', items: ['AutoCAD', 'SOLIDWORKS', 'MasterCam', 'CNC milling'] },
      { category: 'Maintenance & ops', items: ['CMMS', 'Maximo', 'SAP', 'CAPEX', 'Maintenance strategy'] },
    ],
    experience: [
      {
        title: 'Project Planner',
        company: 'Regal Civil Projects Africa',
        location: 'South Africa',
        period: 'Oct 2025 – Present',
        duration: '2+ months',
        isCurrent: true,
        bullets: [
          'Monitoring and updating project schedules across active civils projects.',
          'Tracking and reporting project progress; forecasting and mitigating risks.',
          'Raising and following up on Technical Queries, Delay Warnings, Early Warnings and Compensation Events.',
          'Coordinating availability of materials and resources across site teams.',
        ],
        achievement: 'Took over baseline schedule on a live infrastructure project within first week.',
      },
      {
        title: 'Senior Site Planner',
        company: 'Regal Civil Projects Africa',
        location: 'South Africa',
        period: 'May 2025 – Aug 2025',
        duration: '4 months',
        isCurrent: false,
        bullets: [
          'Developed, managed and updated comprehensive L1–L5 master schedules.',
          'Performed and presented Earned Value Management, S-curve, Critical Path and resource-loading analyses.',
          'Tracked procurement, purchase orders and resource availability across concurrent projects.',
          'Collaborated with PM, CM and engineers to deliver to quality and safety standards under FIDIC.',
        ],
        achievement: 'Standardised reporting and EVM presentation cadence across multiple concurrent projects.',
      },
      {
        title: 'Project Planner — 132kV Solar Power Renewable',
        company: 'Pro-Con Engineering',
        location: 'South Africa',
        period: 'Oct 2024 – Feb 2025',
        duration: '5 months',
        isCurrent: false,
        bullets: [
          'Planned and scheduled renewable-energy project activities in Primavera P6 and MS Projects.',
          'Managed procurement, resource allocation, levelling and lookaheads.',
          'Implemented task method statements, MSDS and risk assessments per FIDIC and NEC3.',
          'Oversaw QA/QC — slump testing, compaction, shuttering, concrete pouring and curing.',
        ],
        achievement: 'Delivered project schedule and EVM reporting for a 132kV solar substation build.',
      },
      {
        title: 'Maintenance Planner',
        company: 'Mega High Voltage Technologies',
        location: 'South Africa',
        period: 'Jul 2024 – Oct 2024',
        duration: '4 months',
        isCurrent: false,
        bullets: [
          'Implemented preventative, scheduled, breakdown and predictive maintenance strategies.',
          'Administered Primavera P6, CMMS, SAP and CAPEX systems.',
          'Coordinated root cause analysis and safety maintenance technology rollouts.',
        ],
        achievement: 'Reduced unplanned downtime through tighter preventative-maintenance scheduling.',
      },
    ],
    education: [
      { degree: 'Project Management Professional (PMP) — Exam Preparation', institution: 'Cursa Academy', year: '2025', highlight: 'In progress' },
      { degree: 'Construction Project Management certificate', institution: 'Cursa Academy', year: '2024' },
      { degree: 'Oracle Primavera P6 Project Planning & Scheduling Masterclass', institution: 'Udemy Academy', year: '2024' },
      { degree: 'Quantity Surveying & Estimation for Road and Tunnel Works', institution: 'Udemy Academy', year: '2024' },
      { degree: 'BA Industrial & Organizational Psychology with Labour Relations Management', institution: 'North West University', year: '2019' },
    ],
    references: [
      { name: 'Available on request', role: 'Project Manager', company: 'Regal Civil Projects Africa', contact: 'Provided upon shortlisting' },
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
    readiness: ['[Headline qualification 1]', '[Headline qualification 2]', '[Headline qualification 3]'],
    industries: ['[Focus industry 1]', '[Focus industry 2]', '[Focus industry 3]'],
    skills: [
      { category: '[Skill group 1 — e.g. Tools]', items: ['[Skill]', '[Skill]', '[Skill]'] },
      { category: '[Skill group 2 — e.g. Methodology]', items: ['[Skill]', '[Skill]'] },
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
      { degree: '[Degree / certification]', institution: '[Institution]', year: '[Year]', highlight: '[Optional — distinction, specialism]' },
    ],
    references: [
      { name: '[Referee name]', role: '[Their role]', company: '[Their company]', contact: '[Phone / email]' },
    ],
  },
]

export const consultants = seedConsultants

export function getAllConsultants(): Consultant[] {
  return [...seedConsultants, ...getImportedConsultants()]
}

export function getConsultant(id: string): Consultant | undefined {
  return getAllConsultants().find((c) => c.id === id)
}
