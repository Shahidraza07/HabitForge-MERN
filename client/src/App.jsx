import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

// --- LEVEL UP THRESHOLDS CONSTANTS ---
const LEVEL_THRESHOLDS = {
    1: 250,  
    2: 250,  
    3: 250,  
    4: 250, 
    5: 250,
    6: 250,
    7: 250
};

// --- MOTIVATIONAL QUOTES ARCHIVE FOR COMPLETED QUESTS ---
const MOTIVATIONAL_QUOTES = [
    "Consistency beats talent! Keep pushing.",
    "Code. Deploy. Conquer. Loop executed successfully.",
    "One step closer to mastering the matrix.",
    "Build the habit, and the habit will build you.",
    "Discipline is choosing between what you want now and what you want most.",
    "Excellent execution! Legacy system upgraded.",
    "Velocity maintained. Stay hungry, stay focused."
];

function App() {
    // --- STABLE AUTHENTICATION GATE STATE LAYER ---
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("habitForge_isLoggedIn") === "true";
    }); 
    const [authMode, setAuthMode] = useState('login'); 
    const [authFormData, setAuthFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [authError, setAuthError] = useState('');
    const [authSuccessMsg, setAuthSuccessMsg] = useState('');

    // --- SECURE LIFECYCLE SEED: SINGLE ROOT ATOMIC INIT ---
    useEffect(() => {
        if (!localStorage.getItem("habitForge_savedEmail")) {
            localStorage.setItem("habitForge_savedEmail", "xyz@gmail.com");
        }
        if (!localStorage.getItem("habitForge_savedPassword")) {
            localStorage.setItem("habitForge_savedPassword", "123456"); 
        }
        if (!localStorage.getItem("habitForge_savedUsername")) {
            localStorage.setItem("habitForge_savedUsername", "xyz");
        }
        if (!localStorage.getItem("habitForge_currentXP")) {
            localStorage.setItem("habitForge_currentXP", "0");
        }
        if (!localStorage.getItem("habitForge_level")) {
            localStorage.setItem("habitForge_level", "1");
        }
    }, []);

    // --- CORE GLOBAL APPLICATION CORE HABITS STATE ---
    const [habits, setHabits] = useState(() => {
        const savedHabits = localStorage.getItem("habitForge_habits_list");
        return savedHabits ? JSON.parse(savedHabits) : [
            { _id: "1", name: "Read Documentation", currentStreak: 3, category: "Coding & Projects", colorTag: "#8b5cf6", icon: "💻", isCompletedToday: true, lastCompletedDate: new Date().toDateString(), earnedQuote: "Code. Deploy. Conquer. Loop executed successfully." }
        ];
    });

    useEffect(() => {
        localStorage.setItem("habitForge_habits_list", JSON.stringify(habits));
    }, [habits]);

    const [habitName, setHabitName] = useState('');
    const [category, setCategory] = useState('Studies');
    const [colorTag, setColorTag] = useState('#3b82f6');
    const [activeTab, setActiveTab] = useState('dashboard'); 

    // --- PERSISTENT FIXED USER PROFILE COMPONENT METRICS ---
    const [userProfile, setUserProfile] = useState({
        username: localStorage.getItem("habitForge_savedUsername") || "xyz",
        email: localStorage.getItem("habitForge_savedEmail") || "xyz@gmail.com",
        level: parseInt(localStorage.getItem("habitForge_level")) || 1,
        currentXP: parseInt(localStorage.getItem("habitForge_currentXP")) || 0, 
        rankTier: "Premium Pro Active"
    });

    // Explicit Tab Switching State Lock Injection
    useEffect(() => {
        if (isLoggedIn) {
            setUserProfile(prev => ({
                ...prev,
                username: localStorage.getItem("habitForge_savedUsername") || "xyz",
                email: localStorage.getItem("habitForge_savedEmail") || "xyz@gmail.com",
                level: parseInt(localStorage.getItem("habitForge_level")) || prev.level,
                currentXP: parseInt(localStorage.getItem("habitForge_currentXP")) || prev.currentXP
            }));
        }
    }, [isLoggedIn, activeTab]);

    // --- ISOLATED PRE-CONFIGURED SUB-FORM STRUCTS ---
    const [settingsForm, setSettingsForm] = useState({
        username: localStorage.getItem("habitForge_savedUsername") || "xyz",
        email: localStorage.getItem("habitForge_savedEmail") || "xyz@gmail.com",
        syncInterval: localStorage.getItem("habitForge_syncInterval") || '6h',
        cloudBackup: true,
        notificationAlerts: true
    });

    const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '' });
    const [settingsFeedback, setSettingsFeedback] = useState('');
    const [securityFeedback, setSecurityFeedback] = useState('');

    useEffect(() => {
        if (activeTab === 'settings') {
            setSettingsForm({
                username: localStorage.getItem("habitForge_savedUsername") || "xyz",
                email: localStorage.getItem("habitForge_savedEmail") || "xyz@gmail.com",
                syncInterval: localStorage.getItem("habitForge_syncInterval") || '6h',
                cloudBackup: true,
                notificationAlerts: true
            });
            setSecurityForm({ currentPassword: '', newPassword: '' });
            setSettingsFeedback('');
            setSecurityFeedback('');
        }
    }, [activeTab]);

    // Dynamic Live UI Core Clock State
    const [timeToReset, setTimeToReset] = useState('--h --m --s');

    // --- AUTHENTICATION FLOW PROCESSING METHODS ---
    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthSuccessMsg('');

        const savedEmail = (localStorage.getItem("habitForge_savedEmail") || "xyz@gmail.com").trim().toLowerCase();
        const savedPassword = localStorage.getItem("habitForge_savedPassword") || "123456";

        const currentInputtedEmail = (authFormData.email || '').trim().toLowerCase();
        const currentInputtedPassword = authFormData.password;

        if (!currentInputtedEmail || !currentInputtedPassword) {
            setAuthError('Please populate all credential input fields.');
            return;
        }

        if (authMode === 'register') {
            if (!authFormData.username) {
                setAuthError('Username lookup index is required.');
                return;
            }
            if (currentInputtedPassword !== authFormData.confirmPassword) {
                setAuthError('Security cipher verification fields do not match.');
                return;
            }
            
            localStorage.setItem("habitForge_savedUsername", authFormData.username.trim());
            localStorage.setItem("habitForge_savedEmail", currentInputtedEmail);
            localStorage.setItem("habitForge_savedPassword", currentInputtedPassword);
            localStorage.setItem("habitForge_currentXP", "0");
            localStorage.setItem("habitForge_level", "1");

            setAuthSuccessMsg('Account registered successfully! Redirecting to login verification gate...');
            setTimeout(() => {
                setAuthMode('login');
                setAuthSuccessMsg('');
                setAuthFormData({ username: '', email: '', password: '', confirmPassword: '' });
            }, 1200);
        } else {
            if (currentInputtedEmail === savedEmail && currentInputtedPassword === savedPassword) {
                localStorage.setItem("habitForge_isLoggedIn", "true");
                setIsLoggedIn(true);
            } else {
                setAuthError('Access Authorization Failed. Invalid Email or Cipher Passcode Node!');
            }
        }
    };

    const handleUserLogout = () => {
        localStorage.setItem("habitForge_isLoggedIn", "false");
        setIsLoggedIn(false);
        setAuthError('');
        setAuthSuccessMsg('');
        setAuthFormData({ username: '', email: '', password: '', confirmPassword: '' });
    };

    // --- DYNAMIC COUNTDOWN SYNC CONTROL SYSTEM ---
    useEffect(() => {
        if (!isLoggedIn) return;

        const updateCountdown = () => {
            let targetTimeStr = localStorage.getItem("habitForge_targetTime");
            let savedInterval = localStorage.getItem("habitForge_syncInterval") || '6h';
            let intervalHours = parseInt(savedInterval) || 6;
            
            const currentTime = Date.now();
            let targetTime = targetTimeStr ? parseInt(targetTimeStr) : null;

            if (!targetTime) {
                targetTime = currentTime + (intervalHours * 60 * 60 * 1000);
                localStorage.setItem("habitForge_targetTime", targetTime);
            }

            let timeRemaining = targetTime - currentTime;

            if (timeRemaining <= 0) {
                targetTime = Date.now() + (intervalHours * 60 * 60 * 1000);
                localStorage.setItem("habitForge_targetTime", targetTime);
                timeRemaining = targetTime - Date.now();
                
                // Optional: Auto-reset local habits visibility flags if countdown hits 0
                setHabits(prev => prev.map(h => ({ ...h, isCompletedToday: false, earnedQuote: "" })));
            }

            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            setTimeToReset(`${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [isLoggedIn, settingsForm.syncInterval]);

    // --- SAFE PROFILE SUBMISSION TRIGGER ---
    const handleSaveGeneralSettings = (e) => {
        e.preventDefault();
        setSettingsFeedback('');
        
        const cleanUsername = settingsForm.username.trim();
        const cleanEmail = settingsForm.email.trim().toLowerCase();
        const preservedCurrentPassword = localStorage.getItem("habitForge_savedPassword") || "123456";

        localStorage.setItem("habitForge_savedUsername", cleanUsername);
        localStorage.setItem("habitForge_savedEmail", cleanEmail);
        localStorage.setItem("habitForge_savedPassword", preservedCurrentPassword); 
        localStorage.setItem("habitForge_syncInterval", settingsForm.syncInterval);

        const hours = parseInt(settingsForm.syncInterval) || 6;
        localStorage.setItem("habitForge_targetTime", Date.now() + (hours * 60 * 60 * 1000));

        setUserProfile(prev => ({ ...prev, username: cleanUsername, email: cleanEmail }));
        setSettingsFeedback(`✓ Identity Link configuration saved successfully.`);
        setTimeout(() => setSettingsFeedback(''), 4000);
    };

    // --- INDEPENDENT SECURE PASSCODE CIPHER CONTROL OVERWRITE ---
    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setSecurityFeedback('');

        const currentSavedPassword = localStorage.getItem("habitForge_savedPassword") || "123456";

        if (!securityForm.currentPassword || !securityForm.newPassword) {
            setSecurityFeedback("❌ Configuration Error: All cipher nodes must be completely field populated.");
            return;
        }

        if (securityForm.currentPassword !== currentSavedPassword) {
            setSecurityFeedback("❌ Verification Failed: Current Password validation failed.");
            return;
        }

        localStorage.setItem("habitForge_savedPassword", securityForm.newPassword);
        setSecurityFeedback("✓ Security Matrix Updated! New secure cipher committed successfully.");
        setSecurityForm({ currentPassword: '', newPassword: '' });
        setTimeout(() => setSecurityFeedback(''), 4000);
    };

    // --- EXPANDED COLOR & HABITS POOL CONFIGURATION ---
    const categoryColors = {
        'Studies': '#3b82f6',       
        'Gym & Fitness': '#10b981',           
        'Coding & Projects': '#8b5cf6',
        'Health & Diet': '#ec4899',
        'Book Reading': '#f59e0b',
        'Meditation & Mindfulness': '#06b6d4',
        'Sleep Discipline': '#6366f1'
    };

    const handleCreateQuest = (e) => {
        e.preventDefault();
        if (!habitName.trim()) return;

        let chosenIcon = '🎯';
        if (category === 'Studies') chosenIcon = '📚';
        if (category === 'Gym & Fitness') chosenIcon = '💪';
        if (category === 'Coding & Projects') chosenIcon = '💻';
        if (category === 'Health & Diet') chosenIcon = '🥦';
        if (category === 'Book Reading') chosenIcon = '📖';
        if (category === 'Meditation & Mindfulness') chosenIcon = '🧘';
        if (category === 'Sleep Discipline') chosenIcon = '🌙';

        const newQuest = {
            _id: "mock_" + Math.random().toString(36).substr(2, 9),
            name: habitName.trim(),
            category: category,
            colorTag: categoryColors[category] || colorTag,
            icon: chosenIcon,
            currentStreak: 0,
            isCompletedToday: false,
            lastCompletedDate: "",
            earnedQuote: ""
        };

        setHabits(prev => [...prev, newQuest]);
        setHabitName('');
    };

    const handleCheckIn = (id) => {
    // 1. Habit ko complete mark karein
    setHabits(prev => prev.map(h => h._id === id ? { ...h, isCompletedToday: true } : h));

    // 2. XP aur Level-up Logic
    setUserProfile(prev => {
        const xpGain = 25; // Jitna XP aap dena chahte hain
        let newXP = prev.currentXP + xpGain;
        let newLevel = prev.level;

        // Man lijiye har level ka threshold 250 hai (aapke screenshot ke hisab se)
        const threshold = 250; 

        if (newXP >= threshold) {
            newLevel += 1;
            newXP = newXP - threshold; // XP ka remainder agle level ke liye
            
            // Pop-up Alert
            alert(`🎉 Congratulations! You leveled up to Level ${newLevel}!`);
        }

        return { ...prev, currentXP: newXP, level: newLevel };
    });
};

    const handleDeleteHabit = (id) => {
        setHabits(prev => prev.filter(h => h._id !== id));
    };

    const totalQuestsCount = habits.length;
    const completedTodayCount = habits.filter(h => h.isCompletedToday).length;
    const completionPercentage = totalQuestsCount > 0 ? Math.round((completedTodayCount / totalQuestsCount) * 100) : 0;

    const categoryVolumeData = Object.keys(categoryColors).map(cat => ({
        name: cat.split(' ')[0], 
        Total: habits.filter(h => h.category === cat).length,
        Done: habits.filter(h => h.category === cat && h.isCompletedToday).length,
        fill: categoryColors[cat]
    })).filter(item => item.Total > 0);

    const radialProgressPayload = [
        { name: 'Remaining', value: Math.max(0, 100 - completionPercentage), fill: '#1f2937' },
        { name: 'Completed', value: completionPercentage, fill: '#10b981' }
    ];

    const prevLevelThreshold = LEVEL_THRESHOLDS[userProfile.level - 1] || 0;
    const currentXpMaxTarget = LEVEL_THRESHOLDS[userProfile.level] || 250;
    const xpEarnedInCurrentRange = userProfile.currentXP - prevLevelThreshold;
    const totalXpRequiredForCurrentRange = currentXpMaxTarget - prevLevelThreshold;
    const currentProgressBarPercentage = Math.min(Math.max((xpEarnedInCurrentRange * 100) / totalXpRequiredForCurrentRange, 0), 100);

    const badgesList = [
        { id: 'b1', title: 'First Blood', desc: 'Successfully create your first daily tracking link.', icon: '⚡', unlocked: totalQuestsCount > 0 },
        { id: 'b2', title: 'Consistent Linker', desc: 'Maintain any target stream streak for 3 consecutive days.', icon: '🔥', unlocked: habits.some(h => h.currentStreak >= 3) },
        { id: 'b3', title: 'Code Warrior', desc: 'Inject and deploy at least one Coding & Projects quest.', icon: '💻', unlocked: habits.some(h => h.category === "Coding & Projects") },
        { id: 'b4', title: 'Gym Beast Core', desc: 'Maintain an active fitness quest node configuration.', icon: '💪', unlocked: habits.some(h => h.category === "Gym & Fitness") },
        { id: 'b5', title: 'Scholar Grid', desc: 'Add a dedicated study sector pipeline.', icon: '📚', unlocked: habits.some(h => h.category === "Studies") },
        { id: 'b6', title: 'Level Up Vanguard', desc: 'Cross over the initialization layer into Level 3+ Matrix.', icon: '👑', unlocked: userProfile.level >= 3 },
        { id: 'b7', title: 'Flawless Execution', desc: 'Achieve 100% complete daily success rate operations.', icon: '🎯', unlocked: completionPercentage === 100 && totalQuestsCount > 0 },
        { id: 'b8', title: 'Overdrive Tracker', desc: 'Load 4 or more tracking operations pipelines concurrently.', icon: '🚀', unlocked: totalQuestsCount >= 4 }
    ];

    if (!isLoggedIn) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19', color: '#ffffff', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
                <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '32px' }}>
                        <div style={{ fontSize: '32px', fontWeight: '900', color: '#3b82f6', letterSpacing: '0.05em' }}>🔥 HabitForge</div>
                        <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secure optimization tracking terminal gateway link</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#030712', padding: '4px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #1f2937' }}>
                        <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccessMsg(''); }} style={{ padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: authMode === 'login' ? '#2563eb' : 'transparent', color: authMode === 'login' ? '#ffffff' : '#9ca3af' }}>Access Authorization</button>
                        <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccessMsg(''); }} style={{ padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: authMode === 'register' ? '#2563eb' : 'transparent', color: authMode === 'register' ? '#ffffff' : '#9ca3af' }}>Forge Core Profile</button>
                    </div>

                    {authError && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>⚠️ {authError}</div>}
                    {authSuccessMsg && <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#34d399', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>✓ {authSuccessMsg}</div>}

                    <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {authMode === 'register' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase' }}>USERNAME IDENTIFIER</label>
                                <input type="text" placeholder="e.g. Shahid" value={authFormData.username} onChange={(e) => setAuthFormData({...authFormData, username: e.target.value})} style={{ backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', padding: '14px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase' }}>EMAIL NETWORK ADDR</label>
                            <input type="email" placeholder="name@network.com" value={authFormData.email} onChange={(e) => setAuthFormData({...authFormData, email: e.target.value})} style={{ backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', padding: '14px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase' }}>CIPHER PASSCODE</label>
                            <input type="password" placeholder="••••••••" value={authFormData.password} onChange={(e) => setAuthFormData({...authFormData, password: e.target.value})} style={{ backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', padding: '14px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
                        </div>

                        {authMode === 'register' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase' }}>CONFIRM CIPHER PASSCODE</label>
                                <input type="password" placeholder="••••••••" value={authFormData.confirmPassword} onChange={(e) => setAuthFormData({...authFormData, confirmPassword: e.target.value})} style={{ backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', padding: '14px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
                            </div>
                        )}

                        <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '8px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>{authMode === 'login' ? 'Establish Secure Connection' : 'Forge Account Matrix'}</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19', color: '#ffffff', fontFamily: 'sans-serif' }}>
            
            {/* SIDEBAR NAVIGATION LAYOUT */}
            <div style={{ width: '260px', backgroundColor: '#111827', borderRight: '1px solid #1f2937', padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px', flexShrink: 0 }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#3b82f6', letterSpacing: '0.05em' }}>🔥 HabitForge</div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <button onClick={() => setActiveTab('dashboard')} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', backgroundColor: activeTab === 'dashboard' ? '#2563eb' : 'transparent', color: activeTab === 'dashboard' ? '#ffffff' : '#9ca3af' }}>📊 &nbsp; Dashboard Matrix</button>
                    <button onClick={() => setActiveTab('vault')} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', backgroundColor: activeTab === 'vault' ? '#2563eb' : 'transparent', color: activeTab === 'vault' ? '#ffffff' : '#9ca3af' }}>🎯 &nbsp; Quest Vault</button>
                    <button onClick={() => setActiveTab('achievements')} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', backgroundColor: activeTab === 'achievements' ? '#2563eb' : 'transparent', color: activeTab === 'achievements' ? '#ffffff' : '#9ca3af' }}>🏆 &nbsp; Achievements</button>
                    <button onClick={() => setActiveTab('settings')} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', backgroundColor: activeTab === 'settings' ? '#2563eb' : 'transparent', color: activeTab === 'settings' ? '#ffffff' : '#9ca3af' }}>⚙️ &nbsp; Core Settings</button>
                </nav>
            </div>

            {/* MAIN CORE CONTROL SYSTEM DISPLAY */}
            <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
                
                {/* SYSTEM BANNER UNIT */}
                <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
                    <div style={{ flex: 1, minWidth: '0px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>⚡ Welcome, {userProfile.username}!</h1>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>Rank Tier: <span style={{ color: '#22d3ee', fontWeight: '700' }}>{userProfile.rankTier}</span></p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#eab308' }}>LEVEL {userProfile.level}</span>
                                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{userProfile.currentXP} / {currentXpMaxTarget} XP</span>
                            </div>
                            <div style={{ width: '100%', backgroundColor: '#030712', height: '10px', borderRadius: '9999px', overflow: 'hidden', border: '1px solid #1f2937' }}>
                                <div style={{ backgroundColor: '#10b981', height: '100%', width: `${currentProgressBarPercentage}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end', flexShrink: 0, minWidth: '140px' }}>
                        <button onClick={handleUserLogout} style={{ padding: '12px 24px', backgroundColor: '#2563eb', border: 'none', color: '#ffffff', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', width: '100%' }}>Logout</button>
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid #ef4444', padding: '8px 12px', borderRadius: '12px', width: '100%', textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#ef4444', fontWeight: '800' }}>⏰ RESET IN</span>
                            <div style={{ fontSize: '15px', fontFamily: 'monospace', fontWeight: '800', marginTop: '2px', color: '#ffffff' }}>{timeToReset}</div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN MATRIX DASHBOARD ENGINE --- */}
                {activeTab === 'dashboard' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', margin: '0 0 10px 0', textTransform: 'uppercase', width: '100%' }}>📊 Success Rate</h3>
                                <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={radialProgressPayload} startAngle={90} endAngle={-270}>
                                            <RadialBar background dataKey="value" cornerRadius={5} />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>{completionPercentage}%</span>
                                        <span style={{ fontSize: '10px', color: '#6b7280' }}>{completedTodayCount}/{totalQuestsCount} Done</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', margin: '0 0 16px 0', textTransform: 'uppercase' }}>📈 Matrix Breakdown</h3>
                                <div style={{ width: '100%', height: '160px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryVolumeData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                            <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                                            <YAxis stroke="#6b7280" fontSize={11} tickLine={false} allowDecimals={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }} />
                                            <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={18} />
                                            <Bar dataKey="Done" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* HABIT DROPDOWN LIST OPTION FIELDS */}
                        <form onSubmit={handleCreateQuest} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', margin: 0 }}>+ Craft a New Daily Quest</h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input type="text" value={habitName} onChange={(e) => setHabitName(e.target.value)} placeholder="Type your daily quest objective..." style={{ flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', outline: 'none' }} />
                                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', borderRadius: '12px', padding: '12px', outline: 'none', cursor: 'pointer' }}>
                                    <option value="Studies">📚 Studies</option>
                                    <option value="Gym & Fitness">💪 Gym & Fitness</option>
                                    <option value="Coding & Projects">💻 Coding & Projects</option>
                                    <option value="Health & Diet">🥦 Health & Diet</option>
                                    <option value="Book Reading">📖 Book Reading</option>
                                    <option value="Meditation & Mindfulness">🧘 Meditation</option>
                                    <option value="Sleep Discipline">🌙 Sleep Discipline</option>
                                </select>
                                <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '700', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Inject Quest Matrix</button>
                            </div>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f97316', margin: 0 }}>🔥 Active Quest Pipelines</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {habits.map((habit) => {
                                    const assignedColor = habit.colorTag || '#3b82f6';
                                    return (
                                        <div key={habit._id} style={{ backgroundColor: '#111827', border: habit.isCompletedToday ? '1px solid rgba(16, 185, 129, 0.4)' : `1px solid ${assignedColor}40`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '230px', position: 'relative', transition: 'all 0.3s ease' }}>
                                            <button onClick={() => handleDeleteHabit(habit._id)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                                            
                                            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                                <div style={{ width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', backgroundColor: `${assignedColor}15`, border: `1px solid ${assignedColor}30` }}>{habit.icon}</div>
                                                <div>
                                                    <h4 style={{ fontWeight: '700', margin: '0 0 4px 0', fontSize: '15px' }}>{habit.name}</h4>
                                                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Streak: <b style={{ color: assignedColor }}>{habit.currentStreak} Days</b></span>
                                                </div>
                                            </div>

                                            {/* MOTIVATIONAL QUOTES INJECTION CORE BOX */}
                                            {habit.isCompletedToday && habit.earnedQuote && (
                                                <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderLeft: '3px solid #10b981', borderRadius: '4px', fontSize: '11px', color: '#a7f3d0', italic: 'true', lineHeight: '1.4' }}>
                                                    ✨ <i>"{habit.earnedQuote}"</i>
                                                </div>
                                            )}

                                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <button onClick={() => handleCheckIn(habit._id)} disabled={habit.isCompletedToday} style={{ width: '100%', padding: '10px', borderRadius: '10px', fontWeight: '700', fontSize: '12px', border: 'none', backgroundColor: habit.isCompletedToday ? 'rgba(16, 185, 129, 0.1)' : assignedColor, color: habit.isCompletedToday ? '#10b981' : '#fff', cursor: habit.isCompletedToday ? 'default' : 'pointer' }}>
                                                    {habit.isCompletedToday ? '✓ Completed Today' : 'Complete Quest (+25 XP)'}
                                                </button>

                                                {/* DYNAMIC INDIVIDUAL QUEST RESET COUNTDOWN DISPLAY */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#6b7280', padding: '2px 4px' }}>
                                                    <span>Status: {habit.isCompletedToday ? <b style={{ color: '#10b981' }}>Locked</b> : <b>Active</b>}</span>
                                                    <span>Reset In: <b style={{ fontFamily: 'monospace', color: '#f87171' }}>{timeToReset}</b></span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {/* --- QUEST VAULT LEDGER ROUTE --- */}
                {activeTab === 'vault' && (
                    <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6', margin: 0 }}>🎯 Quest Vault Ledger</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #1f2937', color: '#9ca3af' }}>
                                    <th style={{ padding: '12px 16px' }}>MISSION IDENTITY</th>
                                    <th style={{ padding: '12px 16px' }}>SECTOR CATEGORY</th>
                                    <th style={{ padding: '12px 16px' }}>STREAK ENGINE</th>
                                    <th style={{ padding: '12px 16px' }}>STATE METRIC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {habits.map((h) => (
                                    <tr style={{ borderBottom: '1px solid #1f2937' }} key={h._id}>
                                        <td style={{ padding: '16px', fontWeight: '700' }}>{h.icon} {h.name}</td>
                                        <td style={{ padding: '16px' }}>{h.category}</td>
                                        <td style={{ padding: '16px', color: '#eab308' }}>🔥 {h.currentStreak} Days</td>
                                        <td style={{ padding: '16px', color: h.isCompletedToday ? '#10b981' : '#f97316' }}>{h.isCompletedToday ? '● ONLINE' : '○ PENDING'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- OPERATIONAL BADGES GRID PANEL --- */}
                {activeTab === 'achievements' && (
                    <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#eab308', margin: "0 0 8px 0" }}>🏆 Operational Badges Grid</h2>
                        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 24px 0' }}>Dynamic systemic targets verified via runtime parameters tracking operations loops.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {badgesList.map(b => (
                                <div key={b.id} style={{ border: b.unlocked ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid #1f2937', background: b.unlocked ? 'rgba(234, 179, 8, 0.02)' : 'rgba(3, 7, 18, 0.2)', padding: '20px', borderRadius: '14px', display: 'flex', gap: '16px', alignItems: 'center', opacity: b.unlocked ? 1 : 0.4, filter: b.unlocked ? 'none' : 'grayscale(60%)', transition: 'all 0.3s ease' }}>
                                    <div style={{ fontSize: '28px', backgroundColor: b.unlocked ? 'rgba(234, 179, 8, 0.12)' : '#111827', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: b.unlocked ? '1px solid rgba(234, 179, 8, 0.25)' : '1px solid #1f2937' }}>{b.icon}</div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: b.unlocked ? '#fff' : '#9ca3af' }}>{b.title}</h4>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: b.unlocked ? '#9ca3af' : '#6b7280', lineHeight: '1.4' }}>{b.desc}</p>
                                        <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '9px', fontWeight: '800', letterSpacing: '0.05em', color: b.unlocked ? '#eab308' : '#4b5563' }}>{b.unlocked ? '✓ MATRICULATED' : '🔒 LOCKED'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- CORE SETTINGS HUB PANEL --- */}
                {activeTab === 'settings' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ fontSize: '40px' }}>⚙️</div>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6', margin: 0 }}>SETTINGS SUBSYSTEM GRID</h2>
                                <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0 0 0' }}>Configure profile credentials, active network parameters, and sync protocols.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <form onSubmit={handleSaveGeneralSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', margin: 0 }}>Profile Identity Link</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af' }}>USERNAME IDENTIFIER</label>
                                        <input type="text" value={settingsForm.username} onChange={(e) => setSettingsForm({...settingsForm, username: e.target.value})} style={{ backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af' }}>EMAIL NETWORK ADDR</label>
                                        <input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})} style={{ backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
                                    </div>
                                </div>

                                <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', margin: 0 }}>System Pipeline Preferences</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af' }}>DB REFRESH INTERVAL</label>
                                            <select value={settingsForm.syncInterval} onChange={(e) => setSettingsForm({...settingsForm, syncInterval: e.target.value})} style={{ backgroundColor: '#030712', border: '1px solid #374151', color: '#ffffff', borderRadius: '12px', padding: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                                                <option value="1h">Every 1 Hour</option>
                                                <option value="6h">Every 6 Hours</option>
                                                <option value="12h">Every 12 Hours</option>
                                                <option value="24h">Every 24 Hours</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <input type="checkbox" id="cloudBackup" checked={settingsForm.cloudBackup} onChange={(e) => setSettingsForm({...settingsForm, cloudBackup: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }} />
                                            <label htmlFor="cloudBackup" style={{ fontSize: '13px', color: '#ffffff', cursor: 'pointer' }}>Automated Cloud Matrix Backup</label>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <input type="checkbox" id="notificationAlerts" checked={settingsForm.notificationAlerts} onChange={(e) => setSettingsForm({...settingsForm, notificationAlerts: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }} />
                                            <label htmlFor="notificationAlerts" style={{ fontSize: '13px', color: '#ffffff', cursor: 'pointer' }}>Enable System UI Push Alerts</label>
                                        </div>
                                    </div>
                                </div>

                                {settingsFeedback && <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#34d399', padding: '14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' }}>{settingsFeedback}</div>}
                                <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '700', fontSize: '14px', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Commit Configurations</button>
                            </form>

                            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#ef4444', textTransform: 'uppercase', margin: 0 }}>Security Keys & Cipher</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af' }}>CURRENT PASSWORD</label>
                                        <input type="password" placeholder="••••••••" value={securityForm.currentPassword} onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})} style={{ backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af' }}>NEW SECURE CIPHER</label>
                                        <input type="password" placeholder="Enter new passcode node" value={securityForm.newPassword} onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})} style={{ backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
                                    </div>
                                    {securityFeedback && <div style={{ backgroundColor: securityFeedback.includes('❌') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: securityFeedback.includes('❌') ? '1px solid #ef4444' : '1px solid #10b981', color: securityFeedback.includes('❌') ? '#f87171' : '#34d399', padding: '14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' }}>{securityFeedback}</div>}
                                    <button type="submit" style={{ backgroundColor: '#ef4444', color: '#ffffff', fontWeight: '700', fontSize: '14px', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '10px' }}>Update Security Cipher</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default App;