import { IMG } from './images';

export const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/meridian', label: 'MERIDIAN™' },
  { href: '/sectors', label: 'Sectors' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const QUADRANTS = [
  {
    index: '01',
    title: 'Company',
    links: [
      { href: '/about', label: 'Who we are' },
      { href: '/team', label: 'Leadership & team' },
      { href: '/sectors', label: 'Sectors & track record' },
    ],
  },
  {
    index: '02',
    title: 'Services',
    links: [
      { href: '/services#asset-management', label: 'Infrastructure Asset Management' },
      { href: '/services#spatial-planning', label: 'Spatial Planning & GIS' },
      { href: '/services#valuations', label: 'Valuations' },
      { href: '/services#data-analytics', label: 'Data & Analytics' },
    ],
  },
  {
    index: '03',
    title: 'MERIDIAN™',
    links: [
      { href: '/meridian', label: 'The platform' },
      { href: '/meridian#modules', label: 'Modules' },
      { href: '/meridian#demo', label: 'Request a demonstration' },
    ],
  },
  {
    index: '04',
    title: 'Connect',
    links: [
      { href: '/insights', label: 'Insights & publications' },
      { href: '/contact', label: 'Offices & contact' },
    ],
  },
];

export type Service = {
  id: string;
  index: string;
  title: string;
  short: string;
  summary: string;
  capabilities: string[];
  standards: string[];
  image: string;
  imageAlt: string;
};

export const SERVICES: Service[] = [
  {
    id: 'asset-management',
    index: '01',
    title: 'Infrastructure Asset Management',
    short: 'Governance, audit-defensible registers, lifecycle planning.',
    summary:
      'We build and maintain the asset registers that municipalities, utilities and state-owned entities are audited against. Every component is located, conditioned, valued and scheduled — and every number can be traced back to a survey, a drawing or a transaction.',
    capabilities: [
      'Componentised asset registers (GRAP 17 / GRAP 103)',
      'Condition assessment and remaining-useful-life modelling',
      'Lifecycle and renewal planning aligned to ISO 55000',
      'mSCOA-classified capital and maintenance budgets',
      'Audit support and AGSA finding remediation',
      'Asset management plans, policies and strategies',
    ],
    standards: ['GRAP 17', 'GRAP 103', 'mSCOA', 'ISO 55000', 'IIMM'],
    image: IMG.siteAerial,
    imageAlt: 'Aerial view of an infrastructure construction site',
  },
  {
    id: 'spatial-planning',
    index: '02',
    title: 'Spatial Planning & GIS',
    short: 'Spatial development frameworks, land use schemes, geospatial analytics.',
    summary:
      'Spatial decisions outlive the people who make them. We author the frameworks, schemes and datasets that govern where a city grows — and we make them queryable, so a planning decision is an analysis, not an opinion.',
    capabilities: [
      'Municipal and regional Spatial Development Frameworks',
      'Land Use Schemes and SPLUMA compliance',
      'Cadastral, zoning and servitude data engineering',
      'Drone and satellite survey integration',
      'Growth, densification and infrastructure demand modelling',
      'Enterprise GIS architecture and data governance',
    ],
    standards: ['SPLUMA', 'SANS 1878', 'ISO 19115', 'OGC'],
    image: IMG.coastalAerial,
    imageAlt: 'Aerial view of a planned coastal development',
  },
  {
    id: 'valuations',
    index: '03',
    title: 'Valuations',
    short: 'Municipal, financial-institution and private-sector valuations.',
    summary:
      'From a general valuation roll of a million parcels to a single-asset opinion for a lender, our valuations are mass-appraisal grade: statistically defensible, spatially indexed and reproducible on demand.',
    capabilities: [
      'General and supplementary valuation rolls (MPRA)',
      'Mass appraisal modelling and ratio studies',
      'Mortgage, portfolio and impairment valuations for lenders',
      'Insurance replacement-cost and depreciated-cost valuations',
      'Objections, appeals and Valuation Appeal Board support',
      'Plant, equipment and infrastructure asset valuation',
    ],
    standards: ['MPRA', 'IVS', 'IFRS 13', 'SAIV', 'RICS'],
    image: IMG.towersUp,
    imageAlt: 'Glass office towers viewed from street level',
  },
  {
    id: 'data-analytics',
    index: '04',
    title: 'Data & Analytics',
    short: 'The data and software layer beneath MERIDIAN™.',
    summary:
      'Every service we deliver produces structured, spatial, time-stamped data. Our analytics practice turns that exhaust into the models, dashboards and APIs that power MERIDIAN™ — and into institutional memory for our clients.',
    capabilities: [
      'Spatial data warehouses and master data management',
      'Predictive deterioration and demand models',
      'Executive dashboards and regulatory reporting automation',
      'Integration with ERP, GIS and financial systems',
      'Data quality frameworks and stewardship programmes',
      'Custom platform development on the MERIDIAN™ core',
    ],
    standards: ['ISO 8000', 'POPIA', 'ISO 27001', 'OGC API'],
    image: IMG.dashboardScreen,
    imageAlt: 'Analytics dashboard on a large display',
  },
];

export const STATS = [
  { value: 2.4, prefix: 'R', suffix: 'B', decimals: 1, label: 'Assets under management', note: 'Current replacement cost' },
  { value: 14000, suffix: ' km', label: 'Infrastructure mapped', note: 'Roads, pipelines, reticulation' },
  { value: 1.2, suffix: 'M', decimals: 1, label: 'Parcels valued', note: 'Across general valuation rolls' },
  { value: 98.6, suffix: '%', decimals: 1, label: 'Audit clearance', note: 'Register findings resolved' },
];

export const CLIENT_TYPES = [
  'Metropolitan Municipalities',
  'District & Local Municipalities',
  'Provincial Treasuries',
  'Development Finance Institutions',
  'Commercial Banks',
  'Listed Property Funds',
  'State-Owned Enterprises',
  'Water Boards & Utilities',
  'Mining Houses',
];

export type Person = {
  slug: string;
  name: string;
  role: string;
  focus: string;
  bio: string[];
  credentials: string[];
  image: string;
  leadership?: boolean;
};

export const TEAM: Person[] = [
  {
    slug: 'sifiso-mabaso',
    name: 'Sifiso Mabaso',
    role: 'Founder & Chief Executive',
    focus: 'Asset governance · Public finance',
    bio: [
      'Sifiso founded the firm on a single observation: municipalities were being audited against registers nobody could stand behind. Twenty years later that observation is a platform.',
      'He has led asset management programmes for four metropolitan municipalities and advised National Treasury on the componentisation standards now embedded in GRAP 17 practice notes.',
    ],
    credentials: ['Pr Eng', 'MBA (Wits)', 'CAMA (IAM)'],
    image: IMG.p1,
    leadership: true,
  },
  {
    slug: 'naledi-khumalo',
    name: 'Naledi Khumalo',
    role: 'Chief Technology Officer · MERIDIAN™',
    focus: 'Spatial data platforms · Product',
    bio: [
      'Naledi built the first version of MERIDIAN™ as a weekend prototype to reconcile a valuation roll against a cadastre. It now holds more than a million parcels in production.',
      'She previously led geospatial engineering at a pan-African satellite analytics company and holds two patents in mass-appraisal spatial indexing.',
    ],
    credentials: ['MSc Geoinformatics', 'GISc Professional'],
    image: IMG.p2,
    leadership: true,
  },
  {
    slug: 'thabo-nkosi',
    name: 'Thabo Nkosi',
    role: 'Director · Valuations',
    focus: 'Mass appraisal · Lender valuations',
    bio: [
      'Thabo has signed off general valuation rolls covering more than 800,000 properties and has appeared before Valuation Appeal Boards in six provinces.',
      'He leads the firm’s financial-institution practice, where MERIDIAN™ valuation models are used for portfolio impairment and mortgage origination.',
    ],
    credentials: ['Professional Valuer (SACPVP)', 'MRICS'],
    image: IMG.p3,
    leadership: true,
  },
  {
    slug: 'zanele-dlamini',
    name: 'Zanele Dlamini',
    role: 'Director · Spatial Planning',
    focus: 'SDFs · Land use management',
    bio: [
      'Zanele has authored spatial development frameworks for three district municipalities and led the first fully digital land use scheme adopted under SPLUMA.',
    ],
    credentials: ['Pr Pln (SACPLAN)', 'MTRP'],
    image: IMG.p4,
  },
  {
    slug: 'kagiso-molefe',
    name: 'Kagiso Molefe',
    role: 'Head of Infrastructure Asset Management',
    focus: 'Condition assessment · Lifecycle planning',
    bio: [
      'Kagiso runs the field and modelling teams that keep 2.4 billion rand of infrastructure on the register, on schedule and on budget.',
    ],
    credentials: ['Pr Tech Eng', 'IAM Certificate'],
    image: IMG.p5,
  },
  {
    slug: 'lerato-mokoena',
    name: 'Lerato Mokoena',
    role: 'Head of Data Engineering',
    focus: 'Pipelines · Integrations · Data quality',
    bio: [
      'Lerato designed the MERIDIAN™ ingestion layer that reconciles ERP, GIS and financial data into a single, versioned asset truth.',
    ],
    credentials: ['BSc Computer Science', 'AWS Solutions Architect'],
    image: IMG.p7,
  },
  {
    slug: 'sipho-ndlovu',
    name: 'Sipho Ndlovu',
    role: 'Senior Valuer',
    focus: 'Commercial & industrial property',
    bio: [
      'Sipho leads commercial valuation engagements for listed property funds and the firm’s insurance replacement-cost practice.',
    ],
    credentials: ['Professional Valuer (SACPVP)'],
    image: IMG.p6,
  },
  {
    slug: 'johan-van-der-merwe',
    name: 'Johan van der Merwe',
    role: 'Principal · Governance & Audit',
    focus: 'AGSA readiness · Policy',
    bio: [
      'Johan spent fifteen years in public-sector audit before joining to build the firm’s audit-readiness practice.',
    ],
    credentials: ['CA(SA)', 'CIA'],
    image: IMG.p8,
  },
  {
    slug: 'amahle-zulu',
    name: 'Amahle Zulu',
    role: 'GIS Analyst',
    focus: 'Cadastral data · Remote sensing',
    bio: ['Amahle maintains the cadastral and imagery layers that underpin every MERIDIAN™ spatial query.'],
    credentials: ['BSc Hons GIS'],
    image: IMG.p9,
  },
];

export const VALUES = [
  { index: '01', title: 'Defensible by design', text: 'Every figure we publish is traceable to a survey, a drawing or a transaction. If it cannot be audited, it does not leave the building.' },
  { index: '02', title: 'Spatial first', text: 'An asset without a location is a rumour. We index everything — registers, valuations, budgets — to the ground it stands on.' },
  { index: '03', title: 'Institutional memory', text: 'Our clients outlast their officials. We build systems that remember, so that decisions compound instead of resetting.' },
  { index: '04', title: 'Restraint', text: 'We do not decorate. Signal over noise, in our reports, in our platform and on this page.' },
];

export const TIMELINE = [
  { year: '2006', text: 'Founded in Johannesburg as an asset register consultancy.' },
  { year: '2011', text: 'First metropolitan general valuation roll delivered.' },
  { year: '2015', text: 'Spatial planning practice established; first SPLUMA land use scheme.' },
  { year: '2019', text: 'MERIDIAN™ v1 enters production with a district municipality.' },
  { year: '2023', text: 'Financial-institution valuation practice launched.' },
  { year: '2026', text: 'MERIDIAN™ v4: unified asset, spatial and valuation intelligence.' },
];

export const SECTORS = [
  { index: '01', title: 'Metropolitan & Local Government', text: 'Asset registers, valuation rolls, SDFs and mSCOA-aligned budgeting for municipalities of every size.', clients: 'Metros · Districts · Locals' },
  { index: '02', title: 'Provincial & National Government', text: 'Immovable asset registers, custodian reporting and policy support for departments and treasuries.', clients: 'Departments · Treasuries' },
  { index: '03', title: 'Banks & Development Finance', text: 'Portfolio, impairment and origination valuations with spatial risk overlays.', clients: 'Commercial banks · DFIs' },
  { index: '04', title: 'Property Funds & REITs', text: 'Independent valuations, portfolio analytics and disclosure-grade reporting.', clients: 'Listed funds · Private portfolios' },
  { index: '05', title: 'Utilities & State-Owned Enterprises', text: 'Network asset management for water, electricity and transport infrastructure.', clients: 'Water boards · Utilities · SOEs' },
  { index: '06', title: 'Mining & Energy', text: 'Plant and infrastructure valuation, closure planning and spatial compliance.', clients: 'Mining houses · IPPs' },
];

export const TRACK_RECORD = [
  { client: 'Metropolitan municipality', scope: 'Componentised infrastructure asset register', metric: '186,000', unit: 'components', value: 'R38.2bn CRC' },
  { client: 'District municipality', scope: 'General valuation roll & MPRA compliance', metric: '412,000', unit: 'parcels', value: 'R96bn roll' },
  { client: 'Water utility', scope: 'Pipeline condition assessment & renewal plan', metric: '6,800', unit: 'km', value: '20-yr plan' },
  { client: 'Commercial bank', scope: 'Residential portfolio impairment valuation', metric: '94,000', unit: 'properties', value: 'Quarterly' },
  { client: 'Provincial department', scope: 'Immovable asset register & GIAMA reporting', metric: '9,400', unit: 'facilities', value: 'Clean audit' },
  { client: 'Local municipality', scope: 'Spatial development framework & land use scheme', metric: '2,100', unit: 'km²', value: 'SPLUMA adopted' },
];

export const INSIGHTS = [
  { slug: 'audit-defensible-registers', category: 'Asset Management', date: '2026-08-12', title: 'What makes an asset register audit-defensible — and why most are not', excerpt: 'A register is only as strong as its weakest component. We unpack the six failure modes we see in AGSA findings and how to design them out.', image: IMG.blueprintDraft, read: '9 min' },
  { slug: 'mass-appraisal-spatial', category: 'Valuations', date: '2026-07-03', title: 'Spatial indexing is the missing variable in South African mass appraisal', excerpt: 'Why location-aware models outperform comparable-sales heuristics on every ratio study we have run since 2019.', image: IMG.towersUp, read: '7 min' },
  { slug: 'sdf-as-database', category: 'Spatial Planning', date: '2026-05-21', title: 'The SDF should be a database, not a PDF', excerpt: 'A spatial development framework that cannot be queried cannot be enforced. A case for planning documents as living data.', image: IMG.worldMap, read: '6 min' },
  { slug: 'mscoa-lifecycle', category: 'Data & Analytics', date: '2026-03-14', title: 'Closing the loop between mSCOA budgets and lifecycle plans', excerpt: 'How MERIDIAN™ reconciles capital budgets against renewal demand — automatically, every month.', image: IMG.dashboardScreen, read: '8 min' },
  { slug: 'iso-55000-municipal', category: 'Asset Management', date: '2026-01-30', title: 'ISO 55000 for municipalities: a pragmatic adoption path', excerpt: 'You do not need certification to benefit from the standard. A staged model we have applied across eleven municipalities.', image: IMG.parking, read: '11 min' },
  { slug: 'lender-valuations-climate', category: 'Valuations', date: '2025-11-08', title: 'Climate exposure belongs in the lender valuation', excerpt: 'Flood, fire and drought overlays are now cheap to compute. Ignoring them is a pricing error.', image: IMG.coastalAerial, read: '5 min' },
];

export const OFFICES = [
  { city: 'Johannesburg', role: 'Head office', address: 'Level 12, 20 Baker Street, Rosebank, 2196', lat: -26.1461, lng: 28.0421, phone: '+27 11 000 0000' },
  { city: 'Cape Town', role: 'Regional office', address: '2nd Floor, 22 Bree Street, Cape Town, 8001', lat: -33.9189, lng: 18.4233, phone: '+27 21 000 0000' },
  { city: 'Durban', role: 'Regional office', address: 'Suite 4, 9 Richefond Circle, Umhlanga, 4319', lat: -29.7245, lng: 31.0741, phone: '+27 31 000 0000' },
];
