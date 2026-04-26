// screens.jsx — Remaining key screens
// Services list, Calendar/Timeline (with drag-feel), Service detail, Map, New-service modal

const { useState: us, useMemo: um } = React;

// ════════════════════════════════════════════════════════════
// 1) SERVICES LIST — dense table + filters + inline edit
// ════════════════════════════════════════════════════════════
const VOServicesList = ({ lang = 'es' }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const t = (es, en) => lang === 'en' ? en : es;
  const [selected, setSelected] = us(new Set());
  const [filter, setFilter] = us('all');

  const services = D.services;
  const filtered = filter === 'all' ? services
    : filter === 'active' ? services.filter(s => ['en_route','on_site','in_progress'].includes(s.status))
    : filter === 'unassigned' ? services.filter(s => s.status === 'unassigned')
    : filter === 'incidents' ? services.filter(s => s.status === 'incident' || s.atRisk || s.delay)
    : services;

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="vo-app" data-screen-label="Services list">
      <VOTopbar active="list" lang={lang} />

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar with saved views */}
        <aside className="vo-sidebar">
          <div className="vo-sidebar-section">{t('Vistas', 'Views')}</div>
          {[
            ['all', t('Todos los servicios', 'All services'), 15],
            ['active', t('En curso ahora', 'Active now'), 4],
            ['unassigned', t('Sin asignar', 'Unassigned'), 3],
            ['incidents', t('Atención requerida', 'Needs attention'), 4],
          ].map(([k, l, n]) => (
            <div key={k} className="vo-side-item" data-active={filter === k} onClick={() => setFilter(k)}>
              <VOIcon name="list" size={12} />
              <span>{l}</span>
              <span className="count">{n}</span>
            </div>
          ))}

          <div className="vo-sidebar-section" style={{ marginTop: 12 }}>{t('Por cliente', 'By client')}</div>
          {D.clients.slice(0, 5).map(c => (
            <div key={c.id} className="vo-side-item">
              <span className="vo-avatar" style={{ width: 16, height: 16, fontSize: 9, background: 'var(--accent-soft)', color: 'var(--accent-text)', border: 0 }}>{c.name[0]}</span>
              <span className="vo-truncate">{c.name}</span>
              <span className="count">{D.services.filter(s => s.client === c.id).length}</span>
            </div>
          ))}

          <div className="vo-sidebar-section" style={{ marginTop: 12 }}>{t('Por tipo', 'By type')}</div>
          {Object.entries(D.TYPES).map(([k, v]) => (
            <div key={k} className="vo-side-item">
              <VOIcon name={v.icon} size={12} />
              <span>{v.label}</span>
              <span className="count">{D.services.filter(s => s.type === k).length}</span>
            </div>
          ))}
        </aside>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Toolbar */}
          <div className="vo-toolbar">
            <span style={{ fontSize: 13, fontWeight: 600 }}>{t('Servicios', 'Services')}</span>
            <span className="vo-mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>{filtered.length}</span>
            <div className="vo-divider"></div>
            <button className="vo-btn" data-size="sm"><VOIcon name="calendar" size={11} /> 25 Abr 2026</button>
            <button className="vo-btn" data-size="sm" data-variant="ghost"><VOIcon name="filter" size={11} /> {t('Estado', 'Status')}</button>
            <button className="vo-btn" data-size="sm" data-variant="ghost"><VOIcon name="filter" size={11} /> {t('Tipo', 'Type')}</button>
            <button className="vo-btn" data-size="sm" data-variant="ghost"><VOIcon name="sort" size={11} /> {t('Hora ↑', 'Time ↑')}</button>
            <div style={{ flex: 1 }}></div>
            {selected.size > 0 ? (
              <>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selected.size} {t('seleccionados', 'selected')}</span>
                <button className="vo-btn" data-size="sm">{t('Asignar lote', 'Bulk assign')}</button>
                <button className="vo-btn" data-size="sm">{t('Reasignar', 'Reassign')}</button>
                <button className="vo-btn" data-size="sm" data-variant="danger">{t('Cancelar', 'Cancel')}</button>
              </>
            ) : (
              <>
                <button className="vo-btn" data-size="sm" data-variant="ghost"><VOIcon name="layers" size={11} /></button>
                <button className="vo-btn" data-size="sm" data-variant="primary"><VOIcon name="plus" size={11} /> {t('Nuevo servicio', 'New service')}</button>
              </>
            )}
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            <table className="vo-table">
              <thead>
                <tr>
                  <th style={{ width: 26 }}>
                    <input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
                  </th>
                  <th style={{ width: 60 }}>{t('Hora', 'Time')}</th>
                  <th style={{ width: 60 }}>ID</th>
                  <th style={{ width: 60 }}>{t('Tipo', 'Type')}</th>
                  <th>{t('Recogida → Destino', 'Pickup → Drop-off')}</th>
                  <th style={{ width: 130 }}>{t('Cliente', 'Client')}</th>
                  <th style={{ width: 50 }}>Pax</th>
                  <th style={{ width: 150 }}>{t('Conductor', 'Driver')}</th>
                  <th style={{ width: 110 }}>{t('Vehículo', 'Vehicle')}</th>
                  <th style={{ width: 130 }}>{t('Estado', 'Status')}</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const driver = H.driverById(s.driver);
                  const vehicle = H.vehicleById(s.vehicle);
                  const client = H.clientById(s.client);
                  const tone = s.status === 'incident' ? 'crit' : s.atRisk || s.delay ? 'warn' : null;
                  return (
                    <tr key={s.id} data-tone={tone} data-selected={selected.has(s.id)}>
                      <td onClick={(e) => { e.stopPropagation(); toggle(s.id); }}>
                        <input type="checkbox" checked={selected.has(s.id)} readOnly style={{ accentColor: 'var(--accent)' }} />
                      </td>
                      <td><span className="time">{H.fmtTime(s.pickup.at)}</span></td>
                      <td><span className="id">{s.id}</span></td>
                      <td><VOServiceType type={s.type} /></td>
                      <td>
                        <div className="vo-row vo-truncate" style={{ gap: 6, maxWidth: 480 }}>
                          <span className="vo-truncate">{s.pickup.place}</span>
                          <VOIcon name="arrow_right" size={11} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                          <span className="vo-truncate" style={{ color: 'var(--text-muted)' }}>{s.dropoff.place}</span>
                        </div>
                      </td>
                      <td><span style={{ fontSize: 12 }} className="vo-truncate">{client?.name}</span></td>
                      <td><span className="vo-mono">{s.pax}</span></td>
                      <td><VODriverChip id={s.driver} /></td>
                      <td><VOVehicleChip id={s.vehicle} /></td>
                      <td>
                        <div className="vo-row" style={{ gap: 4 }}>
                          <VOStatus status={s.status} mini />
                          {s.delay && <span className="vo-pill" data-tone="warn" data-square="true">+{s.delay}m</span>}
                          {s.atRisk && <VOIcon name="alert" size={11} style={{ color: 'var(--warn-text)' }} />}
                        </div>
                      </td>
                      <td>
                        <div className="vo-row-actions">
                          <button className="vo-icon-btn" style={{ width: 24, height: 24 }} title="Editar"><VOIcon name="edit" size={11} /></button>
                          <button className="vo-icon-btn" style={{ width: 24, height: 24 }} title="Llamar"><VOIcon name="phone" size={11} /></button>
                          <button className="vo-icon-btn" style={{ width: 24, height: 24 }}><VOIcon name="dots" size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// 2) CALENDAR / TIMELINE — Gantt by driver
// ════════════════════════════════════════════════════════════
const VOCalendar = ({ lang = 'es' }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const t = (es, en) => lang === 'en' ? en : es;
  const NOW = D.NOW_MIN;
  const [hovered, setHovered] = us(null);

  // Hours: 06:00 to 19:00
  const startH = 6, endH = 19;
  const totalMin = (endH - startH) * 60;
  const pxPerMin = 2; // 2px per minute = 26 hours visible roughly. ~120px/h
  const W = totalMin * pxPerMin;

  // Bucket services by driver. Unassigned → "Sin asignar" lane.
  const lanes = um(() => {
    const m = new Map();
    for (const d of D.drivers) m.set(d.id, []);
    m.set('UNASSIGNED', []);
    for (const s of D.services) {
      const k = s.driver || 'UNASSIGNED';
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(s);
    }
    return m;
  }, []);

  const driverList = [...D.drivers, { id: 'UNASSIGNED', name: t('Sin asignar', 'Unassigned'), initials: '?', status: 'unassigned' }];

  const minToX = (m) => (m - startH * 60) * pxPerMin;

  return (
    <div className="vo-app" data-screen-label="Calendar timeline">
      <VOTopbar active="calendar" lang={lang} />

      <div className="vo-toolbar">
        <button className="vo-btn" data-size="sm"><VOIcon name="chevron" size={11} style={{ transform: 'rotate(180deg)' }} /></button>
        <button className="vo-btn" data-size="sm">{t('Hoy', 'Today')}</button>
        <button className="vo-btn" data-size="sm"><VOIcon name="chevron" size={11} /></button>
        <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 6 }}>{t('Viernes 25 Abr 2026', 'Friday Apr 25, 2026')}</span>
        <div className="vo-divider"></div>
        <button className="vo-btn" data-size="sm">{t('Día', 'Day')}</button>
        <button className="vo-btn" data-size="sm" data-variant="ghost">{t('3 días', '3 days')}</button>
        <button className="vo-btn" data-size="sm" data-variant="ghost">{t('Semana', 'Week')}</button>
        <div className="vo-divider"></div>
        <button className="vo-btn" data-size="sm" data-variant="ghost"><VOIcon name="layers" size={11} /> {t('Por conductor', 'By driver')}</button>
        <div style={{ flex: 1 }}></div>
        <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{t('Arrastra para mover · Shift+arrastra para crear', 'Drag to move · Shift+drag to create')}</span>
        <button className="vo-btn" data-size="sm" data-variant="primary"><VOIcon name="plus" size={11} /> {t('Nuevo', 'New')}</button>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        {/* Left: driver column (sticky) */}
        <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid var(--line)', background: 'var(--bg-elev)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 36, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('Conductor', 'Driver')}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {driverList.map(d => (
              <div key={d.id} style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 12px', borderBottom: '1px solid var(--line)', gap: 8, cursor: 'pointer' }}>
                {d.id !== 'UNASSIGNED' ? (
                  <>
                    <span className="vo-avatar">{d.initials}</span>
                    <div className="vo-col" style={{ gap: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 500 }} className="vo-truncate">{d.name}</span>
                      <span className="vo-row" style={{ gap: 4 }}>
                        <span style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: d.status === 'driving' ? 'var(--ok)' : d.status === 'idle' ? 'var(--accent)' : d.status === 'break' ? 'var(--warn)' : 'var(--text-dim)',
                        }}></span>
                        <span className="vo-mono" style={{ fontSize: 10, color: 'var(--text-dim)' }}>{d.id}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>· {lanes.get(d.id)?.length || 0} svc</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="vo-avatar" data-empty="true" style={{ background: 'var(--violet-soft)', color: 'var(--violet-text)', borderColor: 'var(--violet-soft)' }}>?</span>
                    <div className="vo-col" style={{ gap: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--violet-text)' }}>{t('Sin asignar', 'Unassigned')}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{lanes.get('UNASSIGNED')?.length || 0} servicios</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: timeline canvas */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative', background: 'var(--bg-sunken)' }}>
          {/* Hour header */}
          <div style={{ position: 'sticky', top: 0, zIndex: 2, height: 36, background: 'var(--bg-elev)', borderBottom: '1px solid var(--line)', width: W, display: 'flex' }}>
            {Array.from({ length: endH - startH }, (_, i) => (
              <div key={i} style={{ width: 60 * pxPerMin, borderRight: '1px solid var(--line)', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-muted)' }}>
                {String(startH + i).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', width: W }}>
            {/* Hour gridlines */}
            {Array.from({ length: endH - startH + 1 }, (_, i) => (
              <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: i * 60 * pxPerMin, width: 1, background: 'var(--line)' }}></div>
            ))}

            {/* "Now" line */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: minToX(NOW), width: 2, background: 'var(--crit)', zIndex: 3, pointerEvents: 'none' }}>
              <span style={{ position: 'absolute', top: 4, left: 4, padding: '1px 6px', borderRadius: 3, background: 'var(--crit)', color: 'white', fontSize: 10, fontFamily: 'var(--ff-mono)', fontWeight: 600 }}>
                NOW · {H.fmtTime(NOW)}
              </span>
            </div>

            {/* Lanes */}
            {driverList.map((d, idx) => {
              const services = lanes.get(d.id) || [];
              return (
                <div key={d.id} style={{ height: 56, borderBottom: '1px solid var(--line)', position: 'relative', background: idx % 2 ? 'transparent' : 'var(--bg)' }}>
                  {services.map(s => {
                    const x = minToX(s.pickup.at);
                    const w = (s.dropoff.at - s.pickup.at) * pxPerMin;
                    const tone = s.status === 'incident' ? 'crit' : s.atRisk || s.delay ? 'warn' : s.status === 'completed' ? 'neutral' : s.status === 'unassigned' ? 'violet' : s.status === 'in_progress' || s.status === 'en_route' ? 'ok' : 'info';
                    const colorMap = {
                      crit: ['var(--crit-soft)', 'var(--crit-text)', 'var(--crit)'],
                      warn: ['var(--warn-soft)', 'var(--warn-text)', 'var(--warn)'],
                      ok:   ['var(--ok-soft)', 'var(--ok-text)', 'var(--ok)'],
                      info: ['var(--accent-soft)', 'var(--accent-text)', 'var(--accent)'],
                      violet: ['var(--violet-soft)', 'var(--violet-text)', 'var(--violet)'],
                      neutral: ['var(--bg-sunken)', 'var(--text-muted)', 'var(--text-dim)'],
                    };
                    const [bg, fg, line] = colorMap[tone];
                    return (
                      <div key={s.id}
                        onMouseEnter={() => setHovered(s.id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          position: 'absolute', left: x, top: 6, width: Math.max(w, 60), height: 44,
                          background: bg, border: `1px solid ${line}`, borderLeft: `3px solid ${line}`,
                          borderRadius: 4, padding: '4px 8px', cursor: 'pointer',
                          overflow: 'hidden', boxShadow: hovered === s.id ? '0 4px 12px rgba(0,0,0,.12)' : 'none',
                          transition: 'box-shadow .12s, transform .12s',
                          transform: hovered === s.id ? 'translateY(-1px)' : 'none',
                          zIndex: hovered === s.id ? 4 : 1,
                        }}>
                        <div className="vo-row" style={{ gap: 4, marginBottom: 2 }}>
                          <span className="vo-mono" style={{ fontSize: 9.5, color: fg, fontWeight: 600 }}>{s.id.replace('S-', '')}</span>
                          <span style={{ fontSize: 9.5, color: fg, opacity: 0.8 }}>{D.TYPES[s.type].short}</span>
                          {s.delay && <span style={{ fontSize: 9.5, color: 'var(--crit-text)', fontWeight: 600 }}>+{s.delay}m</span>}
                          {s.atRisk && <VOIcon name="alert" size={9} style={{ color: 'var(--warn-text)', marginLeft: 'auto' }} />}
                        </div>
                        <div className="vo-truncate" style={{ fontSize: 11, color: fg, fontWeight: 500 }}>
                          {s.pickup.place.split(',')[0]} → {s.dropoff.place.split(',')[0].split(' ').slice(0, 2).join(' ')}
                        </div>
                        <div className="vo-row" style={{ gap: 6, marginTop: 1 }}>
                          <span className="vo-mono" style={{ fontSize: 9.5, color: fg, opacity: 0.75 }}>
                            {H.fmtTime(s.pickup.at)}–{H.fmtTime(s.dropoff.at)}
                          </span>
                          <span style={{ fontSize: 9.5, color: fg, opacity: 0.75 }}>· {s.pax}p</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// 3) SERVICE DETAIL — drawer-style with timeline
// ════════════════════════════════════════════════════════════
const VOServiceDetail = ({ lang = 'es' }) => {
  const D = window.VO_DATA;
  const H = window.VO_HELPERS;
  const t = (es, en) => lang === 'en' ? en : es;
  const svc = D.services.find(s => s.id === 'S-2844'); // the at-risk one
  const driver = H.driverById(svc.driver);
  const vehicle = H.vehicleById(svc.vehicle);
  const client = H.clientById(svc.client);

  return (
    <div className="vo-app" data-screen-label="Service detail" style={{ background: 'var(--bg-sunken)' }}>
      <VOTopbar active="list" lang={lang} />

      <div style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--line)', background: 'var(--bg-elev)' }}>
        <span className="vo-link">{t('Servicios', 'Services')}</span>
        <span style={{ margin: '0 6px', color: 'var(--text-dim)' }}>/</span>
        <span>{t('Hoy 25 Abr', 'Today Apr 25')}</span>
        <span style={{ margin: '0 6px', color: 'var(--text-dim)' }}>/</span>
        <span style={{ color: 'var(--text)', fontFamily: 'var(--ff-mono)' }}>{svc.id}</span>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 0, overflow: 'hidden' }}>
        {/* Main pane */}
        <div style={{ overflow: 'auto', padding: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="vo-row" style={{ gap: 8, marginBottom: 6 }}>
                <span className="vo-mono" style={{ fontSize: 12, color: 'var(--text-dim)' }}>{svc.id}</span>
                <VOServiceType type={svc.type} />
                <VOStatus status={svc.status} />
                {svc.delay && <span className="vo-pill" data-tone="warn"><VOIcon name="alert" size={10} />+{svc.delay}m {t('retraso', 'late')}</span>}
              </div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
                {svc.pickup.place} → {svc.dropoff.place}
              </h1>
              <div className="vo-row" style={{ gap: 12, marginTop: 8, fontSize: 12.5, color: 'var(--text-muted)' }}>
                <span><VOIcon name="users" size={12} /> {svc.pax} pax</span>
                <span>·</span>
                <span><VOIcon name="clock" size={12} /> {H.fmtTime(svc.pickup.at)} – {H.fmtTime(svc.dropoff.at)} ({H.fmtDur(svc.dropoff.at - svc.pickup.at)})</span>
                {svc.flight && <><span>·</span><span className="vo-mono">{svc.flight}</span></>}
                <span>·</span>
                <span>{client?.name}</span>
              </div>
            </div>
            <div className="vo-row" style={{ gap: 6 }}>
              <button className="vo-btn"><VOIcon name="phone" size={12} /> {t('Llamar conductor', 'Call driver')}</button>
              <button className="vo-btn"><VOIcon name="edit" size={12} /> {t('Editar', 'Edit')}</button>
              <button className="vo-btn" data-variant="primary"><VOIcon name="swap" size={12} /> {t('Reasignar', 'Reassign')}</button>
              <button className="vo-icon-btn"><VOIcon name="dots" size={14} /></button>
            </div>
          </div>

          {/* Cascade warning */}
          <div className="vo-alert" data-tone="warn" style={{ marginBottom: 16 }}>
            <VOIcon name="alert" size={16} style={{ color: 'var(--warn-text)', marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div className="ttl">{t('Riesgo en cadena', 'Cascade risk')}</div>
              <div className="body">
                {t('Este retraso afectará al siguiente servicio del conductor: ', 'This delay will impact the driver\'s next service: ')}
                <span className="vo-mono" style={{ color: 'var(--text)' }}>S-2851</span>
                {t(' (recogida 13:00, vuelo IB3173 14:50). Margen actual: 4 min.', ' (pickup 13:00, IB3173 14:50). Current margin: 4 min.')}
              </div>
            </div>
            <button className="vo-btn" data-size="sm">{t('Ver cadena', 'View chain')}</button>
            <button className="vo-btn" data-size="sm" data-variant="primary">{t('Reasignar S-2851', 'Reassign S-2851')}</button>
          </div>

          {/* Stops */}
          <div className="vo-card" style={{ marginBottom: 16 }}>
            <div className="vo-card-hd">
              <h3>{t('Paradas', 'Stops')}</h3>
              <span className="sub">{t('Ruta planificada', 'Planned route')}</span>
            </div>
            <div style={{ padding: 18, position: 'relative' }}>
              {[
                { kind: 'pickup', time: svc.pickup.at, place: svc.pickup.place, note: t('Recogida · 2 maletas grandes', 'Pickup · 2 large bags'), done: true },
                { kind: 'dropoff', time: svc.dropoff.at, place: svc.dropoff.place, note: t('Salida vuelo BA0492 · LHR 11:10', 'Outbound BA0492 · LHR 11:10'), done: false },
              ].map((stop, i, arr) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 28px 1fr', gap: 12, paddingBottom: i < arr.length - 1 ? 18 : 0 }}>
                  <span className="vo-mono" style={{ fontSize: 13, fontWeight: 500, paddingTop: 3 }}>{H.fmtTime(stop.time)}</span>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: stop.done ? 'var(--ok)' : 'var(--bg-elev)',
                      border: stop.done ? '1px solid var(--ok)' : '2px solid var(--line-strong)',
                      display: 'block', position: 'relative', zIndex: 1,
                    }}></span>
                    {i < arr.length - 1 && <span style={{ position: 'absolute', top: 14, bottom: -22, left: 6, width: 2, background: 'var(--line-strong)' }}></span>}
                  </div>
                  <div className="vo-col" style={{ gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{stop.place}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stop.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="vo-card">
            <div className="vo-card-hd">
              <h3>{t('Cronología', 'Timeline')}</h3>
              <span className="sub">{t('Eventos auditables', 'Auditable events')}</span>
            </div>
            <div style={{ padding: '8px 18px 18px' }}>
              {[
                { t: 685, k: 'en_route', text: t('Sergio B. inicia ruta hacia recogida', 'Sergio B. started toward pickup'), by: 'sistema' },
                { t: 690, k: 'delay', text: t('Webfleet detecta retraso · +8m por tráfico Ma-19', 'Webfleet detected delay · +8m on Ma-19'), by: 'auto' },
                { t: 692, k: 'note', text: t('Aviso enviado a Cristina O.', 'Alert sent to Cristina O.'), by: 'sistema' },
                { t: 715, k: 'manual', text: t('Llamada al cliente para informar +10m', 'Called client to notify +10m'), by: 'Cristina O.' },
              ].map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10, paddingTop: 10, borderTop: i ? '1px solid var(--line)' : 0 }}>
                  <span className="vo-mono" style={{ fontSize: 11.5, color: 'var(--text-muted)', paddingTop: 1 }}>{H.fmtTime(e.t)}</span>
                  <div className="vo-col" style={{ gap: 2 }}>
                    <span style={{ fontSize: 12.5 }}>{e.text}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{e.k} · {e.by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <aside style={{ borderLeft: '1px solid var(--line)', background: 'var(--bg-elev)', overflow: 'auto' }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{t('Conductor', 'Driver')}</div>
            <div className="vo-row" style={{ gap: 10 }}>
              <span className="vo-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{driver.initials}</span>
              <div className="vo-col" style={{ gap: 1, flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{driver.name}</span>
                <span className="vo-mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>{driver.id} · {driver.phone}</span>
              </div>
              <button className="vo-icon-btn"><VOIcon name="phone" size={13} /></button>
            </div>
          </div>

          <div style={{ padding: 16, borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{t('Vehículo', 'Vehicle')}</div>
            <div className="vo-row" style={{ gap: 10 }}>
              <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center', border: '1px solid var(--line)' }}>
                <VOIcon name="car" size={18} />
              </span>
              <div className="vo-col" style={{ gap: 1, flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{vehicle.model}</span>
                <span className="vo-mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>{vehicle.plate} · {vehicle.seats} pax</span>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--text-muted)' }}>
              <span className="vo-row"><span style={{ flex: 1 }}>{t('Combustible', 'Fuel')}</span><span className="vo-mono">{vehicle.fuel}%</span></span>
              <div style={{ height: 4, background: 'var(--bg-sunken)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${vehicle.fuel}%`, background: vehicle.fuel < 25 ? 'var(--crit)' : vehicle.fuel < 50 ? 'var(--warn)' : 'var(--ok)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ padding: 16, borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{t('Cliente', 'Client')}</div>
            <div className="vo-col" style={{ gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{client?.name}</span>
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{t('Agencia · tier ', 'Agency · tier ')}{client?.tier}</span>
              <span className="vo-mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>BKG-2026-04-1144</span>
            </div>
          </div>

          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{t('Acciones', 'Actions')}</div>
            <div className="vo-col" style={{ gap: 6 }}>
              <button className="vo-btn" style={{ justifyContent: 'flex-start' }}><VOIcon name="check" size={12} /> {t('Marcar como completado', 'Mark completed')}</button>
              <button className="vo-btn" style={{ justifyContent: 'flex-start' }}><VOIcon name="alert" size={12} /> {t('Reportar incidencia', 'Report incident')}</button>
              <button className="vo-btn" style={{ justifyContent: 'flex-start' }}><VOIcon name="swap" size={12} /> {t('Reasignar', 'Reassign')}</button>
              <button className="vo-btn" data-variant="danger" style={{ justifyContent: 'flex-start' }}><VOIcon name="x" size={12} /> {t('Cancelar servicio', 'Cancel service')}</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// 4) MAP — operative map with active services
// ════════════════════════════════════════════════════════════
const VOMap = ({ lang = 'es' }) => {
  const D = window.VO_DATA;
  const t = (es, en) => lang === 'en' ? en : es;
  const [selected, setSelected] = us('S-2844');

  // Schematic Mallorca-ish positions for live services + airport pin
  const pins = [
    { id: 'AIRPORT', x: 660, y: 380, kind: 'hub', label: 'PMI' },
    { id: 'PALMA',   x: 540, y: 320, kind: 'hub', label: 'Palma' },
    { id: 'S-2843',  x: 470, y: 360, kind: 'live', label: 'S-2843', driver: 'CV', tone: 'ok' },
    { id: 'S-2844',  x: 500, y: 295, kind: 'live', label: 'S-2844', driver: 'SB', tone: 'warn' },
    { id: 'S-2845',  x: 555, y: 290, kind: 'live', label: 'S-2845', driver: 'PM', tone: 'ok' },
    { id: 'S-2849',  x: 440, y: 180, kind: 'live', label: 'S-2849', driver: 'JR', tone: 'ok' },
    { id: 'D-007',   x: 600, y: 310, kind: 'idle', label: 'LP' },
    { id: 'D-019',   x: 560, y: 350, kind: 'idle', label: 'NS' },
    { id: 'D-005',   x: 510, y: 360, kind: 'idle', label: 'IT' },
  ];

  return (
    <div className="vo-app" data-screen-label="Map">
      <VOTopbar active="map" lang={lang} />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: 0 }}>
        {/* Left: filters + active service list */}
        <aside style={{ borderRight: '1px solid var(--line)', background: 'var(--bg-elev)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 12, borderBottom: '1px solid var(--line)' }}>
            <div className="vo-row" style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{t('Mapa operativo', 'Operations map')}</span>
              <button className="vo-btn" data-size="sm" data-variant="ghost" style={{ marginLeft: 'auto' }}><VOIcon name="settings" size={11} /></button>
            </div>
            <div className="vo-row" style={{ gap: 4, flexWrap: 'wrap' }}>
              {[t('En ruta', 'En route'), t('En recogida', 'On site'), t('En curso', 'In progress'), t('Disponibles', 'Idle')].map((l, i) => (
                <span key={i} className="vo-pill" data-square="true" data-tone={['info','warn','ok','neutral'][i]} style={{ cursor: 'pointer' }}>
                  <span className="dot"></span>{l}
                </span>
              ))}
            </div>
          </div>

          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)', fontSize: 10.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('Servicios activos', 'Active services')} · 4
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {D.services.filter(s => ['en_route','on_site','in_progress'].includes(s.status)).map(s => {
              const driver = window.VO_HELPERS.driverById(s.driver);
              const tone = s.delay || s.atRisk ? 'warn' : 'ok';
              return (
                <div key={s.id} onClick={() => setSelected(s.id)} style={{
                  padding: '10px 12px', borderBottom: '1px solid var(--line)',
                  background: selected === s.id ? 'var(--accent-soft)' : 'transparent',
                  cursor: 'pointer',
                }}>
                  <div className="vo-row" style={{ gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone === 'warn' ? 'var(--warn)' : 'var(--ok)' }}></span>
                    <span className="vo-mono" style={{ fontSize: 11, color: 'var(--text)' }}>{s.id}</span>
                    <VOServiceType type={s.type} />
                    {s.delay && <span className="vo-pill" data-tone="warn" data-square="true" style={{ marginLeft: 'auto' }}>+{s.delay}m</span>}
                  </div>
                  <div className="vo-truncate" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    {s.pickup.place.split(',')[0]} → {s.dropoff.place.split(',')[0].split(' ').slice(0,2).join(' ')}
                  </div>
                  <div className="vo-row" style={{ gap: 5, marginTop: 4 }}>
                    <span className="vo-avatar" style={{ width: 14, height: 14, fontSize: 8.5 }}>{driver?.initials}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>{driver?.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right: map */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-sunken)' }}>
          {/* Schematic map */}
          <svg viewBox="0 0 900 500" style={{ width: '100%', height: '100%', display: 'block' }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" strokeWidth="0.5" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* "Land" */}
            <path d="M 280 130 Q 380 90 480 100 Q 600 100 720 140 Q 800 200 770 290 Q 740 380 660 410 Q 540 440 420 420 Q 300 400 240 330 Q 220 220 280 130 Z"
              fill="var(--bg)" stroke="var(--line-strong)" strokeWidth="1" opacity="0.7"/>
            {/* Road network suggestion */}
            <path d="M 540 320 Q 580 340 660 380" stroke="var(--line-strong)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.6"/>
            <path d="M 540 320 Q 480 280 440 180" stroke="var(--line-strong)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.6"/>
            <path d="M 540 320 Q 520 305 500 295" stroke="var(--warn)" strokeWidth="2" fill="none"/>

            {/* Pins */}
            {pins.map(p => {
              if (p.kind === 'hub') {
                return (
                  <g key={p.id}>
                    <rect x={p.x - 28} y={p.y - 9} width="56" height="18" rx="3" fill="var(--text)" />
                    <text x={p.x} y={p.y + 4} fill="var(--bg)" fontSize="10" fontFamily="var(--ff-mono)" fontWeight="600" textAnchor="middle">{p.label}</text>
                  </g>
                );
              }
              if (p.kind === 'idle') {
                return (
                  <g key={p.id}>
                    <circle cx={p.x} cy={p.y} r="9" fill="var(--bg-elev)" stroke="var(--line-strong)" strokeWidth="1.5" />
                    <text x={p.x} y={p.y + 3} fill="var(--text-dim)" fontSize="8" fontFamily="var(--ff-ui)" fontWeight="600" textAnchor="middle">{p.label}</text>
                  </g>
                );
              }
              const isSel = selected === p.id;
              const color = p.tone === 'warn' ? 'var(--warn)' : 'var(--ok)';
              return (
                <g key={p.id} onClick={() => setSelected(p.id)} style={{ cursor: 'pointer' }}>
                  {isSel && <circle cx={p.x} cy={p.y} r="22" fill={color} opacity="0.15" />}
                  <circle cx={p.x} cy={p.y} r="14" fill={color} stroke="white" strokeWidth="2" />
                  <text x={p.x} y={p.y + 4} fill="white" fontSize="9" fontFamily="var(--ff-ui)" fontWeight="700" textAnchor="middle">{p.driver}</text>
                  <text x={p.x} y={p.y + 28} fill="var(--text)" fontSize="9.5" fontFamily="var(--ff-mono)" fontWeight="600" textAnchor="middle" style={{ paintOrder: 'stroke', stroke: 'var(--bg)', strokeWidth: 3 }}>{p.label}</text>
                </g>
              );
            })}
          </svg>

          {/* Floating selected card */}
          {selected && (() => {
            const s = D.services.find(x => x.id === selected);
            if (!s) return null;
            const driver = window.VO_HELPERS.driverById(s.driver);
            return (
              <div style={{ position: 'absolute', left: 16, bottom: 16, width: 320, background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 8, boxShadow: 'var(--shadow-2)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>
                  <div className="vo-row" style={{ gap: 6, marginBottom: 4 }}>
                    <span className="vo-mono" style={{ fontSize: 12, fontWeight: 600 }}>{s.id}</span>
                    <VOServiceType type={s.type} />
                    <VOStatus status={s.status} mini />
                    {s.delay && <span className="vo-pill" data-tone="warn" style={{ marginLeft: 'auto' }}><VOIcon name="alert" size={10} />+{s.delay}m</span>}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{s.pickup.place} → {s.dropoff.place}</div>
                </div>
                <div style={{ padding: 10, fontSize: 11.5, color: 'var(--text-muted)' }}>
                  <div className="vo-row" style={{ marginBottom: 4 }}>
                    <span className="vo-avatar" style={{ width: 18, height: 18, fontSize: 9 }}>{driver?.initials}</span>
                    <span style={{ marginLeft: 6 }}>{driver?.name}</span>
                    <span className="vo-mono" style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>{s.flight || '—'}</span>
                  </div>
                  <div className="vo-row">
                    <span style={{ color: 'var(--text-dim)' }}>ETA destino</span>
                    <span className="vo-mono" style={{ marginLeft: 'auto', color: s.delay ? 'var(--warn-text)' : 'var(--text)', fontWeight: 500 }}>
                      {window.VO_HELPERS.fmtTime(s.dropoff.at + (s.delay || 0))}
                    </span>
                  </div>
                </div>
                <div className="vo-row" style={{ padding: 8, borderTop: '1px solid var(--line)', gap: 6 }}>
                  <button className="vo-btn" data-size="sm" style={{ flex: 1 }}><VOIcon name="phone" size={11} /> {t('Llamar', 'Call')}</button>
                  <button className="vo-btn" data-size="sm" data-variant="primary" style={{ flex: 1 }}>{t('Ver detalle', 'Open detail')}</button>
                </div>
              </div>
            );
          })()}

          {/* Map controls */}
          <div style={{ position: 'absolute', right: 16, top: 16, background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 6, padding: 4, display: 'flex', flexDirection: 'column', gap: 2, boxShadow: 'var(--shadow-1)' }}>
            <button className="vo-icon-btn"><VOIcon name="plus" size={14} /></button>
            <button className="vo-icon-btn">−</button>
            <div style={{ height: 1, background: 'var(--line)' }}></div>
            <button className="vo-icon-btn" title="Re-center"><VOIcon name="pin" size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// 5) NEW SERVICE MODAL — fast creation form
// ════════════════════════════════════════════════════════════
const VONewService = ({ lang = 'es' }) => {
  const t = (es, en) => lang === 'en' ? en : es;

  return (
    <div className="vo-app" data-screen-label="New service modal" style={{ background: 'var(--bg-sunken)' }}>
      <VOTopbar active="dashboard" lang={lang} />

      {/* Backdrop */}
      <div style={{ flex: 1, position: 'relative', display: 'grid', placeItems: 'center', padding: 24, background: 'rgba(15, 20, 35, 0.5)' }}>
        {/* Modal */}
        <div style={{ width: 720, maxHeight: '90%', background: 'var(--bg-elev)', borderRadius: 12, border: '1px solid var(--line)', boxShadow: '0 24px 60px rgba(0,0,0,.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{t('Nuevo servicio', 'New service')}</h2>
            <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-dim)' }} className="vo-mono">S-2856</span>
            <div style={{ flex: 1 }}></div>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{t('Atajo', 'Shortcut')}</span>
            <span className="vo-kbd" style={{ marginLeft: 4 }}>N</span>
            <button className="vo-icon-btn" style={{ marginLeft: 8 }}><VOIcon name="x" size={14} /></button>
          </div>

          {/* Type tabs */}
          <div style={{ padding: '12px 18px 0', display: 'flex', gap: 4, borderBottom: '1px solid var(--line)' }}>
            {[
              { k: 'transfer', label: t('Transfer', 'Transfer'), icon: 'plane', active: true },
              { k: 'disposicion', label: t('Disposición', 'On-call'), icon: 'clock' },
              { k: 'grupo', label: t('Grupo / Agencia', 'Group / Agency'), icon: 'users' },
              { k: 'excursion', label: t('Excursión', 'Excursion'), icon: 'map' },
            ].map(tab => (
              <div key={tab.k} style={{
                padding: '8px 14px', cursor: 'pointer',
                borderBottom: '2px solid', borderColor: tab.active ? 'var(--text)' : 'transparent',
                color: tab.active ? 'var(--text)' : 'var(--text-muted)',
                fontSize: 12.5, fontWeight: tab.active ? 600 : 500,
                marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <VOIcon name={tab.icon} size={12} />{tab.label}
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ padding: 18, overflow: 'auto', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label={t('Fecha', 'Date')} value="25 Abr 2026" mono icon="calendar" />
              <Field label={t('Hora de recogida', 'Pickup time')} value="13:25" mono icon="clock" />

              <Field label={t('Pasajeros', 'Passengers')} value="3" mono full={false} />
              <Field label={t('Vuelo (opcional)', 'Flight (optional)')} value="IB3173 → MAD 14:50" mono icon="plane" />

              <Field label={t('Recogida', 'Pickup')} value="Hotel Be Live Adults Only" icon="pin" full />
              <Field label={t('Destino', 'Drop-off')} value="PMI · Aeropuerto T1, salidas" icon="pin" full />

              <Field label={t('Cliente', 'Client')} value="Tropikana Travel" icon="users" />
              <Field label={t('Referencia agencia', 'Agency ref.')} value="BKG-2026-04-1145" mono />
            </div>

            <div style={{ marginTop: 18, padding: 14, background: 'var(--bg-sunken)', borderRadius: 6, border: '1px solid var(--line)' }}>
              <div className="vo-row" style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{t('Asignación rápida', 'Quick assign')}</span>
                <span className="vo-pill" data-tone="info" style={{ marginLeft: 8 }}>{t('Sugerencia automática', 'Auto-suggest')}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)' }}>{t('Basado en disponibilidad y proximidad', 'Based on availability + proximity')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <SuggestionCard
                  label={t('Conductor sugerido', 'Suggested driver')}
                  primary="Núria Sala"
                  secondary={t('D-019 · disponible · 12 min de la recogida', 'D-019 · available · 12 min from pickup')}
                  ok
                />
                <SuggestionCard
                  label={t('Vehículo sugerido', 'Suggested vehicle')}
                  primary="Tesla Model S · 2034-MBG"
                  secondary={t('V-21 · sedan 3 pax · combustible 88%', 'V-21 · sedan 3 pax · fuel 88%')}
                  ok
                />
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--ok-soft)', border: '1px solid var(--ok)', borderRadius: 6, fontSize: 12, color: 'var(--ok-text)' }}>
              <VOIcon name="check" size={12} style={{ marginRight: 6 }} />
              {t('Sin conflictos detectados con la agenda actual.', 'No conflicts detected with current schedule.')}
            </div>
          </div>

          <div style={{ padding: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="vo-btn" data-variant="ghost">{t('Plantillas', 'Templates')}</button>
            <div style={{ flex: 1 }}></div>
            <button className="vo-btn">{t('Guardar borrador', 'Save draft')}</button>
            <button className="vo-btn" data-variant="primary">{t('Crear y asignar', 'Create & assign')} <span className="vo-kbd" style={{ marginLeft: 4, background: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.7)' }}>⌘⏎</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, mono, icon, full }) => (
  <div className="vo-col" style={{ gap: 4, gridColumn: full ? '1 / -1' : 'auto' }}>
    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
    <div className="vo-row" style={{ padding: '7px 10px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--bg-elev)', fontSize: 12.5, gap: 6, fontFamily: mono ? 'var(--ff-mono)' : 'var(--ff-ui)' }}>
      {icon && <VOIcon name={icon} size={12} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />}
      <span style={{ flex: 1, color: 'var(--text)' }}>{value}</span>
    </div>
  </div>
);

const SuggestionCard = ({ label, primary, secondary, ok }) => (
  <div style={{ padding: 10, background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 6 }}>
    <div className="vo-row" style={{ marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
      {ok && <span className="vo-pill" data-tone="ok" style={{ marginLeft: 'auto' }}><VOIcon name="check" size={10} /></span>}
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{primary}</div>
    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{secondary}</div>
    <div className="vo-row" style={{ gap: 4, marginTop: 8 }}>
      <button className="vo-btn" data-size="sm" style={{ flex: 1 }}>{'Cambiar'}</button>
      <button className="vo-btn" data-size="sm" data-variant="primary"><VOIcon name="check" size={10} /></button>
    </div>
  </div>
);

Object.assign(window, {
  VOServicesList, VOCalendar, VOServiceDetail, VOMap, VONewService,
});
