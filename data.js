// data.js — Mock data for Vía Operations
// Realistic transport ops scenario for late morning of a busy ops day.

window.VO_DATA = (() => {
  const NOW_MIN = 11 * 60 + 32; // simulated "now" = 11:32

  const drivers = [
    { id: 'D-014', name: 'Marta Aguilar', initials: 'MA', phone: '+34 612 332 110', status: 'driving',  rating: 4.9, since: '2019' },
    { id: 'D-021', name: 'Joan Riba',     initials: 'JR', phone: '+34 612 110 988', status: 'driving',  rating: 4.8, since: '2021' },
    { id: 'D-007', name: 'Lucía Pons',    initials: 'LP', phone: '+34 698 442 003', status: 'idle',     rating: 4.9, since: '2018' },
    { id: 'D-033', name: 'Adel Ben',      initials: 'AB', phone: '+34 666 776 211', status: 'break',    rating: 4.7, since: '2022' },
    { id: 'D-002', name: 'Carlos Vidal',  initials: 'CV', phone: '+34 690 887 332', status: 'driving',  rating: 4.8, since: '2017' },
    { id: 'D-019', name: 'Núria Sala',    initials: 'NS', phone: '+34 654 332 112', status: 'idle',     rating: 4.9, since: '2020' },
    { id: 'D-028', name: 'Dani Ortega',   initials: 'DO', phone: '+34 612 998 110', status: 'off',      rating: 4.6, since: '2023' },
    { id: 'D-040', name: 'Sergio Bauzá',  initials: 'SB', phone: '+34 690 442 887', status: 'driving',  rating: 4.8, since: '2021' },
    { id: 'D-005', name: 'Imane Tazi',    initials: 'IT', phone: '+34 612 111 343', status: 'idle',     rating: 4.9, since: '2019' },
    { id: 'D-031', name: 'Paco Méndez',   initials: 'PM', phone: '+34 698 220 994', status: 'driving',  rating: 4.7, since: '2018' },
  ];

  const vehicles = [
    { id: 'V-12', plate: '4421-LXP', model: 'Mercedes V-Class', kind: 'van',     seats: 7,  status: 'in_service',  fuel: 64 },
    { id: 'V-08', plate: '8190-KTR', model: 'Mercedes Vito',    kind: 'van',     seats: 8,  status: 'in_service',  fuel: 41 },
    { id: 'V-21', plate: '2034-MBG', model: 'Tesla Model S',    kind: 'sedan',   seats: 3,  status: 'idle',        fuel: 88 },
    { id: 'V-04', plate: '6701-JFM', model: 'BMW 7 Series',     kind: 'sedan',   seats: 3,  status: 'in_service',  fuel: 52 },
    { id: 'V-17', plate: '5523-LZN', model: 'Mercedes Sprinter',kind: 'minibus', seats: 16, status: 'idle',        fuel: 91 },
    { id: 'V-25', plate: '9912-MCV', model: 'Mercedes Sprinter',kind: 'minibus', seats: 19, status: 'maintenance', fuel: 12 },
    { id: 'V-02', plate: '1180-HFA', model: 'Audi A6',          kind: 'sedan',   seats: 3,  status: 'in_service',  fuel: 68 },
    { id: 'V-29', plate: '7741-MGT', model: 'Iveco Daily',      kind: 'bus',     seats: 24, status: 'in_service',  fuel: 73 },
    { id: 'V-11', plate: '3309-LBC', model: 'Mercedes V-Class', kind: 'van',     seats: 7,  status: 'idle',        fuel: 55 },
    { id: 'V-19', plate: '8842-LZP', model: 'Mercedes E-Class', kind: 'sedan',   seats: 3,  status: 'in_service',  fuel: 47 },
  ];

  const clients = [
    { id: 'C-AGT-01', name: 'Tropikana Travel',   kind: 'agency',  tier: 'A' },
    { id: 'C-AGT-02', name: 'Mediterranean Tours', kind: 'agency',  tier: 'A' },
    { id: 'C-AGT-03', name: 'Iberia Holidays',    kind: 'agency',  tier: 'B' },
    { id: 'C-CRP-04', name: 'Lufthansa Crew',     kind: 'corporate', tier: 'A' },
    { id: 'C-PRV-09', name: 'M. Schultz',         kind: 'private', tier: '—' },
    { id: 'C-PRV-12', name: 'L. Romero',          kind: 'private', tier: '—' },
    { id: 'C-AGT-07', name: 'Costa Adventures',    kind: 'agency',  tier: 'B' },
  ];

  // Service types (for icons / pills)
  const TYPES = {
    transfer:    { label: 'Transfer',     short: 'TR', icon: 'plane' },
    disposicion: { label: 'Disposición', short: 'DSP', icon: 'clock' },
    grupo:       { label: 'Grupo',        short: 'GR', icon: 'users' },
    excursion:   { label: 'Excursión',    short: 'EX', icon: 'map' },
  };

  // Today's services. Times in minutes-from-midnight.
  // status: draft | unassigned | assigned | en_route | on_site | in_progress | completed | no_show | incident
  const services = [
    { id: 'S-2841', type: 'transfer', client: 'C-AGT-01', pax: 4,
      pickup: { at: 360, place: 'Hotel Riu Palace, S\'Arenal' },
      dropoff:{ at: 415, place: 'PMI · Aeropuerto T1, salidas' },
      flight: 'IB3171 → MAD 08:45',
      status: 'completed',
      driver: 'D-014', vehicle: 'V-12',
      events: [ {t: 355, k: 'en_route'}, {t: 360, k: 'on_site'}, {t: 372, k: 'in_progress'}, {t: 412, k: 'completed'} ],
    },
    { id: 'S-2842', type: 'transfer', client: 'C-AGT-02', pax: 3,
      pickup: { at: 480, place: 'Hotel Iberostar, Playa de Palma' },
      dropoff:{ at: 535, place: 'PMI · Aeropuerto T1, salidas' },
      flight: 'EW9851 → CGN 10:30',
      status: 'completed',
      driver: 'D-021', vehicle: 'V-08',
      events: [ {t: 478, k: 'en_route'}, {t: 488, k: 'on_site'}, {t: 503, k: 'in_progress'}, {t: 538, k: 'completed', late: 3} ],
    },
    { id: 'S-2843', type: 'transfer', client: 'C-CRP-04', pax: 8,
      pickup: { at: 600, place: 'Hotel Innside Calviá Beach' },
      dropoff:{ at: 660, place: 'PMI · Aeropuerto T2, llegadas' },
      flight: 'LH1146 ← FRA 11:20',
      status: 'in_progress',
      driver: 'D-002', vehicle: 'V-29',
      events: [ {t: 605, k: 'en_route'}, {t: 632, k: 'on_site'}, {t: 645, k: 'in_progress'} ],
    },
    { id: 'S-2844', type: 'transfer', client: 'C-AGT-01', pax: 2,
      pickup: { at: 690, place: 'PMI · Aeropuerto T1, llegadas' },
      dropoff:{ at: 745, place: 'Hotel Mar Azul, Cala Major' },
      flight: 'BA0492 ← LHR 11:10',
      status: 'en_route',
      driver: 'D-040', vehicle: 'V-19',
      delay: 8, // late by 8 min
      events: [ {t: 685, k: 'en_route'} ],
      delayCascade: ['S-2851'], // this driver's next service is at risk
    },
    { id: 'S-2845', type: 'disposicion', client: 'C-PRV-09', pax: 2,
      pickup: { at: 660, place: 'Hotel Castillo Hospes' },
      dropoff:{ at: 900, place: 'Disposición · 4 h · Palma centro' },
      hours: 4,
      status: 'in_progress',
      driver: 'D-031', vehicle: 'V-04',
      events: [ {t: 655, k: 'en_route'}, {t: 660, k: 'on_site'}, {t: 665, k: 'in_progress'} ],
    },
    { id: 'S-2846', type: 'transfer', client: 'C-AGT-03', pax: 1,
      pickup: { at: 705, place: 'Hotel Be Live Adults Only' },
      dropoff:{ at: 755, place: 'PMI · Aeropuerto T1, salidas' },
      flight: 'VY3811 → BCN 12:55',
      status: 'assigned',
      driver: 'D-019', vehicle: 'V-21',
      events: [],
    },
    { id: 'S-2847', type: 'grupo', client: 'C-AGT-02', pax: 14,
      pickup: { at: 720, place: 'Cruise terminal Palma · Muelle 2' },
      dropoff:{ at: 780, place: 'Hotel Meliá Calvià · Lobby' },
      status: 'unassigned',
      events: [],
    },
    { id: 'S-2848', type: 'transfer', client: 'C-AGT-07', pax: 6,
      pickup: { at: 730, place: 'Hotel Garonda' },
      dropoff:{ at: 795, place: 'PMI · Aeropuerto T1, salidas' },
      flight: 'AF1948 → CDG 14:00',
      status: 'unassigned',
      conflict: 'no_vehicle',
      events: [],
    },
    { id: 'S-2849', type: 'excursion', client: 'C-AGT-07', pax: 11,
      pickup: { at: 540, place: 'Hotel Palace Bonanza' },
      dropoff:{ at: 1020, place: 'Cap de Formentor · ruta 8 paradas' },
      stops: 8,
      status: 'in_progress',
      driver: 'D-021', vehicle: 'V-17',
      events: [ {t: 538, k: 'en_route'}, {t: 547, k: 'on_site'}, {t: 555, k: 'in_progress'} ],
    },
    { id: 'S-2850', type: 'transfer', client: 'C-PRV-12', pax: 2,
      pickup: { at: 765, place: 'Hotel Nakar Palma' },
      dropoff:{ at: 825, place: 'PMI · Aeropuerto T1, salidas' },
      flight: 'IB3179 → MAD 14:30',
      status: 'assigned',
      driver: 'D-007', vehicle: 'V-02',
      events: [],
    },
    { id: 'S-2851', type: 'transfer', client: 'C-AGT-01', pax: 3,
      pickup: { at: 780, place: 'Hotel Mar Azul, Cala Major' },
      dropoff:{ at: 845, place: 'PMI · Aeropuerto T1, salidas' },
      flight: 'IB3173 → MAD 14:50',
      status: 'assigned',
      driver: 'D-040', vehicle: 'V-19',
      atRisk: true, // affected by S-2844 delay
      events: [],
    },
    { id: 'S-2852', type: 'transfer', client: 'C-AGT-03', pax: 4,
      pickup: { at: 810, place: 'Hotel Llaut Palace' },
      dropoff:{ at: 870, place: 'PMI · Aeropuerto T1, salidas' },
      flight: 'EW9854 → CGN 15:15',
      status: 'assigned',
      driver: 'D-005', vehicle: 'V-11',
      events: [],
    },
    { id: 'S-2853', type: 'grupo', client: 'C-AGT-02', pax: 22,
      pickup: { at: 870, place: 'Cruise terminal Palma · Muelle 4' },
      dropoff:{ at: 930, place: 'Hotel Riu Concordia' },
      status: 'unassigned',
      conflict: 'capacity', // needs 22 seats
      events: [],
    },
    { id: 'S-2854', type: 'transfer', client: 'C-CRP-04', pax: 5,
      pickup: { at: 900, place: 'PMI · Aeropuerto T2, llegadas' },
      dropoff:{ at: 950, place: 'Hotel Innside Calviá Beach' },
      flight: 'LH1148 ← FRA 14:50',
      status: 'assigned',
      driver: 'D-002', vehicle: 'V-29',
      events: [],
    },
    { id: 'S-2855', type: 'transfer', client: 'C-AGT-01', pax: 2,
      pickup: { at: 930, place: 'Hotel Riu Palace, S\'Arenal' },
      dropoff:{ at: 985, place: 'PMI · Aeropuerto T1, salidas' },
      status: 'incident',
      driver: 'D-014', vehicle: 'V-12',
      incident: { kind: 'no_show', note: 'Cliente no se presentó · 12 min de espera' },
      events: [ {t: 690, k: 'en_route'}, {t: 705, k: 'on_site'}, {t: 717, k: 'incident'} ],
    },
  ];

  // Live timeline events for "Activity feed"
  const activity = [
    { t: 692, k: 'incident', svc: 'S-2855', text: 'No-show reportado por Marta A. · cliente no apareció' },
    { t: 690, k: 'delay',    svc: 'S-2844', text: 'Retraso estimado +8 min · tráfico Ma-19 hacia Cala Major' },
    { t: 685, k: 'en_route', svc: 'S-2844', text: 'Sergio B. (V-19) en ruta hacia recogida' },
    { t: 665, k: 'started',  svc: 'S-2845', text: 'Disposición iniciada · 4 h · Hotel Castillo Hospes' },
    { t: 645, k: 'started',  svc: 'S-2843', text: 'Pasajeros recogidos · LH1146 (8 pax)' },
    { t: 632, k: 'on_site',  svc: 'S-2843', text: 'Carlos V. en aeropuerto · esperando vuelo LH1146' },
    { t: 555, k: 'started',  svc: 'S-2849', text: 'Excursión Cap de Formentor en curso · 11 pax' },
    { t: 538, k: 'completed',svc: 'S-2842', text: 'Servicio completado · +3 min sobre lo previsto' },
    { t: 412, k: 'completed',svc: 'S-2841', text: 'Servicio completado on-time' },
  ];

  return {
    NOW_MIN, drivers, vehicles, clients, services, activity, TYPES,
  };
})();

// ─── Helpers ────────────────────────────────────────────────
window.VO_HELPERS = {
  fmtTime(min) {
    if (min == null) return '—';
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  },
  fmtDur(min) {
    if (min < 60) return `${min}m`;
    return `${Math.floor(min/60)}h ${min%60 ? (min%60)+'m' : ''}`.trim();
  },
  diffFromNow(min, now) {
    const d = min - now;
    if (Math.abs(d) < 1) return 'ahora';
    if (d > 0) return `en ${d < 60 ? d+'m' : Math.floor(d/60)+'h '+(d%60)+'m'}`;
    const a = -d;
    return `hace ${a < 60 ? a+'m' : Math.floor(a/60)+'h'}`;
  },
  statusInfo(status) {
    return ({
      draft:       { label: 'Borrador',     tone: 'neutral', dot: 'oklch(0.7 0 0)' },
      unassigned:  { label: 'Sin asignar',  tone: 'violet',  dot: 'var(--violet)' },
      assigned:    { label: 'Asignado',     tone: 'info',    dot: 'var(--accent)' },
      en_route:    { label: 'En ruta',      tone: 'info',    dot: 'var(--accent)' },
      on_site:     { label: 'En recogida',  tone: 'warn',    dot: 'var(--warn)' },
      in_progress: { label: 'En curso',     tone: 'ok',      dot: 'var(--ok)' },
      completed:   { label: 'Completado',   tone: 'neutral', dot: 'var(--text-dim)' },
      no_show:     { label: 'No-show',      tone: 'crit',    dot: 'var(--crit)' },
      incident:    { label: 'Incidencia',   tone: 'crit',    dot: 'var(--crit)' },
    })[status] || { label: status, tone: 'neutral' };
  },
  serviceLabel(s, types) {
    return types[s.type]?.short || '—';
  },
  driverById(id) {
    return window.VO_DATA.drivers.find(d => d.id === id);
  },
  vehicleById(id) {
    return window.VO_DATA.vehicles.find(v => v.id === id);
  },
  clientById(id) {
    return window.VO_DATA.clients.find(c => c.id === id);
  },
};
