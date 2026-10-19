import type { CategoryId, CrewId, CrewMember } from '@/types/content';

export const crewIds = [
  'dev',
  'pixel',
  'mutex',
  'query',
  'cache',
  'ping',
  'bug',
  'sec',
  'ops',
  'intern',
] as const;

export const crewMembers: CrewMember[] = [
  {
    id: 'dev',
    name: 'Dev',
    role: {
      id: 'Host & Pemandu',
      en: 'Host & Guide',
    },
    catchphrase: {
      id: 'Santai, kita bedah pelan-pelan.',
      en: "Easy, we'll take it apart slowly.",
    },
    palette: {
      shirt: '#7c5cff',
      accent: '#ffc933',
      hat: '#5c3d2e',
    },
  },
  {
    id: 'pixel',
    name: 'Pixel',
    role: {
      id: 'Frontend Engineer',
      en: 'Frontend Engineer',
    },
    catchphrase: {
      id: '60 FPS atau nggak sama sekali!',
      en: '60 FPS or nothing at all!',
    },
    leadOf: 'frontend-performance',
    palette: {
      shirt: '#ff9d42',
      accent: '#ffc933',
      hat: '#ff7a1a',
    },
  },
  {
    id: 'mutex',
    name: 'Mutex',
    role: {
      id: 'Concurrency Engineer',
      en: 'Concurrency Engineer',
    },
    catchphrase: {
      id: 'Antre ya, jangan rebutan thread!',
      en: "Queue up, don't fight over threads!",
    },
    leadOf: 'concurrency-locking',
    palette: {
      shirt: '#3ba7ff',
      accent: '#ffc933',
      hat: '#1b1b1f',
    },
  },
  {
    id: 'query',
    name: 'Query',
    role: {
      id: 'Database Administrator',
      en: 'Database Administrator',
    },
    catchphrase: {
      id: 'Integritas nomor satu, no tipu-tipu.',
      en: 'Integrity first, zero fake reads.',
    },
    leadOf: 'database-integrity',
    palette: {
      shirt: '#f8fafc',
      accent: '#ff5c5c',
      hat: '#1b1b1f',
    },
  },
  {
    id: 'cache',
    name: 'Cache',
    role: {
      id: 'Caching Courier',
      en: 'Caching Courier',
    },
    catchphrase: {
      id: 'Ambil dari memori, kilat abis!',
      en: 'Fetch from memory, super fast!',
    },
    leadOf: 'caching-state',
    palette: {
      shirt: '#2fbf71',
      accent: '#ffd65c',
      hat: '#249658',
    },
  },
  {
    id: 'ping',
    name: 'Ping',
    role: {
      id: 'Distributed Systems Engineer',
      en: 'Distributed Systems Engineer',
    },
    catchphrase: {
      id: 'Node seberang masih napas, kan?',
      en: 'Is the remote node still alive?',
    },
    leadOf: 'distributed-reliability',
    palette: {
      shirt: '#ff5c5c',
      accent: '#ffd65c',
      hat: '#ffd65c',
    },
  },
  {
    id: 'bug',
    name: 'Bug',
    role: {
      id: 'QA Tester',
      en: 'QA Tester',
    },
    catchphrase: {
      id: 'Ketemu celah baru lagi nih, hehe.',
      en: 'Found another sneaky edge case!',
    },
    palette: {
      shirt: '#a19fb0',
      accent: '#ff7a7a',
      hat: '#2e2b3b',
    },
  },
  {
    id: 'sec',
    name: 'Sec',
    role: {
      id: 'Security Specialist',
      en: 'Security Specialist',
    },
    catchphrase: {
      id: 'Kunci rapat, periksa token dulu!',
      en: 'Lock it tight, verify tokens first!',
    },
    palette: {
      shirt: '#2d3748',
      accent: '#6bbfff',
      hat: '#1a202c',
    },
  },
  {
    id: 'ops',
    name: 'Ops',
    role: {
      id: 'DevOps / SRE',
      en: 'DevOps / SRE',
    },
    catchphrase: {
      id: 'Server aman, tidur pun tenang.',
      en: 'Servers healthy, sleep peacefully.',
    },
    palette: {
      shirt: '#3182ce',
      accent: '#ecc94b',
      hat: '#2b6cb0',
    },
  },
  {
    id: 'intern',
    name: 'Intern',
    role: {
      id: 'Junior Explorer',
      en: 'Junior Explorer',
    },
    catchphrase: {
      id: 'Ini tombol apa ya kalau dipencet?',
      en: 'What does this button actually do?',
    },
    palette: {
      shirt: '#ecc94b',
      accent: '#ff7a7a',
      hat: '#d69e2e',
    },
  },
];

export function getCrew(id: CrewId): CrewMember | undefined {
  return crewMembers.find((member) => member.id === id);
}

export function getLeadCrew(category: CategoryId): CrewMember | undefined {
  return crewMembers.find((member) => member.leadOf === category);
}
