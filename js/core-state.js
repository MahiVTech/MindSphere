// ═══════════════════════════ STATE ═══════════════════════════
const appState = {
  fearScore: null, stressScore: null, confScore: null,
  analysisCount: 0, journalEntries: [], selectedMood: null,
  goals: [
    { id:1, label:'Sleep 7+ hours tonight', streak:0, done:false, icon:'😴' },
    { id:2, label:'Do 10 min box breathing', streak:0, done:false, icon:'🌬️' },
    { id:3, label:'No screens 1hr before bed', streak:0, done:false, icon:'📵' },
    { id:4, label:'Study with Pomodoro method', streak:0, done:false, icon:'🍅' },
    { id:5, label:'Journal one entry today', streak:0, done:false, icon:'📓' },
    { id:6, label:'Reach out to one friend', streak:0, done:false, icon:'💬' },
  ],
  emergencyContacts: [],
  location: null
};
