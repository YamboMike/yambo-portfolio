import { useState, useEffect, useRef } from "react";
import data from "./investigations.json";

const CATEGORIES = data.categories;

const getTheme = (dark) => dark
  ? { bg: "#111111", ink: "#efefef", mid: "#c0c0c0", muted: "#787878", faint: "#484848", border: "#282828", navBg: "rgba(17,17,17,0.92)" }
  : { bg: "#ffffff", ink: "#0c0c0c", mid: "#3d3d3d", muted: "#888888", faint: "#b4b4b4", border: "#e8e8e8", navBg: "rgba(255,255,255,0.92)" };

const glass = (dark, on) => !on ? {} : dark
  ? { background: "rgba(160,200,255,0.07)", backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)", borderColor: "rgba(160,200,255,0.22)", boxShadow: "0 2px 14px rgba(120,170,255,0.10), inset 0 1px 0 rgba(255,255,255,0.06)" }
  : { background: "rgba(80,130,230,0.055)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", borderColor: "rgba(80,130,230,0.22)",   boxShadow: "0 2px 14px rgba(80,130,230,0.08),  inset 0 1px 0 rgba(255,255,255,0.7)" };

const sans = "'DM Sans', system-ui, sans-serif";
const W    = "min(92vw, 880px)";
const SM   = 640;


// Flatten all tags for filter bar
const ALL_TAGS = ["All", ...Array.from(
  new Set(CATEGORIES.flatMap(c => c.items.flatMap(i => i.tags)))
).sort()];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useScrolled(offset = 48) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > offset);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [offset]);
  return s;
}

function useHover() {
  const [on, setOn] = useState(false);
  return [on, { onMouseEnter: () => setOn(true), onMouseLeave: () => setOn(false) }];
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ─── Shared glass button ──────────────────────────────────────────────────────

function GlassBtn({ children, href, onClick, solid, C, dark, style = {} }) {
  const [hov, hp] = useHover();
  const g = glass(dark, hov);
  return href
    ? <a href={href} onClick={onClick} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "9px 17px", borderRadius: 100, fontSize: 14,
        fontWeight: 400, fontFamily: sans, textDecoration: "none",
        letterSpacing: "-0.01em", cursor: "pointer",
        background:  solid ? C.ink : (hov ? g.background : "transparent"),
        color:       solid ? C.bg  : C.mid,
        border:      solid ? "none" : `1px solid ${hov ? (g.borderColor || C.border) : C.border}`,
        backdropFilter:       !solid && hov ? g.backdropFilter       : "none",
        WebkitBackdropFilter: !solid && hov ? g.WebkitBackdropFilter : "none",
        boxShadow: hov ? (solid
          ? dark ? "0 2px 16px rgba(120,170,255,0.18)" : "0 2px 16px rgba(80,130,230,0.14)"
          : g.boxShadow) : "none",
        transition: "background 0.22s, border-color 0.22s, box-shadow 0.22s, color 0.3s",
        ...style,
      }} {...hp}>{children}</a>
    : <button onClick={onClick} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "9px 17px", borderRadius: 100, fontSize: 14,
        fontWeight: 400, fontFamily: sans,
        letterSpacing: "-0.01em", cursor: "pointer",
        background:  solid ? C.ink : (hov ? g.background : "transparent"),
        color:       solid ? C.bg  : C.mid,
        border:      solid ? "none" : `1px solid ${hov ? (g.borderColor || C.border) : C.border}`,
        backdropFilter:       !solid && hov ? g.backdropFilter       : "none",
        WebkitBackdropFilter: !solid && hov ? g.WebkitBackdropFilter : "none",
        boxShadow: hov ? (solid
          ? dark ? "0 2px 16px rgba(120,170,255,0.18)" : "0 2px 16px rgba(80,130,230,0.14)"
          : g.boxShadow) : "none",
        transition: "background 0.22s, border-color 0.22s, box-shadow 0.22s, color 0.3s",
        ...style,
      }} {...hp}>{children}</button>;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const SunIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

// ─── Fade ─────────────────────────────────────────────────────────────────────

function Fade({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

// ─── Investigation row ────────────────────────────────────────────────────────

function InvRow({ title, desc, href, tags, pub, year, featured, activeTag, C, last }) {
  const [hov, hp] = useHover();
  const dimmed = activeTag !== "All" && !tags.includes(activeTag);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }} {...hp}>
      <div style={{
        padding: "20px 12px",
        borderTop: `1px solid ${C.border}`,
        borderBottom: last ? `1px solid ${C.border}` : "none",
        borderRadius: 8,
        background: hov ? (C.border + "55") : "transparent",
        opacity: dimmed ? 0.28 : 1,
        transition: "background 0.18s, opacity 0.3s, border-color 0.3s",
        cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
              {featured && (
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", color: C.bg, background: C.ink, padding: "2px 8px", borderRadius: 100, fontFamily: sans }}>
                  FEATURED
                </span>
              )}
              {tags.map(t => (
                <span key={t} style={{
                  fontSize: 11, padding: "2px 9px", borderRadius: 100, fontFamily: sans,
                  background: activeTag === t ? C.ink : C.border,
                  color:      activeTag === t ? C.bg  : C.muted,
                  transition: "background 0.2s, color 0.2s",
                }}>
                  {t}
                </span>
              ))}
            </div>

            <h3 style={{
              fontFamily: sans, fontSize: "clamp(15px, 2vw, 17px)", fontWeight: 500,
              color: C.ink, margin: "0 0 6px", letterSpacing: "-0.015em",
              lineHeight: 1.3, transition: "color 0.3s",
            }}>
              {title}
            </h3>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0, transition: "color 0.3s" }}>
              {desc}
            </p>
          </div>

          {/* Right: pub + year + arrow */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0, paddingTop: 2 }}>
            <span style={{ fontSize: 11, color: C.faint, whiteSpace: "nowrap", fontFamily: sans, transition: "color 0.3s" }}>{year}</span>
            <span style={{ fontSize: 11, color: C.faint, whiteSpace: "nowrap", textAlign: "right", fontFamily: sans, maxWidth: 120, lineHeight: 1.4, transition: "color 0.3s" }}>{pub}</span>
            <span style={{ fontSize: 14, color: hov ? C.ink : C.faint, marginTop: 4, transition: "color 0.18s" }}>↗</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ─── Category section ─────────────────────────────────────────────────────────

function CategorySection({ category, activeTag, C, delay }) {
  const visibleCount = activeTag === "All"
    ? category.items.length
    : category.items.filter(i => i.tags.includes(activeTag)).length;

  if (visibleCount === 0 && activeTag !== "All") return null;

  return (
    <Fade delay={delay}>
      <div style={{ marginBottom: 56 }}>
        {/* Category header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: sans, fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 500, letterSpacing: "-0.02em", color: C.ink, margin: 0, transition: "color 0.3s" }}>
            {category.label}
          </h2>
          <span style={{ fontSize: 13, color: C.faint, fontFamily: sans, transition: "color 0.3s" }}>
            {visibleCount} {visibleCount === 1 ? "investigation" : "investigations"}
          </span>
        </div>
        <p style={{ fontSize: 14, color: C.muted, margin: "0 0 20px", lineHeight: 1.6, maxWidth: 540, transition: "color 0.3s" }}>
          {category.desc}
        </p>

        {/* Items */}
        <div>
          {category.items.map((item, i) => (
            <InvRow
              key={item.href}
              {...item}
              activeTag={activeTag}
              C={C}
              last={i === category.items.length - 1}
            />
          ))}
        </div>
      </div>
    </Fade>
  );
}

// ─── Investigations page ──────────────────────────────────────────────────────

export default function InvestigationsPage({ dark, setDark, onGoHome }) {
  const scrolled   = useScrolled();
  const width      = useWindowWidth();
  const isMobile   = width < SM;
  const [activeTag, setActiveTag] = useState("All");
  const [loaded,    setLoaded]    = useState(false);
  const [themeHv,   themeHvP]     = useHover();
  const C  = getTheme(dark);
  const tg = glass(dark, themeHv);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setLoaded(true), 60);
  }, []);

  const px    = isMobile ? "20px" : "clamp(32px, 5vw, 56px)";
  const inner = { maxWidth: W, margin: "0 auto" };

  // Total count
  const totalCount = CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);
  const filteredCount = activeTag === "All"
    ? totalCount
    : CATEGORIES.reduce((acc, c) => acc + c.items.filter(i => i.tags.includes(activeTag)).length, 0);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: sans, minHeight: "100vh", overflowX: "hidden", WebkitFontSmoothing: "antialiased", transition: "background 0.3s, color 0.3s" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 52, padding: `0 ${px}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background:           scrolled ? C.navBg : "transparent",
        backdropFilter:       scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "background 0.2s, border 0.2s",
      }}>
        {/* Back to home */}
        <button onClick={onGoHome} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: sans, fontSize: 15, fontWeight: 500,
          color: C.ink, letterSpacing: "-0.015em",
          transition: "opacity 0.18s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <span style={{ fontSize: 16 }}>←</span> yambo.
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isMobile && (
            <span style={{ fontSize: 13, color: C.faint, fontFamily: sans, marginRight: 8 }}>
              Investigations
            </span>
          )}
          {/* Theme toggle */}
          <button onClick={() => setDark(d => !d)} title={dark ? "Light mode" : "Dark mode"}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: 100,
              background:           themeHv ? tg.background    : "transparent",
              backdropFilter:       themeHv ? tg.backdropFilter : "none",
              WebkitBackdropFilter: themeHv ? tg.WebkitBackdropFilter : "none",
              border: `1px solid ${themeHv ? tg.borderColor || C.border : C.border}`,
              boxShadow: themeHv ? tg.boxShadow : "none",
              color: C.muted, cursor: "pointer",
              transition: "background 0.22s, border-color 0.22s, box-shadow 0.22s, color 0.3s",
            }} {...themeHvP}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: `clamp(90px, 14vw, 140px) ${px} clamp(32px, 5vw, 56px)` }}>
        <div style={{ ...inner }}>
          <div style={{ marginBottom: 8, opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.05s" }}>
            <span style={{ fontSize: 13, color: C.faint, fontFamily: sans }}>
              {filteredCount} of {totalCount} investigations
            </span>
          </div>

          <h1 style={{
            fontFamily: sans, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 500,
            letterSpacing: "-0.035em", lineHeight: 1.05, margin: "0 0 16px",
            color: C.ink,
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(10px)",
            transition: "opacity 0.55s ease 0.08s, transform 0.55s ease 0.08s, color 0.3s",
          }}>
            All Investigations
          </h1>

          <p style={{
            fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 300, color: C.faint,
            margin: "0 0 36px", maxWidth: 480, lineHeight: 1.6,
            opacity: loaded ? 1 : 0, transition: "opacity 0.55s ease 0.16s, color 0.3s",
          }}>
            Open-source reporting across conflict, accountability,<br />
            and data journalism in Africa.
          </p>

          {/* Tag filter bar */}
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap",
            opacity: loaded ? 1 : 0, transition: "opacity 0.55s ease 0.24s",
          }}>
            {ALL_TAGS.map(tag => {
              const active = activeTag === tag;
              return (
                <button key={tag} onClick={() => setActiveTag(tag)} style={{
                  padding: "6px 14px", borderRadius: 100, fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  cursor: "pointer", fontFamily: sans,
                  background:  active ? C.ink    : "transparent",
                  color:       active ? C.bg     : C.muted,
                  border:      active ? "none"   : `1px solid ${C.border}`,
                  transition:  "background 0.18s, color 0.18s, border-color 0.18s",
                }}>
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: C.border, transition: "background 0.3s" }} />

      {/* ── Categories ──────────────────────────────────────────────────────── */}
      <section style={{ padding: `clamp(40px, 6vw, 64px) ${px}` }}>
        <div style={{ ...inner }}>
          {CATEGORIES.map((cat, i) => (
            <CategorySection
              key={cat.id}
              category={cat}
              activeTag={activeTag}
              C={C}
              delay={i * 60}
            />
          ))}

          {/* Empty state */}
          {filteredCount === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: 15, color: C.faint, fontFamily: sans }}>
                No investigations tagged "{activeTag}" yet.
              </p>
              <button onClick={() => setActiveTag("All")} style={{ marginTop: 16, padding: "8px 18px", borderRadius: 100, fontSize: 13, fontFamily: sans, cursor: "pointer", background: C.ink, color: C.bg, border: "none" }}>
                Show all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div style={{ height: 1, background: C.border, transition: "background 0.3s" }} />
      <footer style={{ padding: `20px ${px}` }}>
        <div style={{ ...inner, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <button onClick={onGoHome} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: sans, fontSize: 14, color: C.faint, letterSpacing: "-0.01em", transition: "color 0.18s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.ink}
            onMouseLeave={e => e.currentTarget.style.color = C.faint}
          >
            ← Back to home
          </button>
          <span style={{ fontSize: 13, color: C.faint, fontFamily: sans }}>Mike Yambo · Nairobi</span>
        </div>
      </footer>

    </div>
  );
}
