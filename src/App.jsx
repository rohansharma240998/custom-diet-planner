import { useState, useRef, useEffect } from "react";

const API_URL = "/api/chat";
const API_KEY = undefined;

const QUOTES = [
  "YOUR BODY CAN DO IT. IT'S YOUR MIND YOU NEED TO CONVINCE.",
  "FUEL YOUR AMBITION.",
  "EAT CLEAN. TRAIN MEAN. LIVE LEAN.",
  "EVERY MEAL IS A CHOICE. CHOOSE POWER.",
  "DISCIPLINE BEATS MOTIVATION EVERY TIME.",
  "YOU ARE WHAT YOU EAT. BE EXTRAORDINARY.",
  "STRONG STARTS IN THE KITCHEN.",
  "NO SHORTCUTS. NO EXCUSES. JUST RESULTS.",
  "PROGRESS NOT PERFECTION.",
  "THE BODY ACHIEVES WHAT THE MIND BELIEVES.",
  "MAKE TODAY COUNT.",
  "TRANSFORM YOUR PLATE. TRANSFORM YOUR LIFE.",
  "CONSISTENCY IS THE ULTIMATE SUPERPOWER.",
  "PUSH HARDER THAN YESTERDAY.",
  "YOUR FUTURE SELF WILL THANK YOU.",
];

const steps = [
  { id: "personal", label: "Personal" },
  { id: "body", label: "Body Stats" },
  { id: "goal", label: "Goal" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "diet", label: "Diet Prefs" },
  { id: "food-access", label: "Food Access" },
  { id: "supplements", label: "Supplements" },
  { id: "health", label: "Health" },
];

const SUPPLEMENT_OPTIONS = [
  "Whey Protein","Creatine","Multivitamin","Omega-3","Vitamin D",
  "Magnesium","Zinc","BCAAs","Pre-workout","Collagen","Probiotics",
  "Iron","Calcium","Vitamin B12","Ashwagandha",
];

const initialForm = {
  name:"",age:"",gender:"",height:"",heightUnit:"cm",
  weight:"",weightUnit:"kg",goal:"",activityLevel:"",
  mealsPerDay:"3",dietType:[],allergies:"",cuisines:"",
  healthConditions:"",dislikedFoods:"",waterIntake:"",
  availableFoods:"",affordableFoods:"",excludeFoods:"",
  useSupplements:"",supplements:[],customSupplement:"",
};

// ── Animated Background ───────────────────────────────────────────────
function AnimatedBG() {
  const canvasRef = useRef(null);
  const state = useRef({ quotes: [], particles: [], frame: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    state.current.quotes = Array.from({ length: 6 }, (_, i) => ({
      text: QUOTES[i % QUOTES.length], x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.12 + 0.04, size: Math.random() * 6 + 9,
      color: Math.random() > 0.5 ? "#00E676" : "#00BCD4",
    }));
    state.current.particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.8, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.35 + 0.05, pulse: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      state.current.frame++;
      const f = state.current.frame;
      [[0.2,0.3,"#00E676",0.04],[0.8,0.7,"#00BCD4",0.03],[0.5,0.9,"#69F0AE",0.025]].forEach(([rx,ry,c,a]) => {
        const gx = rx*canvas.width+Math.sin(f*0.005)*60, gy = ry*canvas.height+Math.cos(f*0.004)*40;
        const g = ctx.createRadialGradient(gx,gy,0,gx,gy,320);
        g.addColorStop(0,c+Math.round(a*255).toString(16).padStart(2,"0")); g.addColorStop(1,"transparent");
        ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
      });
      state.current.quotes.forEach(q => {
        q.x+=q.vx; q.y+=q.vy;
        if(q.x<-300)q.x=canvas.width+50; if(q.x>canvas.width+300)q.x=-50;
        if(q.y<-30)q.y=canvas.height+10; if(q.y>canvas.height+30)q.y=-10;
        ctx.save(); ctx.globalAlpha=q.opacity; ctx.font=`900 ${q.size}px 'Segoe UI',sans-serif`;
        ctx.fillStyle=q.color; ctx.fillText(q.text,q.x,q.y); ctx.restore();
      });
      state.current.particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.pulse+=0.03;
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
        const r = Math.max(0.1, p.r+Math.sin(p.pulse)*0.5);
        ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,230,118,${p.opacity+Math.sin(p.pulse)*0.05})`; ctx.fill();
      });
      const scanY=(f*1.2)%(canvas.height+60)-30;
      const scanG=ctx.createLinearGradient(0,scanY-30,0,scanY+30);
      scanG.addColorStop(0,"transparent"); scanG.addColorStop(0.5,"rgba(0,230,118,0.025)"); scanG.addColorStop(1,"transparent");
      ctx.fillStyle=scanG; ctx.fillRect(0,scanY-30,canvas.width,60);
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
}

function QuoteTicker() {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:2, overflow:"hidden", background:"linear-gradient(90deg,#0a0a0f,#0a0a0fee)", borderTop:"1px solid #00E67622", padding:"7px 0" }}>
      <div style={{ display:"flex", animation:"ticker 40s linear infinite", whiteSpace:"nowrap", width:"max-content" }}>
        {[...QUOTES,...QUOTES].map((q,i) => (
          <span key={i} style={{ marginRight:60, color:i%3===0?"#00E676":i%3===1?"#69F0AE":"#00BCD4", fontSize:11, fontWeight:900, letterSpacing:2, textTransform:"uppercase", opacity:0.7 }}>⚡ {q}</span>
        ))}
      </div>
      <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

// ── Form Components ───────────────────────────────────────────────────
const Input = ({ label, type="text", value, onChange, placeholder, required }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:"block", color:"#8899aa", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>{label}{required&&<span style={{ color:"#00E676" }}> *</span>}</label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", background:"rgba(0,0,0,0.5)", border:"1.5px solid #1e2a1e", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box", backdropFilter:"blur(4px)" }}
      onFocus={e=>{e.target.style.border="1.5px solid #00E676";e.target.style.boxShadow="0 0 16px #00E67622";}}
      onBlur={e=>{e.target.style.border="1.5px solid #1e2a1e";e.target.style.boxShadow="none";}} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, hint }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:"block", color:"#8899aa", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>{label}</label>
    {hint&&<div style={{ color:"#556655", fontSize:12, marginBottom:6 }}>{hint}</div>}
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3}
      style={{ width:"100%", background:"rgba(0,0,0,0.5)", border:"1.5px solid #1e2a1e", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"inherit" }}
      onFocus={e=>{e.target.style.border="1.5px solid #00E676";e.target.style.boxShadow="0 0 16px #00E67222";}}
      onBlur={e=>{e.target.style.border="1.5px solid #1e2a1e";e.target.style.boxShadow="none";}} />
  </div>
);

const Select = ({ label, value, onChange, options, required }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:"block", color:"#8899aa", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>{label}{required&&<span style={{ color:"#00E676" }}> *</span>}</label>
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", background:"rgba(10,20,10,0.95)", border:"1.5px solid #1e2a1e", borderRadius:10, padding:"12px 16px", color: value ? "#ffffff" : "#8899aa", fontSize:15, outline:"none", boxSizing:"border-box" }}>
      <option value="" style={{ color:"#8899aa", background:"#0a140a" }}>Select...</option>
      {options.map(o=><option key={o.value} value={o.value} style={{ color:"#ffffff", background:"#0a140a" }}>{o.label}</option>)}
    </select>
  </div>
);

const MultiSelect = ({ label, options, selected, onChange }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:"block", color:"#8899aa", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 }}>{label}</label>
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {options.map(o => {
        const active=selected.includes(o);
        return (
          <button key={o} onClick={()=>onChange(active?selected.filter(x=>x!==o):[...selected,o])}
            style={{ padding:"7px 14px", borderRadius:20, border:active?"1.5px solid #00E676":"1.5px solid #1e3020", background:active?"linear-gradient(135deg,#00E67628,#00BCD428)":"rgba(0,0,0,0.4)", color:active?"#00E676":"#778877", fontSize:12, fontWeight:800, cursor:"pointer", transition:"all 0.2s", boxShadow:active?"0 0 10px #00E67633":"none" }}>
            {o}
          </button>
        );
      })}
    </div>
  </div>
);

const OptionCard = ({ label, desc, selected, onClick }) => (
  <div onClick={onClick}
    style={{ padding:"13px 18px", borderRadius:12, border:selected?"1.5px solid #00E676":"1.5px solid #1a2a1a", background:selected?"linear-gradient(135deg,rgba(0,230,118,0.1),rgba(0,188,212,0.06))":"rgba(0,0,0,0.35)", cursor:"pointer", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", transition:"all 0.25s", boxShadow:selected?"0 0 18px #00E67622, inset 0 0 20px #00E67608":"none", backdropFilter:"blur(4px)" }}>
    <div style={{ textAlign:"left" }}>
      <div style={{ color:selected?"#fff":"#aaa", fontWeight:800, fontSize:14 }}>{label}</div>
      {desc&&<div style={{ color:selected?"#669966":"#445", fontSize:12, marginTop:2 }}>{desc}</div>}
    </div>
    {selected&&<div style={{ color:"#00E676", fontSize:18, fontWeight:900, marginLeft:12 }}>✓</div>}
  </div>
);

const BMRInfo = ({ form }) => {
  const w=parseFloat(form.weight),h=parseFloat(form.height),a=parseInt(form.age);
  if(!w||!h||!a||!form.gender) return null;
  const wKg=form.weightUnit==="lbs"?w*0.453592:w, hCm=form.heightUnit==="in"?h*2.54:h;
  const bmr=form.gender==="male"?Math.round(10*wKg+6.25*hCm-5*a+5):Math.round(10*wKg+6.25*hCm-5*a-161);
  const mult={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,"very-active":1.9};
  const tdee=form.activityLevel?Math.round(bmr*(mult[form.activityLevel]||1.2)):null;
  return (
    <div style={{ background:"linear-gradient(135deg,rgba(0,20,10,0.8),rgba(0,15,20,0.8))", border:"1px solid #00E67633", borderRadius:12, padding:"14px 18px", marginBottom:20, backdropFilter:"blur(8px)", boxShadow:"0 0 20px #00E67611" }}>
      <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
        <div><div style={{ color:"#446644", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1 }}>BMR</div><div style={{ color:"#00E676", fontSize:24, fontWeight:900 }}>{bmr} <span style={{ fontSize:12 }}>kcal</span></div></div>
        {tdee&&<div><div style={{ color:"#446644", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1 }}>TDEE</div><div style={{ color:"#69F0AE", fontSize:24, fontWeight:900 }}>{tdee} <span style={{ fontSize:12 }}>kcal</span></div></div>}
      </div>
      <div style={{ color:"#334", fontSize:10, marginTop:4 }}>Mifflin-St Jeor equation</div>
    </div>
  );
};

const ProgressBar = ({ current }) => (
  <div style={{ marginBottom:20 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
      {steps.map((s,i) => (
        <div key={s.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
          <div style={{ width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:i<current?"#00E676":i===current?"linear-gradient(135deg,#00E676,#00BCD4)":"rgba(0,0,0,0.4)", border:i===current?"2px solid #00E676":i<current?"2px solid #00E676":"1.5px solid #1e3020", color:i<=current?"#0a0a0f":"#334", fontWeight:900, fontSize:10, boxShadow:i===current?"0 0 14px #00E67677":"none", transition:"all 0.3s" }}>{i<current?"✓":i+1}</div>
          <span style={{ fontSize:7.5, color:i<=current?"#00E676":"#334", marginTop:3, fontWeight:800, textTransform:"uppercase", letterSpacing:0.5 }}>{s.label}</span>
        </div>
      ))}
    </div>
    <div style={{ height:3, background:"rgba(0,0,0,0.4)", borderRadius:2 }}>
      <div style={{ height:"100%", background:"linear-gradient(90deg,#00E676,#00BCD4,#69F0AE)", borderRadius:2, width:`${(current/(steps.length-1))*100}%`, transition:"width 0.4s ease", boxShadow:"0 0 8px #00E67666" }} />
    </div>
  </div>
);

const stepAccents = [
  {from:"#00E676",to:"#00BCD4"},{from:"#69F0AE",to:"#00E676"},{from:"#00BCD4",to:"#26C6DA"},
  {from:"#00E676",to:"#69F0AE"},{from:"#1DE9B6",to:"#00E676"},{from:"#00BCD4",to:"#00E676"},
  {from:"#69F0AE",to:"#1DE9B6"},{from:"#00E676",to:"#00BCD4"},
];

// ── Accordion Plan Display ────────────────────────────────────────────
function parsePlan(planText) {
  const days = [];
  // Split on DAY boundaries, keeping the delimiter
  const parts = planText.split(/(?=\bDAY\s*\d\b)/i);
  let intro = "";
  parts.forEach(part => {
    const dayMatch = part.match(/^\s*DAY\s*(\d+)/i);
    if (!dayMatch) { intro = part.trim(); return; }
    const dayNum = parseInt(dayMatch[1]);
    const mealTypes = ["BREAKFAST","LUNCH","DINNER","SNACK","MORNING SNACK","EVENING SNACK","PRE-WORKOUT","POST-WORKOUT","SUPPLEMENTS"];
    const lines = part.split('\n');
    let currentMeal = null;
    let currentContent = [];
    let dayTip = "";
    let dayCalories = "";
    const meals = [];
    lines.forEach(line => {
      const clean = line.replace(/[#*-]/g,'').trim();
      if (!clean) return;
      const upperClean = clean.toUpperCase();
      const isMealHeader = mealTypes.some(m => upperClean.startsWith(m));
      const isTip = upperClean.includes('POWER TIP') || upperClean.startsWith('TIP:');
      const isCalTotal = upperClean.includes('DAILY TOTAL') || upperClean.includes('TOTAL CALORIES') || upperClean.includes('TOTAL DAILY');
      if (isTip) { dayTip = clean; return; }
      if (isCalTotal) { dayCalories = clean; return; }
      if (isMealHeader) {
        if (currentMeal) meals.push({ name: currentMeal, content: currentContent.join('\n') });
        currentMeal = clean; currentContent = [];
      } else if (currentMeal) {
        currentContent.push(clean);
      }
    });
    if (currentMeal) meals.push({ name: currentMeal, content: currentContent.join('\n') });
    // Only add if not already added (avoid duplicates)
    if (!days.find(d => d.dayNum === dayNum)) {
      days.push({ dayNum, meals, tip: dayTip, calories: dayCalories });
    }
  });
  // Sort by day number to ensure correct order
  days.sort((a, b) => a.dayNum - b.dayNum);
  return { intro, days };
}

const mealIcons = { BREAKFAST:"🌅", LUNCH:"☀️", DINNER:"🌙", SNACK:"🍎", "MORNING SNACK":"🍌", "EVENING SNACK":"🥜", "PRE-WORKOUT":"⚡", "POST-WORKOUT":"💪", SUPPLEMENTS:"💊" };

function AccordionPlan({ planText }) {
  const [openDay, setOpenDay] = useState(1);
  const { days } = parsePlan(planText);
  return (
    <div>
      {days.map(day => (
        <div key={day.dayNum} style={{ marginBottom:10, borderRadius:14, overflow:"hidden", border: openDay===day.dayNum?"1.5px solid #00E676":"1.5px solid #1a2a1a", transition:"all 0.3s" }}>
          {/* Day Header */}
          <div onClick={()=>setOpenDay(openDay===day.dayNum?null:day.dayNum)}
            style={{ padding:"14px 18px", background: openDay===day.dayNum?"linear-gradient(90deg,rgba(0,230,118,0.15),rgba(0,188,212,0.08))":"rgba(0,0,0,0.4)", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", backdropFilter:"blur(8px)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ background: openDay===day.dayNum?"linear-gradient(135deg,#00E676,#00BCD4)":"rgba(0,230,118,0.15)", borderRadius:8, padding:"4px 10px", color: openDay===day.dayNum?"#0a0a0f":"#00E676", fontWeight:900, fontSize:12, letterSpacing:1 }}>DAY {day.dayNum}</div>
              {day.calories && <div style={{ color:"#446644", fontSize:12 }}>{day.calories.replace(/[^0-9,\s\-kcalKCAL]/gi,'').trim()}</div>}
            </div>
            <div style={{ color:"#00E676", fontSize:18, transition:"transform 0.3s", transform: openDay===day.dayNum?"rotate(180deg)":"rotate(0deg)" }}>▼</div>
          </div>
          {/* Day Content */}
          {openDay===day.dayNum && (
            <div style={{ background:"rgba(5,10,5,0.85)", padding:"16px 18px" }}>
              {day.meals.map((meal,i) => {
                const mealKey = Object.keys(mealIcons).find(k => meal.name.toUpperCase().includes(k)) || "SNACK";
                const icon = mealIcons[mealKey] || "🍽️";
                return (
                  <div key={i} style={{ marginBottom:14, background:"rgba(0,0,0,0.3)", borderRadius:12, overflow:"hidden", border:"1px solid #1a2a1a" }}>
                    <div style={{ background:"linear-gradient(90deg,rgba(0,230,118,0.1),transparent)", padding:"10px 14px", borderBottom:"1px solid #1a2a1a" }}>
                      <span style={{ color:"#00E676", fontWeight:900, fontSize:12, letterSpacing:1, textTransform:"uppercase" }}>{icon} {meal.name}</span>
                    </div>
                    <div style={{ padding:"12px 14px" }}>
                      {meal.content.split('\n').filter(l=>l.trim()).map((line,j) => {
                        const isCalLine = line.toLowerCase().includes('calorie')||line.toLowerCase().includes('kcal')||line.toLowerCase().includes('macro')||line.toLowerCase().includes('protein')||line.toLowerCase().includes('carb')||line.toLowerCase().includes('fat');
                        return (
                          <div key={j} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:6 }}>
                            <span style={{ color:isCalLine?"#00BCD4":"#00E67688", fontSize:12, marginTop:2, flexShrink:0 }}>{isCalLine?"📊":"•"}</span>
                            <span style={{ color:isCalLine?"#00BCD4":"#ccc", fontSize:13, lineHeight:1.5, fontWeight:isCalLine?700:400 }}>{line.replace(/^[-•*]\s*/,'')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {/* Power Tip — always inside the day tab */}
              {day.tip && (
                <div style={{ background:"linear-gradient(135deg,rgba(0,230,118,0.08),rgba(0,188,212,0.05))", border:"1px solid #00E67633", borderRadius:10, padding:"10px 14px", display:"flex", gap:10, alignItems:"flex-start", marginTop:4 }}>
                  <span style={{ fontSize:16 }}>💡</span>
                  <span style={{ color:"#88bb88", fontSize:13, lineHeight:1.5 }}>{day.tip}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Plan View ─────────────────────────────────────────────────────────
function PlanView({ form, plan, onRestart, onRegenerate }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [currentPlan, setCurrentPlan] = useState(plan);
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [planRevealed, setPlanRevealed] = useState(false);
  const chatEndRef = useRef(null);
  const { intro } = parsePlan(currentPlan);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chatHistory,chatLoading]);

  const sendChange = async () => {
    if(!chatInput.trim()||chatLoading) return;
    const userMsg=chatInput.trim(); setChatInput(""); setChatLoading(true);
    const newHistory=[...chatHistory,{role:"user",content:userMsg}];
    setChatHistory(newHistory);
    const messages=[
      {role:"user",content:`Here is my current 7-day meal plan:\n\n${currentPlan}\n\nPlease help me modify it.`},
      {role:"assistant",content:"Got it! What changes would you like?"},
      ...newHistory,
    ];
    try {
      const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,
          system:"You are a certified nutritionist. When users request changes, return the COMPLETE updated 7-day meal plan. Keep same format with DAY headers, meal labels, exact quantities, calories per meal, daily macros (protein/carbs/fats in grams), and power tips. Be encouraging.",
          messages})});
      const data=await res.json();
      const reply=data.content?.find(b=>b.type==="text")?.text||"";
      if(/DAY\s*[1-7]/i.test(reply)) setCurrentPlan(reply);
      setChatHistory(h=>[...h,{role:"assistant",content:reply,isPlanUpdate:/DAY\s*[1-7]/i.test(reply)}]);
    } catch { setChatHistory(h=>[...h,{role:"assistant",content:"Something went wrong. Try again."}]); }
    setChatLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", padding:"24px 16px 80px", fontFamily:"'Segoe UI',sans-serif", position:"relative" }}>
      <AnimatedBG /><QuoteTicker />
      <div style={{ maxWidth:720, margin:"0 auto", position:"relative", zIndex:2 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ display:"inline-block", background:"linear-gradient(135deg,#00E67222,#00BCD422)", border:"1px solid #00E676", borderRadius:20, padding:"6px 18px", color:"#00E676", fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:2, marginBottom:12, boxShadow:"0 0 20px #00E67633" }}>YOUR PLAN IS READY</div>
          <div style={{ fontSize:32, fontWeight:900, color:"#fff" }}>7-DAY <span style={{ color:"#00E676", textShadow:"0 0 20px #00E67666" }}>MEAL PLAN</span></div>
          <div style={{ color:"#557755", marginTop:6, fontSize:13 }}>Personalized for {form.name} 🎯</div>
        </div>

        {/* Intro Card — always visible */}
        {intro && (
          <div style={{ background:"linear-gradient(135deg,rgba(0,230,118,0.08),rgba(0,188,212,0.05))", border:"1px solid #00E67633", borderRadius:16, padding:"20px 20px", marginBottom:16, color:"#aabbaa", fontSize:14, lineHeight:1.8, whiteSpace:"pre-wrap" }}>
            {intro.split('\n').map((line,i) => {
              const clean = line.replace(/[#*]/g,'').trim();
              if(!clean) return <br key={i}/>;
              const isBold = line.includes('**') || line.startsWith('#');
              return <div key={i} style={{ color: isBold?"#00E676":"#aabbaa", fontWeight: isBold?800:400, marginBottom:4 }}>{clean}</div>;
            })}
          </div>
        )}

        {/* Reveal Button or Full Plan */}
        {!planRevealed ? (
          <button onClick={()=>setPlanRevealed(true)}
            style={{ width:"100%", padding:"18px", background:"linear-gradient(135deg,#00E676,#00BCD4)", border:"none", borderRadius:14, color:"#0a0a0f", fontWeight:900, fontSize:16, cursor:"pointer", textTransform:"uppercase", letterSpacing:2, boxShadow:"0 4px 28px #00E67655", marginBottom:16, animation:"pulse 2s ease-in-out infinite" }}>
            REVEAL MY PLAN 🗓️
          </button>
        ) : (
          <AccordionPlan planText={currentPlan} />
        )}
        <style>{`@keyframes pulse{0%,100%{box-shadow:0 4px 28px #00E67655}50%{box-shadow:0 4px 40px #00E676aa}}`}</style>
        <button onClick={()=>setShowChat(s=>!s)}
          style={{ width:"100%", padding:14, background:showChat?"rgba(0,230,118,0.08)":"linear-gradient(135deg,rgba(0,230,118,0.1),rgba(0,188,212,0.08))", border:"1.5px solid #00E676", borderRadius:12, color:"#00E676", fontWeight:900, fontSize:14, cursor:"pointer", textTransform:"uppercase", letterSpacing:1.5, margin:"14px 0", boxShadow:"0 0 16px #00E67622" }}>
          {showChat?"▲ HIDE CHANGES":"✏️ REQUEST CHANGES TO PLAN"}
        </button>
        {showChat && (
          <div style={{ background:"rgba(5,10,5,0.9)", border:"1px solid #1a2a1a", borderRadius:16, marginBottom:14, overflow:"hidden", backdropFilter:"blur(12px)" }}>
            <div style={{ background:"linear-gradient(90deg,rgba(0,230,118,0.08),transparent)", padding:"14px 18px", borderBottom:"1px solid #1a2a1a" }}>
              <div style={{ color:"#00E676", fontWeight:900, fontSize:12, textTransform:"uppercase", letterSpacing:1.5 }}>💬 MODIFY YOUR PLAN</div>
              <div style={{ color:"#445", fontSize:12, marginTop:2 }}>Swap foods, adjust portions, change meals and more</div>
            </div>
            {chatHistory.length===0 && (
              <div style={{ padding:"12px 18px", borderBottom:"1px solid #0f1a0f" }}>
                <div style={{ color:"#334", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Try asking:</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {["Remove all tofu","Replace chicken with fish","I want more protein","Make Day 3 vegetarian","Reduce carbs on Day 5"].map(s=>(
                    <button key={s} onClick={()=>setChatInput(s)}
                      style={{ padding:"6px 12px", borderRadius:14, border:"1px solid #1e2a1e", background:"rgba(0,0,0,0.3)", color:"#667766", fontSize:11, cursor:"pointer", fontWeight:700 }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chatHistory.length>0 && (
              <div style={{ maxHeight:280, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
                {chatHistory.map((m,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                    <div style={{ maxWidth:"85%", padding:"9px 14px", borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px", background:m.role==="user"?"linear-gradient(135deg,rgba(0,230,118,0.15),rgba(0,188,212,0.1))":"rgba(20,25,20,0.8)", border:m.role==="user"?"1px solid #00E67633":"1px solid #1a2a1a", color:"#bbb", fontSize:13 }}>
                      {m.isPlanUpdate?<div><div style={{ color:"#00E676", fontWeight:900, fontSize:11, marginBottom:4 }}>✅ PLAN UPDATED ABOVE</div><div style={{ color:"#556", fontSize:11 }}>Changes applied to your meal plan.</div></div>:m.content.slice(0,200)+(m.content.length>200?"...":"")}
                    </div>
                  </div>
                ))}
                {chatLoading&&<div style={{ display:"flex", gap:5, padding:"6px 14px" }}>{[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#00E676", animation:`bounce 1s ease-in-out ${i*0.2}s infinite` }} />)}</div>}
                <div ref={chatEndRef} />
              </div>
            )}
            <div style={{ padding:"12px 18px", borderTop:"1px solid #0f1a0f", display:"flex", gap:10 }}>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChange()} placeholder="e.g. Remove tofu, add more eggs..."
                style={{ flex:1, background:"rgba(0,0,0,0.5)", border:"1.5px solid #1e2a1e", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit" }}
                onFocus={e=>{e.target.style.border="1.5px solid #00E676";}}
                onBlur={e=>{e.target.style.border="1.5px solid #1e2a1e";}} />
              <button onClick={sendChange} disabled={chatLoading||!chatInput.trim()}
                style={{ padding:"10px 16px", background:chatInput.trim()?"linear-gradient(135deg,#00E676,#00BCD4)":"rgba(0,0,0,0.3)", border:"none", borderRadius:10, color:chatInput.trim()?"#0a0a0f":"#334", fontWeight:900, fontSize:12, cursor:chatInput.trim()?"pointer":"not-allowed" }}>
                SEND
              </button>
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={onRestart} style={{ flex:1, padding:14, background:"transparent", border:"1.5px solid #1e2a1e", borderRadius:12, color:"#445", fontWeight:900, fontSize:13, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>START OVER</button>
          <button onClick={onRegenerate} style={{ flex:1, padding:14, background:"linear-gradient(135deg,#00E676,#00BCD4)", border:"none", borderRadius:12, color:"#0a0a0f", fontWeight:900, fontSize:13, cursor:"pointer", textTransform:"uppercase", letterSpacing:1, boxShadow:"0 4px 20px #00E67644" }}>REGENERATE ⚡</button>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [error, setError] = useState("");
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));
  const accent = stepAccents[step]||stepAccents[0];

  const loadMsgs = ["Crunching your numbers 💪","Calculating your macros 🔥","Crafting your custom plan 🥗","Almost ready, champ! ⚡"];

  const generatePlan = async () => {
    setLoading(true); setError("");
    let i=0; setLoadMsg(loadMsgs[0]);
    const iv=setInterval(()=>{i=(i+1)%loadMsgs.length;setLoadMsg(loadMsgs[i]);},2500);
    const wKg=form.weightUnit==="lbs"?(parseFloat(form.weight)*0.453592).toFixed(1):form.weight;
    const hCm=form.heightUnit==="in"?(parseFloat(form.height)*2.54).toFixed(1):form.height;
    const prompt=`You are a certified nutritionist and fitness coach. Create a detailed personalized 7-day diet plan.

PROFILE:
Name: ${form.name} | Age: ${form.age} | Gender: ${form.gender}
Height: ${hCm}cm | Weight: ${wKg}kg
Goal: ${form.goal} | Activity: ${form.activityLevel}
Meals/day: ${form.mealsPerDay}

DIETARY:
Diet type: ${form.dietType.join(", ")||"None"}
Allergies: ${form.allergies||"None"}
Dislikes: ${form.dislikedFoods||"None"}
Cuisines: ${form.cuisines||"Any"}

FOOD ACCESS:
Daily access: ${form.availableFoods||"Not specified"}
Affordable: ${form.affordableFoods||"Not specified"}
Exclude: ${form.excludeFoods||"None"}

SUPPLEMENTS:
Using: ${form.useSupplements}
${form.useSupplements==="yes"?`Supplements: ${[...form.supplements,form.customSupplement].filter(Boolean).join(", ")}`:""}

HEALTH:
Conditions: ${form.healthConditions||"None"}
Water: ${form.waterIntake||"Not specified"}

IMPORTANT INSTRUCTIONS:
- For EVERY food item, include EXACT quantities (e.g. "2 large eggs", "150g chicken breast", "1 cup oats (80g)", "1 medium banana (120g)")
- For EVERY meal, include calories (e.g. "Meal calories: ~520 kcal")
- For EVERY day, include macro breakdown: Protein: Xg | Carbs: Xg | Fats: Xg
- For EVERY day, include Daily Total Calories
- Include micro nutrients highlights where relevant (e.g. high in Vitamin C, Iron, Calcium)
- Include a Power Tip for each day
- Start with a short motivating intro for ${form.name}
${form.useSupplements==="yes"?"- Include when and how to take each supplement alongside meals":""}

Format: DAY 1, DAY 2 etc as headers, then BREAKFAST, LUNCH, DINNER, SNACK as subheaders.`;

    try {
      const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:8000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      setPlan(data.content?.find(b=>b.type==="text")?.text||"");
    } catch { setError("Something went wrong. Please try again."); }
    clearInterval(iv); setLoading(false);
  };

  const canNext = () => {
    if(step===0) return form.name&&form.age&&form.gender;
    if(step===1) return form.height&&form.weight;
    if(step===2) return form.goal;
    if(step===3) return form.activityLevel;
    if(step===6) return form.useSupplements!=="";
    return true;
  };

  const GradientTitle = ({ line1, line2 }) => (
    <div style={{ marginBottom:22 }}>
      <div style={{ fontSize:26, fontWeight:900, color:"#fff", lineHeight:1.2 }}>
        {line1}<br />
        <span style={{ background:`linear-gradient(90deg,${accent.from},${accent.to})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", display:"inline-block" }}>{line2}</span>
      </div>
    </div>
  );

  const renderStep = () => {
    switch(step) {
      case 0: return <>
        <GradientTitle line1="LET'S GET TO" line2="KNOW YOU" />
        <div style={{ color:"#446644", marginBottom:20, fontSize:13 }}>Your journey to a better you starts here 🔥</div>
        <Input label="Your Name" value={form.name} onChange={v=>upd("name",v)} placeholder="e.g. Alex" required />
        <Input label="Age" type="number" value={form.age} onChange={v=>upd("age",v)} placeholder="e.g. 28" required />
        <Select label="Gender" value={form.gender} onChange={v=>upd("gender",v)} required options={[{value:"male",label:"Male"},{value:"female",label:"Female"},{value:"other",label:"Other"}]} />
      </>;
      case 1: return <>
        <GradientTitle line1="YOUR BODY" line2="STATS" />
        <div style={{ color:"#446644", marginBottom:20, fontSize:13 }}>We'll calculate your perfect calories 📊</div>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ flex:1 }}><Input label="Height" type="number" value={form.height} onChange={v=>upd("height",v)} placeholder={form.heightUnit==="cm"?"e.g. 175":"e.g. 69"} required /></div>
          <div style={{ width:90 }}><Select label="Unit" value={form.heightUnit} onChange={v=>upd("heightUnit",v)} options={[{value:"cm",label:"cm"},{value:"in",label:"in"}]} /></div>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ flex:1 }}><Input label="Weight" type="number" value={form.weight} onChange={v=>upd("weight",v)} placeholder={form.weightUnit==="kg"?"e.g. 72":"e.g. 158"} required /></div>
          <div style={{ width:90 }}><Select label="Unit" value={form.weightUnit} onChange={v=>upd("weightUnit",v)} options={[{value:"kg",label:"kg"},{value:"lbs",label:"lbs"}]} /></div>
        </div>
        <BMRInfo form={form} />
      </>;
      case 2: return <>
        <GradientTitle line1="WHAT'S YOUR" line2="GOAL?" />
        <div style={{ color:"#446644", marginBottom:20, fontSize:13 }}>Define your target and we'll build around it 🎯</div>
        {[
          {v:"lose-weight",label:"🔥 Lose Weight",desc:"Burn fat, get lean"},
          {v:"gain-muscle",label:"💪 Build Muscle",desc:"Increase strength & size"},
          {v:"lose-weight-gain-muscle",label:"⚡ Lose Weight & Gain Muscle",desc:"Body recomposition"},
          {v:"maintain",label:"⚖️ Maintain Weight",desc:"Stay at current weight"},
          {v:"improve-health",label:"🌿 Improve Health",desc:"Boost energy & wellness"},
          {v:"bulk",label:"📈 Bulk Up",desc:"Serious mass gain"},
        ].map(g=><OptionCard key={g.v} label={g.label} desc={g.desc} selected={form.goal===g.v} onClick={()=>upd("goal",g.v)} />)}
      </>;
      case 3: return <>
        <GradientTitle line1="YOUR" line2="LIFESTYLE" />
        <div style={{ color:"#446644", marginBottom:20, fontSize:13 }}>How active is your daily life? 🏃</div>
        {[
          {v:"sedentary",label:"🛋️ Sedentary",desc:"Desk job, little exercise"},
          {v:"light",label:"🚶 Lightly Active",desc:"Light exercise 1-3 days/week"},
          {v:"moderate",label:"🏋️ Moderately Active",desc:"Exercise 3-5 days/week"},
          {v:"active",label:"⚡ Very Active",desc:"Hard exercise 6-7 days/week"},
          {v:"very-active",label:"🔥 Athlete",desc:"Physical job + daily training"},
        ].map(a=><OptionCard key={a.v} label={a.label} desc={a.desc} selected={form.activityLevel===a.v} onClick={()=>upd("activityLevel",a.v)} />)}
        <BMRInfo form={form} />
        <Select label="Meals per day" value={form.mealsPerDay} onChange={v=>upd("mealsPerDay",v)} options={[{value:"2",label:"2 meals"},{value:"3",label:"3 meals"},{value:"4",label:"4 meals"},{value:"5",label:"5 meals"},{value:"6",label:"6 meals"}]} />
      </>;
      case 4: return <>
        <GradientTitle line1="DIET" line2="PREFERENCES" />
        <div style={{ color:"#446644", marginBottom:20, fontSize:13 }}>Tell us what works for you 🥦</div>
        <MultiSelect label="Dietary Type" options={["Vegan","Vegetarian","Pescatarian","Keto","Paleo","Gluten-Free","Dairy-Free","Halal","Kosher","Low-Carb","High-Protein"]} selected={form.dietType} onChange={v=>upd("dietType",v)} />
        <Input label="Allergies / Intolerances" value={form.allergies} onChange={v=>upd("allergies",v)} placeholder="e.g. nuts, shellfish, soy" />
        <Input label="Foods You Dislike" value={form.dislikedFoods} onChange={v=>upd("dislikedFoods",v)} placeholder="e.g. broccoli, liver" />
        <Input label="Preferred Cuisines" value={form.cuisines} onChange={v=>upd("cuisines",v)} placeholder="e.g. Mediterranean, Asian" />
      </>;
      case 5: return <>
        <GradientTitle line1="FOOD" line2="ACCESS" />
        <div style={{ color:"#446644", marginBottom:20, fontSize:13 }}>Build your plan around what you actually have 🛒</div>
        <Textarea label="Foods You Have Daily Access To" hint="Ingredients you regularly have at home or can easily find" value={form.availableFoods} onChange={v=>upd("availableFoods",v)} placeholder="e.g. eggs, rice, chicken, spinach, oats, bananas..." />
        <Textarea label="Affordable / Budget-Friendly Foods" hint="Foods within your budget you can buy regularly" value={form.affordableFoods} onChange={v=>upd("affordableFoods",v)} placeholder="e.g. lentils, canned tuna, sweet potato, frozen veggies..." />
        <Textarea label="Foods to Exclude" hint="Specific foods to remove beyond allergies" value={form.excludeFoods} onChange={v=>upd("excludeFoods",v)} placeholder="e.g. tofu, mushrooms, red meat..." />
      </>;
      case 6: return <>
        <GradientTitle line1="SUPPLEMENTS" line2="& BOOSTERS" />
        <div style={{ color:"#446644", marginBottom:20, fontSize:13 }}>Do you take or plan to take supplements? 💊</div>
        {[
          {v:"yes",label:"💊 Yes, I use supplements",desc:"Include them in my plan"},
          {v:"no",label:"🙅 No supplements",desc:"Keep it food-only"},
          {v:"open",label:"🤔 Open to suggestions",desc:"Recommend what fits my goal"},
        ].map(o=><OptionCard key={o.v} label={o.label} desc={o.desc} selected={form.useSupplements===o.v} onClick={()=>upd("useSupplements",o.v)} />)}
        {(form.useSupplements==="yes"||form.useSupplements==="open")&&<>
          <MultiSelect label="Select Your Supplements" options={SUPPLEMENT_OPTIONS} selected={form.supplements} onChange={v=>upd("supplements",v)} />
          <Input label="Other Supplements" value={form.customSupplement} onChange={v=>upd("customSupplement",v)} placeholder="e.g. Glutamine, Spirulina, Turmeric..." />
        </>}
      </>;
      case 7: return <>
        <GradientTitle line1="ALMOST" line2="THERE!" />
        <div style={{ color:"#446644", marginBottom:20, fontSize:13 }}>Last few details and we're set 💯</div>
        <Input label="Health Conditions (optional)" value={form.healthConditions} onChange={v=>upd("healthConditions",v)} placeholder="e.g. diabetes, hypertension, PCOS" />
        <Input label="Daily Water Intake (optional)" value={form.waterIntake} onChange={v=>upd("waterIntake",v)} placeholder="e.g. 1L, 8 glasses" />
        <div style={{ background:"linear-gradient(135deg,rgba(0,20,10,0.7),rgba(0,10,20,0.7))", border:"1px solid #00E67622", borderRadius:12, padding:16, marginTop:8, backdropFilter:"blur(8px)" }}>
          <div style={{ color:"#00E676", fontWeight:900, fontSize:11, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 }}>Your Summary</div>
          {[["Name",form.name],["Goal",form.goal?.replace(/-/g," ").toUpperCase()],["Activity",form.activityLevel?.replace(/-/g," ").toUpperCase()],["Diet",form.dietType.join(", ")||"Standard"],["Meals/day",form.mealsPerDay],["Supplements",form.useSupplements==="no"?"None":[...form.supplements,form.customSupplement].filter(Boolean).join(", ")||"Open"]].map(([k,v])=>v?(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", borderBottom:"1px solid #0a140a", padding:"5px 0", fontSize:12 }}>
              <span style={{ color:"#446644" }}>{k}</span><span style={{ color:"#ccc", fontWeight:700 }}>{v}</span>
            </div>
          ):null)}
        </div>
      </>;
      default: return null;
    }
  };

  if(loading) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, position:"relative" }}>
      <AnimatedBG />
      <div style={{ position:"relative", zIndex:2, textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:24, animation:"spin 1.5s linear infinite", display:"inline-block" }}>⚡</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:12 }}>{loadMsg}</div>
        <div style={{ color:"#446644", fontSize:14 }}>Building your personalized 7-day plan...</div>
        <div style={{ marginTop:32, display:"flex", gap:10, justifyContent:"center" }}>
          {[0,1,2].map(i=><div key={i} style={{ width:12, height:12, borderRadius:"50%", background:"linear-gradient(135deg,#00E676,#00BCD4)", animation:`bounce 1s ease-in-out ${i*0.2}s infinite`, boxShadow:"0 0 10px #00E67666" }} />)}
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
    </div>
  );

  if(plan) return <PlanView form={form} plan={plan} onRestart={()=>{setPlan(null);setStep(0);setForm(initialForm);}} onRegenerate={generatePlan} />;

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Segoe UI',sans-serif", padding:"24px 16px 80px", position:"relative" }}>
      <AnimatedBG /><QuoteTicker />
      <div style={{ maxWidth:480, margin:"0 auto", position:"relative", zIndex:2 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:12, fontWeight:900, background:`linear-gradient(90deg,${accent.from},${accent.to})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", textTransform:"uppercase", letterSpacing:3 }}>⚡ CUSTOM DIET PLANNER</div>
          <div style={{ fontSize:10, color:"#223322", marginTop:3, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Step {step+1} of {steps.length}</div>
        </div>
        <ProgressBar current={step} />
        <div style={{ background:"linear-gradient(160deg,rgba(0,15,8,0.92) 0%,rgba(0,8,15,0.92) 100%)", border:`1.5px solid`, borderColor:`${accent.from}33`, borderRadius:20, padding:"28px 24px", minHeight:400, backdropFilter:"blur(16px)", boxShadow:`0 0 40px ${accent.from}11, 0 8px 40px #00000099, inset 0 0 40px rgba(0,230,118,0.02)`, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:0, width:80, height:80, background:`radial-gradient(circle at top right, ${accent.from}18, transparent 70%)`, borderRadius:"0 20px 0 0", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:0, left:0, width:60, height:60, background:`radial-gradient(circle at bottom left, ${accent.to}10, transparent 70%)`, borderRadius:"0 0 0 20px", pointerEvents:"none" }} />
          {renderStep()}
        </div>
        {error&&<div style={{ color:"#ff5252", textAlign:"center", marginTop:12, fontSize:13 }}>{error}</div>}
        <div style={{ display:"flex", gap:12, marginTop:16 }}>
          {step>0&&(
            <button onClick={()=>setStep(s=>s-1)}
              style={{ flex:1, padding:14, background:"transparent", border:"1.5px solid #1a2a1a", borderRadius:12, color:"#446644", fontWeight:900, fontSize:13, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>
              ← BACK
            </button>
          )}
          <button onClick={()=>step<steps.length-1?setStep(s=>s+1):generatePlan()} disabled={!canNext()}
            style={{ flex:2, padding:14, background:canNext()?`linear-gradient(135deg,${accent.from},${accent.to})`:"rgba(0,0,0,0.3)", border:"none", borderRadius:12, color:canNext()?"#0a0a0f":"#223322", fontWeight:900, fontSize:15, cursor:canNext()?"pointer":"not-allowed", textTransform:"uppercase", letterSpacing:1.5, boxShadow:canNext()?`0 4px 24px ${accent.from}44`:"none", transition:"all 0.3s" }}>
            {step===steps.length-1?"BUILD MY PLAN ⚡":"NEXT →"}
          </button>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}