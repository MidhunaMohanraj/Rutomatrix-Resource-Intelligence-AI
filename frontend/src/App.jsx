import { useState } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const t = {
  bg:"#0A0D14",surface:"#111520",surfaceAlt:"#161C2D",
  border:"#1E2940",accent:"#3B82F6",accentGlow:"rgba(59,130,246,0.15)",
  accentAlt:"#06B6D4",success:"#10B981",warning:"#F59E0B",danger:"#EF4444",
  purple:"#8B5CF6",orange:"#F97316",
  muted:"#4B5680",text:"#E2E8F0",dim:"#8B96B0",bright:"#F8FAFF",
};

// ─── REAL DATA FROM EXCEL FILES ───────────────────────────────────────────────

const CLIENTS = [
  { id:"C001", name:"INTEL",   type:"External", status:"POC",  active_projects:2, description:"Server testing automation. Two projects ongoing." },
  { id:"C002", name:"TI",      type:"External", status:"POC",  active_projects:1, description:"Hardware testing & monitoring with reservation system." },
  { id:"C003", name:"COE",     type:"Internal", status:"POC",  active_projects:3, description:"Internal R&D projects." },
  { id:"C004", name:"REALTEK", type:"External", status:"Demo", active_projects:1, description:"Demo on Rutomatrix HPC, video and audio analysis." },
  { id:"C005", name:"NXP",     type:"External", status:"Demo", active_projects:1, description:"Service based. Interested in robotic arm automation." },
  { id:"C006", name:"ZEBRA",   type:"External", status:"Demo", active_projects:1, description:"Interested in custom local LLM and robotic arm automation." },
];

const PROJECTS = [
  { id:"P001", name:"Server Automation",        client_id:"C001", priority:"High",   status:"Ongoing",      deadline:"10 Nov 2025", description:"Server specific automation tasks." },
  { id:"P002", name:"Client Testing Automation",client_id:"C001", priority:"Medium", status:"Ongoing",      deadline:"20 Nov 2025", description:"Client system testing tasks." },
  { id:"P003", name:"Automated Test Bench",     client_id:"C002", priority:"High",   status:"Ongoing",      deadline:"25 Nov 2025", description:"System testing + Rutomatrix HPC tasks." },
  { id:"P004", name:"PCB AI",                   client_id:"C003", priority:"High",   status:"Ongoing",      deadline:"—",           description:"End-to-end PCB development automation. Routing, schematic creation." },
  { id:"P005", name:"Smart Ring",               client_id:"C003", priority:"Medium", status:"Not Started",  deadline:"—",           description:"Internal R&D — wearable technology showcase." },
  { id:"P006", name:"Zukimo Android",           client_id:"C003", priority:"Medium", status:"Not Started",  deadline:"—",           description:"Android platform for SOC in automotive instrument cluster." },
  { id:"P007", name:"Robotic Arm Development",  client_id:"C001", priority:"High",   status:"Ongoing",      deadline:"—",           description:"Rutomatrix expertise demo for multiple clients." },
  { id:"P008", name:"Video & Audio Analysis",   client_id:"C004", priority:"High",   status:"Ongoing",      deadline:"—",           description:"Video/audio analysis software demo for Realtek." },
  { id:"P009", name:"Content Creation",         client_id:"C003", priority:"High",   status:"Ongoing",      deadline:"—",           description:"Posters, ad films and animations." },
];

const TEAM = [
  { id:"T1816", emp_id:"T1816", name:"Adarsh",     role:"AI",       skills:["AI","Python","Power BI","Web"],                  status:"Active",  tasks:["TS027"],            comments:"Excellent in AI and Python. Track daily to complete tasks." },
  { id:"13032", emp_id:"13032", name:"Arvind",     role:"AI",       skills:["AI","Python"],                                   status:"Active",  tasks:[],                   comments:"LLM capable. Good for easy to moderate AI/LLM tasks." },
  { id:"12606", emp_id:"12606", name:"Dharshana",  role:"Software", skills:["C","Python","Web"],                              status:"Active",  tasks:["TS018"],            comments:"Skilled in Python features and Linux OS customization." },
  { id:"11383", emp_id:"11383", name:"Gogulnath",  role:"CAD",      skills:["C","Python","CAD","Embedded"],                   status:"Active",  tasks:["TS012","TS015","TS023","TS024","TS032"], comments:"Only resource for CAD model design and fabrication." },
  { id:"11797", emp_id:"11797", name:"Mary",       role:"Software", skills:["Python","C","Web","Embedded","PCB"],             status:"Active",  tasks:["TS002","TS003","TS005","TS006","TS008","TS009","TS010"], comments:"Multitasker. Excels in software and firmware tasks under critical conditions." },
  { id:"T1959", emp_id:"T1959", name:"Midhuna",    role:"AI",       skills:["AI","Python","Web"],                             status:"Active",  tasks:["TS026"],            comments:"Excellent in AI. Creates documentation on AI works." },
  { id:"T2032", emp_id:"T2032", name:"Mohan",      role:"Software", skills:["Python","Java","Computer Vision"],               status:"Active",  tasks:["TS029"],            comments:"New trainee. Learning Python and OpenCV. Java skills too." },
  { id:"T1926", emp_id:"T1926", name:"Nandhini",   role:"AI",       skills:["AI","Python","Web"],                             status:"Active",  tasks:["TS028"],            comments:"Excellent in AI. Creates documentation on AI works." },
  { id:"12629", emp_id:"12629", name:"Nithish",    role:"Hardware", skills:["PCB","Embedded"],                                status:"Active",  tasks:["TS013","TS016","TS023","TS025","TS030","TS032"], comments:"Excels at PCB development at any difficulty level." },
  { id:"12605", emp_id:"12605", name:"Prasanna",   role:"Software", skills:["Web","Python","C"],                              status:"Active",  tasks:["TS003","TS005","TS006","TS009","TS020","TS021","TS035"], comments:"Web + firmware dev. Also training on hardware tasks." },
  { id:"12610", emp_id:"12610", name:"Prasanth",   role:"Software", skills:["Web","Python","C"],                              status:"Active",  tasks:["TS005","TS006","TS014","TS020","TS021","TS035"], comments:"Web + firmware dev. Also training on hardware tasks." },
  { id:"12599", emp_id:"12599", name:"Praveen",    role:"Software", skills:["C","Python","Web"],                              status:"Active",  tasks:["TS019","TS022"],    comments:"Skilled in Python, C and Linux OS customization." },
  { id:"12600", emp_id:"12600", name:"Rahul",      role:"Software", skills:["Web","Python","C","Embedded"],                   status:"Active",  tasks:["TS017","TS030","TS031","TS035"], comments:"Web + firmware dev. Training on hardware tasks." },
  { id:"12828", emp_id:"12828", name:"Raj",        role:"Hardware", skills:["Web","Python","C","Embedded"],                   status:"Active",  tasks:["TS001","TS007","TS011","TS028"], comments:"Automotive, Python, Firmware, Embedded. Multitasker at any difficulty." },
  { id:"12831", emp_id:"12831", name:"Rio",        role:"Software", skills:["Web","Python","C","Embedded","AWS"],             status:"Active",  tasks:["TS001","TS002","TS007","TS011","TS028","TS033","TS034","TS035"], comments:"Python, Firmware, Software, Embedded, AWS. Multitasker." },
  { id:"T2017", emp_id:"T2017", name:"Ronald",     role:"Others",   skills:["Photography","Videography","Editing"],           status:"Active",  tasks:["TS036","TS037"],    comments:"Photographer intern. Photography, videography and editing." },
  { id:"12595", emp_id:"12595", name:"Sanjith",    role:"Software", skills:["C","Python","Web","Embedded"],                   status:"Active",  tasks:[],                   comments:"Works at NXP client. Contact for details." },
  { id:"12611", emp_id:"12611", name:"Sathish",    role:"Hardware", skills:["C","Python","Embedded","Inventory"],             status:"Active",  tasks:["TS004","TS013","TS014","TS021","TS032","TS033"], comments:"Manages inventory. Also Python dev and hardware testing." },
  { id:"T2031", emp_id:"T2031", name:"Shaan",      role:"Software", skills:["Python","Computer Vision"],                     status:"Active",  tasks:["TS029"],            comments:"New trainee. Learning Python and OpenCV." },
  { id:"T2016", emp_id:"T2016", name:"Soppimath",  role:"Others",   skills:["Editing","Content Creation"],                   status:"Active",  tasks:["TS036","TS037"],    comments:"Photographer intern. Photography, videography and editing." },
  { id:"12604", emp_id:"12604", name:"Teechana",   role:"CAD",      skills:["CAD"],                                           status:"Active",  tasks:["TS012"],            comments:"Excels in CAD models. Requires support from Gogulnath." },
  { id:"T1964", emp_id:"T1964", name:"Tejaswi",    role:"Software", skills:["C","Python","Web"],                              status:"Active",  tasks:["TS018"],            comments:"Python software development. Post silicon validation experience." },
  { id:"T1819", emp_id:"T1819", name:"Vaathsalya", role:"Software", skills:["Web","Python"],                                  status:"Active",  tasks:[],                   comments:"New trainee. Started working on web development tasks." },
];

const TASKS = [
  { id:"TS001", name:"Virtual Desk",                project:"P001,P003", type:"Embedded",        assigned:["12828","12831"],                    priority:"High",   status:"In Progress", deps:"TS025" },
  { id:"TS002", name:"BIOS Serial Logging",          project:"P001",      type:"Embedded",        assigned:["11797","12831"],                    priority:"High",   status:"In Progress", deps:"—" },
  { id:"TS003", name:"Firmware Flashing",            project:"P001",      type:"Embedded",        assigned:["11797","12605"],                    priority:"High",   status:"In Progress", deps:"—" },
  { id:"TS004", name:"Intelligent PDU",              project:"P001",      type:"Embedded",        assigned:["12696","12611"],                    priority:"High",   status:"In Progress", deps:"TS025" },
  { id:"TS005", name:"Postcode ESPI",                project:"P001",      type:"Embedded",        assigned:["11797","12610","12605"],            priority:"High",   status:"In Progress", deps:"TS025" },
  { id:"TS006", name:"Postcode LPC",                 project:"P001",      type:"Embedded",        assigned:["11797","12610","12605"],            priority:"High",   status:"In Progress", deps:"TS025" },
  { id:"TS007", name:"OS Flashing",                  project:"P001",      type:"Embedded",        assigned:["12828","12831"],                    priority:"High",   status:"Completed",   deps:"—" },
  { id:"TS008", name:"USB Over Network",             project:"P001,P003", type:"Software",        assigned:["11797"],                            priority:"High",   status:"In Progress", deps:"—" },
  { id:"TS009", name:"ATX System State",             project:"P001",      type:"Embedded",        assigned:["11797","12605"],                    priority:"High",   status:"In Progress", deps:"TS025" },
  { id:"TS010", name:"Python SV",                    project:"P001",      type:"Embedded",        assigned:["11797"],                            priority:"High",   status:"In Progress", deps:"—" },
  { id:"TS011", name:"Package Installation",         project:"P001,P003", type:"Software",        assigned:["12828","12831"],                    priority:"Medium", status:"In Progress", deps:"—" },
  { id:"TS012", name:"Camera/Thermal Fabrication",   project:"P003",      type:"CAD",             assigned:["11383","12604"],                    priority:"Medium", status:"In Progress", deps:"TS013,TS014" },
  { id:"TS013", name:"Camera/Thermal Hardware",      project:"P003",      type:"Hardware",        assigned:["12629","12611"],                    priority:"Medium", status:"In Progress", deps:"TS014" },
  { id:"TS014", name:"Camera/Thermal Software",      project:"P003",      type:"Software",        assigned:["12611","12610"],                    priority:"Medium", status:"Completed",   deps:"TS013" },
  { id:"TS015", name:"Robotic Arm Fabrication",      project:"P007",      type:"CAD",             assigned:["11383"],                            priority:"High",   status:"In Progress", deps:"TS016,TS017" },
  { id:"TS016", name:"Robotic Arm Hardware",         project:"P007",      type:"Hardware",        assigned:["11383","12629"],                    priority:"High",   status:"Not Started", deps:"TS017" },
  { id:"TS017", name:"Robotic Arm Software",         project:"P007",      type:"Software",        assigned:["12600"],                            priority:"Low",    status:"Not Started", deps:"TS016" },
  { id:"TS018", name:"Video Analysis Local",         project:"P008",      type:"Software",        assigned:["T1964","12606"],                    priority:"High",   status:"In Progress", deps:"—" },
  { id:"TS019", name:"Video Analysis Live Feed",     project:"P008",      type:"Software",        assigned:["12599"],                            priority:"High",   status:"In Progress", deps:"TS018" },
  { id:"TS020", name:"Audio Analysis Local",         project:"P008",      type:"Software",        assigned:["12610","12605"],                    priority:"Medium", status:"In Progress", deps:"—" },
  { id:"TS021", name:"Audio Analysis Live Feed",     project:"P008",      type:"Software",        assigned:["12610","12605","12611"],            priority:"Medium", status:"Not Started", deps:"TS020" },
  { id:"TS022", name:"Logic Analyzer Software",      project:"P003",      type:"Software",        assigned:["12599","12606"],                    priority:"Medium", status:"In Progress", deps:"TS023" },
  { id:"TS023", name:"Logic Analyzer Hardware",      project:"P003",      type:"Hardware",        assigned:["12629","11383"],                    priority:"Medium", status:"In Progress", deps:"TS022" },
  { id:"TS024", name:"Rutomatrix Enclosure Fab",     project:"P001,P002,P003", type:"CAD",        assigned:["11383"],                            priority:"High",   status:"Not Started", deps:"TS025" },
  { id:"TS025", name:"Rutomatrix HAT PCB Dev",       project:"P001,P002,P003", type:"Hardware",   assigned:["12629"],                            priority:"High",   status:"In Progress", deps:"—" },
  { id:"TS026", name:"AI Circuit Creator",           project:"P004",      type:"AI",              assigned:["T1959"],                            priority:"Low",    status:"In Progress", deps:"—" },
  { id:"TS027", name:"AI Schematic Creator",         project:"P004",      type:"AI",              assigned:["T1816"],                            priority:"Medium", status:"In Progress", deps:"TS026" },
  { id:"TS028", name:"AI Routing",                   project:"P004",      type:"AI",              assigned:["12828","12831","T1926"],            priority:"High",   status:"In Progress", deps:"—" },
  { id:"TS029", name:"Computer Vision (AI/ML/DL)",   project:"P007",      type:"Software",        assigned:["T2031","T2032"],                    priority:"Medium", status:"Not Started", deps:"—" },
  { id:"TS030", name:"Smart Ring Hardware",          project:"P005",      type:"Hardware",        assigned:["12600","12629"],                    priority:"Low",    status:"Not Started", deps:"TS031" },
  { id:"TS031", name:"Smart Ring Software",          project:"P005",      type:"Software",        assigned:["12600"],                            priority:"Low",    status:"Not Started", deps:"TS030" },
  { id:"TS032", name:"Rutomatrix HPC Hardware",      project:"P003",      type:"Hardware",        assigned:["11383","12611"],                    priority:"High",   status:"In Progress", deps:"—" },
  { id:"TS033", name:"Rutomatrix HPC Software",      project:"P003",      type:"Software",        assigned:["12611","12831"],                    priority:"Low",    status:"In Progress", deps:"—" },
  { id:"TS034", name:"Zukimo Android Ideation",      project:"P006",      type:"Ideation",        assigned:["12831"],                            priority:"High",   status:"Not Started", deps:"—" },
  { id:"TS035", name:"Reservation System",           project:"P003",      type:"Software",        assigned:["12831","12605","12610","12600"],    priority:"Low",    status:"Completed",   deps:"—" },
  { id:"TS036", name:"Poster Creation",              project:"P009",      type:"Content Creation",assigned:["T2016","T2017"],                    priority:"High",   status:"In Progress", deps:"—" },
  { id:"TS037", name:"Ad Creation",                  project:"P009",      type:"Content Creation",assigned:["T2016","T2017"],                    priority:"High",   status:"In Progress", deps:"—" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name) { return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }

function getMemberTasks(empId) {
  return TASKS.filter(task => task.assigned.includes(String(empId)));
}

function getMemberWorkload(empId) {
  const myTasks = getMemberTasks(empId);
  const active = myTasks.filter(t => t.status === "In Progress").length;
  if (active === 0) return { label:"Available", color:t.success, pct:0 };
  if (active <= 2)  return { label:"Light Load", color:t.warning, pct: active*25 };
  if (active <= 4)  return { label:"Moderate",   color:t.orange,  pct: active*18 };
  return               { label:"Heavy Load", color:t.danger,  pct: Math.min(95,active*14) };
}

function getClientName(id) {
  const ids = id.split(",").map(s=>s.trim());
  return ids.map(i => CLIENTS.find(c=>c.id===i)?.name || i).join(", ");
}

// ─── LLM matching ─────────────────────────────────────────────────────────────
async function callLLM(system, user) {
  try {
    const r = await fetch("http://localhost:11434/api/chat", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"llama3.2", stream:false,
        messages:[{role:"system",content:system},{role:"user",content:user}] }),
    });
    const d = await r.json();
    return d.message?.content || null;
  } catch { return null; }
}

async function runAIMatching(jd, members, onStatus) {
  const system = `You are a resource allocation AI. Rank team members for a task/project requirement.
Respond ONLY with valid JSON:
{"extractedSkills":["skill1"],"rankings":[{"memberId":"12828","score":95,"skillMatch":90,"experienceScore":85,"workloadScore":100,"explanation":"reason","skillGaps":["gap"],"strengths":["str"]}],"summary":"summary"}`;
  const prompt = `Requirement:\n${jd}\n\nTeam Members:\n${JSON.stringify(members.map(m=>({id:m.id,name:m.name,role:m.role,skills:m.skills,activeTasks:getMemberTasks(m.id).filter(tk=>tk.status==="In Progress").length})))}`;
  onStatus?.("AI analyzing requirement...");
  const raw = await callLLM(system, prompt);
  if (!raw) return null;
  try { const m = raw.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : null; } catch { return null; }
}

function fallbackRank(jd, members) {
  const jdL = jd.toLowerCase();
  return members.map(m => {
    const matched = m.skills.filter(s => jdL.includes(s.toLowerCase())).length;
    const skillMatch = Math.round((matched / Math.max(m.skills.length,1)) * 100);
    const wl = getMemberWorkload(m.id);
    const workloadScore = wl.label === "Available" ? 100 : wl.label === "Light Load" ? 75 : wl.label === "Moderate" ? 50 : 25;
    const score = Math.round(skillMatch * 0.5 + workloadScore * 0.5);
    return { memberId:m.id, score, skillMatch, experienceScore:70, workloadScore, explanation:`${m.name} has ${matched}/${m.skills.length} matching skills. Current workload: ${wl.label}.`, skillGaps:[], strengths:m.skills.slice(0,3) };
  }).sort((a,b) => b.score - a.score);
}

// ─── Shared UI components ─────────────────────────────────────────────────────
function Badge({ label, color, bg }) {
  return <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:600, background: bg || color+"22", color, border:`1px solid ${color}44` }}>{label}</span>;
}

function ScoreRing({ score, size=52 }) {
  const r=(size-8)/2, circ=2*Math.PI*r, dash=(score/100)*circ;
  const c = score>=80 ? t.success : score>=55 ? t.warning : t.danger;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.border} strokeWidth={4}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={4} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:c }}>{score}%</div>
    </div>
  );
}

function Avatar({ name, size=36, color }) {
  const bg = color || `linear-gradient(135deg, ${t.accent}, ${t.accentAlt})`;
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.3, fontWeight:700, color:"#fff", flexShrink:0 }}>{getInitials(name)}</div>;
}

function SkillTag({ skill, matched }) {
  return <span style={{ padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:500, background: matched?"rgba(59,130,246,0.15)":"#161C2D", color: matched?t.accentAlt:t.dim, border:`1px solid ${matched?t.accent+"44":t.border}` }}>{skill}</span>;
}

function PriorityBadge({ p }) {
  const c = p==="High"?t.danger:p==="Medium"?t.warning:t.success;
  return <Badge label={p} color={c} />;
}

function StatusBadge({ s }) {
  const c = s==="Completed"?t.success:s==="In Progress"?t.accent:s==="Not Started"?t.muted:t.warning;
  return <Badge label={s} color={c} />;
}

function WorkloadBadge({ empId }) {
  const wl = getMemberWorkload(empId);
  return <Badge label={wl.label} color={wl.color} />;
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard",  label:"Dashboard",       icon:"⊞" },
  { id:"finder",     label:"Resource Finder",  icon:"◎" },
  { id:"team",       label:"Team",             icon:"👥" },
  { id:"projects",   label:"Projects",         icon:"📋" },
  { id:"tasks",      label:"Tasks",            icon:"✓"  },
  { id:"clients",    label:"Clients",          icon:"🏢" },
  { id:"pipeline",   label:"Pipeline",         icon:"▤"  },
];

function Sidebar({ active, onChange, shortlisted }) {
  return (
    <div style={{ width:220, background:t.surface, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
      <div style={{ padding:"20px 16px 14px", borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:`linear-gradient(135deg,${t.accent},${t.accentAlt})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>◈</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:t.bright }}>Rutomatrix</div>
            <div style={{ fontSize:9, color:t.accent, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Resource AI</div>
          </div>
        </div>
      </div>
      <nav style={{ padding:"10px 6px", flex:1 }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => onChange(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:7, border:"none", cursor:"pointer", marginBottom:2, textAlign:"left", background: active===item.id ? t.accentGlow : "transparent", color: active===item.id ? t.accent : t.dim, fontFamily:"inherit", fontSize:12, fontWeight: active===item.id ? 600 : 400, borderLeft: active===item.id ? `2px solid ${t.accent}` : "2px solid transparent" }}>
            <span style={{ fontSize:14, width:18, textAlign:"center" }}>{item.icon}</span>
            {item.label}
            {item.id==="pipeline" && shortlisted.length>0 && <span style={{ marginLeft:"auto", background:t.accent, color:"#fff", fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:10 }}>{shortlisted.length}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding:"12px 16px", borderTop:`1px solid ${t.border}` }}>
        <div style={{ fontSize:11, color:t.dim }}>Rutomatrix Pvt. Ltd.</div>
        <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>{TEAM.length} team members</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ onNavigate }) {
  const activeProj = PROJECTS.filter(p=>p.status==="Ongoing").length;
  const completedTasks = TASKS.filter(t=>t.status==="Completed").length;
  const inProgressTasks = TASKS.filter(t=>t.status==="In Progress").length;
  const highPriority = TASKS.filter(t=>t.priority==="High" && t.status!=="Completed").length;

  const roleCounts = TEAM.reduce((acc,m) => { acc[m.role]=(acc[m.role]||0)+1; return acc; }, {});

  return (
    <div style={{ padding:28, overflowY:"auto", height:"100%" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:t.bright, margin:0 }}>Rutomatrix — Resource Dashboard</h1>
        <p style={{ color:t.dim, marginTop:5, fontSize:13 }}>{TEAM.length} team members · {PROJECTS.length} projects · {CLIENTS.length} clients</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Team Members",     value:TEAM.length,        color:t.accent,   sub:"All active" },
          { label:"Active Projects",  value:activeProj,         color:t.success,  sub:`${PROJECTS.length} total` },
          { label:"Tasks In Progress",value:inProgressTasks,    color:t.warning,  sub:`${completedTasks} completed` },
          { label:"High Priority",    value:highPriority,       color:t.danger,   sub:"Needs attention" },
        ].map((s,i) => (
          <div key={i} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:11, padding:18 }}>
            <div style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:t.text, marginTop:3 }}>{s.label}</div>
            <div style={{ fontSize:10, color:t.muted, marginTop:4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
        {/* Team by role */}
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:11, padding:18 }}>
          <h3 style={{ margin:"0 0 14px", fontSize:13, color:t.bright, fontWeight:600 }}>Team by Role</h3>
          {Object.entries(roleCounts).map(([role,count]) => {
            const c = role==="AI"?t.purple:role==="Software"?t.accent:role==="Hardware"?t.warning:role==="CAD"?t.success:t.muted;
            return (
              <div key={role} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c, flexShrink:0 }} />
                <div style={{ flex:1, fontSize:12, color:t.text }}>{role}</div>
                <div style={{ height:6, width:80, borderRadius:3, background:t.border }}>
                  <div style={{ height:"100%", borderRadius:3, width:`${(count/TEAM.length)*100}%`, background:c }} />
                </div>
                <span style={{ fontSize:12, fontWeight:600, color:c, width:16, textAlign:"right" }}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* Active Projects */}
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:11, padding:18 }}>
          <h3 style={{ margin:"0 0 14px", fontSize:13, color:t.bright, fontWeight:600 }}>Active Projects</h3>
          {PROJECTS.filter(p=>p.status==="Ongoing").map(p => (
            <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${t.border}` }}>
              <div>
                <div style={{ fontSize:12, color:t.text, fontWeight:500 }}>{p.name}</div>
                <div style={{ fontSize:10, color:t.dim }}>{getClientName(p.client_id)}</div>
              </div>
              <PriorityBadge p={p.priority} />
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:11, padding:18 }}>
          <h3 style={{ margin:"0 0 14px", fontSize:13, color:t.bright, fontWeight:600 }}>Quick Actions</h3>
          {[
            { label:"Find Resource for Task", icon:"◎", page:"finder", color:t.accent },
            { label:"View Full Team",          icon:"👥", page:"team",   color:t.purple },
            { label:"All Projects",            icon:"📋", page:"projects",color:t.success },
            { label:"Task Tracker",            icon:"✓",  page:"tasks",  color:t.warning },
            { label:"Client Overview",         icon:"🏢", page:"clients",color:t.orange },
          ].map((a,i) => (
            <button key={i} onClick={() => onNavigate(a.page)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 10px", marginBottom:7, borderRadius:8, background:t.surfaceAlt, border:`1px solid ${t.border}`, cursor:"pointer", textAlign:"left" }}>
              <span style={{ fontSize:16, color:a.color }}>{a.icon}</span>
              <span style={{ fontSize:12, color:t.text, fontWeight:500 }}>{a.label}</span>
              <span style={{ marginLeft:"auto", color:t.muted, fontSize:12 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RESOURCE FINDER (Phase 1 + Phase 2) ─────────────────────────────────────
const INDIA_LOCATIONS = [
  "India","Bangalore","Hyderabad","Chennai","Mumbai","Pune","Delhi NCR",
  "Noida","Gurgaon","Kochi","Ahmedabad","Kolkata","Coimbatore","Jaipur",
];

async function fetchExternalCandidates(skills, location, requiredSkills) {
  try {
    const res = await fetch("http://localhost:3001/api/external-search/run", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ skills, location, requiredSkills }),
    });
    if (!res.ok) throw new Error(`Backend error ${res.status}`);
    const data = await res.json();
    return data.candidates || [];
  } catch(err) {
    console.warn("[Phase2] Backend not available:", err.message);
    return null; // null = backend offline, use mock
  }
}

function generateMockExternal(skills, location) {
  const names = ["Arjun Pillai","Sneha Reddy","Vikram Das","Pooja Shetty","Karthik Menon",
    "Divya Nair","Suresh Rao","Anita Sharma","Rajesh Kumar","Preethi Iyer"];
  const roles = {
    "AI":["AI Engineer","ML Engineer","NLP Engineer","AI Developer"],
    "Python":["Python Developer","Backend Engineer","Data Engineer"],
    "Embedded":["Embedded Engineer","Firmware Developer","IoT Engineer"],
    "PCB":["PCB Designer","Hardware Engineer","Electronics Engineer"],
    "CAD":["CAD Engineer","Mechanical Designer","Product Designer"],
    "Web":["Full Stack Developer","Frontend Developer","Web Developer"],
    "Computer Vision":["Computer Vision Engineer","CV Developer","AI/CV Engineer"],
  };
  const matchedRole = Object.keys(roles).find(k => skills.some(s=>s.toLowerCase().includes(k.toLowerCase())));
  const roleList = roles[matchedRole] || ["Software Engineer","Technical Engineer"];

  return names.slice(0,6).map((name,i) => {
    const role = roleList[i % roleList.length];
    const exp = Math.floor(Math.random()*6)+2;
    const score = Math.floor(Math.random()*25)+65;
    return {
      id:`mock_${i}`, name, role, experience:exp,
      location: i%3===0 ? location : INDIA_LOCATIONS[Math.floor(Math.random()*INDIA_LOCATIONS.length)],
      skills:[...skills.slice(0,3), "Python","Communication"].slice(0,5),
      availability:"Open to Work", allocation:0,
      status:"external", source: i%2===0 ? "LinkedIn" : "Naukri.com",
      profileUrl: i%2===0
        ? `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g,'-')}`
        : `https://naukri.com/profile/${name.toLowerCase().replace(/\s+/g,'-')}`,
      company:"Currently Seeking", contactEmail:null, isExternal:true,
      avatar:name.split(" ").map(w=>w[0]).join("").toUpperCase(),
      score, skillMatch:score-5, experienceScore:Math.min(100,exp*12),
      availabilityScore:100, allocationScore:100,
      skillGaps:[], strengths:skills.slice(0,2),
      explanation:`${name} has ${exp} years of ${role} experience. Open to work in ${location}.`,
    };
  });
}

function ResourceFinder({ shortlisted, setShortlisted }) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase2Loading, setPhase2Loading] = useState(false);
  const [status, setStatus] = useState("");
  const [phase2Status, setPhase2Status] = useState("");
  const [results, setResults] = useState(null);
  const [externalResults, setExternalResults] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [filterRole, setFilterRole] = useState("All");
  const [location, setLocation] = useState("India");
  const [showPhase2, setShowPhase2] = useState(false);

  const roles = ["All", ...new Set(TEAM.map(m=>m.role))];
  const filteredTeam = filterRole==="All" ? TEAM : TEAM.filter(m=>m.role===filterRole);

  const handleSearch = async () => {
    if (!jd.trim()) return;
    setLoading(true); setResults(null); setExternalResults(null);
    setShowPhase2(false); setStatus("AI analyzing requirement...");
    const aiResult = await runAIMatching(jd, filteredTeam, setStatus);
    let rankings, skills;
    if (aiResult) {
      skills = aiResult.extractedSkills || [];
      rankings = aiResult.rankings.map(r => ({ ...r, member: TEAM.find(m=>m.id===r.memberId) })).filter(r=>r.member).sort((a,b)=>b.score-a.score);
      setResults({ ...aiResult, rankings });
    } else {
      setStatus("Using fallback ranking...");
      skills = jd.toLowerCase().split(/\W+/).filter(w => ["python","ai","web","c","embedded","pcb","cad","java","computer vision","aws","android"].includes(w)).map(s=>s.toUpperCase());
      if (!skills.length) skills = ["Python"];
      rankings = fallbackRank(jd, filteredTeam).map(r => ({ ...r, member: TEAM.find(m=>m.id===r.memberId) })).filter(r=>r.member);
      setResults({ extractedSkills:skills, rankings, summary:"Ranked by skill match and current workload." });
    }
    setExtractedSkills(skills);
    setLoading(false); setStatus("");

    // Auto-suggest Phase 2 if best internal score < 75
    const bestScore = rankings[0]?.score || 0;
    if (bestScore < 75) setShowPhase2(true);
  };

  const handlePhase2Search = async () => {
    setPhase2Loading(true); setExternalResults(null);
    setPhase2Status("🌐 Connecting to Playwright scraper...");
    await new Promise(r=>setTimeout(r,800));
    setPhase2Status("🔍 Searching LinkedIn profiles...");
    await new Promise(r=>setTimeout(r,1000));
    setPhase2Status("📋 Searching Naukri.com...");
    await new Promise(r=>setTimeout(r,800));
    setPhase2Status("🇮🇳 Searching Indeed India...");

    const candidates = await fetchExternalCandidates(extractedSkills, location, extractedSkills);
    let finalCandidates;
    if (candidates && candidates.length > 0) {
      finalCandidates = candidates;
      setPhase2Status(`✅ Found ${candidates.length} external candidates from live sources`);
    } else {
      finalCandidates = generateMockExternal(extractedSkills, location);
      setPhase2Status("⚠️ Backend offline — showing demo results. Start backend to get live data.");
    }
    setExternalResults(finalCandidates);
    setPhase2Loading(false);
  };

  const toggleShortlist = (m) => setShortlisted(prev => prev.find(s=>s.id===m.id) ? prev.filter(s=>s.id!==m.id) : [...prev, m]);

  const InternalCard = ({ r, idx }) => {
    const m = r.member;
    const myTasks = getMemberTasks(m.id);
    const isShortlisted = shortlisted.find(s=>s.id===m.id);
    return (
      <div style={{ background:t.surface, border:`1px solid ${idx===0?t.accent+"66":t.border}`, borderRadius:11, padding:16, boxShadow:idx===0?`0 0 18px ${t.accentGlow}`:"none" }}>
        {idx===0 && <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:t.accentGlow, border:`1px solid ${t.accent}44`, borderRadius:5, padding:"2px 9px", fontSize:9, fontWeight:700, color:t.accent, marginBottom:10, textTransform:"uppercase" }}>★ Best Internal Match</div>}
        <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          <Avatar name={m.name} size={42} />
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:14, fontWeight:700, color:t.bright }}>{m.name}</span>
              <Badge label={m.role} color={m.role==="AI"?t.purple:m.role==="Hardware"?t.warning:m.role==="CAD"?t.success:t.accent} />
              <WorkloadBadge empId={m.id} />
              <span style={{ fontSize:10, color:t.muted }}>#{idx+1}</span>
            </div>
            <div style={{ fontSize:11, color:t.dim, marginTop:3 }}>Emp ID: {m.emp_id} · {myTasks.filter(tk=>tk.status==="In Progress").length} active tasks</div>
            <div style={{ fontSize:11, color:t.dim, marginTop:2, fontStyle:"italic" }}>{m.comments}</div>
          </div>
          <ScoreRing score={r.score} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:12 }}>
          {[["Skill Match",r.skillMatch],["Role Fit",r.experienceScore],["Availability",r.workloadScore]].map(([label,value])=>(
            <div key={label} style={{ background:t.surfaceAlt, borderRadius:7, padding:"7px 9px" }}>
              <div style={{ fontSize:9, color:t.muted, marginBottom:3 }}>{label}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ flex:1, height:4, borderRadius:2, background:t.border }}><div style={{ height:"100%", borderRadius:2, width:`${value}%`, background:value>=80?t.success:value>=55?t.warning:t.danger }}/></div>
                <span style={{ fontSize:10, fontWeight:600, color:t.text }}>{value}%</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:4 }}>
          {m.skills.map(s=><SkillTag key={s} skill={s} matched={extractedSkills.some(es=>es.toLowerCase()===s.toLowerCase())}/>)}
        </div>
        {r.explanation && <div style={{ marginTop:10, padding:"8px 11px", borderRadius:7, background:t.surfaceAlt, fontSize:11, color:t.dim, borderLeft:`3px solid ${t.accent}` }}><span style={{ color:t.accent, fontWeight:600 }}>AI: </span>{r.explanation}</div>}
        {myTasks.filter(tk=>tk.status==="In Progress").length>0 && (
          <div style={{ marginTop:8, fontSize:10, color:t.warning }}>Active: {myTasks.filter(tk=>tk.status==="In Progress").map(tk=>tk.name).join(", ")}</div>
        )}
        <button onClick={()=>toggleShortlist(m)} style={{ width:"100%", marginTop:12, padding:7, borderRadius:7, border:`1px solid ${isShortlisted?t.success+"44":t.accent+"44"}`, cursor:"pointer", background:isShortlisted?t.success+"22":t.accentGlow, color:isShortlisted?t.success:t.accent, fontSize:11, fontWeight:600 }}>
          {isShortlisted ? "✓ Shortlisted" : "★ Shortlist"}
        </button>
      </div>
    );
  };

  const ExternalCard = ({ c, idx }) => {
    const isShortlisted = shortlisted.find(s=>s.id===c.id);
    const srcColor = c.source==="LinkedIn" ? "#0A66C2" : c.source==="Naukri.com" ? "#FF7555" : t.purple;
    return (
      <div style={{ background:t.surface, border:`1px solid ${idx===0?t.purple+"66":t.border}`, borderRadius:11, padding:16, borderTop:`3px solid ${srcColor}` }}>
        {idx===0 && <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:t.purple+"22", border:`1px solid ${t.purple}44`, borderRadius:5, padding:"2px 9px", fontSize:9, fontWeight:700, color:t.purple, marginBottom:10, textTransform:"uppercase" }}>★ Best External Match</div>}
        <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background:`linear-gradient(135deg,${srcColor},${t.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff", flexShrink:0 }}>{c.avatar}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:14, fontWeight:700, color:t.bright }}>{c.name}</span>
              <Badge label={c.source} color={srcColor} />
              <Badge label="External" color={t.purple} />
              <span style={{ fontSize:10, color:t.muted }}>#{idx+1}</span>
            </div>
            <div style={{ fontSize:11, color:t.dim, marginTop:3 }}>{c.role} · {c.experience} yrs · {c.location}</div>
            {c.company && <div style={{ fontSize:11, color:t.muted, marginTop:1 }}>{c.company}</div>}
          </div>
          <ScoreRing score={c.score} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:12 }}>
          {[["Skill Match",c.skillMatch],["Experience",c.experienceScore],["Availability",100]].map(([label,value])=>(
            <div key={label} style={{ background:t.surfaceAlt, borderRadius:7, padding:"7px 9px" }}>
              <div style={{ fontSize:9, color:t.muted, marginBottom:3 }}>{label}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ flex:1, height:4, borderRadius:2, background:t.border }}><div style={{ height:"100%", borderRadius:2, width:`${value}%`, background:value>=80?t.success:value>=55?t.warning:t.danger }}/></div>
                <span style={{ fontSize:10, fontWeight:600, color:t.text }}>{value}%</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:4 }}>
          {c.skills.map(s=><SkillTag key={s} skill={s} matched={extractedSkills.some(es=>es.toLowerCase()===s.toLowerCase())}/>)}
        </div>
        {c.explanation && <div style={{ marginTop:10, padding:"8px 11px", borderRadius:7, background:t.surfaceAlt, fontSize:11, color:t.dim, borderLeft:`3px solid ${t.purple}` }}><span style={{ color:t.purple, fontWeight:600 }}>Match: </span>{c.explanation}</div>}
        <div style={{ display:"flex", gap:7, marginTop:12 }}>
          <button onClick={()=>toggleShortlist(c)} style={{ flex:1, padding:7, borderRadius:7, border:`1px solid ${isShortlisted?t.success+"44":t.purple+"44"}`, cursor:"pointer", background:isShortlisted?t.success+"22":t.purple+"15", color:isShortlisted?t.success:t.purple, fontSize:11, fontWeight:600 }}>
            {isShortlisted ? "✓ Shortlisted" : "★ Shortlist"}
          </button>
          <a href={c.profileUrl} target="_blank" rel="noreferrer" style={{ padding:"7px 12px", borderRadius:7, border:`1px solid ${t.border}`, color:t.dim, fontSize:11, textDecoration:"none", background:t.surfaceAlt }}>View Profile →</a>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
      {/* Left panel */}
      <div style={{ width:340, borderRight:`1px solid ${t.border}`, padding:20, display:"flex", flexDirection:"column", gap:14, overflowY:"auto" }}>
        <div>
          <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:t.bright }}>Resource Finder</h2>
          <p style={{ margin:"5px 0 0", fontSize:12, color:t.dim }}>AI ranks your team. If no good match — search external candidates from Naukri & LinkedIn.</p>
        </div>

        <textarea value={jd} onChange={e=>setJd(e.target.value)}
          placeholder={"Describe the task requirement...\n\ne.g. Need someone for AI-based PCB routing. Python and AI skills required."}
          style={{ width:"100%", height:160, padding:12, boxSizing:"border-box", background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:9, color:t.text, fontSize:12, resize:"vertical", fontFamily:"inherit", lineHeight:1.6 }} />

        <div>
          <div style={{ fontSize:10, color:t.dim, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Quick Templates</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {[
              ["PCB AI",       "Need someone for AI circuit creation and PCB routing. AI and Python skills required."],
              ["Embedded",     "Need engineer for firmware flashing and embedded development. C and Embedded."],
              ["Web + Python", "Web development and Python scripting task. Looking for available team member."],
              ["CAD",          "CAD model design and fabrication. Need someone with CAD skills immediately."],
              ["CV / AI",      "Computer vision or video/audio analysis. Python and AI/ML skills needed."],
              ["Content",      "Poster and ad creation task. Photography and editing skills needed."],
            ].map(([label, text]) => (
              <button key={label} onClick={()=>setJd(text)} style={{ padding:"4px 9px", borderRadius:5, border:`1px solid ${t.border}`, background:t.surfaceAlt, color:t.dim, fontSize:10, cursor:"pointer" }}>{label}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize:10, color:t.dim, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Filter by Role</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {roles.map(role=>(
              <button key={role} onClick={()=>setFilterRole(role)} style={{ padding:"4px 9px", borderRadius:5, border:`1px solid ${filterRole===role?t.accent:t.border}`, background:filterRole===role?t.accentGlow:t.surfaceAlt, color:filterRole===role?t.accent:t.dim, fontSize:10, cursor:"pointer", fontWeight:filterRole===role?600:400 }}>{role}</button>
            ))}
          </div>
        </div>

        <button onClick={handleSearch} disabled={loading||!jd.trim()} style={{ padding:11, borderRadius:9, border:"none", cursor:loading?"not-allowed":"pointer", background:loading?t.muted:`linear-gradient(135deg,${t.accent},${t.accentAlt})`, color:"#fff", fontSize:13, fontWeight:700 }}>
          {loading ? "◎ Analyzing..." : "◎ Search Internal Team"}
        </button>

        {status && <div style={{ padding:10, borderRadius:7, background:t.accentGlow, border:`1px solid ${t.accent}44`, fontSize:11, color:t.accent }}>{status}</div>}

        {/* Phase 2 Panel */}
        {(showPhase2 || externalResults) && (
          <div style={{ padding:14, borderRadius:10, background:"rgba(139,92,246,0.08)", border:`1px solid ${t.purple}44` }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.purple, marginBottom:4 }}>🌐 Search External Candidates</div>
            {showPhase2 && !externalResults && (
              <div style={{ fontSize:11, color:t.dim, marginBottom:10 }}>Best internal match is below 75%. Search Naukri.com + LinkedIn across India?</div>
            )}
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:10, color:t.dim, marginBottom:4 }}>Location</div>
              <select value={location} onChange={e=>setLocation(e.target.value)} style={{ width:"100%", padding:"6px 8px", borderRadius:6, background:t.surfaceAlt, border:`1px solid ${t.border}`, color:t.text, fontSize:11 }}>
                {INDIA_LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button onClick={handlePhase2Search} disabled={phase2Loading} style={{ width:"100%", padding:9, borderRadius:8, border:"none", cursor:phase2Loading?"not-allowed":"pointer", background:phase2Loading?t.muted:`linear-gradient(135deg,${t.purple},#EC4899)`, color:"#fff", fontSize:12, fontWeight:700 }}>
              {phase2Loading ? "🔍 Scraping live data..." : "🌐 Search External Candidates"}
            </button>
            {phase2Status && <div style={{ marginTop:8, fontSize:10, color:t.purple }}>{phase2Status}</div>}
          </div>
        )}

        {!showPhase2 && results && !externalResults && (
          <button onClick={()=>setShowPhase2(true)} style={{ padding:9, borderRadius:8, border:`1px solid ${t.purple}44`, cursor:"pointer", background:t.purple+"15", color:t.purple, fontSize:11, fontWeight:600 }}>
            🌐 Also search external candidates
          </button>
        )}

        {extractedSkills.length>0 && (
          <div style={{ padding:11, borderRadius:8, background:t.surfaceAlt, border:`1px solid ${t.border}` }}>
            <div style={{ fontSize:10, color:t.dim, marginBottom:6, textTransform:"uppercase" }}>Detected Skills</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>{extractedSkills.map(s=><SkillTag key={s} skill={s} matched/>)}</div>
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ flex:1, overflowY:"auto", padding:20 }}>
        {!results && !loading && (
          <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:48, opacity:0.1 }}>◎</div>
            <p style={{ color:t.muted, fontSize:13 }}>Describe a task to find the best internal match</p>
            <p style={{ color:t.muted, fontSize:11 }}>If score is below 75% — external search unlocks automatically</p>
          </div>
        )}

        {results && (
          <>
            {/* Internal results header */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, padding:"10px 14px", borderRadius:9, background:t.accentGlow, border:`1px solid ${t.accent}44` }}>
              <span style={{ fontSize:11, fontWeight:700, color:t.accent }}>👥 Internal Team — {results.rankings.length} ranked</span>
              <span style={{ fontSize:11, color:t.dim }}>{results.summary}</span>
              <span style={{ marginLeft:"auto", fontSize:13, fontWeight:700, color: results.rankings[0]?.score>=75?t.success:t.warning }}>
                Best: {results.rankings[0]?.score}% {results.rankings[0]?.score < 75 ? "⚠️ Low — consider external" : "✅"}
              </span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom: externalResults?24:0 }}>
              {results.rankings.map((r,idx) => <InternalCard key={r.memberId} r={r} idx={idx} />)}
            </div>

            {/* External results */}
            {externalResults && (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0 14px", padding:"10px 14px", borderRadius:9, background:t.purple+"15", border:`1px solid ${t.purple}44` }}>
                  <span style={{ fontSize:11, fontWeight:700, color:t.purple }}>🌐 External Candidates — {externalResults.length} found</span>
                  <span style={{ fontSize:11, color:t.dim }}>From Naukri.com + LinkedIn + Indeed India · {location}</span>
                  <span style={{ marginLeft:"auto", fontSize:11, color:t.purple, fontWeight:600 }}>Best: {externalResults[0]?.score}%</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {externalResults.map((c,idx) => <ExternalCard key={c.id} c={c} idx={idx} />)}
                </div>
              </>
            )}

            {phase2Loading && (
              <div style={{ textAlign:"center", padding:30, color:t.purple }}>
                <div style={{ fontSize:24, marginBottom:8 }}>🌐</div>
                <div style={{ fontSize:13, fontWeight:600 }}>Scraping live job sites...</div>
                <div style={{ fontSize:11, color:t.muted, marginTop:4 }}>{phase2Status}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── TEAM PAGE ────────────────────────────────────────────────────────────────
function TeamPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const roles = ["All", ...new Set(TEAM.map(m=>m.role))];
  const filtered = TEAM.filter(m => {
    const q = search.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.skills.some(s=>s.toLowerCase().includes(q));
    const matchR = roleFilter==="All" || m.role===roleFilter;
    return matchQ && matchR;
  });

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
      {/* List */}
      <div style={{ width:320, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"16px 16px 10px", borderBottom:`1px solid ${t.border}` }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or skill..." style={{ width:"100%", padding:"8px 11px", boxSizing:"border-box", background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, fontSize:12, fontFamily:"inherit" }} />
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
            {roles.map(r => <button key={r} onClick={()=>setRoleFilter(r)} style={{ padding:"3px 8px", borderRadius:5, border:`1px solid ${roleFilter===r?t.accent:t.border}`, background:roleFilter===r?t.accentGlow:t.surfaceAlt, color:roleFilter===r?t.accent:t.dim, fontSize:10, cursor:"pointer" }}>{r}</button>)}
          </div>
          <div style={{ fontSize:10, color:t.muted, marginTop:6 }}>{filtered.length} members</div>
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          {filtered.map(m => {
            const wl = getMemberWorkload(m.id);
            const active = getMemberTasks(m.id).filter(tk=>tk.status==="In Progress").length;
            return (
              <div key={m.id} onClick={()=>setSelected(m)} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", cursor:"pointer", borderBottom:`1px solid ${t.border}`, background: selected?.id===m.id ? t.accentGlow : "transparent" }}>
                <Avatar name={m.name} size={34} color={m.role==="AI"?`linear-gradient(135deg,${t.purple},#EC4899)`:undefined} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:t.text }}>{m.name}</div>
                  <div style={{ fontSize:10, color:t.dim }}>{m.role} · {m.emp_id}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
                  <span style={{ fontSize:9, fontWeight:600, color:wl.color }}>{wl.label}</span>
                  {active>0 && <span style={{ fontSize:9, color:t.muted }}>{active} tasks</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex:1, overflowY:"auto", padding:24 }}>
        {!selected ? (
          <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:40, opacity:0.1 }}>👥</div>
            <p style={{ color:t.muted, fontSize:13 }}>Select a team member to view details</p>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20, padding:20, background:t.surface, borderRadius:12, border:`1px solid ${t.border}` }}>
              <Avatar name={selected.name} size={56} color={selected.role==="AI"?`linear-gradient(135deg,${t.purple},#EC4899)`:undefined} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:20, fontWeight:700, color:t.bright }}>{selected.name}</div>
                <div style={{ fontSize:13, color:t.dim, marginTop:2 }}>Emp ID: {selected.emp_id} · Role: {selected.role}</div>
                <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                  <Badge label={selected.role} color={selected.role==="AI"?t.purple:selected.role==="Hardware"?t.warning:t.accent} />
                  <WorkloadBadge empId={selected.id} />
                  <Badge label={selected.status} color={t.success} />
                </div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:16 }}>
                <div style={{ fontSize:11, fontWeight:600, color:t.dim, marginBottom:10, textTransform:"uppercase" }}>Skills</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{selected.skills.map(s=><SkillTag key={s} skill={s} matched />)}</div>
              </div>
              <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:16 }}>
                <div style={{ fontSize:11, fontWeight:600, color:t.dim, marginBottom:10, textTransform:"uppercase" }}>Manager Comments</div>
                <div style={{ fontSize:12, color:t.text, lineHeight:1.6 }}>{selected.comments}</div>
              </div>
            </div>

            {/* Tasks */}
            <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:16 }}>
              <div style={{ fontSize:11, fontWeight:600, color:t.dim, marginBottom:12, textTransform:"uppercase" }}>Assigned Tasks ({getMemberTasks(selected.id).length})</div>
              {getMemberTasks(selected.id).length === 0 ? (
                <div style={{ fontSize:12, color:t.muted, fontStyle:"italic" }}>No tasks assigned — Available</div>
              ) : (
                getMemberTasks(selected.id).map(task => (
                  <div key={task.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${t.border}` }}>
                    <div>
                      <div style={{ fontSize:12, color:t.text, fontWeight:500 }}>{task.name}</div>
                      <div style={{ fontSize:10, color:t.dim, marginTop:2 }}>{task.id} · {task.type} · Project: {task.project}</div>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <PriorityBadge p={task.priority} />
                      <StatusBadge s={task.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PROJECTS PAGE ────────────────────────────────────────────────────────────
function ProjectsPage() {
  const [selected, setSelected] = useState(null);

  const getProjectTasks = (pid) => TASKS.filter(tk => tk.project.split(",").map(s=>s.trim()).includes(pid));
  const getProjectMembers = (pid) => {
    const tasks = getProjectTasks(pid);
    const empIds = new Set(tasks.flatMap(tk=>tk.assigned));
    return TEAM.filter(m => empIds.has(String(m.id)));
  };

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
      <div style={{ width:300, borderRight:`1px solid ${t.border}`, overflowY:"auto" }}>
        <div style={{ padding:"14px 14px 8px", borderBottom:`1px solid ${t.border}` }}>
          <div style={{ fontSize:13, fontWeight:600, color:t.bright }}>Projects</div>
          <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>{PROJECTS.length} total</div>
        </div>
        {PROJECTS.map(p => {
          const client = CLIENTS.find(c=>c.id===p.client_id.split(",")[0].trim());
          const tasks = getProjectTasks(p.id);
          const done = tasks.filter(tk=>tk.status==="Completed").length;
          return (
            <div key={p.id} onClick={()=>setSelected(p)} style={{ padding:"12px 14px", cursor:"pointer", borderBottom:`1px solid ${t.border}`, background: selected?.id===p.id?t.accentGlow:"transparent" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                <div style={{ fontSize:12, fontWeight:600, color:t.text }}>{p.name}</div>
                <PriorityBadge p={p.priority} />
              </div>
              <div style={{ fontSize:10, color:t.dim, marginBottom:5 }}>{client?.name || p.client_id} · {p.id}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, height:4, borderRadius:2, background:t.border }}>
                  <div style={{ height:"100%", borderRadius:2, width:`${tasks.length?((done/tasks.length)*100):0}%`, background:t.success }} />
                </div>
                <span style={{ fontSize:9, color:t.muted }}>{done}/{tasks.length}</span>
                <StatusBadge s={p.status} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:22 }}>
        {!selected ? (
          <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:40, opacity:0.1 }}>📋</div>
            <p style={{ color:t.muted, fontSize:13 }}>Select a project to view details</p>
          </div>
        ) : (
          <>
            <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:11, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:700, color:t.bright }}>{selected.name}</div>
                  <div style={{ fontSize:12, color:t.dim, marginTop:3 }}>{selected.id} · Client: {getClientName(selected.client_id)} · Deadline: {selected.deadline}</div>
                </div>
                <div style={{ display:"flex", gap:7 }}><PriorityBadge p={selected.priority} /><StatusBadge s={selected.status} /></div>
              </div>
              <div style={{ marginTop:10, fontSize:12, color:t.text, lineHeight:1.6 }}>{selected.description}</div>
            </div>

            {/* Members */}
            <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:16, marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:t.dim, marginBottom:10, textTransform:"uppercase" }}>Team on this Project ({getProjectMembers(selected.id).length})</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {getProjectMembers(selected.id).map(m => (
                  <div key={m.id} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 10px", background:t.surfaceAlt, borderRadius:8, border:`1px solid ${t.border}` }}>
                    <Avatar name={m.name} size={26} />
                    <div><div style={{ fontSize:11, color:t.text, fontWeight:500 }}>{m.name}</div><div style={{ fontSize:9, color:t.dim }}>{m.role}</div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:16 }}>
              <div style={{ fontSize:11, fontWeight:600, color:t.dim, marginBottom:10, textTransform:"uppercase" }}>Tasks ({getProjectTasks(selected.id).length})</div>
              {getProjectTasks(selected.id).map(task => {
                const members = task.assigned.map(id=>TEAM.find(m=>String(m.id)===String(id))?.name).filter(Boolean);
                return (
                  <div key={task.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${t.border}` }}>
                    <div>
                      <div style={{ fontSize:12, color:t.text, fontWeight:500 }}>{task.name}</div>
                      <div style={{ fontSize:10, color:t.dim, marginTop:2 }}>{task.id} · {task.type} · {members.join(", ") || "Unassigned"}</div>
                    </div>
                    <div style={{ display:"flex", gap:6 }}><PriorityBadge p={task.priority} /><StatusBadge s={task.status} /></div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── TASKS PAGE ───────────────────────────────────────────────────────────────
function TasksPage() {
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const statuses = ["All","In Progress","Not Started","Completed"];
  const types = ["All", ...new Set(TASKS.map(tk=>tk.type))];
  const filtered = TASKS.filter(tk => {
    const ms = filter==="All" || tk.status===filter;
    const mt = typeFilter==="All" || tk.type===typeFilter;
    return ms && mt;
  });

  return (
    <div style={{ padding:22, overflowY:"auto", height:"100%" }}>
      <div style={{ marginBottom:16 }}>
        <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:t.bright }}>Task Tracker</h2>
        <div style={{ display:"flex", gap:5, marginTop:10, flexWrap:"wrap" }}>
          {statuses.map(s => <button key={s} onClick={()=>setFilter(s)} style={{ padding:"4px 10px", borderRadius:6, border:`1px solid ${filter===s?t.accent:t.border}`, background:filter===s?t.accentGlow:t.surfaceAlt, color:filter===s?t.accent:t.dim, fontSize:11, cursor:"pointer", fontWeight:filter===s?600:400 }}>{s}</button>)}
          <div style={{ width:1, background:t.border, margin:"0 4px" }} />
          {types.map(tp => <button key={tp} onClick={()=>setTypeFilter(tp)} style={{ padding:"4px 10px", borderRadius:6, border:`1px solid ${typeFilter===tp?t.purple:t.border}`, background:typeFilter===tp?t.purple+"22":t.surfaceAlt, color:typeFilter===tp?t.purple:t.dim, fontSize:11, cursor:"pointer" }}>{tp}</button>)}
        </div>
        <div style={{ fontSize:11, color:t.muted, marginTop:6 }}>{filtered.length} tasks</div>
      </div>

      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:11, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"80px 1fr 90px 100px 80px 90px 130px", padding:"10px 14px", background:t.surfaceAlt, borderBottom:`1px solid ${t.border}` }}>
          {["Task ID","Task Name","Project","Type","Priority","Status","Assigned To"].map(h=>(
            <div key={h} style={{ fontSize:10, fontWeight:600, color:t.dim, textTransform:"uppercase" }}>{h}</div>
          ))}
        </div>
        {filtered.map((task,i) => {
          const members = task.assigned.map(id=>TEAM.find(m=>String(m.id)===String(id))?.name).filter(Boolean);
          return (
            <div key={task.id} style={{ display:"grid", gridTemplateColumns:"80px 1fr 90px 100px 80px 90px 130px", padding:"10px 14px", borderBottom:`1px solid ${t.border}`, background: i%2===0?t.surface:t.surfaceAlt+"55", alignItems:"center" }}>
              <div style={{ fontSize:10, color:t.accent, fontWeight:600 }}>{task.id}</div>
              <div style={{ fontSize:12, color:t.text, fontWeight:500 }}>{task.name}</div>
              <div style={{ fontSize:10, color:t.dim }}>{task.project}</div>
              <div style={{ fontSize:10, color:t.dim }}>{task.type}</div>
              <PriorityBadge p={task.priority} />
              <StatusBadge s={task.status} />
              <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                {members.slice(0,2).map(name=>(
                  <span key={name} style={{ fontSize:9, padding:"2px 6px", borderRadius:4, background:t.accentGlow, color:t.accent, border:`1px solid ${t.accent}33` }}>{name}</span>
                ))}
                {members.length>2 && <span style={{ fontSize:9, color:t.muted }}>+{members.length-2}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CLIENTS PAGE ─────────────────────────────────────────────────────────────
function ClientsPage() {
  const [selected, setSelected] = useState(null);
  const getClientProjects = (cid) => PROJECTS.filter(p=>p.client_id.split(",").map(s=>s.trim()).includes(cid));

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
      <div style={{ width:280, borderRight:`1px solid ${t.border}`, overflowY:"auto" }}>
        <div style={{ padding:"14px 14px 8px", borderBottom:`1px solid ${t.border}` }}>
          <div style={{ fontSize:13, fontWeight:600, color:t.bright }}>Clients</div>
        </div>
        {CLIENTS.map(c => (
          <div key={c.id} onClick={()=>setSelected(c)} style={{ padding:"12px 14px", cursor:"pointer", borderBottom:`1px solid ${t.border}`, background:selected?.id===c.id?t.accentGlow:"transparent" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <div style={{ fontSize:13, fontWeight:700, color:t.bright }}>{c.name}</div>
              <Badge label={c.status} color={c.status==="POC"?t.accent:t.warning} />
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <Badge label={c.type} color={c.type==="Internal"?t.success:t.purple} />
              <span style={{ fontSize:10, color:t.dim }}>{c.active_projects} project{c.active_projects!==1?"s":""}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:22 }}>
        {!selected ? (
          <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:40, opacity:0.1 }}>🏢</div>
            <p style={{ color:t.muted, fontSize:13 }}>Select a client to view details</p>
          </div>
        ) : (
          <>
            <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:11, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:20, fontWeight:700, color:t.bright }}>{selected.name}</div>
                  <div style={{ fontSize:12, color:t.dim, marginTop:3 }}>{selected.id}</div>
                  <div style={{ display:"flex", gap:7, marginTop:8 }}>
                    <Badge label={selected.type} color={selected.type==="Internal"?t.success:t.purple} />
                    <Badge label={selected.status} color={selected.status==="POC"?t.accent:t.warning} />
                  </div>
                </div>
                <div style={{ fontSize:22, fontWeight:700, color:t.accent, textAlign:"center" }}>
                  {selected.active_projects}
                  <div style={{ fontSize:10, color:t.dim, fontWeight:400 }}>projects</div>
                </div>
              </div>
              <div style={{ marginTop:12, fontSize:12, color:t.text, lineHeight:1.7 }}>{selected.description}</div>
            </div>
            <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:16 }}>
              <div style={{ fontSize:11, fontWeight:600, color:t.dim, marginBottom:10, textTransform:"uppercase" }}>Projects</div>
              {getClientProjects(selected.id).map(p => (
                <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${t.border}` }}>
                  <div>
                    <div style={{ fontSize:12, color:t.text, fontWeight:500 }}>{p.name}</div>
                    <div style={{ fontSize:10, color:t.dim }}>{p.id} · Deadline: {p.deadline}</div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}><PriorityBadge p={p.priority} /><StatusBadge s={p.status} /></div>
                </div>
              ))}
              {getClientProjects(selected.id).length===0 && <div style={{ fontSize:12, color:t.muted, fontStyle:"italic" }}>No projects linked yet.</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PIPELINE PAGE ────────────────────────────────────────────────────────────
function PipelinePage({ shortlisted, setShortlisted }) {
  const stages = [
    { id:"shortlisted",  label:"Shortlisted",   color:t.accent },
    { id:"interviewing", label:"To Assign",      color:t.warning },
    { id:"allocated",    label:"Allocated",      color:t.success },
    { id:"rejected",     label:"Not Suitable",   color:t.danger },
  ];
  const [stageMap, setStageMap] = useState({});
  const getStage = (id) => stageMap[id] || "shortlisted";

  if (!shortlisted.length) return (
    <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10 }}>
      <div style={{ fontSize:40, opacity:0.2 }}>▤</div>
      <p style={{ color:t.muted, fontSize:13 }}>No members shortlisted yet. Use Resource Finder first.</p>
    </div>
  );

  return (
    <div style={{ padding:22, height:"100%", overflowY:"auto" }}>
      <h2 style={{ margin:"0 0 18px", fontSize:18, fontWeight:700, color:t.bright }}>Resource Pipeline</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, alignItems:"start" }}>
        {stages.map(stage => {
          const stageMems = shortlisted.filter(m=>getStage(m.id)===stage.id);
          return (
            <div key={stage.id}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10, padding:"7px 11px", borderRadius:7, background:stage.color+"15", border:`1px solid ${stage.color}33` }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:stage.color }} />
                <span style={{ fontSize:11, fontWeight:600, color:stage.color }}>{stage.label}</span>
                <span style={{ marginLeft:"auto", background:stage.color+"22", color:stage.color, fontSize:9, fontWeight:700, padding:"1px 5px", borderRadius:9 }}>{stageMems.length}</span>
              </div>
              {stageMems.map(m => (
                <div key={m.id} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:9, padding:12, marginBottom:9 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
                    <Avatar name={m.name} size={28} />
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:t.text }}>{m.name}</div>
                      <div style={{ fontSize:9, color:t.dim }}>{m.role} · {m.emp_id}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginBottom:8 }}>
                    {m.skills.slice(0,3).map(s=><SkillTag key={s} skill={s} />)}
                  </div>
                  <div style={{ display:"flex", gap:4 }}>
                    <select value={getStage(m.id)} onChange={e=>setStageMap(p=>({...p,[m.id]:e.target.value}))} style={{ flex:1, padding:"4px 6px", borderRadius:5, background:t.surfaceAlt, border:`1px solid ${t.border}`, color:t.text, fontSize:10 }}>
                      {stages.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    <button onClick={()=>setShortlisted(p=>p.filter(x=>x.id!==m.id))} style={{ padding:"4px 7px", borderRadius:5, background:"transparent", border:`1px solid ${t.border}`, color:t.muted, cursor:"pointer", fontSize:11 }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [shortlisted, setShortlisted] = useState([]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${t.bg};color:${t.text};font-family:'DM Sans',sans-serif;}
        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px;}
        input,select,textarea,button{font-family:inherit;}
      `}</style>
      <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:t.bg }}>
        <Sidebar active={page} onChange={setPage} shortlisted={shortlisted} />
        <main style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {/* Topbar */}
          <div style={{ height:50, borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:10, background:t.surface, flexShrink:0 }}>
            <span style={{ fontSize:13, fontWeight:600, color:t.bright }}>{NAV.find(n=>n.id===page)?.label}</span>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
              {shortlisted.length>0 && (
                <button onClick={()=>setPage("pipeline")} style={{ padding:"4px 11px", borderRadius:18, background:t.accentGlow, border:`1px solid ${t.accent}44`, color:t.accent, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                  ★ {shortlisted.length} in Pipeline
                </button>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:18, background:t.success+"22", border:`1px solid ${t.success}44`, fontSize:10, color:t.success }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:t.success }} />AI Ready
              </div>
            </div>
          </div>
          <div style={{ flex:1, overflow:"hidden" }}>
            {page==="dashboard" && <Dashboard onNavigate={setPage} />}
            {page==="finder"    && <ResourceFinder shortlisted={shortlisted} setShortlisted={setShortlisted} />}
            {page==="team"      && <TeamPage />}
            {page==="projects"  && <ProjectsPage />}
            {page==="tasks"     && <TasksPage />}
            {page==="clients"   && <ClientsPage />}
            {page==="pipeline"  && <PipelinePage shortlisted={shortlisted} setShortlisted={setShortlisted} />}
          </div>
        </main>
      </div>
    </>
  );
}
