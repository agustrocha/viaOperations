// dashboard-dense.jsx — Dashboard v2: Dense "centralita" variant
// More info per pixel, monospace-heavy, Bloomberg/control-room flavor.

const VODashboardDense = ({ lang = 'es' }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const NOW = D.NOW_MIN;
  const t = (es, en) => lang === 'en' ? en : es;

  return (
    <div className="vo-app" data-density="dense" data-screen-label="Dashboard dense" style={{ background: 'var(--bg-sunken)' }}>
      <VOTopbar active="dashboard" lang={lang} />

      {/* Strip: live KPIs as ticker */}
      <div style={{
        height: 32, flex: '0 0 32px', borderBottom: '1px solid var(--line)',
        background: 'var(--bg-elev)', display: 'flex', alignItems: 'center',
        padding: '0 12px', gap: 16, fontSize: 11.5, fontFamily: 'var(--ff-mono)', overflow: 'hidden',
      }}>
        {[
          ['SVC TOTAL', '15', null],
          ['DONE', '2', 'ok'],
          ['LIVE', '4', 'info'],
          ['ASSIGNED', '5', null],
          ['UNASSIGNED', '3', 'warn'],
          ['INCIDENTS', '1', 'crit'],
          ['DRIVERS·ON', '5/10', 'ok'],
          ['VEH·OUT', '6/10', 'info'],
          ['ON-TIME', '92%', 'ok'],
          ['AVG DELAY', '+2.4m', null],
          ['NEXT 30m', '4', null],
        ].map(([k, v, tone], i) => (
          <span key={i} className="vo-row" style={{ gap: 6 }}>
            <span style={{ color: 'var(--text-dim)' }}>{k}</span>
            <span style={{
              fontWeight: 600,
              color: tone === 'ok' ? 'var(--ok-text)' : tone === 'warn' ? 'var(--warn-text)' : tone === 'crit' ? 'var(--crit-text)' : tone === 'info' ? 'var(--accent-text)' : 'var(--text)',
            }}>{v}</span>
            {i < 10 && <span style={{ color: 'var(--line-strong)' }}>·</span>}
          </span>
        ))}
      </div>

      {/* 3-col grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '240px 1fr 320px', minHeight: 0 }}>
        {/* Left rail: status filters + drivers */}
        <DenseLeftRail lang={lang} />

        {/* Center: huge service grid */}
        <DenseGrid lang={lang} />

        {/* Right: alerts + activity */}
        <DenseRightRail lang={lang} />
      </div>
    </div>
  );
};

// ─── Left rail ──────────────────────────────────────────────
const DenseLeftRail = ({ lang }) => {
  const D = window.VO_DATA;
  const t = (es, en) => lang === 'en' ? en : es;

  return (
    <aside style={{
      borderRight: '1px solid var(--line)',
      background: 'var(--bg-elev)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>
        <div className="vo-row" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('Filtrar por estado', 'Filter by status')}</span>
        </div>
        <div className="vo-col" style={{ gap: 1 }}>
          {[
            { k: 'all', label: t('Todos', 'All'), n: 15, tone: 'all' },
            { k: 'unassigned', label: t('Sin asignar', 'Unassigned'), n: 3, tone: 'violet' },
            { k: 'assigned', label: t('Asignados', 'Assigned'), n: 5, tone: 'info' },
            { k: 'en_route', label: t('En ruta', 'En route'), n: 1, tone: 'info' },
            { k: 'in_progress', label: t('En curso', 'In progress'), n: 3, tone: 'ok' },
            { k: 'completed', label: t('Completados', 'Completed'), n: 2, tone: 'neutral' },
            { k: 'incident', label: t('Incidencias', 'Incidents'), n: 1, tone: 'crit' },
          ].map((it, i) => (
            <div key={it.k} className="vo-side-item" data-active={i === 0} style={{ padding: '5px 10px', fontSize: 12, borderRadius: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: it.tone === 'all' ? 'var(--text-dim)' : `var(--${it.tone === 'neutral' ? 'text-dim' : it.tone})` }}></span>
              <span>{it.label}</span>
              <span className="count vo-mono">{it.n}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)', flex: 1, overflow: 'auto' }}>
        <div className="vo-row" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('Conductores en ruta', 'Drivers on road')}</span>
          <span className="vo-mono" style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--text-dim)' }}>5/10</span>
        </div>
        <div className="vo-col" style={{ gap: 2 }}>
          {D.drivers.map(d => (
            <div key={d.id} className="vo-row" style={{ padding: '4px 6px', borderRadius: 4, fontSize: 11.5, cursor: 'pointer' }}
                 onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: d.status === 'driving' ? 'var(--ok)' : d.status === 'idle' ? 'var(--accent)' : d.status === 'break' ? 'var(--warn)' : 'var(--text-dim)',
                flexShrink: 0,
              }}></span>
              <span className="vo-avatar" style={{ width: 16, height: 16, fontSize: 8.5 }}>{d.initials}</span>
              <span className="vo-truncate" style={{ flex: 1, color: 'var(--text)' }}>{d.name}</span>
              <span className="vo-mono" style={{ fontSize: 10, color: 'var(--text-dim)' }}>{d.id.replace('D-', '')}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 12px' }}>
        <div className="vo-row" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('Atajos', 'Shortcuts')}</span>
        </div>
        <div className="vo-col" style={{ gap: 3 }}>
          {[
            ['N', t('Nuevo servicio', 'New service')],
            ['A', t('Asignar selección', 'Assign selection')],
            ['F', t('Buscar', 'Search')],
            ['G·M', t('Ir a mapa', 'Go to map')],
            ['?', t('Ver todos', 'See all')],
          ].map(([k, l]) => (
            <div key={k} className="vo-row" style={{ fontSize: 11, color: 'var(--text-muted)', justifyContent: 'space-between' }}>
              <span>{l}</span>
              <span className="vo-kbd">{k}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

// ─── Center grid: dense table of all today's services ───────
const DenseGrid = ({ lang }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const NOW = D.NOW_MIN;
  const t = (es, en) => lang === 'en' ? en : es;

  const [selected, setSelected] = React.useState(null);
  const sorted = [...D.services].sort((a, b) => a.pickup.at - b.pickup.at);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
      <div className="vo-toolbar" style={{ padding: '6px 10px' }}>
        <span className="vo-row" style={{ gap: 6 }}>
          <button className="vo-btn" data-size="sm">25 Abr 2026</button>
          <button className="vo-btn" data-variant="ghost" data-size="sm"><VOIcon name="chevron" size={11} style={{ transform: 'rotate(180deg)' }} /></button>
          <button className="vo-btn" data-variant="ghost" data-size="sm"><VOIcon name="chevron" size={11} /></button>
        </span>
        <div className="vo-divider"></div>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{t('Mostrando', 'Showing')}</span>
        <button className="vo-btn" data-size="sm">{t('Todos', 'All')} (15) <VOIcon name="chevron" size={10} style={{ transform: 'rotate(90deg)' }} /></button>
        <button className="vo-btn" data-size="sm" data-variant="ghost"><VOIcon name="filter" size={11} /> {t('Tipo', 'Type')}</button>
        <button className="vo-btn" data-size="sm" data-variant="ghost"><VOIcon name="filter" size={11} /> {t('Cliente', 'Client')}</button>
        <div style={{ flex: 1 }}></div>
        <button className="vo-btn" data-size="sm" data-variant="ghost"><VOIcon name="layers" size={11} /></button>
        <button className="vo-btn" data-size="sm" data-variant="primary"><VOIcon name="plus" size={11} /> {t('Nuevo', 'New')} <span className="vo-kbd" style={{ marginLeft: 4 }}>N</span></button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <table className="vo-table">
          <thead>
            <tr>
              <th style={{ width: 20 }}></th>
              <th style={{ width: 56 }}>{t('Hora', 'Time')}</th>
              <th style={{ width: 50 }}>ID</th>
              <th style={{ width: 30 }}>T</th>
              <th>{t('Recogida', 'Pickup')}</th>
              <th>{t('Destino', 'Drop-off')}</th>
              <th style={{ width: 90 }}>{t('Vuelo', 'Flight')}</th>
              <th style={{ width: 110 }}>{t('Cliente', 'Client')}</th>
              <th style={{ width: 36 }}>Pax</th>
              <th style={{ width: 130 }}>{t('Conductor', 'Driver')}</th>
              <th style={{ width: 90 }}>{t('Vehículo', 'Vehicle')}</th>
              <th style={{ width: 100 }}>{t('Estado', 'Status')}</th>
              <th style={{ width: 24 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(s => {
              const driver = H.driverById(s.driver);
              const vehicle = H.vehicleById(s.vehicle);
              const client = H.clientById(s.client);
              const tone = s.status === 'incident' || s.conflict ? 'crit' :
                           s.atRisk || s.delay ? 'warn' :
                           s.status === 'in_progress' || s.status === 'on_site' || s.status === 'en_route' ? 'ok' : null;
              return (
                <tr key={s.id} data-tone={tone} data-selected={selected === s.id} onClick={() => setSelected(s.id)}>
                  <td>
                    <input type="checkbox" style={{ accentColor: 'var(--accent)' }} onClick={e => e.stopPropagation()} />
                  </td>
                  <td><span className="time">{H.fmtTime(s.pickup.at)}</span></td>
                  <td><span className="id">{s.id.replace('S-', '')}</span></td>
                  <td>
                    <span className="vo-mono" style={{ fontSize: 9.5, padding: '1px 4px', borderRadius: 3, background: 'var(--bg-sunken)', color: 'var(--text-muted)' }}>{D.TYPES[s.type].short}</span>
                  </td>
                  <td><span className="vo-truncate" style={{ maxWidth: 200, display: 'inline-block', verticalAlign: 'middle' }}>{s.pickup.place.split(',')[0]}</span></td>
                  <td><span className="vo-truncate" style={{ maxWidth: 200, display: 'inline-block', verticalAlign: 'middle' }}>{s.dropoff.place.split(',')[0]}</span></td>
                  <td><span className="vo-mono" style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{s.flight ? s.flight.split(' ')[0] : '—'}</span></td>
                  <td><span className="vo-truncate" style={{ maxWidth: 110, display: 'inline-block', fontSize: 11.5 }}>{client?.name}</span></td>
                  <td><span className="vo-mono">{s.pax}</span></td>
                  <td>
                    {driver ? (
                      <span className="vo-row" style={{ gap: 5 }}>
                        <span className="vo-avatar" style={{ width: 16, height: 16, fontSize: 8.5 }}>{driver.initials}</span>
                        <span className="vo-truncate" style={{ fontSize: 11.5 }}>{driver.name.split(' ')[0]}</span>
                      </span>
                    ) : (
                      <span className="vo-pill" data-tone="violet" data-square="true" style={{ fontSize: 10 }}><VOIcon name="plus" size={9} /> {t('Asignar', 'Assign')}</span>
                    )}
                  </td>
                  <td>
                    {vehicle ? <span className="vo-mono" style={{ fontSize: 10.5 }}>{vehicle.plate}</span> : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                  </td>
                  <td>
                    {s.delay && <span className="vo-pill" data-tone="warn" data-square="true" style={{ fontSize: 10, marginRight: 4 }}>+{s.delay}m</span>}
                    {s.atRisk && <span className="vo-pill" data-tone="warn" data-square="true" style={{ fontSize: 10 }}><VOIcon name="alert" size={9} /></span>}
                    {!s.delay && !s.atRisk && <VOStatus status={s.status} mini />}
                  </td>
                  <td>
                    <button className="vo-icon-btn" style={{ width: 22, height: 22 }}><VOIcon name="dots" size={11} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Status footer */}
      <div style={{ height: 26, borderTop: '1px solid var(--line)', background: 'var(--bg-elev)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 14, fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-muted)' }}>
        <span><span style={{ color: 'var(--text-dim)' }}>SEL</span> {selected ? '1' : '0'}</span>
        <span><span style={{ color: 'var(--text-dim)' }}>FILTERS</span> 0</span>
        <span><span style={{ color: 'var(--text-dim)' }}>LAST SYNC</span> 11:32:04</span>
        <span style={{ marginLeft: 'auto' }}><span style={{ color: 'var(--ok)' }}>●</span> Realtime · ws://ops</span>
      </div>
    </div>
  );
};

// ─── Right rail: alerts + activity ──────────────────────────
const DenseRightRail = ({ lang }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const t = (es, en) => lang === 'en' ? en : es;

  return (
    <aside style={{
      borderLeft: '1px solid var(--line)',
      background: 'var(--bg-elev)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Critical alerts section */}
      <div style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10.5, color: 'var(--crit-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>● {t('Alertas críticas', 'Critical alerts')}</span>
          <span className="vo-mono" style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--text-dim)' }}>2</span>
        </div>
        <DenseAlert
          tone="crit"
          time="11:32"
          title={t('Cadena de retrasos', 'Delay cascade')}
          body={t('S-2844 → S-2851. Margen 4m.', 'S-2844 → S-2851. Margin 4m.')}
          action={t('Reasignar', 'Reassign')}
        />
        <DenseAlert
          tone="crit"
          time="11:30"
          title={t('No-show S-2855', 'No-show S-2855')}
          body={t('Marta A. esperó 12m. Cliente no apareció.', 'Marta A. waited 12m. No-show.')}
          action={t('Resolver', 'Resolve')}
        />
      </div>

      <div style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10.5, color: 'var(--warn-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>▲ {t('Avisos', 'Warnings')}</span>
          <span className="vo-mono" style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--text-dim)' }}>3</span>
        </div>
        <DenseAlert
          tone="warn"
          time="11:25"
          title={t('S-2848 sin vehículo', 'S-2848 missing vehicle')}
          body={t('Recogida 12:10 · 6 pax · sin van disponible', 'Pickup 12:10 · 6 pax · no van free')}
          action={t('Asignar', 'Assign')}
        />
        <DenseAlert
          tone="warn"
          time="11:20"
          title={t('Capacidad: S-2853', 'Capacity: S-2853')}
          body={t('22 pax · ningún vehículo cubre solo', '22 pax · no single vehicle fits')}
          action={t('Dividir', 'Split')}
        />
        <DenseAlert
          tone="warn"
          time="10:52"
          title={t('V-25 mantenimiento', 'V-25 maintenance')}
          body={t('Sprinter 19px fuera de servicio hoy', 'Sprinter 19s out of service today')}
        />
      </div>

      {/* Activity stream */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <div style={{ padding: '8px 12px', position: 'sticky', top: 0, background: 'var(--bg-elev)', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('Actividad', 'Activity')}</span>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ok)' }}></span>
          <span style={{ fontSize: 10.5, color: 'var(--ok-text)' }}>{t('Live', 'Live')}</span>
        </div>
        {D.activity.map((ev, i) => (
          <div key={i} style={{
            padding: '6px 12px', borderBottom: '1px solid var(--line)',
            fontSize: 11.5, fontFamily: 'var(--ff-mono)',
          }}>
            <div className="vo-row" style={{ gap: 6, marginBottom: 2 }}>
              <span style={{ color: 'var(--text-dim)' }}>{H.fmtTime(ev.t)}</span>
              <span style={{ color: 'var(--text-muted)' }}>{ev.svc}</span>
              <span style={{ marginLeft: 'auto', color: ev.k === 'incident' ? 'var(--crit-text)' : ev.k === 'delay' ? 'var(--warn-text)' : 'var(--text-dim)', textTransform: 'uppercase', fontSize: 9.5 }}>
                {ev.k}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--ff-ui)', fontSize: 11.5, color: 'var(--text)', lineHeight: 1.35 }}>{ev.text}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};

const DenseAlert = ({ tone, time, title, body, action }) => (
  <div style={{
    padding: '8px 12px', borderTop: '1px solid var(--line)',
    background: tone === 'crit' ? 'color-mix(in oklch, var(--crit-soft), transparent 70%)' : 'color-mix(in oklch, var(--warn-soft), transparent 70%)',
    cursor: 'pointer',
  }}>
    <div className="vo-row" style={{ gap: 6, marginBottom: 2 }}>
      <span className="vo-mono" style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>{time}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: tone === 'crit' ? 'var(--crit-text)' : 'var(--warn-text)' }}>{title}</span>
    </div>
    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.35, marginBottom: action ? 4 : 0 }}>{body}</div>
    {action && (
      <button className="vo-btn" data-size="sm" data-variant="ghost" style={{ height: 22, fontSize: 10.5, padding: '2px 7px', color: tone === 'crit' ? 'var(--crit-text)' : 'var(--warn-text)' }}>
        {action} <VOIcon name="arrow_right" size={10} />
      </button>
    )}
  </div>
);

window.VODashboardDense = VODashboardDense;
