// components.jsx — Shared UI primitives for Vía Operations
// Exports to window for cross-file use.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Icons (24x24 stroke 1.5, currentColor) ─────────────────
const VOIcon = ({ name, size = 14, style }) => {
  const paths = {
    plane: <path d="M10 21l2-7 7-7a2 2 0 1 1 2 2l-7 7-7 2zM3 13l4-4 5 5-4 4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>,
    clock: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    users: <><circle cx="9" cy="9" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M16 11a3 3 0 1 0 0-6M21 19c0-2.5-1.7-4.3-4-4.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    map: <><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>,
    pin: <><path d="M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
    plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
    search: <><circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    bell: <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16zM10 20h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>,
    filter: <path d="M4 5h16l-6 8v6l-4-2v-4L4 5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>,
    sort: <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    chevron: <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    dots: <><circle cx="6" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18" cy="12" r="1.3" fill="currentColor"/></>,
    car: <path d="M5 16h14l-1.2-5.5a2 2 0 0 0-2-1.5h-7.6a2 2 0 0 0-2 1.5L5 16zM5 16v3h2v-3M19 16v3h-2v-3M7.5 13.5h.01M16.5 13.5h.01" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    bus: <path d="M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1h-1v2h-2v-2H9v2H7v-2H6a1 1 0 0 1-1-1V6zm1 4h12M8 14h.01M16 14h.01" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    layers: <path d="M12 4l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5M3 17l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>,
    list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    calendar: <path d="M4 7h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7zm0 0V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M8 3v3M16 3v3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
    home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>,
    arrow_right: <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    alert: <path d="M12 4l10 17H2L12 4zM12 10v5M12 18.5v.01" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>,
    check: <path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>,
    x: <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
    phone: <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 6 6L15 13l4 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>,
    flag: <path d="M5 21V4m0 0h11l-2 4 2 4H5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>,
    edit: <path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>,
    refresh: <path d="M4 12a8 8 0 0 1 14-5l2-2v6h-6l3-3M20 12a8 8 0 0 1-14 5l-2 2v-6h6l-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>,
    settings: <><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    swap: <path d="M7 4v16M7 4 4 7M7 4l3 3M17 20V4m0 16-3-3m3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    play: <path d="M7 4v16l13-8L7 4z" fill="currentColor"/>,
    drag: <path d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', flexShrink: 0, ...style }} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};

// ─── Status pill + dot ─────────────────────────────────────
const VOStatus = ({ status, mini }) => {
  const info = window.VO_HELPERS.statusInfo(status);
  if (mini) {
    return <span className="vo-pill" data-tone={info.tone} data-square="true"><span className="dot"></span>{info.label}</span>;
  }
  return <span className="vo-pill" data-tone={info.tone}><span className="dot"></span>{info.label}</span>;
};

// ─── Service type pill ─────────────────────────────────────
const VOServiceType = ({ type }) => {
  const t = window.VO_DATA.TYPES[type];
  if (!t) return null;
  return (
    <span className="vo-pill" data-square="true" style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, letterSpacing: '0.05em' }}>
      <VOIcon name={t.icon} size={11} />
      {t.short}
    </span>
  );
};

// ─── Driver chip / vehicle chip ────────────────────────────
const VODriverChip = ({ id, onAssign }) => {
  if (!id) {
    return (
      <span className="vo-chip" data-empty="true" onClick={(e) => { e.stopPropagation(); onAssign && onAssign(); }}>
        <VOIcon name="plus" size={10} /> Asignar conductor
      </span>
    );
  }
  const d = window.VO_HELPERS.driverById(id);
  if (!d) return null;
  return (
    <span className="vo-chip">
      <span className="vo-avatar" style={{ width: 18, height: 18, fontSize: 9 }}>{d.initials}</span>
      <span>{d.name.split(' ')[0]} {d.name.split(' ')[1]?.[0]}.</span>
    </span>
  );
};

const VOVehicleChip = ({ id, onAssign }) => {
  if (!id) {
    return (
      <span className="vo-chip" data-empty="true" onClick={(e) => { e.stopPropagation(); onAssign && onAssign(); }}>
        <VOIcon name="plus" size={10} /> Vehículo
      </span>
    );
  }
  const v = window.VO_HELPERS.vehicleById(id);
  if (!v) return null;
  const icon = v.kind === 'sedan' ? 'car' : v.kind === 'bus' || v.kind === 'minibus' ? 'bus' : 'car';
  return (
    <span className="vo-chip">
      <VOIcon name={icon} size={11} style={{ color: 'var(--text-muted)' }} />
      <span className="vo-mono" style={{ fontSize: 10.5 }}>{v.plate}</span>
    </span>
  );
};

// ─── Top bar ─────────────────────────────────────────────
const VOTopbar = ({ active, onNav, dense, lang }) => {
  const t = (es, en) => lang === 'en' ? en : es;
  return (
    <header className="vo-topbar">
      <div className="vo-brand">
        <span className="vo-brand-mark">V</span>
        <span>Vía<span style={{ color: 'var(--text-dim)', fontWeight: 400 }}> Operations</span></span>
      </div>
      <nav className="vo-nav">
        {[
          { id: 'dashboard', label: t('Hoy', 'Today'),       icon: 'home' },
          { id: 'list',      label: t('Servicios', 'Services'), icon: 'list' },
          { id: 'calendar',  label: t('Planning', 'Planning'),  icon: 'calendar' },
          { id: 'map',       label: t('Mapa', 'Map'),         icon: 'map' },
          { id: 'incidents', label: t('Incidencias', 'Incidents'), icon: 'flag' },
        ].map(n => (
          <span key={n.id} className="vo-nav-item" data-active={active === n.id} onClick={() => onNav?.(n.id)}>
            <VOIcon name={n.icon} size={13} />{n.label}
          </span>
        ))}
      </nav>
      <div className="vo-topbar-spacer"></div>
      <div className="vo-search">
        <VOIcon name="search" size={12} />
        <span>{t('Buscar servicio, conductor, vehículo…', 'Search…')}</span>
        <kbd>⌘K</kbd>
      </div>
      <div className="vo-clock">
        <span className="dot"></span>
        <span>11:32</span>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <span style={{ color: 'var(--text-muted)' }}>Vie 25 Abr</span>
      </div>
      <button className="vo-icon-btn" title="Notifications">
        <VOIcon name="bell" size={14} />
        <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: 'var(--crit)' }}></span>
      </button>
      <span className="vo-avatar">CO</span>
    </header>
  );
};

Object.assign(window, {
  VOIcon, VOStatus, VOServiceType, VODriverChip, VOVehicleChip, VOTopbar,
});
