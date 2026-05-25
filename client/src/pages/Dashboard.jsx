import { useState, useEffect } from "react";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [questName, setQuestName] = useState("");
  const [category, setCategory] = useState("Studies");
  const [colorTag, setColorTag] = useState("#3B82F6");

  // Core stats managed cleanly
  const [totalXp, setTotalXp] = useState(0); 
  const [level, setLevel] = useState(1);       
  const [loading, setLoading] = useState(true);

  // 🚀 MOTIVATIONAL QUEST STRINGS STATE ARRAY
  const [activeQuote, setActiveQuote] = useState("");
  const MOTIVATIONAL_QUOTES = [
    "Consistency beats talent! Keep pushing.",
    "Level Up in life requires daily grind. Outstanding work!",
    "Another pipeline successfully executed. You are unstoppable!",
    "Quest secured! Your future self is thanking you right now.",
    "Stay focused, stay disciplined. Success is inevitable!",
    "Small wins compound into monumental achievements. Keep it up!"
  ];

  const LEVEL_THRESHOLDS = {
    1: 250, 2: 250, 3: 250, 4: 250, 5: 250, 6: 250, 7: 250
  };

  const categoryIcons = {
    Studies: "📚", Programming: "💻", Gym: "💪", Health: "🍏", Lifestyle: "🔥", Finance: "💰"
  };

  const fetchDashboardInitialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      const profileRes = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (profileRes.ok) {
        const userData = await profileRes.json();
        // Strict mapping context ensuring parse stability upon refresh
        const persistentXp = userData.totalXp !== undefined && userData.totalXp !== null ? Number(userData.totalXp) : 0;
        setTotalXp(persistentXp);
        setLevel(Number(userData.level) || 1);
      }

      const habitsRes = await fetch("http://localhost:5000/api/habits", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (habitsRes.ok) {
        const habitsData = await habitsRes.json();
        setHabits(habitsData);
      }
    } catch (err) {
      console.error("Initialization sync layer failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchDashboardInitialData();
    })();
  }, []);

  const handleInfectQuestMatrix = async (e) => {
    e.preventDefault();
    if (!questName.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/habits", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: questName,
          category: category,
          colorTag: colorTag,
          icon: categoryIcons[category] || "🎯"
        })
      });

      if (res.ok) {
        const freshQuest = await res.json();
        setHabits([...habits, freshQuest]);
        setQuestName("");
      }
    } catch (err) {
      console.error("Failed to inject target quest structure:", err);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:5000/api/habits/${id}/complete`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        
        // Instant state mutation handling
        if(data.totalXp !== undefined) {
          setTotalXp(Number(data.totalXp));
          setLevel(Number(data.level) || 1);
        } else {
          setTotalXp(prev => prev + 25);
        }

        setHabits(habits.map(h => h._id === id ? { ...h, isCompletedToday: true, currentStreak: (h.currentStreak || 0) + 1 } : h));

        // 🚀 DYNAMIC MOTIVATIONAL POPUP INJECTION
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
        setActiveQuote(MOTIVATIONAL_QUOTES[randomIndex]);
        
        // Auto dismiss popup after 4 seconds
        setTimeout(() => {
          setActiveQuote("");
        }, 4000);
      }
    } catch (err) {
      console.error("Runtime trigger synchronization error:", err);
    }
  };

  const handleDeleteQuest = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setHabits(habits.filter(h => h._id !== id));
      }
    } catch (err) {
      console.error("Deletion routine interrupted:", err);
    }
  };

  const maxXpForCurrentLevel = LEVEL_THRESHOLDS[level] || 250;
  const progressPercentage = totalXp > 0 ? Math.min((totalXp / maxXpForCurrentLevel) * 100, 100) : 0;

  const totalQuests = habits.length;
  const completedQuests = habits.filter(h => h.isCompletedToday).length;
  const metricsSuccessRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0B0F17", color: "#3B82F6", fontSize: "1.2rem", fontWeight: "bold" }}>
        Loading HabitForge Matrix Engine...
      </div>
    );
  }

  return (
    <div style={styles.dashboardContainer}>
      {/* SIDEBAR PANEL */}
      <aside style={styles.sidebar}>
        <div style={styles.brandContainer}>
          <span style={{ fontSize: "1.5rem" }}>🔥</span>
          <h2 style={styles.brandText}>HabitForge</h2>
        </div>
        <nav style={styles.navStack}>
          <button style={styles.activeNavBtn}>📊 Dashboard Matrix</button>
          <button style={styles.navBtn}>🎯 Quest Vault</button>
          <button style={styles.navBtn}>🏆 Achievements</button>
          <button style={styles.navBtn}>⚙️ Core Settings</button>
        </nav>
      </aside>

      {/* MAIN CONTAINER STREAM */}
      <main style={styles.mainContent}>
        
        {/* 🚀 MOTIVATIONAL QUEST ALERTS NODE */}
        {activeQuote && (
          <div style={styles.motivationToast}>
            <span style={{ marginRight: "12px", fontSize: "1.3rem" }}>⚡</span>
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", tracking: "0.1em", opacity: 0.8 }}>Quest Motivational Boost</div>
              <div style={{ fontSize: "1rem", fontWeight: "bold", marginTop: "2px" }}>{activeQuote}</div>
            </div>
          </div>
        )}

        <header style={styles.heroHeaderCard}>
          <div style={styles.heroRow}>
            <div>
              <h2 style={styles.welcomeTitle}>⚡ Welcome, User!</h2>
              <p style={styles.rankTierText}>Rank Tier: <span style={{ color: "#38BDF8", fontWeight: "bold" }}>Premium Pro Active</span></p>
            </div>
            <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); window.location.reload(); }}>
              LOGOUT
            </button>
          </div>

          <div style={styles.xpStatusRow}>
            <span style={styles.levelIndicator}>LEVEL {level}</span>
            <div style={styles.trackBarOuter}>
              <div style={{ 
                ...styles.trackBarInner, 
                width: `${progressPercentage}%`, 
                background: "linear-gradient(90deg, #3B82F6 0%, #10B981 100%)",
                boxShadow: progressPercentage > 0 ? "0 0 12px rgba(16, 185, 129, 0.6)" : "none"
              }}></div>
            </div>
            <span style={styles.xpTextCounter}>{totalXp} / {maxXpForCurrentLevel} XP</span>
          </div>
        </header>

        {/* METRICS ROW OVERVIEW */}
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ ...styles.heroHeaderCard, flex: 1, marginBottom: 0 }}>
            <h4 style={{ ...styles.sectionHeading, color: "#94A3B8" }}>📊 SUCCESS RATE</h4>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "120px", fontSize: "2rem", fontWeight: "bold", color: "#10B981" }}>
              {metricsSuccessRate}%
            </div>
          </div>
          <div style={{ ...styles.heroHeaderCard, flex: 2, marginBottom: 0 }}>
            <h4 style={{ ...styles.sectionHeading, color: "#94A3B8" }}>📈 MATRIX BREAKDOWN</h4>
            <div style={{ height: "120px", borderBottom: "1px solid #334155", position: "relative", display: "flex", alignItems: "flex-end", paddingBottom: "10px", gap: "20px" }}>
              <div style={{ width: "40px", height: `${metricsSuccessRate}%`, maxHeight: "100px", background: "#3B82F6", borderRadius: "4px 4px 0 0", transition: "height 0.4s ease" }}></div>
            </div>
          </div>
        </div>

        {/* CREATION MODULE */}
        <section style={styles.creationControlCard}>
          <h3 style={styles.sectionHeading}>＋ CRAFT A NEW DAILY QUEST</h3>
          <form onSubmit={handleInfectQuestMatrix} style={styles.inlineForm}>
            <input 
              type="text" 
              placeholder="Type your daily quest objective..."
              value={questName}
              onChange={(e) => setQuestName(e.target.value)}
              style={styles.textInput}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.selectDropdown}>
              <option value="Studies">📚 Studies</option>
              <option value="Programming">💻 Programming</option>
              <option value="Gym">💪 Gym</option>
              <option value="Health">🍏 Health</option>
              <option value="Lifestyle">🔥 Lifestyle</option>
              <option value="Finance">💰 Finance</option>
            </select>
            <input type="color" value={colorTag} onChange={(e) => setColorTag(e.target.value)} style={styles.colorPickerInline} />
            <button type="submit" style={styles.submitButton}>Inject Quest Matrix</button>
          </form>
        </section>

        {/* QUEST PIPELINE RENDER NODE */}
        <section style={{ marginTop: "2.5rem" }}>
          <h3 style={styles.sectionHeading}>🔥 ACTIVE QUEST PIPELINES</h3>
          <div style={styles.gridContainer}>
            {habits.map((item) => (
              <div key={item._id} style={{ ...styles.habitCardNode, borderLeft: `6px solid ${item.colorTag || "#3B82F6"}` }}>
                <button onClick={() => handleDeleteQuest(item._id)} style={styles.deleteTopBtn}>🗑️</button>
                <div style={styles.iconWrapper}>{item.icon || "🎯"}</div>
                <h4 style={styles.habitNodeTitle}>{item.name}</h4>
                <p style={styles.streakStatusSub}>Streak: <strong style={{ color: "#FFF" }}>{item.currentStreak || 0} days</strong></p>
                <button 
                  onClick={() => handleToggleComplete(item._id)} 
                  disabled={item.isCompletedToday}
                  style={item.isCompletedToday ? styles.doneBtnNode : styles.actionBtnNode}
                >
                  {item.isCompletedToday ? "✓ Completed Today" : "Complete Quest"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  dashboardContainer: { display: "flex", minHeight: "100vh", background: "#0B0F17", color: "#F8FAFC", fontFamily: "sans-serif" },
  sidebar: { width: "260px", background: "#0F172A", borderRight: "1px solid #1E293B", padding: "1.5rem" },
  brandContainer: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "2.5rem" },
  brandText: { fontSize: "1.4rem", fontWeight: "bold", color: "#3B82F6", margin: 0 },
  navStack: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  activeNavBtn: { width: "100%", background: "#2563EB", border: "none", color: "#FFF", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "bold" },
  navBtn: { width: "100%", background: "transparent", border: "none", color: "#64748B", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500" },
  mainContent: { flex: 1, padding: "2rem", overflowY: "auto", background: "#0B1329", position: "relative" },
  
  // 🚀 MOTIVATIONAL FLOATING CORNER SYSTEMS STYLING
  motivationToast: { 
    position: "fixed", top: "24px", right: "24px", background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", 
    color: "#FFF", padding: "14px 24px", borderRadius: "12px", boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)", 
    zIndex: 99999, display: "flex", alignItems: "center", border: "1px solid #34D399",
    animation: "fadeIn 0.3s ease"
  },

  heroHeaderCard: { background: "#111C44", borderRadius: "14px", padding: "1.5rem", border: "1px solid #1E293B", marginBottom: "2rem" },
  heroRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  welcomeTitle: { fontSize: "1.8rem", fontWeight: "bold", margin: 0 },
  rankTierText: { color: "#94A3B8", fontSize: "0.9rem", marginTop: "4px", marginBottom: 0 },
  logoutBtn: { background: "#2563EB", color: "#FFF", border: "none", padding: "8px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" },
  xpStatusRow: { display: "flex", alignItems: "center", gap: "15px", marginTop: "1.5rem", width: "100%" },
  levelIndicator: { fontWeight: "bold", fontSize: "0.9rem", color: "#E2E8F0" },
  trackBarOuter: { flex: 1, height: "10px", background: "#0B0F17", borderRadius: "5px", overflow: "hidden", border: "1px solid #1E293B" },
  trackBarInner: { height: "100%", transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)" },
  xpTextCounter: { fontSize: "0.9rem", color: "#94A3B8", fontWeight: "bold" },
  creationControlCard: { background: "#111C44", borderRadius: "14px", padding: "1.5rem", border: "1px solid #1E293B" },
  sectionHeading: { fontSize: "0.9rem", color: "#94A3B8", marginTop: 0, marginBottom: "1rem", fontWeight: "bold", letterSpacing: "0.05em" },
  inlineForm: { display: "flex", gap: "12px", alignItems: "center" },
  textInput: { flex: 1, background: "#0B1329", border: "1px solid #1E293B", padding: "12px 16px", borderRadius: "8px", color: "#FFF", outline: "none" },
  selectDropdown: { background: "#0B1329", border: "1px solid #1E293B", padding: "12px 16px", borderRadius: "8px", color: "#FFF", cursor: "pointer", outline: "none" },
  colorPickerInline: { width: "45px", height: "40px", border: "none", background: "transparent", cursor: "pointer" },
  submitButton: { background: "#2563EB", color: "#FFF", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem", marginTop: "1rem" },
  habitCardNode: { position: "relative", background: "#111C44", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "flex-start", border: "1px solid #1E293B" },
  deleteTopBtn: { position: "absolute", top: "12px", right: "12px", background: "transparent", border: "none", cursor: "pointer", fontSize: "1rem" },
  iconWrapper: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  habitNodeTitle: { margin: "0 0 4px 0", fontSize: "1.2rem", fontWeight: "bold", color: "#FFF" },
  streakStatusSub: { margin: "0 0 1.25rem 0", fontSize: "0.9rem", color: "#94A3B8" },
  actionBtnNode: { width: "100%", background: "#2563EB", color: "#FFF", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
  doneBtnNode: { width: "100%", background: "#0B1329", color: "#64748B", border: "1px solid #1E293B", padding: "10px", borderRadius: "8px", cursor: "not-allowed" }
};