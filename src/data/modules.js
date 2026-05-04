export const modules = [
  { slug: 'alur-kerja', name: 'Alur Kerja', group: 'SOP' },
  {
    slug: 'device-speed',
    name: 'Device Speed',
    keywords: 'speed uni forklift gt-sal09fhv1 device kecepatan',
    items: ['Speed Uni', 'Speed Forklift GT-SAL09FHV1'],
  },
  {
    slug: 'device-fatigue',
    name: 'Device Fatigue',
    keywords: 'fatigue merah putih fmp alarm kelelahan',
    items: ['Fatigue Merah Putih (FMP)'],
  },
  {
    slug: 'auto-fire',
    name: 'AFS',
    keywords: 'auto fire suppression afs pcb pemadam kebakaran',
    items: ['PCB AFS', 'PCB Fatigue'],
  },
  {
    slug: 'iscs',
    name: 'ISCS',
    keywords: 'iscs incline shutdown control system gt-iid06a kabel kemiringan',
    items: ['ISCS Device GT-IID06A', 'Kabel Body ISCS'],
  },
  {
    slug: 'pids',
    name: 'PIDS',
    keywords: 'pids no ka gt-nt03pap display temperatur controller outdoor gt-pap02p2',
    items: ['PIDS No. KA GT-NT03PAP', 'PIDS Display Temperatur', 'PIDS Controller Outdoor GT-PAP02P2'],
  },
  {
    slug: 'limiter',
    name: 'Limiter Cut Controller',
    keywords: 'limiter cut controller universal',
    items: ['Limiter Cut Controller Universal'],
  },
  {
    slug: 'gyroscope',
    name: 'Gyroscope',
    keywords: 'gyroscope gt-gy2 gt-gy03a gt-gy04a tanpa line driver ada',
    items: ['Gyroscope Tanpa Line Driver GT-GY2 GT-GY03A', 'Gyroscope Ada Line Driver GT-GY04A'],
  },
  {
    slug: 'imu',
    name: 'IMU',
    keywords: 'imu inertial measurement unit',
    items: ['IMU'],
  },
  {
    slug: 'kabel-body',
    name: 'Kabel Body',
    keywords: 'kabel body speed safety module tracker logger limiter fuso display eksternal voice fatigue gitronik merah putih idletimer iscs shutdown dump',
    items: [
      'Kabel Body Speed',
      'Kabel Body Safety Module',
      'Kabel Speed Tracker Logger',
      'Kabel Body Speed Limiter Fuso',
      'Kabel Body Speed Display Eksternal',
      'Kabel Body Speed Voice',
      'Kabel Body Fatigue Alarm Gitronik',
      'Kabel Body Fatigue Alarm Merah Putih',
      'Kabel Body Idletimer HE & Dozer',
      'Kabel Body ISCS Shutdown',
      'Kabel Body ISCS Safety Dump',
    ],
  },
  {
    slug: 'alarm',
    name: 'Alarm',
    keywords: 'alarm bulat kecil besar',
    items: ['Alarm Bulat Kecil', 'Alarm Bulat Besar'],
  },
  {
    slug: 'line-driver',
    name: 'Line Driver RS232',
    keywords: 'line driver rs232 mini serial',
    items: ['Line Driver RS232 Mini'],
  },
  {
    slug: 'idletimer',
    name: 'Idletimer / Turbotimer',
    keywords: 'idletimer turbotimer heavy equipment dozer gt-iis05d gt-iis06a gt-ith04a lite',
    items: ['Idletimer Heavy Equipment & Dozer GT-IIS05D', 'Idletimer GT-IIS06A', 'Idletimer Lite GT-ITH04A'],
  },
]

export function normalize(value) {
  return String(value || '').toLowerCase().trim().replace(/\s+/g, ' ')
}

export function matchesQuery(values, query) {
  const words = normalize(query).split(' ').filter(Boolean)
  const haystack = values.map(normalize).join(' ')
  return words.every((word) => haystack.includes(word))
}

export function getModuleTitle(slug) {
  return modules.find((module) => module.slug === slug)?.name || slug
}
