import { useState, useEffect } from "react";

// ============================================================
// DATA & CONSTANTS
// ============================================================
const INITIAL_PATIENTS = [
  { id: 1, name: "Ana García López", age: 34, phone: "612 345 678", email: "ana@email.com", diagnosis: "F41.1 - Trastorno de ansiedad generalizada", since: "2024-03-15", sessions: 12, status: "activo", balance: 0, notes: [] },
  { id: 2, name: "Carlos Mendez", age: 28, phone: "698 765 432", email: "carlos@email.com", diagnosis: "F32.1 - Episodio depresivo moderado", since: "2024-06-01", sessions: 8, status: "activo", balance: -80, notes: [] },
  { id: 3, name: "Laura Sánchez", age: 45, phone: "611 222 333", email: "laura@email.com", diagnosis: "F43.1 - Trastorno de estrés postraumático", since: "2023-11-10", sessions: 24, status: "activo", balance: 0, notes: [] },
];

const INITIAL_INVOICES = [
  { id: 1, patientId: 1, patient: "Ana García López", concept: "Sesión individual", date: "2025-03-10", amount: 80, status: "pagada", method: "transferencia" },
  { id: 2, patientId: 2, patient: "Carlos Mendez", concept: "Sesión individual", date: "2025-03-12", amount: 80, status: "pendiente", method: "" },
  { id: 3, patientId: 3, patient: "Laura Sánchez", concept: "Sesión individual", date: "2025-03-14", amount: 90, status: "pagada", method: "efectivo" },
  { id: 4, patientId: 1, patient: "Ana García López", concept: "Sesión individual", date: "2025-03-17", amount: 80, status: "pagada", method: "bizum" },
];

const INITIAL_APPOINTMENTS = [
  { id: 1, patientId: 1, patient: "Ana García López", date: "2025-03-17", time: "10:00", duration: 50, type: "individual", notes: "" },
  { id: 2, patientId: 2, patient: "Carlos Mendez", date: "2025-03-17", time: "11:00", duration: 50, type: "individual", notes: "" },
  { id: 3, patientId: 3, patient: "Laura Sánchez", date: "2025-03-18", time: "16:00", duration: 50, type: "individual", notes: "" },
  { id: 4, patientId: 1, patient: "Ana García López", date: "2025-03-24", time: "10:00", duration: 50, type: "individual", notes: "" },
];

const DSM_CODES = [
  "F32.0 - Episodio depresivo leve", "F32.1 - Episodio depresivo moderado", "F32.2 - Episodio depresivo grave",
  "F33.0 - Trastorno depresivo recurrente leve", "F40.0 - Agorafobia", "F40.1 - Fobia social",
  "F41.0 - Trastorno de pánico", "F41.1 - Trastorno de ansiedad generalizada",
  "F42 - Trastorno obsesivo-compulsivo", "F43.0 - Reacción aguda al estrés",
  "F43.1 - Trastorno de estrés postraumático", "F43.2 - Trastorno de adaptación",
  "F60.3 - Trastorno de personalidad límite", "F50.0 - Anorexia nerviosa",
  "F50.2 - Bulimia nerviosa", "F90.0 - TDAH predominantemente inatento",
];

// ============================================================
// ICONS
// ============================================================
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    patients: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    calendar: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    invoice: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    finance: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    plus: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    x: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
    note: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    chart: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    alert: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    trash: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  };
  return icons[name] || null;
};

// ============================================================
// MODAL COMPONENT
// ============================================================
const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
    <div style={{ background: "#0f1117", border: "1px solid #2a2d3a", borderRadius: "16px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.8)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px", borderBottom: "1px solid #1e2130" }}>
        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "#f0f0f5", fontFamily: "'Playfair Display', serif" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: "4px", borderRadius: "6px" }}><Icon name="x" size={18} /></button>
      </div>
      <div style={{ padding: "28px" }}>{children}</div>
    </div>
  </div>
);

// ============================================================
// FORM INPUTS
// ============================================================
const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={{ display: "block", fontSize: "12px", color: "#8891aa", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>
    <input {...props} style={{ width: "100%", background: "#1a1d2e", border: "1px solid #2a2d3a", borderRadius: "8px", padding: "10px 14px", color: "#f0f0f5", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={{ display: "block", fontSize: "12px", color: "#8891aa", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>
    <select {...props} style={{ width: "100%", background: "#1a1d2e", border: "1px solid #2a2d3a", borderRadius: "8px", padding: "10px 14px", color: "#f0f0f5", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}>{children}</select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={{ display: "block", fontSize: "12px", color: "#8891aa", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>
    <textarea {...props} style={{ width: "100%", background: "#1a1d2e", border: "1px solid #2a2d3a", borderRadius: "8px", padding: "10px 14px", color: "#f0f0f5", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", minHeight: "90px" }} />
  </div>
);

const Btn = ({ children, variant = "primary", onClick, style = {}, size = "md" }) => {
  const variants = {
    primary: { background: "linear-gradient(135deg, #7c6af0, #a78bfa)", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "#8891aa", border: "1px solid #2a2d3a" },
    danger: { background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" },
    success: { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" },
  };
  const sizes = { sm: "8px 14px", md: "10px 20px", lg: "12px 28px" };
  return (
    <button onClick={onClick} style={{ ...variants[variant], padding: sizes[size], borderRadius: "8px", cursor: "pointer", fontSize: size === "sm" ? "12px" : "14px", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "inherit", ...style }}>
      {children}
    </button>
  );
};

// ============================================================
// DASHBOARD
// ============================================================
const Dashboard = ({ patients, invoices, appointments }) => {
  const today = new Date().toISOString().split("T")[0];
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthInvoices = invoices.filter(i => i.date.startsWith(thisMonth));
  const monthRevenue = monthInvoices.filter(i => i.status === "pagada").reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter(i => i.status === "pendiente").reduce((s, i) => s + i.amount, 0);
  const todayApts = appointments.filter(a => a.date === today);
  const activePatients = patients.filter(p => p.status === "activo").length;

  const stats = [
    { label: "Ingresos del mes", value: `${monthRevenue}€`, sub: `${monthInvoices.length} sesiones`, color: "#7c6af0", icon: "finance" },
    { label: "Cobros pendientes", value: `${pending}€`, sub: `${invoices.filter(i => i.status === "pendiente").length} facturas`, color: "#f59e0b", icon: "alert" },
    { label: "Pacientes activos", value: activePatients, sub: `${patients.length} en total`, color: "#34d399", icon: "patients" },
    { label: "Citas hoy", value: todayApts.length, sub: `Próxima: ${todayApts[0]?.time || "--"}`, color: "#60a5fa", icon: "calendar" },
  ];

  const recentMonths = ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"];
  const barData = [1240, 1680, 1520, 1900, 1760, monthRevenue || 2080];
  const maxBar = Math.max(...barData);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: 700, color: "#f0f0f5", fontFamily: "'Playfair Display', serif" }}>Buenos días ✦</h2>
        <p style={{ margin: 0, color: "#8891aa", fontSize: "14px" }}>{new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "14px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ width: 38, height: 38, borderRadius: "10px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}><Icon name={s.icon} size={18} /></div>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 700, color: s.color, marginBottom: "4px", fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#8891aa" }}>{s.label}</div>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "14px", padding: "22px" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 600, color: "#c8c8d8", fontFamily: "'Playfair Display', serif" }}>Ingresos últimos 6 meses</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
            {barData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{ fontSize: "10px", color: "#555" }}>{val}€</div>
                <div style={{ width: "100%", height: `${(val / maxBar) * 90}px`, background: i === 5 ? "linear-gradient(180deg, #7c6af0, #a78bfa)" : "#1e2130", borderRadius: "4px 4px 0 0", transition: "height 0.3s" }} />
                <div style={{ fontSize: "11px", color: "#666" }}>{recentMonths[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "14px", padding: "22px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 600, color: "#c8c8d8", fontFamily: "'Playfair Display', serif" }}>Próximas citas</h3>
          {appointments.slice(0, 4).map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < 3 ? "1px solid #1a1d2e" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1e2130", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "#7c6af0" }}>{a.patient[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#e0e0ea" }}>{a.patient}</div>
                <div style={{ fontSize: "11px", color: "#666" }}>{new Date(a.date + "T00:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })} · {a.time}</div>
              </div>
              <div style={{ fontSize: "11px", color: "#7c6af0", background: "#7c6af018", padding: "3px 8px", borderRadius: "20px" }}>{a.duration} min</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PATIENTS
// ============================================================
const Patients = ({ patients, setPatients }) => {
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState("info");
  const [newNote, setNewNote] = useState({ date: new Date().toISOString().split("T")[0], content: "", evolution: "estable" });
  const [form, setForm] = useState({ name: "", age: "", phone: "", email: "", diagnosis: "", since: new Date().toISOString().split("T")[0], status: "activo" });

  const addPatient = () => {
    const p = { ...form, id: Date.now(), sessions: 0, balance: 0, notes: [], age: Number(form.age) };
    setPatients([...patients, p]);
    setShowAdd(false);
    setForm({ name: "", age: "", phone: "", email: "", diagnosis: "", since: new Date().toISOString().split("T")[0], status: "activo" });
  };

  const addNote = () => {
    const updated = patients.map(p => p.id === selected.id ? { ...p, notes: [...(p.notes || []), { ...newNote, id: Date.now() }], sessions: p.sessions + 1 } : p);
    setPatients(updated);
    setSelected({ ...selected, notes: [...(selected.notes || []), { ...newNote, id: Date.now() }], sessions: selected.sessions + 1 });
    setNewNote({ date: new Date().toISOString().split("T")[0], content: "", evolution: "estable" });
  };

  const evColors = { mejora: "#34d399", estable: "#60a5fa", empeora: "#f87171" };

  if (selected) return (
    <div>
      <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#8891aa", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", marginBottom: "20px", padding: 0 }}>
        ← Volver a pacientes
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#7c6af0,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#fff" }}>{selected.name[0]}</div>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: "#f0f0f5", fontFamily: "'Playfair Display', serif" }}>{selected.name}</h2>
          <span style={{ fontSize: "12px", background: "#34d39920", color: "#34d399", padding: "2px 10px", borderRadius: "20px" }}>{selected.status}</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: "22px", fontWeight: 700, color: "#7c6af0" }}>{selected.sessions}</div><div style={{ fontSize: "11px", color: "#666" }}>sesiones</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: "22px", fontWeight: 700, color: selected.balance < 0 ? "#f87171" : "#34d399" }}>{selected.balance}€</div><div style={{ fontSize: "11px", color: "#666" }}>saldo</div></div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "#0f1117", padding: "4px", borderRadius: "10px", width: "fit-content" }}>
        {["info", "notas", "evolución"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: tab === t ? "#1e2130" : "transparent", color: tab === t ? "#f0f0f5" : "#666", cursor: "pointer", fontSize: "13px", textTransform: "capitalize", fontFamily: "inherit" }}>{t}</button>
        ))}
      </div>

      {tab === "info" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[["Edad", `${selected.age} años`], ["Teléfono", selected.phone], ["Email", selected.email], ["Paciente desde", selected.since], ["Diagnóstico principal", selected.diagnosis, true]].map(([k, v, full]) => (
            <div key={k} style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "12px", padding: "16px", gridColumn: full ? "1 / -1" : "auto" }}>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</div>
              <div style={{ fontSize: "14px", color: "#e0e0ea" }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "notas" && (
        <div>
          <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <h4 style={{ margin: "0 0 16px", fontSize: "14px", color: "#c8c8d8" }}>Nueva nota de sesión</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Input label="Fecha" type="date" value={newNote.date} onChange={e => setNewNote({ ...newNote, date: e.target.value })} />
              <Select label="Evolución" value={newNote.evolution} onChange={e => setNewNote({ ...newNote, evolution: e.target.value })}>
                <option value="mejora">Mejora</option>
                <option value="estable">Estable</option>
                <option value="empeora">Empeora</option>
              </Select>
            </div>
            <Textarea label="Contenido de la sesión" value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })} placeholder="Observaciones, temas tratados, tareas asignadas..." />
            <Btn onClick={addNote}><Icon name="plus" size={14} /> Guardar nota</Btn>
          </div>
          {(selected.notes || []).slice().reverse().map((n, i) => (
            <div key={i} style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "12px", padding: "18px", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "#8891aa" }}>{n.date}</span>
                <span style={{ fontSize: "11px", background: `${evColors[n.evolution]}20`, color: evColors[n.evolution], padding: "2px 10px", borderRadius: "20px" }}>{n.evolution}</span>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#c8c8d8", lineHeight: 1.6 }}>{n.content || <em style={{ color: "#555" }}>Sin contenido</em>}</p>
            </div>
          ))}
          {(selected.notes || []).length === 0 && <p style={{ color: "#555", textAlign: "center", marginTop: "40px" }}>Aún no hay notas de sesión</p>}
        </div>
      )}

      {tab === "evolución" && (
        <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "12px", padding: "24px" }}>
          <h4 style={{ margin: "0 0 20px", fontSize: "14px", color: "#c8c8d8" }}>Línea de evolución</h4>
          {(selected.notes || []).length === 0 ? <p style={{ color: "#555", textAlign: "center" }}>Sin datos de evolución</p> : (
            <div style={{ position: "relative" }}>
              {selected.notes.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: evColors[n.evolution], flexShrink: 0 }} />
                    {i < selected.notes.length - 1 && <div style={{ width: 2, flex: 1, background: "#1e2130", minHeight: "30px" }} />}
                  </div>
                  <div style={{ paddingBottom: "8px" }}>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>{n.date}</div>
                    <div style={{ fontSize: "13px", color: "#c8c8d8" }}>{n.content?.slice(0, 80)}{n.content?.length > 80 ? "..." : ""}</div>
                    <span style={{ fontSize: "11px", color: evColors[n.evolution] }}>{n.evolution}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#f0f0f5", fontFamily: "'Playfair Display', serif" }}>Pacientes</h2>
        <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={15} /> Nuevo paciente</Btn>
      </div>
      <div style={{ display: "grid", gap: "12px" }}>
        {patients.map(p => (
          <div key={p.id} onClick={() => setSelected(p)} style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "12px", padding: "18px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#7c6af0"} onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2130"}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#7c6af0,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{p.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: "#e0e0ea", marginBottom: "3px" }}>{p.name}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>{p.diagnosis || "Sin diagnóstico"}</div>
            </div>
            <div style={{ display: "flex", gap: "20px", marginRight: "12px" }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: "16px", fontWeight: 600, color: "#7c6af0" }}>{p.sessions}</div><div style={{ fontSize: "10px", color: "#555" }}>sesiones</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: "16px", fontWeight: 600, color: p.balance < 0 ? "#f87171" : "#34d399" }}>{p.balance}€</div><div style={{ fontSize: "10px", color: "#555" }}>saldo</div></div>
            </div>
            <span style={{ fontSize: "11px", background: "#34d39918", color: "#34d399", padding: "3px 10px", borderRadius: "20px" }}>{p.status}</span>
            <Icon name="arrow" size={16} color="#444" />
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="Nuevo paciente" onClose={() => setShowAdd(false)}>
          <Input label="Nombre completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input label="Edad" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
            <Input label="Desde" type="date" value={form.since} onChange={e => setForm({ ...form, since: e.target.value })} />
          </div>
          <Input label="Teléfono" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Select label="Diagnóstico principal" value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })}>
            <option value="">Seleccionar diagnóstico</option>
            {DSM_CODES.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Btn>
            <Btn onClick={addPatient}>Guardar paciente</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// AGENDA
// ============================================================
const Agenda = ({ appointments, setAppointments, patients }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ patientId: "", date: new Date().toISOString().split("T")[0], time: "10:00", duration: "50", type: "individual", notes: "" });

  const addAppt = () => {
    const p = patients.find(p => p.id === Number(form.patientId));
    setAppointments([...appointments, { ...form, id: Date.now(), patient: p?.name || "", patientId: Number(form.patientId) }]);
    setShowAdd(false);
  };

  const grouped = appointments.reduce((acc, a) => { (acc[a.date] = acc[a.date] || []).push(a); return acc; }, {});
  const sortedDates = Object.keys(grouped).sort();

  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "16:00", "17:00", "18:00", "19:00"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#f0f0f5", fontFamily: "'Playfair Display', serif" }}>Agenda</h2>
        <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={15} /> Nueva cita</Btn>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {sortedDates.map(date => (
          <div key={date}>
            <div style={{ fontSize: "12px", color: "#7c6af0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", fontWeight: 600 }}>
              {new Date(date + "T00:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              {grouped[date].sort((a, b) => a.time.localeCompare(b.time)).map(a => (
                <div key={a.id} style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "10px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#7c6af0", fontFamily: "'Playfair Display', serif", width: "54px" }}>{a.time}</div>
                  <div style={{ width: 2, height: 36, background: "#7c6af030", borderRadius: "2px" }} />
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1e2130", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "#a78bfa", fontSize: "14px" }}>{a.patient[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: "#e0e0ea", fontSize: "14px" }}>{a.patient}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>{a.type} · {a.duration} min</div>
                  </div>
                  <button onClick={() => setAppointments(appointments.filter(x => x.id !== a.id))} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: "4px" }}><Icon name="trash" size={15} /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="Nueva cita" onClose={() => setShowAdd(false)}>
          <Select label="Paciente" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
            <option value="">Seleccionar paciente</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input label="Fecha" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Select label="Hora" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
              {hours.map(h => <option key={h} value={h}>{h}</option>)}
            </Select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input label="Duración (min)" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
            <Select label="Tipo" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="individual">Individual</option>
              <option value="pareja">Pareja</option>
              <option value="familia">Familia</option>
              <option value="grupo">Grupo</option>
            </Select>
          </div>
          <Textarea label="Notas (opcional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Btn>
            <Btn onClick={addAppt}>Guardar cita</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// INVOICES
// ============================================================
const Invoices = ({ invoices, setInvoices, patients }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("todas");
  const [form, setForm] = useState({ patientId: "", concept: "Sesión individual", date: new Date().toISOString().split("T")[0], amount: "80", method: "transferencia" });

  const addInvoice = () => {
    const p = patients.find(p => p.id === Number(form.patientId));
    setInvoices([...invoices, { ...form, id: Date.now(), patient: p?.name || "", patientId: Number(form.patientId), status: "pendiente", amount: Number(form.amount) }]);
    setShowAdd(false);
  };

  const markPaid = (id) => setInvoices(invoices.map(i => i.id === id ? { ...i, status: "pagada" } : i));

  const filtered = filter === "todas" ? invoices : invoices.filter(i => i.status === filter);
  const statusColors = { pagada: "#34d399", pendiente: "#f59e0b", cancelada: "#f87171" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#f0f0f5", fontFamily: "'Playfair Display', serif" }}>Facturación</h2>
        <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={15} /> Nueva factura</Btn>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["todas", "pendiente", "pagada"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: "20px", border: "none", background: filter === f ? "#7c6af0" : "#1e2130", color: filter === f ? "#fff" : "#888", cursor: "pointer", fontSize: "13px", textTransform: "capitalize", fontFamily: "inherit" }}>{f}</button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: "13px", color: "#8891aa", display: "flex", alignItems: "center" }}>
          Total pendiente: <strong style={{ color: "#f59e0b", marginLeft: "6px" }}>{invoices.filter(i => i.status === "pendiente").reduce((s, i) => s + i.amount, 0)}€</strong>
        </div>
      </div>

      <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e2130" }}>
              {["Paciente", "Concepto", "Fecha", "Importe", "Estado", ""].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.sort((a, b) => b.date.localeCompare(a.date)).map((inv, i) => (
              <tr key={inv.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #0d0f1a" : "none" }}>
                <td style={{ padding: "14px 18px", fontSize: "14px", color: "#e0e0ea", fontWeight: 500 }}>{inv.patient}</td>
                <td style={{ padding: "14px 18px", fontSize: "13px", color: "#8891aa" }}>{inv.concept}</td>
                <td style={{ padding: "14px 18px", fontSize: "13px", color: "#8891aa" }}>{inv.date}</td>
                <td style={{ padding: "14px 18px", fontSize: "15px", fontWeight: 600, color: "#f0f0f5", fontFamily: "'Playfair Display', serif" }}>{inv.amount}€</td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ fontSize: "11px", background: `${statusColors[inv.status]}18`, color: statusColors[inv.status], padding: "3px 10px", borderRadius: "20px" }}>{inv.status}</span>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  {inv.status === "pendiente" && <Btn size="sm" variant="success" onClick={() => markPaid(inv.id)}><Icon name="check" size={12} /> Cobrar</Btn>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: "center", color: "#555", padding: "40px" }}>No hay facturas</p>}
      </div>

      {showAdd && (
        <Modal title="Nueva factura" onClose={() => setShowAdd(false)}>
          <Select label="Paciente" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
            <option value="">Seleccionar paciente</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Input label="Concepto" value={form.concept} onChange={e => setForm({ ...form, concept: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input label="Fecha" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Input label="Importe (€)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          </div>
          <Select label="Método de pago" value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="bizum">Bizum</option>
            <option value="tarjeta">Tarjeta</option>
          </Select>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Btn>
            <Btn onClick={addInvoice}>Crear factura</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// FINANCES
// ============================================================
const Finances = ({ invoices }) => {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const now = new Date();

  const byMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const paid = invoices.filter(inv => inv.date.startsWith(key) && inv.status === "pagada").reduce((s, x) => s + x.amount, 0);
    const pending = invoices.filter(inv => inv.date.startsWith(key) && inv.status === "pendiente").reduce((s, x) => s + x.amount, 0);
    return { month: months[d.getMonth()], paid, pending, total: paid + pending };
  });

  const maxVal = Math.max(...byMonth.map(m => m.total), 1);
  const totalYear = invoices.filter(i => i.date.startsWith(String(now.getFullYear())) && i.status === "pagada").reduce((s, x) => s + x.amount, 0);
  const thisMonth = byMonth[byMonth.length - 1];
  const lastMonth = byMonth[byMonth.length - 2];
  const growth = lastMonth.paid ? (((thisMonth.paid - lastMonth.paid) / lastMonth.paid) * 100).toFixed(0) : 0;

  const methods = invoices.filter(i => i.status === "pagada").reduce((acc, i) => { acc[i.method || "efectivo"] = (acc[i.method || "efectivo"] || 0) + i.amount; return acc; }, {});
  const methodColors = { transferencia: "#7c6af0", bizum: "#60a5fa", efectivo: "#34d399", tarjeta: "#f59e0b" };

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: "22px", fontWeight: 700, color: "#f0f0f5", fontFamily: "'Playfair Display', serif" }}>Finanzas & Reportes</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Facturado este año", value: `${totalYear}€`, color: "#7c6af0", note: `${invoices.filter(i => i.date.startsWith(String(now.getFullYear()))).length} facturas` },
          { label: `Ingresos ${months[now.getMonth()]}`, value: `${thisMonth.paid}€`, color: "#34d399", note: growth > 0 ? `↑ ${growth}% vs mes anterior` : `↓ ${Math.abs(growth)}% vs mes anterior` },
          { label: "Pendiente de cobro", value: `${invoices.filter(i => i.status === "pendiente").reduce((s, x) => s + x.amount, 0)}€`, color: "#f59e0b", note: `${invoices.filter(i => i.status === "pendiente").length} facturas` },
        ].map((s, i) => (
          <div key={i} style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "14px", padding: "22px" }}>
            <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>{s.label}</div>
            <div style={{ fontSize: "30px", fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif", marginBottom: "4px" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#8891aa" }}>{s.note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "14px", padding: "24px" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "15px", color: "#c8c8d8", fontFamily: "'Playfair Display', serif" }}>Ingresos últimos 6 meses</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "150px" }}>
            {byMonth.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                {m.total > 0 && <div style={{ fontSize: "11px", color: "#555" }}>{m.total}€</div>}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", height: `${(m.total / maxVal) * 120}px` }}>
                  {m.pending > 0 && <div style={{ flex: m.pending, background: "#f59e0b30", borderRadius: "4px 4px 0 0" }} />}
                  {m.paid > 0 && <div style={{ flex: m.paid, background: i === 5 ? "linear-gradient(180deg,#7c6af0,#a78bfa)" : "#1e2130", borderRadius: m.pending > 0 ? "0" : "4px 4px 0 0" }} />}
                </div>
                <div style={{ fontSize: "11px", color: "#666" }}>{m.month}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: 10, height: 10, background: "#7c6af0", borderRadius: "2px" }} /><span style={{ fontSize: "11px", color: "#666" }}>Cobrado</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: 10, height: 10, background: "#f59e0b30", borderRadius: "2px", border: "1px solid #f59e0b" }} /><span style={{ fontSize: "11px", color: "#666" }}>Pendiente</span></div>
          </div>
        </div>

        <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "14px", padding: "24px" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "15px", color: "#c8c8d8", fontFamily: "'Playfair Display', serif" }}>Métodos de pago</h3>
          {Object.entries(methods).length === 0 ? <p style={{ color: "#555", fontSize: "13px" }}>Sin datos</p> : Object.entries(methods).map(([method, amount]) => {
            const total = Object.values(methods).reduce((s, v) => s + v, 0);
            const pct = Math.round((amount / total) * 100);
            return (
              <div key={method} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#c8c8d8", marginBottom: "5px" }}>
                  <span style={{ textTransform: "capitalize" }}>{method}</span>
                  <span style={{ color: methodColors[method] || "#7c6af0" }}>{amount}€ ({pct}%)</span>
                </div>
                <div style={{ height: "5px", background: "#1e2130", borderRadius: "3px" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: methodColors[method] || "#7c6af0", borderRadius: "3px", transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: "14px", padding: "24px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "15px", color: "#c8c8d8", fontFamily: "'Playfair Display', serif" }}>Resumen mensual detallado</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Mes", "Sesiones facturadas", "Cobrado", "Pendiente", "Tasa cobro"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500, borderBottom: "1px solid #1e2130" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {byMonth.slice().reverse().map((m, i) => {
              const rate = m.total > 0 ? Math.round((m.paid / m.total) * 100) : 100;
              return (
                <tr key={i} style={{ borderBottom: "1px solid #0d0f1a" }}>
                  <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: 600, color: "#e0e0ea" }}>{m.month}</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", color: "#8891aa" }}>{Math.round(m.total / 80)} sesiones</td>
                  <td style={{ padding: "12px 14px", fontSize: "14px", color: "#34d399", fontWeight: 500 }}>{m.paid}€</td>
                  <td style={{ padding: "12px 14px", fontSize: "14px", color: m.pending > 0 ? "#f59e0b" : "#555", fontWeight: 500 }}>{m.pending > 0 ? `${m.pending}€` : "—"}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ flex: 1, height: "4px", background: "#1e2130", borderRadius: "2px" }}>
                        <div style={{ height: "100%", width: `${rate}%`, background: rate === 100 ? "#34d399" : rate > 70 ? "#f59e0b" : "#f87171", borderRadius: "2px" }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "#8891aa", width: "36px" }}>{rate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// APP
// ============================================================
export default function App() {
  const [section, setSection] = useState("dashboard");
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "patients", label: "Pacientes", icon: "patients" },
    { id: "agenda", label: "Agenda", icon: "calendar" },
    { id: "invoices", label: "Facturación", icon: "invoice" },
    { id: "finances", label: "Finanzas", icon: "finance" },
  ];

  const FONT = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
        body { margin: 0; background: #070810; }
        input, select, textarea { color-scheme: dark; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 2px; }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "#070810" }}>
        {/* SIDEBAR */}
        <div style={{ width: "220px", background: "#0a0c16", borderRight: "1px solid #1a1d2e", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid #1a1d2e" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#f0f0f5", fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}>PsicoConsulta</div>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>Gestión de consulta</div>
          </div>
          <nav style={{ padding: "16px 12px", flex: 1 }}>
            {nav.map(n => (
              <button key={n.id} onClick={() => setSection(n.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: "none",
                background: section === n.id ? "#1a1d2e" : "transparent",
                color: section === n.id ? "#a78bfa" : "#5a6070", cursor: "pointer", fontSize: "13px", fontWeight: 500,
                fontFamily: "inherit", marginBottom: "2px", transition: "all 0.15s",
              }}>
                <Icon name={n.icon} size={17} />
                {n.label}
                {section === n.id && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "#7c6af0" }} />}
              </button>
            ))}
          </nav>
          <div style={{ padding: "16px 24px", borderTop: "1px solid #1a1d2e" }}>
            <div style={{ fontSize: "12px", color: "#555" }}>Dr/a. Psicóloga</div>
            <div style={{ fontSize: "11px", color: "#3a3d4a", marginTop: "2px" }}>Col. Nº 12345</div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, overflowY: "auto", padding: "40px" }}>
          {section === "dashboard" && <Dashboard patients={patients} invoices={invoices} appointments={appointments} />}
          {section === "patients" && <Patients patients={patients} setPatients={setPatients} />}
          {section === "agenda" && <Agenda appointments={appointments} setAppointments={setAppointments} patients={patients} />}
          {section === "invoices" && <Invoices invoices={invoices} setInvoices={setInvoices} patients={patients} />}
          {section === "finances" && <Finances invoices={invoices} />}
        </div>
      </div>
    </>
  );
}
