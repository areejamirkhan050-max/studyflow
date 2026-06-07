import { useState, useEffect } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Urdu", "Computer", "Islamiat", "Pakistan Studies", "Other"];
const COLORS = ["#f97316", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)); }, [key, val]);
  return [val, setVal];
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage("sf_tasks", []);
  const [sessions, setSessions] = useLocalStorage("sf_sessions", []);
  const [goals, setGoals] = useLocalStorage("sf_goals", []);
  const [tab, setTab] = useState("dashboard");
  const [tSubject, setTSubject] = useState(SUBJECTS[0]);
  const [tTitle, setTTitle] = useState("");
  const [tDue, setTDue] = useState("");
  const [tPriority, setTPriority] = useState("medium");
  const [sSubject, setSSubject] = useState(SUBJECTS[0]);
  const [sDay, setSDay] = useState(DAYS[0]);
  const [sStart, setSStart] = useState("09:00");
  const [sEnd, setSEnd] = useState("10:00");
  const [gTitle, setGTitle] = useState("");
  const [gTarget, setGTarget] = useState(30);
  const [gColor, setGColor] = useState(COLORS[0]);
  const [timerMin, setTimerMin] = useState(25);
  const [timerSec, setTimerSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("focus");

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerSec(s => {
        if (s > 0) return s - 1;
        setTimerMin(m => {
          if (m > 0) return m - 1;
          setTimerRunning(false);
          return timerMode === "focus" ? 5 : 25;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerMode]);

  const resetTimer = (mode) => {
    setTimerRunning(false);
    setTimerMode(mode);
    setTimerMin(mode === "focus" ? 25 : 5);
    setTimerSec(0);
  };

  const addTask = () => {
    if (!tTitle.trim()) return;
    setTasks(p => [...p, { id: Date.now(), subject: tSubject, title: tTitle, due: tDue, priority: tPriority, done: false }]);
    setTTitle(""); setTDue("");
  };

  const addSession = () => {
    setSessions(p => [...p, { id: Date.now(), subject: sSubject, day: sDay, start: sStart, end: sEnd }]);
  };

  const addGoal = () => {
    if (!gTitle.trim()) return;
    setGoals(p => [...p, { id: Date.now(), title: gTitle, target: gTarget, done: 0, color: gColor }]);
    setGTitle("");
  };

  const doneTasks = tasks.filter(t => t.done).length;
  const pendingTasks = tasks.filter(t => !t.done);
  const totalStudyHours = sessions.reduce((acc, s) => {
    const [sh, sm] = s.start.split(":").map(Number);
    const [eh, em] = s.end.split(":").map(Number);
    return acc + Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
  }, 0);

  const subjectColors = {};
  SUBJECTS.forEach((s, i) => subjectColors[s] = COLORS[i % COLORS.length]);

  const card = (style = {}) => ({ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px", ...style });
  const btn = (bg = "#6366f1", extra = {}) => ({ background: bg, border: "none", borderRadius: 9, color: "white", padding: "9px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600, ...extra });
  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "tasks", label: "📝 Tasks" },
    { id: "timetable", label: "🗓 Timetable" },
    { id: "goals", label: "🎯 Goals" },
    { id: "timer", label: "⏱ Timer" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f1a", color: "white", fontFamily: "sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e2e8f0; padding: 8px 12px; font-size: 13px; outline: none; width: 100%; }
        select option { background: #1e2235; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 4px; }
      `}</style>

      <header style={{ background: "rgba(99,102,241,0.06)", borderBottom: "1px solid rgba(99,102,241,0.15)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📚</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#a5b4fc" }}>StudyFlow</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Smart Study Planner</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Done</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#10b981" }}>{doneTasks}/{tasks.length}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Hrs/Week</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b" }}>{totalStudyHours.toFixed(1)}h</div>
          </div>
        </div>
      </header>

      <nav style={{ display: "flex", gap: 4, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ ...btn(tab === t.id ? "rgba(99,102,241,0.25)" : "transparent", { border: tab === t.id ? "1px solid rgba(99,102,241,0.5)" : "1px solid transparent", color: tab === t.id ? "#a5b4fc" : "rgba(255,255,255,0.45)", whiteSpace: "nowrap", padding: "7px 14px" }) }}>{t.label}</button>
        ))}
      </nav>

      <div style={{ padding: "20px 16px", maxWidth: 1000, margin: "0 auto" }}>

        {tab === "dashboard" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
              {[
                { label: "Total Tasks", value: tasks.length, color: "#6366f1", icon: "📝" },
                { label: "Completed", value: doneTasks, color: "#10b981", icon: "✅" },
                { label: "Pending", value: pendingTasks.length, color: "#f59e0b", icon: "⏳" },
                { label: "Study Hrs/Wk", value: totalStudyHours.toFixed(1) + "h", color: "#3b82f6", icon: "⏱" },
                { label: "Goals Set", value: goals.length, color: "#8b5cf6", icon: "🎯" },
              ].map(s => (
                <div key={s.label} style={{ ...card(), animation: "fadeIn 0.3s ease" }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={card()}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc", marginBottom: 14 }}>📋 Upcoming Tasks</div>
              {pendingTasks.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No pending tasks 🎉</div>
              ) : pendingTasks.slice(0, 5).map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.priority === "high" ? "#ef4444" : t.priority === "medium" ? "#f59e0b" : "#10b981", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{t.subject} {t.due && `• Due: ${t.due}`}</div>
                  </div>
                  <button onClick={() => setTasks(p => p.map(x => x.id === t.id ? { ...x, done: true } : x))} style={{ ...btn("#10b981", { padding: "4px 10px", fontSize: 11 }) }}>Done ✓</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "tasks" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={card()}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc", marginBottom: 14 }}>➕ Add Task</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <select value={tSubject} onChange={e => setTSubject(e.target.value)}>{SUBJECTS.map(s => <option key={s}>{s}</option>)}</select>
                <select value={tPriority} onChange={e => setTPriority(e.target.value)}>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <input placeholder="Task title..." value={tTitle} onChange={e => setTTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} />
                <input type="date" value={tDue} onChange={e => setTDue(e.target.value)} />
              </div>
              <button onClick={addTask} style={{ ...btn(), width: "100%" }}>Add Task</button>
            </div>
            {tasks.map(t => (
              <div key={t.id} style={{ ...card({ padding: "12px 16px" }), display: "flex", alignItems: "center", gap: 10, opacity: t.done ? 0.5 : 1 }}>
                <input type="checkbox" checked={t.done} onChange={() => setTasks(p => p.map(x => x.id === t.id ? { ...x, done: !x.done } : x))} style={{ width: 16, height: 16, accentColor: "#6366f1", cursor: "pointer" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.priority === "high" ? "#ef4444" : t.priority === "medium" ? "#f59e0b" : "#10b981", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{t.subject} {t.due && `• ${t.due}`}</div>
                </div>
                <button onClick={() => setTasks(p => p.filter(x => x.id !== t.id))} style={{ background: "transparent", border: "none", color: "rgba(255,80,80,0.6)", cursor: "pointer", fontSize: 18 }}>✕</button>
              </div>
            ))}
          </div>
        )}

        {tab === "timetable" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={card()}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc", marginBottom: 14 }}>➕ Add Session</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <select value={sSubject} onChange={e => setSSubject(e.target.value)}>{SUBJECTS.map(s => <option key={s}>{s}</option>)}</select>
                <select value={sDay} onChange={e => setSDay(e.target.value)}>{DAYS.map(d => <option key={d}>{d}</option>)}</select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Start</label><input type="time" value={sStart} onChange={e => setSStart(e.target.value)} /></div>
                <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>End</label><input type="time" value={sEnd} onChange={e => setSEnd(e.target.value)} /></div>
              </div>
              <button onClick={addSession} style={{ ...btn(), width: "100%" }}>Add Session</button>
            </div>
            <div style={card()}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc", marginBottom: 14 }}>📅 Weekly Timetable</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                {DAYS.map(day => {
                  const ds = sessions.filter(s => s.day === day);
                  return (
                    <div key={day}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#a5b4fc", textAlign: "center", marginBottom: 6, padding: "4px", background: "rgba(99,102,241,0.1)", borderRadius: 6 }}>{day}</div>
                      {ds.length === 0 && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>—</div>}
                      {ds.map(s => (
                        <div key={s.id} onClick={() => setSessions(p => p.filter(x => x.id !== s.id))} style={{ background: subjectColors[s.subject] + "22", border: `1px solid ${subjectColors[s.subject]}44`, borderRadius: 6, padding: "4px 5px", marginBottom: 4, cursor: "pointer" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: subjectColors[s.subject] }}>{s.subject.slice(0, 3)}</div>
                          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>{s.start}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "goals" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={card()}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc", marginBottom: 14 }}>➕ New Goal</div>
              <input placeholder="Goal title..." value={gTitle} onChange={e => setGTitle(e.target.value)} style={{ marginBottom: 10 }} />
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Target: {gTarget} days</label>
                <input type="range" min={1} max={90} value={gTarget} onChange={e => setGTarget(+e.target.value)} style={{ accentColor: "#6366f1", width: "100%", marginTop: 6, background: "transparent", border: "none", padding: 0 }} />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {COLORS.map(c => <div key={c} onClick={() => setGColor(c)} style={{ width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer", border: gColor === c ? "2px solid white" : "2px solid transparent" }} />)}
              </div>
              <button onClick={addGoal} style={{ ...btn(), width: "100%" }}>Add Goal</button>
            </div>
            {goals.map(g => (
              <div key={g.id} style={card()}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{g.title}</div>
                  <button onClick={() => setGoals(p => p.filter(x => x.id !== g.id))} style={{ background: "transparent", border: "none", color: "rgba(255,80,80,0.6)", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (g.done / g.target) * 100)}%`, background: g.color, borderRadius: 99 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: g.color, fontWeight: 700 }}>{g.done}/{g.target} days ({Math.round((g.done / g.target) * 100)}%)</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setGoals(p => p.map(x => x.id === g.id ? { ...x, done: Math.max(0, x.done - 1) } : x))} style={btn("rgba(255,255,255,0.08)", { padding: "5px 12px" })}>−</button>
                    <button onClick={() => setGoals(p => p.map(x => x.id === g.id ? { ...x, done: Math.min(x.target, x.done + 1) } : x))} style={btn(g.color, { padding: "5px 12px" })}>+ Day</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "timer" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, paddingTop: 20 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>🍅 25 min focus • 5 min break</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["focus", "break"].map(m => (
                <button key={m} onClick={() => resetTimer(m)} style={btn(timerMode === m ? (m === "focus" ? "#6366f1" : "#10b981") : "rgba(255,255,255,0.07)", { padding: "8px 20px" })}>
                  {m === "focus" ? "🎯 Focus" : "☕ Break"}
                </button>
              ))}
            </div>
            <div style={{ position: "relative", width: 200, height: 200 }}>
              <svg width="200" height="200" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="100" cy="100" r="90" fill="none" stroke={timerMode === "focus" ? "#6366f1" : "#10b981"} strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={2 * Math.PI * 90 * (1 - (timerMin * 60 + timerSec) / (timerMode === "focus" ? 1500 : 300))}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 48, fontWeight: 700, fontFamily: "monospace", color: timerMode === "focus" ? "#a5b4fc" : "#6ee7b7" }}>
                  {String(timerMin).padStart(2, "0")}:{String(timerSec).padStart(2, "0")}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{timerMode === "focus" ? "Focus Session" : "Break Time"}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setTimerRunning(r => !r)} style={btn(timerRunning ? "#ef4444" : (timerMode === "focus" ? "#6366f1" : "#10b981"), { padding: "11px 30px", fontSize: 15 })}>
                {timerRunning ? "⏸ Pause" : "▶ Start"}
              </button>
              <button onClick={() => resetTimer(timerMode)} style={btn("rgba(255,255,255,0.07)", { padding: "11px 18px", border: "1px solid rgba(255,255,255,0.1)" })}>↺ Reset</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}