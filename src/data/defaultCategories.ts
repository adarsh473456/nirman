export const CATEGORIES = [
  'CNC Machining',
  'Sheet Metal & Fabrication',
  'Injection Molding',
  'Electronics & PCBA',
  'Casting & Forging',
  'Environmental Test & Qualification',
] as const;

export const CERTIFICATIONS_LIST = [
  { code: 'ISO 9001:2015', name: 'Quality Management System', priority: 'High' },
  { code: 'AS9100D', name: 'Aerospace & Defense Standard', priority: 'High' },
  { code: 'ECSS-Q-ST-20C', name: 'Space product assurance', priority: 'High' },
  { code: 'ISO/IEC 17025', name: 'Testing and calibration laboratories', priority: 'High' },
  { code: 'ISO 14644-1', name: 'Cleanroom classification', priority: 'High' },
  { code: 'ISO 14001', name: 'Environmental Management', priority: 'Medium' },
  { code: 'RoHS / REACH', name: 'Hazardous Substance Compliance', priority: 'Medium' },
  { code: 'IPC-A-610', name: 'Electronics Assembly Acceptability', priority: 'Medium' },
];

export const POPULAR_MATERIALS = [
  'Aluminum 6061-T6',
  'Aluminum 7075-T6',
  'Stainless Steel 316L',
  'Titanium Gr5',
  'Carbon-fibre composite',
  'Honeycomb sandwich core',
  'Polyimide / MLI',
  'FR-4 PCB Core',
  'PEEK / Delrin',
  'Inconel 718',
];

export const POPULAR_AI_PROMPTS = [
  "Find a 5-axis shop for a titanium satellite bracket with inspection records",
  "Source lightweight aluminium panels with material traceability",
  "Flight electronics assembly with traceable lots and environmental screening",
  "Thermal vacuum and vibration testing for a small satellite component",
  "High-reliability satellite PCBA with lot traceability and inspection",
];
