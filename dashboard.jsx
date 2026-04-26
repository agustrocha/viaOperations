// dashboard.jsx — Dashboard v1: Modern B2B (Linear-ish)
// The "Today" command center. Stats, alerts, live activity, next-up services.

const VODashboard = ({ lang = 'es' }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const NOW = D.NOW_MIN;
  const t = (es, en) => lang === 'en' ? en : es;

  // Live stats
  const total = D.services.length;
  const completed = D.services.filter(s => s.status === 'completed').length;
  const inProgress = D.services.filter(s => ['en_route','on_site','in_progress'].includes(s.status)).length;
  const unassigned = D.services.filter(s => s.status === 'unassigned').length;
  const incidents = D.services.filter(s => s.status === 'incident' || s.status === 'no_show').length;
  const upcoming = D.services
    .filter(s => s.pickup.at >= NOW && s.pickup.at < NOW + 180)
    .sort((a, b) => a.pickup.at - b.pickup.at);

  const liveDrivers = D.drivers.filter(d => d.status === 'driving').length;
  const idleDrivers = D.drivers.filter(d => d.status === 'idle').length;

  return (
    <div className="vo-app" data-screen-label="Dashboard">
      <VOTopbar active="dashboard" lang={lang} />

      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              {t('Operativa del día', 'Today\'s operations')} · {t('Vie 25 Abr', 'Fri Apr 25')}
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
              {t('Buenos días, Cristina.', 'Good morning, Cristina.')} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>{t('15 servicios hoy.', '15 services today.')}</span>
            </h1>
          </div>
          <div className="vo-row" style={{ gap: 8 }}>
            <button className="vo-btn"><VOIcon name="filter" size={12} /> {t('Filtros', 'Filters')}</button>
            <button className="vo-btn"><VOIcon name="refresh" size={12} /> {t('Auto-refresh · 30s', 'Auto-refresh · 30s')}</button>
            <button className="vo-btn" data-variant="primary"><VOIcon name="plus" size={12} /> {t('Nuevo servicio', 'New service')}</button>
          </div>
        </div>

        {/* Critical alert (delay cascade) */}
        <CascadeAlert lang={lang} />

        {/* Stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          <Stat label={t('En curso', 'In progress')} value={inProgress} total={total} tone="info" sub={t(`${liveDrivers} conductores en ruta`, `${liveDrivers} drivers on road`)} />
          <Stat label={t('Próximas 3 h', 'Next 3 h')} value={upcoming.length} tone="ok" sub={t('Recogidas planificadas', 'Scheduled pickups')} />
          <Stat label={t('Sin asignar', 'Unassigned')} value={unassigned} tone="warn" sub={t('Requieren acción', 'Need action')} />
          <Stat label={t('Incidencias', 'Incidents')} value={incidents} tone="crit" sub={t('Hoy', 'Today')} />
          <Stat label={t('Completados', 'Completed')} value={completed} total={total} tone="ok" sub={t('92% on-time', '92% on-time')} />
        </div>

        {/* Main two-column area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, flex: 1, minHeight: 0 }}>
          {/* Left: Now + Next */}
          <div className="vo-col" style={{ gap: 16 }}>
            <NowSection lang={lang} />
            <NextUpSection lang={lang} />
          </div>

          {/* Right: Activity feed + Resources */}
          <div className="vo-col" style={{ gap: 16 }}>
            <ActivityFeed lang={lang} />
            <ResourcesPanel lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Cascade alert (the critical case) ──────────────────────
const CascadeAlert = ({ lang }) => {
  const t = (es, en) => lang === 'en' ? en : es;
  return (
    <div className="vo-alert" data-tone="crit" style={{ alignItems: 'center' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--crit-soft)', color: 'var(--crit-text)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <VOIcon name="alert" size={15} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="ttl">
          {t('Retraso en cadena detectado · S-2844 → S-2851', 'Cascade delay detected · S-2844 → S-2851')}
        </div>
        <div className="body" style={{ marginTop: 2 }}>
          {t('Sergio B. acumula +8 min por tráfico en Ma-19. El siguiente servicio (vuelo IB3173 a las 14:50) está en riesgo. Margen estimado: 4 min.', 'Sergio B. is +8 min behind on Ma-19. Next service (IB3173 @ 14:50) at risk. Margin: 4 min.')}
        </div>
      </div>
      <div className="vo-row" style={{ gap: 6 }}>
        <button className="vo-btn" data-size="sm">{t('Ver cadena', 'View chain')}</button>
        <button className="vo-btn" data-size="sm" data-variant="primary">{t('Reasignar S-2851', 'Reassign S-2851')}</button>
        <button className="vo-icon-btn" style={{ width: 24, height: 24 }}><VOIcon name="x" size={12} /></button>
      </div>
    </div>
  );
};

const Stat = ({ label, value, total, tone, sub }) => (
  <div className="vo-stat" data-tone={tone}>
    <span className="accent-bar"></span>
    <div className="label">{label}</div>
    <div className="value">{value}{total != null ? <span className="total">/ {total}</span> : null}</div>
    {sub && <div className="delta">{sub}</div>}
  </div>
);

// ─── NOW section: live timeline strip ───────────────────────
const NowSection = ({ lang }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const t = (es, en) => lang === 'en' ? en : es;
  const NOW = D.NOW_MIN;

  const live = D.services
    .filter(s => ['en_route','on_site','in_progress'].includes(s.status))
    .sort((a, b) => a.pickup.at - b.pickup.at);

  return (
    <div className="vo-card" style={{ flexShrink: 0 }}>
      <div className="vo-card-hd">
        <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)' }}></span>
        <h3>{t('Ahora mismo', 'Right now')}</h3>
        <span className="sub">{live.length} {t('servicios activos', 'active services')}</span>
        <div style={{ flex: 1 }}></div>
        <button className="vo-btn" data-variant="ghost" data-size="sm"><VOIcon name="map" size={11} />{t('Ver en mapa', 'Open map')}</button>
      </div>

      <div style={{ padding: '4px 0' }}>
        {live.map(s => <NowRow key={s.id} svc={s} lang={lang} />)}
      </div>
    </div>
  );
};

const NowRow = ({ svc, lang }) => {
  const H = window.VO_HELPERS;
  const D = window.VO_DATA;
  const NOW = D.NOW_MIN;
  const driver = H.driverById(svc.driver);
  const vehicle = H.vehicleById(svc.vehicle);
  const t = (es, en) => lang === 'en' ? en : es;

  // progress 0..1 between pickup.at and dropoff.at
  const total = svc.dropoff.at - svc.pickup.at;
  const elapsed = NOW - svc.pickup.at;
  const progress = Math.max(0, Math.min(1, elapsed / total));
  const etaDelta = svc.delay ? `+${svc.delay}m` : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 200px 120px', gap: 12, padding: '10px 14px', borderTop: '1px solid var(--line)', alignItems: 'center' }}>
      <div className="vo-col" style={{ gap: 2 }}>
        <span className="vo-mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>{svc.id}</span>
        <VOServiceType type={svc.type} />
      </div>

      <div className="vo-col" style={{ gap: 4, minWidth: 0 }}>
        <div className="vo-row" style={{ gap: 6 }}>
          <VOStatus status={svc.status} />
          {svc.flight && <span className="vo-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{svc.flight}</span>}
          {etaDelta && <span className="vo-pill" data-tone="warn"><VOIcon name="alert" size={10} />{etaDelta}</span>}
        </div>
        <div className="vo-row vo-truncate" style={{ fontSize: 12.5, color: 'var(--text)', gap: 6 }}>
          <span className="vo-truncate" style={{ flex: 1 }}>{svc.pickup.place}</span>
          <VOIcon name="arrow_right" size={11} style={{ color: 'var(--text-dim)' }} />
          <span className="vo-truncate" style={{ flex: 1 }}>{svc.dropoff.place}</span>
        </div>
        <div style={{ height: 4, background: 'var(--bg-sunken)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: svc.delay ? 'var(--warn)' : 'var(--ok)', borderRadius: 2 }}></div>
        </div>
      </div>

      <div className="vo-row" style={{ gap: 6 }}>
        <VODriverChip id={svc.driver} />
        <VOVehicleChip id={svc.vehicle} />
      </div>

      <div className="vo-col" style={{ gap: 2, alignItems: 'flex-end', textAlign: 'right' }}>
        <span className="vo-mono" style={{ fontSize: 13, fontWeight: 500 }}>
          {H.fmtTime(svc.pickup.at)} <span style={{ color: 'var(--text-dim)' }}>→</span> {H.fmtTime(svc.dropoff.at)}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{svc.pax} pax · {H.fmtDur(svc.dropoff.at - svc.pickup.at)}</span>
      </div>
    </div>
  );
};

// ─── Next-up table ──────────────────────────────────────────
const NextUpSection = ({ lang }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const NOW = D.NOW_MIN;
  const t = (es, en) => lang === 'en' ? en : es;

  const upcoming = D.services
    .filter(s => s.pickup.at >= NOW && ['assigned','unassigned'].includes(s.status))
    .sort((a, b) => a.pickup.at - b.pickup.at)
    .slice(0, 8);

  return (
    <div className="vo-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="vo-card-hd">
        <h3>{t('Próximos servicios', 'Upcoming services')}</h3>
        <span className="sub">{t('Próximas 3 horas', 'Next 3 hours')}</span>
        <div style={{ flex: 1 }}></div>
        <button className="vo-btn" data-variant="ghost" data-size="sm">{t('Ver todos', 'See all')} <VOIcon name="chevron" size={11} /></button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <table className="vo-table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>{t('Hora', 'Time')}</th>
              <th style={{ width: 60 }}>{t('ID', 'ID')}</th>
              <th>{t('Ruta', 'Route')}</th>
              <th style={{ width: 110 }}>{t('Cliente', 'Client')}</th>
              <th style={{ width: 50 }}>Pax</th>
              <th style={{ width: 240 }}>{t('Asignación', 'Assignment')}</th>
              <th style={{ width: 30 }}></th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map(s => <UpcomingRow key={s.id} svc={s} lang={lang} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UpcomingRow = ({ svc, lang }) => {
  const H = window.VO_HELPERS;
  const D = window.VO_DATA;
  const NOW = D.NOW_MIN;
  const client = H.clientById(svc.client);
  const t = (es, en) => lang === 'en' ? en : es;
  const minToPickup = svc.pickup.at - NOW;
  const isUrgent = minToPickup < 30;
  const tone = svc.atRisk ? 'warn' : svc.status === 'unassigned' ? (isUrgent ? 'crit' : 'warn') : null;

  return (
    <tr data-tone={tone}>
      <td>
        <div className="vo-col" style={{ gap: 0 }}>
          <span className="time">{H.fmtTime(svc.pickup.at)}</span>
          <span className="meta" style={{ fontSize: 10.5 }}>{H.diffFromNow(svc.pickup.at, NOW)}</span>
        </div>
      </td>
      <td><span className="id">{svc.id}</span></td>
      <td>
        <div className="vo-row" style={{ gap: 6 }}>
          <VOServiceType type={svc.type} />
          <span className="vo-truncate" style={{ maxWidth: 280 }}>
            {svc.pickup.place.split(',')[0]} <span style={{ color: 'var(--text-dim)' }}>→</span> {svc.dropoff.place.split(' ')[0]}
          </span>
          {svc.atRisk && <span className="vo-pill" data-tone="warn"><VOIcon name="alert" size={10} />{t('en riesgo', 'at risk')}</span>}
        </div>
      </td>
      <td><span style={{ fontSize: 12 }}>{client?.name || '—'}</span></td>
      <td><span className="vo-mono">{svc.pax}</span></td>
      <td>
        <div className="vo-row" style={{ gap: 4 }}>
          <VODriverChip id={svc.driver} />
          <VOVehicleChip id={svc.vehicle} />
        </div>
      </td>
      <td><button className="vo-icon-btn" style={{ width: 22, height: 22 }}><VOIcon name="dots" size={12} /></button></td>
    </tr>
  );
};

// ─── Activity feed ──────────────────────────────────────────
const ActivityFeed = ({ lang }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const t = (es, en) => lang === 'en' ? en : es;

  const kind2Tone = {
    incident: 'crit', delay: 'warn', en_route: 'info',
    on_site: 'info', started: 'ok', completed: 'neutral',
  };
  const kind2Icon = {
    incident: 'alert', delay: 'clock', en_route: 'play',
    on_site: 'pin', started: 'check', completed: 'check',
  };

  return (
    <div className="vo-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="vo-card-hd">
        <h3>{t('Actividad en directo', 'Live activity')}</h3>
        <span className="sub">{t('últimas 5 h', 'last 5 h')}</span>
        <div style={{ flex: 1 }}></div>
        <button className="vo-btn" data-variant="ghost" data-size="sm"><VOIcon name="filter" size={11} /></button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        {D.activity.map((ev, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 18px 1fr', gap: 8, padding: '8px 14px', alignItems: 'flex-start' }}>
            <span className="vo-mono" style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 1 }}>{H.fmtTime(ev.t)}</span>
            <span style={{
              width: 18, height: 18, borderRadius: 4,
              background: `var(--${kind2Tone[ev.k] === 'neutral' ? 'bg-sunken' : kind2Tone[ev.k]+'-soft'})`,
              color: `var(--${kind2Tone[ev.k] === 'neutral' ? 'text-dim' : kind2Tone[ev.k]+'-text'})`,
              display: 'grid', placeItems: 'center',
            }}>
              <VOIcon name={kind2Icon[ev.k]} size={10} />
            </span>
            <div className="vo-col" style={{ gap: 1 }}>
              <span style={{ fontSize: 12, lineHeight: 1.35 }}>{ev.text}</span>
              <span className="vo-mono" style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>{ev.svc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Resources panel ────────────────────────────────────────
const ResourcesPanel = ({ lang }) => {
  const D = window.VO_DATA;
  const t = (es, en) => lang === 'en' ? en : es;

  const driveStats = {
    driving: D.drivers.filter(d => d.status === 'driving').length,
    idle: D.drivers.filter(d => d.status === 'idle').length,
    break: D.drivers.filter(d => d.status === 'break').length,
    off: D.drivers.filter(d => d.status === 'off').length,
  };
  const vehStats = {
    in_service: D.vehicles.filter(v => v.status === 'in_service').length,
    idle: D.vehicles.filter(v => v.status === 'idle').length,
    maintenance: D.vehicles.filter(v => v.status === 'maintenance').length,
  };

  return (
    <div className="vo-card" style={{ flexShrink: 0 }}>
      <div className="vo-card-hd">
        <h3>{t('Recursos', 'Resources')}</h3>
        <div style={{ flex: 1 }}></div>
        <button className="vo-btn" data-variant="ghost" data-size="sm">{t('Gestionar', 'Manage')}</button>
      </div>

      <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ResourceBlock
          title={t('Conductores', 'Drivers')}
          total={D.drivers.length}
          rows={[
            { label: t('En ruta', 'On road'), val: driveStats.driving, tone: 'ok' },
            { label: t('Disponibles', 'Idle'), val: driveStats.idle, tone: 'info' },
            { label: t('En descanso', 'Break'), val: driveStats.break, tone: 'warn' },
            { label: t('Off-duty', 'Off-duty'), val: driveStats.off, tone: 'neutral' },
          ]}
        />
        <ResourceBlock
          title={t('Vehículos', 'Vehicles')}
          total={D.vehicles.length}
          rows={[
            { label: t('En servicio', 'In service'), val: vehStats.in_service, tone: 'ok' },
            { label: t('Disponibles', 'Idle'), val: vehStats.idle, tone: 'info' },
            { label: t('Mantenimiento', 'Maintenance'), val: vehStats.maintenance, tone: 'crit' },
            { label: '—', val: '', tone: 'neutral' },
          ]}
        />
      </div>
    </div>
  );
};

const ResourceBlock = ({ title, total, rows }) => (
  <div>
    <div className="vo-row" style={{ marginBottom: 8 }}>
      <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500 }}>{title}</span>
      <span className="vo-mono" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)' }}>{total}</span>
    </div>
    <div className="vo-col" style={{ gap: 4 }}>
      {rows.map((r, i) => (
        <div key={i} className="vo-row" style={{ fontSize: 12, justifyContent: 'space-between' }}>
          <span className="vo-row" style={{ gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.tone === 'ok' ? 'var(--ok)' : r.tone === 'warn' ? 'var(--warn)' : r.tone === 'crit' ? 'var(--crit)' : r.tone === 'info' ? 'var(--accent)' : 'var(--text-dim)' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
          </span>
          <span className="vo-mono" style={{ fontWeight: 500 }}>{r.val}</span>
        </div>
      ))}
    </div>
  </div>
);

window.VODashboard = VODashboard;
