(function(){
const CHECK='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.2l2.6 2.6L10 3.4" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const {TUMORS,TRAMITE}=window.FNRO.fnr;
/* ---------- pacientes (estado persistente por paciente) ---------- */
const SKEY='fnr-onco-patients-v1';
let STORE={patients:{}};
try{const s=JSON.parse(localStorage.getItem(SKEY)||'null'); if(s&&s.patients) STORE=s;}catch(e){}
function saveStore(){try{localStorage.setItem(SKEY,JSON.stringify(STORE));}catch(e){toast('No se pudo guardar en este dispositivo: revisá el espacio libre o el modo privado.');}}
let toastT=null;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{el.hidden=true;},3200);}
let CURRENT=null;
let armDelete=null;

const allInds=[];TUMORS.forEach(t=>t.inds.forEach(i=>{i.tumor=t;allInds.push(i);}));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function P(){return STORE.patients[CURRENT];}
function normId(v){return String(v||'').trim().replace(/[.\-\s]/g,'');}

function paraFor(ind){
  const t=ind.tumor,req=[],cond=[],sug=[];
  t.para.forEach((p,n)=>{
    if(p.only&&!p.only.includes(ind.id))return;
    if(p.not&&p.not.includes(ind.id))return;
    if(p.stage&&p.stage!==ind.g)return;
    const o=Object.assign({k:'p'+n},p);
    (p.sug?sug:p.cond?cond:req).push(o);
  });
  return {req,cond,sug};
}
function keysFor(ind){
  const k=[];
  ind.inc.forEach((x,n)=>k.push(typeof x==='object'?'inc'+n+'or':'inc'+n));
  ind.exc.forEach((x,n)=>k.push('exc'+n));
  TRAMITE.forEach((x,n)=>k.push('tr'+n));
  paraFor(ind).req.forEach(p=>k.push(p.k));
  return k;
}
function doneFor(ind,c,k){
  const m=k.match(/^inc(\d+)or$/);
  if(m)return ind.inc[+m[1]].or.some((_,j)=>c['inc'+m[1]+'o'+j]);
  return !!c[k];
}
function done(ind,key){return doneFor(ind,P().checks[ind.id]||{},key);}
function prog(ind,pref){const ks=keysFor(ind).filter(k=>!pref||k.startsWith(pref));return [ks.filter(k=>done(ind,k)).length,ks.length];}
function item(ind,key,text,extra){
  const id=ind.id+'__'+key,on=!!(P().checks[ind.id]||{})[key];
  return `<li><label class="it" for="${id}"><input type="checkbox" id="${id}" data-k="${key}" ${on?'checked':''}><span class="box">${CHECK}</span><span class="tx">${text}${extra||''}</span></label></li>`;
}

/* ---------- pantalla de pacientes ---------- */
function patientSummary(p){
  const t=TUMORS.find(x=>x.id===p.tumor)||TUMORS[0];
  const indId=p.sel[t.id];
  const ind=t.inds.find(i=>i.id===indId)||t.inds[0];
  const c=p.checks[ind.id]||{};
  const ks=keysFor(ind);
  const d=ks.filter(k=>doneFor(ind,c,k)).length;
  return {tumorId:t.id,tumorName:t.name,indChip:ind.chip,d,total:ks.length,stage:tnmStage(t.id,(p.tnm||{})[t.id]).stage};
}
function renderReviewers(){
  const el=document.getElementById('reviewers'),rv=window.FNRO.reviewers;if(!el||!rv)return;
  el.innerHTML='<ul class="rvw">'+Object.values(rv).map(r=>`<li><b>${esc(r.rol)}:</b> ${esc(r.nombre||'pendiente de designar')}. <span class="muted">Conflictos declarados: ${esc(r.coi)}</span></li>`).join('')+'</ul>';
}
function renderGate(){
  renderReviewers();
  const rows=Object.entries(STORE.patients).sort((a,b)=>b[1].updatedAt-a[1].updatedAt);
  const list=document.getElementById('plist');
  if(!rows.length){list.innerHTML='<p class="gate-empty">Todavía no hay pacientes guardados en este dispositivo.</p>';return;}
  list.innerHTML='<h2>Pacientes en curso</h2><div class="prows card">'+rows.map(([id,p])=>{
    const s=patientSummary(p);
    const d=new Date(p.updatedAt);
    const when=d.toLocaleDateString('es-UY',{day:'2-digit',month:'2-digit'})+' · '+d.toLocaleTimeString('es-UY',{hour:'2-digit',minute:'2-digit'});
    const pct=s.total?Math.round(s.d/s.total*100):0;
    return `<div class="prow" data-id="${esc(id)}" data-c="${s.tumorId}" tabindex="0">
      <span class="pdot"></span>
      <div class="pinfo"><span class="pid">${esc(id)}${s.stage?`<span class="pstage">${esc(s.stage)}</span>`:''}</span><span class="pmeta">${esc(s.tumorName)} · ${esc(s.indChip)} · ${s.d}/${s.total}</span><span class="pmini"><i style="width:${pct}%"></i></span></div>
      <div class="pside"><span class="pdate">${when}</span><button type="button" class="pdel ${armDelete===id?'arm':''}" data-del="${esc(id)}">${armDelete===id?'¿Eliminar?':'Eliminar'}</button></div>
    </div>`;
  }).join('')+'</div>';
}
function openPatient(raw,fromHistory){
  const id=normId(raw); if(!id) return;
  if(!STORE.patients[id]) STORE.patients[id]={tumor:'mama',sel:{},checks:{},updatedAt:Date.now(),createdAt:Date.now()};
  CURRENT=id; STORE.patients[id].updatedAt=Date.now(); saveStore();
  document.getElementById('gate').hidden=true;
  document.getElementById('app').hidden=false;
  document.getElementById('pid-input').value='';
  armDelete=null;
  renderApp();
  window.scrollTo(0,0);
  if(!fromHistory){try{history.pushState({fnrPatient:id},'');}catch(e){}}
}
/* botón "Cambiar paciente": si la ficha se abrió con una entrada en el historial, retroceder la consume */
function leavePatient(){
  if(history.state&&history.state.fnrPatient){history.back();}else{backToGate();}
}
function backToGate(){
  if(CURRENT&&STORE.patients[CURRENT]){STORE.patients[CURRENT].updatedAt=Date.now();saveStore();}
  CURRENT=null;
  document.getElementById('app').hidden=true;
  document.getElementById('gate').hidden=false;
  renderGate();
  window.scrollTo(0,0);
}
function deletePatient(id){delete STORE.patients[id];saveStore();armDelete=null;renderGate();}

document.getElementById('pid-go').addEventListener('click',()=>openPatient(document.getElementById('pid-input').value));
document.getElementById('pid-input').addEventListener('keydown',e=>{if(e.key==='Enter')openPatient(e.target.value);});
document.getElementById('plist').addEventListener('keydown',e=>{const r=e.target.closest('.prow');if(r&&e.target===r&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openPatient(r.dataset.id);}});
document.getElementById('plist').addEventListener('click',e=>{
  const del=e.target.closest('[data-del]');
  if(del){const id=del.dataset.del; if(armDelete===id){deletePatient(id);}else{armDelete=id;renderGate();} return;}
  const row=e.target.closest('.prow'); if(row){armDelete=null;openPatient(row.dataset.id);}
});

/* ---------- app (ficha del paciente actual) ---------- */
const tumorObj=()=>TUMORS.find(t=>t.id===P().tumor)||TUMORS[0];
const curInd=()=>{const t=tumorObj();const id=P().sel[t.id];return t.inds.find(i=>i.id===id)||t.inds[0];};

/* ---------- estadificación TNM ---------- */
const TNM=window.TNM_DATA||{};
function tnmStage(tid,sel){const d=TNM[tid];if(!d)return {stage:null,note:'Sin tabla TNM para este tumor.'};try{return d.stage(sel||{});}catch(e){return {stage:null,note:'No se pudo calcular.'};}}
function tnmCode(d,sel){
  const parts=d.axes.filter(a=>sel[a.key]).map(a=>a.key==='PSA'?'PSA '+a.options.find(o=>o.v===sel.PSA).d.replace(/^PSA\s*/,''):a.key==='GG'?'Grupo de grado '+sel.GG.replace('GG',''):a.key==='FIGO'?'FIGO '+sel.FIGO:a.key==='N'&&d.id==='ccu'?'Ganglios: '+(sel.N==='N0'?'negativos':sel.N):sel[a.key]);
  if(d.pre&&sel[d.pre.key])parts.unshift(sel[d.pre.key]);
  return parts.join(' · ');
}
function tnmSel(){const p=P();p.tnm=p.tnm||{};return p.tnm[p.tumor]=p.tnm[p.tumor]||{};}
function renderTnm(t){
  const d=TNM[t.id],box=document.getElementById('v-tnm');
  if(!d){box.innerHTML='<p class="gate-empty">No hay tabla de estadificación para este tumor.</p>';return;}
  const sel=tnmSel(),r=tnmStage(t.id,sel),code=tnmCode(d,sel);
  const preVal=d.pre&&sel[d.pre.key];
  const preHtml=d.pre?`<fieldset class="axis card"><legend>${esc(d.pre.label)}${preVal?`<span class="count">${esc(preVal)}</span>`:''}</legend>
    <div class="opts">${d.pre.options.map(o=>`<button type="button" class="opt" data-ax="${esc(d.pre.key)}" data-v="${esc(o.v)}" aria-pressed="${sel[d.pre.key]===o.v}"><code>${esc(o.v)}</code><span>${esc(o.d)}</span></button>`).join('')}</div></fieldset>`:'';
  const stageHtml=`<aside class="stage card" aria-live="polite">
    <span class="st-lbl">Estadio</span>
    <div class="st-val ${r.stage?'':'none'}">${r.stage?esc(r.stage):esc(r.note||'Elegí las categorías')}</div>
    ${code?`<div class="st-code">${esc(code)}</div>`:''}
    <div class="st-ed">${esc(d.edition)}</div>
    ${r.stage&&r.note?`<div class="st-note">${esc(r.note)}</div>`:''}
    <div class="st-act"><button type="button" class="btn primary" id="tnm-copy" ${r.stage?'':'disabled'}>Copiar resumen</button><button type="button" class="btn" id="tnm-clear">Limpiar</button></div>
  </aside>`;
  if(d.pre&&!preVal){
    /* falta el tipo histológico: todavía no tiene sentido mostrar los ejes TNM */
    box.innerHTML=stageHtml+`<div class="axes">${preHtml}</div>`;
    return;
  }
  box.innerHTML=stageHtml+
  `<div class="axes">${preHtml}${d.axes.map(a=>`<fieldset class="axis card"><legend>${esc(a.label)}${sel[a.key]?`<span class="count">${esc(sel[a.key]==='N0'&&d.id==='ccu'?'N0':(a.options.find(o=>o.v===sel[a.key])||{v:''}).v.replace(/^GG/,'GG ').replace(/^lt10$/,'< 10').replace(/^10a20$/,'10–20').replace(/^ge20$/,'≥ 20'))}</span>`:''}</legend>
    <div class="opts">${a.options.map(o=>`<button type="button" class="opt" data-ax="${esc(a.key)}" data-v="${esc(o.v)}" aria-pressed="${sel[a.key]===o.v}"><code>${esc(o.v.replace(/^GG/,'GG ').replace(/^lt10$/,'< 10').replace(/^10a20$/,'10–20').replace(/^ge20$/,'≥ 20'))}</code><span>${esc(o.d)}</span></button>`).join('')}</div></fieldset>`).join('')}
    <section class="tnm-notes card"><h4>Para tener en cuenta</h4><ul>${d.notes.map(n=>`<li>${esc(n)}</li>`).join('')}<li>Fuente: ${esc(d.source)}. Descripciones resumidas; ante duda, rige la tabla oficial.</li></ul></section>
    ${renderWorkup(t)}
  </div>`;
}
/* ---------- tratamiento: vía terapéutica según estadio ---------- */
const PW=()=>(window.FNRO.pathways||{});
const RG=()=>(window.FNRO.regimens||{});
const {engine:ENG,calc:CALC}=window.FNRO;
const COV={FNR:['fnr','Cubierto por FNR'],FTM:['ftm','Lo cubre el prestador (FTM)'],NC:['nc','Sin cobertura'],NA:['na','No farmacológico'],'?':['unk','Cobertura a verificar']};
const LVL={A:'Fase III con beneficio en SG o SLE',B:'Fase III con subrogado o fase II aleatorizado',C:'Fase II, subgrupo o consenso'};
function pathSt(){const p=P();p.path=p.path||{};return p.path[p.tumor]=p.path[p.tumor]||{a:{},open:{}};}
function refLink(r){const u=r.pmid?`https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(r.pmid)}/`:r.nct?`https://clinicaltrials.gov/study/${encodeURIComponent(r.nct)}`:r.url;
  return u&&/^https:\/\//.test(u)?`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(r.name||r.pmid||r.nct)}</a>`:esc(r.name||'');}
function covBadge(c){const x=COV[(c||{}).t]||COV['?'];return `<span class="cov ${x[0]}">${x[1]}</span>`;}
function renderRegimen(id){
  const rg=RG()[id];if(!rg)return '';
  const pr=P().params||{},bsa=CALC.bsa(pr),cc=CALC.crcl(pr);
  const f=(k,l,type,extra)=>`<label class="fld"><span>${l}</span><input id="pp-${k}" data-pp="${k}" type="${type||'text'}" inputmode="decimal" value="${esc(pr[k]||'')}" ${extra||''}></label>`;
  const rows=rg.drugs.map(d=>{const r=CALC.dose(d,pr);const x=d.dose||{};
    const rule=x.type==='m2'?`${x.value} ${x.unit||'mg'}/m²`:x.type==='kg'?`${x.value} ${x.unit||'mg'}/kg`:x.type==='auc'?`AUC ${x.value}`:x.type==='flat'?`${x.value} ${x.unit||'mg'}`:esc(x.value||'');
    const val=r.mg!=null?`<b>${CALC.fmt(r.mg)} ${esc(r.unit||x.unit||'mg')}</b><small>${esc(r.text)}</small>`:r.missing?`<small>Falta: ${esc(r.missing)}</small>`:`<small>${esc(r.text||'')}</small>`;
    return `<tr><td>${esc(d.name)}${d.day?`<small>${esc(d.day)}</small>`:''}</td><td>${rule}</td><td>${val}</td></tr>`;}).join('');
  return `<div class="rg">
    <div class="rg-h"><b>${esc(rg.name)}</b><span>${esc(rg.cycle||'')}</span></div>
    <div class="fields">${f('peso','Peso (kg)')}${f('talla','Talla (cm)')}${f('edad','Edad')}
      <label class="fld"><span>Sexo</span><select id="pp-sexo" data-pp="sexo"><option value="">—</option><option value="F" ${pr.sexo==='F'?'selected':''}>F</option><option value="M" ${pr.sexo==='M'?'selected':''}>M</option></select></label>
      ${f('creat','Creatinina (mg/dL)')}</div>
    <div class="derived"><span>SC <b>${bsa?bsa.toFixed(2)+' m²':'—'}</b> <small>Mosteller</small></span><span>ClCr <b>${cc?Math.round(cc)+' mL/min':'—'}</b> <small>Cockcroft-Gault</small></span></div>
    <div class="tbl"><table><thead><tr><th>Fármaco</th><th>Dosis</th><th>Para este paciente</th></tr></thead><tbody>${rows}</tbody></table></div>
    ${(rg.notes||[]).length?`<ul class="rg-notes">${rg.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}
    <p class="rg-foot">Dosis orientativas: verificá contra el protocolo institucional, función de órganos y toxicidad previa.${(rg.refs||[]).length?' Ref.: '+rg.refs.map(refLink).join(', '):''}</p>
  </div>`;
}
/* estado de revisión clínica de un ítem (registro en content/reviews/) */
function rvState(tid,nodeId,i,it){
  const ri={key:`${tid}/${nodeId}#${i}`,hash:ENG.fingerprint(it,it.regimen?RG()[it.regimen]:null)};
  return ENG.itemStatus(ri,(window.FNRO.reviews||{})[tid]);
}
const hiddenItem=(tid,id,i,it)=>it.retirado||rvState(tid,id,i,it).state==='retirado';
function renderRec(id,node,ps){
  const tid=P().tumor;
  const items=node.items.map((it,i)=>{if(hiddenItem(tid,id,i,it))return '';
    const k=id+':'+i,open=ps.open[k],picked=ps.plan&&ps.plan.k===k,rv=rvState(tid,id,i,it);
    return `<article class="rx ${picked?'picked':''}">
      <div class="rx-top"><h5>${esc(it.label)}</h5>${covBadge(it.cov)}</div>
      ${rv.state==='revisado'?`<span class="rv-badge">Revisado por dos oncólogos · ${esc(rv.date.slice(5,7)+'/'+rv.date.slice(0,4))}</span>`:rv.state==='discusion'?'<span class="rv-badge disc">En discusión entre revisores</span>':''}
      ${it.detail?`<p class="rx-d">${esc(it.detail)}</p>`:''}
      <div class="rx-meta">${it.level?`<span class="lv" title="${esc(LVL[it.level]||'')}">Evidencia ${esc(it.level)}</span>`:''}${(it.refs||[]).length?`<span class="refs">${it.refs.map(refLink).join(' · ')}</span>`:''}</div>
      <div class="rx-act">
        ${it.regimen&&RG()[it.regimen]?`<button type="button" class="btn" data-open="${esc(k)}" aria-expanded="${!!open}">${open?'Ocultar régimen':'Régimen y dosis'}</button>`:''}
        ${it.cov&&it.cov.t==='FNR'?`<button type="button" class="btn" data-fnr="${esc(it.cov.ind)}">Requisitos FNR →</button>`:''}
        <button type="button" class="btn ${picked?'primary':''}" data-pick="${esc(k)}">${picked?'En el plan ✓':'Elegir para el plan'}</button>
      </div>
      ${open&&it.regimen?renderRegimen(it.regimen):''}
    </article>`;}).join('');
  return `<section class="card rec"><div class="rec-h"><span class="phase">${esc(node.phase||'Recomendación')}</span><h4>${esc(node.title)}</h4></div>${items}${(node.notes||[]).length?`<ul class="rec-notes">${node.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}</section>`;
}
/* ítem de evaluación inicial (workup): mismo estilo que renderRec, sin botones de acción */
function renderWorkupItem(tid,nodeId,i,it){
  if(hiddenItem(tid,nodeId,i,it))return '';
  const rv=rvState(tid,nodeId,i,it);
  return `<article class="rx">
    <div class="rx-top"><h5>${esc(it.label)}</h5>${covBadge(it.cov)}</div>
    ${rv.state==='revisado'?`<span class="rv-badge">Revisado por dos oncólogos · ${esc(rv.date.slice(5,7)+'/'+rv.date.slice(0,4))}</span>`:rv.state==='discusion'?'<span class="rv-badge disc">En discusión entre revisores</span>':''}
    ${it.detail?`<p class="rx-d">${esc(it.detail)}</p>`:''}
    <div class="rx-meta">${it.level?`<span class="lv" title="${esc(LVL[it.level]||'')}">Evidencia ${esc(it.level)}</span>`:''}${(it.refs||[]).length?`<span class="refs">${it.refs.map(refLink).join(' · ')}</span>`:''}</div>
  </article>`;
}
/* tarjeta plegable de evaluación inicial (pw.workup), mostrada en Estadio y no en el recorrido de tratamiento */
function renderWorkup(t){
  const pw=PW()[t.id];if(!pw||!pw.workup)return '';
  const node=pw.nodes[pw.workup];if(!node)return '';
  const items=node.items.map((it,i)=>renderWorkupItem(t.id,pw.workup,i,it)).join('');
  return `<details class="card workup"><summary>${esc(node.title)}</summary><div class="rec">${items}${(node.notes||[]).length?`<ul class="rec-notes">${node.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}</div></details>`;
}
function planText(){
  const t=tumorObj(),ps=pathSt(),d=TNM[t.id],sel=(P().tnm||{})[t.id]||{},r=tnmStage(t.id,sel);
  const pl=ps.plan;if(!pl)return '';
  return `${d?d.name:t.name}${r.stage?` · ${tnmCode(d,sel)} · Estadio ${r.stage}`:''}\nPlan: ${pl.label}${pl.phase?` (${pl.phase})`:''} · ${(COV[pl.cov]||COV['?'])[1]}`;
}
function renderTx(t){
  const box=document.getElementById('v-tx'),pw=PW()[t.id];
  if(!pw){box.innerHTML='<section class="card empty"><h4>Todavía no hay vía terapéutica para este tumor</h4><p>Se va a sumar en próximas versiones. Mientras tanto están disponibles la estadificación y los requisitos FNR.</p></section>';return;}
  const tnmSelT=(P().tnm||{})[t.id]||{};
  if(t.id==='pulm'&&tnmSelT.HIST==='CPCP'){
    box.innerHTML=`<section class="card empty"><h4>Todavía no hay vía de tratamiento para cáncer de pulmón de células pequeñas</h4><p>Esta guía está redactada para cáncer de pulmón de células no pequeñas (no microcítico); el de células pequeñas está en la lista de tumores a agregar.</p></section>`;
    return;
  }
  const ps=pathSt(),st=tnmStage(t.id,tnmSelT).stage;
  const res=ENG.walk(pw,ps.a,st);
  let h='';
  if(t.id==='pulm'&&!tnmSelT.HIST)h+=`<div class="warn"><b>Elegí el tipo histológico en Estadio:</b> esta guía es para células no pequeñas.</div>`;
  const tr=ENG.tumorReview(t.id,pw,RG(),(window.FNRO.reviews||{})[t.id]);
  if(pw.status!=='revisado'||!tr.complete)h+=`<div class="warn"><b>Borrador sin revisión clínica completa.</b> ${tr.count.revisado||0} de ${tr.total} opciones tienen doble aprobación de oncólogos; las demás son preliminares: verificá cada recomendación antes de usarla. Actualizado ${esc(pw.updated)}.</div>`;
  h+=`<div class="card txbar"><div><span class="lbl">Estadio</span> ${st?`<b class="txst">${esc(st)}</b>`:'<span class="muted">sin estadificar: completá la pestaña 1 para que la guía sugiera el camino</span>'}</div>
    <div class="txbar-act">${ps.plan?`<button type="button" class="btn primary" id="plan-copy">Copiar plan</button>`:''}<button type="button" class="btn" id="tx-reset">Reiniciar</button></div></div>`;
  if(ps.plan)h+=`<div class="card plan"><span class="lbl">Plan elegido</span><div><b>${esc(ps.plan.label)}</b> ${covBadge({t:ps.plan.cov})}</div>${ps.plan.phase?`<small>${esc(ps.plan.phase)}</small>`:''}</div>`;
  h+='<ol class="steps">';
  res.steps.forEach(s=>{
    if(s.node.type==='q')h+=`<li class="step done"><span class="q">${esc(s.node.text)}</span><span class="a">${esc(s.node.options[s.chosen].label)}</span><button type="button" class="lnk" data-undo="${esc(s.id)}">Cambiar</button></li>`;
    else{h+=`<li class="step">${renderRec(s.id,s.node,ps)}</li>`;
      if(s.chosen!=null&&s.node.next)h+=`<li class="step done"><span class="q">Continuar</span><span class="a">${esc(s.node.next[s.chosen].label)}</span><button type="button" class="lnk" data-undo="${esc(s.id)}">Cambiar</button></li>`;}
  });
  const c=res.current;
  if(c){
    if(c.node.type==='q')h+=`<li class="step cur"><section class="card qn"><h4>${esc(c.node.text)}</h4>${c.node.help?`<p class="muted">${esc(c.node.help)}</p>`:''}
      <div class="qopts">${c.node.options.map((o,i)=>`<button type="button" class="qopt ${i===c.suggested?'sug':''}" data-ans="${esc(c.id)}" data-i="${i}">${esc(o.label)}${i===c.suggested?`<small>Sugerida por el estadio ${esc(st)}</small>`:''}</button>`).join('')}</div></section></li>`;
    else{h+=`<li class="step">${renderRec(c.id,c.node,ps)}</li>`;
      h+=`<li class="step cur"><section class="card qn"><h4>¿Cómo sigue?</h4><div class="qopts">${c.node.next.map((o,i)=>`<button type="button" class="qopt" data-ans="${esc(c.id)}" data-i="${i}">${esc(o.label)}</button>`).join('')}</div></section></li>`;}
  }
  h+='</ol>';
  h+=`<details class="card legend"><summary>Cómo leer esta guía</summary><ul>
    <li><b>Evidencia A</b>: ${LVL.A}. <b>B</b>: ${LVL.B}. <b>C</b>: ${LVL.C}.</li>
    <li>Cobertura: ${Object.keys(COV).map(k=>covBadge({t:k})).join(' ')}</li>
    <li>Guía propia, redactada a partir de ensayos clínicos, aprobaciones regulatorias, normativas FNR, el FTM y guías de acceso abierto. No reemplaza el juicio clínico ni el ateneo multidisciplinario.</li></ul></details>`;
  box.innerHTML=h;
}
function renderApp(){
  const t=tumorObj(),ind=curInd();
  const view=['tnm','tx','fnr'].indexOf(P().view)>=0?P().view:'tnm';
  document.querySelectorAll('#seg button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===view)));
  const st=tnmStage(t.id,(P().tnm||{})[t.id]).stage;
  document.getElementById('tab-tnm').innerHTML='Estadio'+(st?` <span class="sb">${esc(st)}</span>`:'');
  document.getElementById('v-tnm').hidden=view!=='tnm';
  document.getElementById('v-fnr').hidden=view!=='fnr';
  document.getElementById('v-tx').hidden=view!=='tx';
  document.getElementById('tab-tx').innerHTML='Tratamiento'+(pathSt().plan?' <span class="sb">✓</span>':'');
  if(view==='tnm')renderTnm(t);
  if(view==='tx')renderTx(t);
  document.getElementById('app').dataset.tumor=t.id;
  document.getElementById('pbar').innerHTML=`<span class="plabel">Paciente</span><b>${esc(CURRENT)}</b><button type="button" id="pbar-switch">Cambiar paciente</button>`;
  document.getElementById('tumors').innerHTML=TUMORS.map(x=>{
    const n=x.inds.filter(i=>{const[d,a]=prog(i);return d===a;}).length;
    return `<button type="button" class="tt" data-t="${x.id}" data-c="${x.id}" aria-pressed="${x.id===t.id}"><span class="dot"></span><b>${esc(x.name)}</b><small>${n?`${n}/${x.inds.length} ✓`:x.inds.length}</small></button>`;}).join('');
  document.getElementById('band').innerHTML=`<h2>${esc(t.name)}</h2><span>${esc(t.drugs)} · <b>${esc(t.src)}</b></span>`;
  document.getElementById('picker').innerHTML=t.groups.map(([g,l])=>{
    const cs=t.inds.filter(i=>i.g===g).map(i=>{const[d,a]=prog(i);
      return `<button type="button" class="chip" data-id="${i.id}" aria-pressed="${i.id===ind.id}"><span>${esc(i.chip)}${d===a?`<span class="done" title="Completo">${CHECK}</span>`:''}</span><small>${esc(i.sub)}</small></button>`;}).join('');
    return `<div class="grp-label" id="grp-${esc(t.id)}-${esc(g)}">${esc(l)}</div><div class="chips" role="group" aria-labelledby="grp-${esc(t.id)}-${esc(g)}">${cs}</div>`;}).join('');
  document.getElementById('i-title').textContent=ind.title;
  document.getElementById('i-setting').textContent=ind.setting;
  document.getElementById('i-proto').innerHTML=ind.proto.map(([k,v])=>`<div><span class="k">${esc(k)} ·</span> ${esc(v)}</div>`).join('');

  const inc=ind.inc.map((x,n)=>typeof x==='object'
    ?`<li><div class="orgroup"><div class="sub">${esc(x.label||'Al menos uno de')}<span class="tag">cualquiera</span></div><ul class="items">${x.or.map((o,j)=>item(ind,'inc'+n+'o'+j,esc(o))).join('')}</ul></div></li>`
    :item(ind,'inc'+n,esc(x))).join('');
  const exc=ind.exc.map((x,n)=>item(ind,'exc'+n,esc(x))).join('');
  const tr=TRAMITE.map((x,n)=>item(ind,'tr'+n,esc(x))).join('');
  const P_=paraFor(ind);
  const cnt=p=>{const[d,a]=prog(ind,p);return d+'/'+a;};
  let html=`
  <section class="card blk inc"><div class="blk-h"><h4>Inclusión</h4><span class="hint">marcar lo que cumple</span><span class="count">${cnt('inc')}</span></div><ul class="items">${inc}</ul></section>
  <section class="card blk exc"><div class="blk-h"><h4>Exclusión</h4><span class="hint">marcar lo descartado</span><span class="count">${cnt('exc')}</span></div><ul class="items">${exc}</ul></section>
  <section class="card blk"><div class="blk-h"><h4>Paraclínica a enviar</h4><span class="count">${cnt('p')}</span></div><ul class="items">${P_.req.map(p=>item(ind,p.k,esc(p.t))).join('')}</ul>
   ${P_.cond.length?`<div class="sub">Si corresponde</div><ul class="items">${P_.cond.map(p=>item(ind,p.k,esc(p.t),`<br><em>${esc(p.cond)}</em>`)).join('')}</ul>`:''}
   ${P_.sug.length?`<div class="sub">Sugeridos, no indispensables</div><ul class="items plain sug">${P_.sug.map(p=>`<li><span>${esc(p.t)}</span></li>`).join('')}</ul>`:''}
  </section>
  <section class="card blk"><div class="blk-h"><h4>Trámite</h4><span class="count">${cnt('tr')}</span></div><ul class="items">${tr}</ul></section>`;
  if(ind.indv)html+=`<section class="card blk indv"><div class="blk-h"><h4>Se discute individualizado</h4></div><ul class="items plain">${ind.indv.map(x=>`<li><span>${esc(x)}</span></li>`).join('')}</ul></section>`;
  if(ind.notes&&ind.notes.length){const L={c:'Dato confirmado',i:'Inferencia razonable',e:'Extrapolación'};
    html+=`<section class="card blk ${ind.indv?'':'wide'}"><div class="blk-h"><h4>Ojo con</h4></div><div class="notes">${ind.notes.map(([l,x])=>`<div class="note"><span class="lvl ${l}">${L[l]}</span><span>${esc(x)}</span></div>`).join('')}</div></section>`;}
  document.getElementById('cols').innerHTML=html;
  const[d,a]=prog(ind);
  document.getElementById('bar').style.width=(a?d/a*100:0)+'%';
  document.getElementById('meter-txt').innerHTML='<b>'+d+'</b> de '+a+' obligatorios';
  document.getElementById('fu-list').innerHTML=t.fu.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('foot').textContent='Las fichas se guardan sólo en este dispositivo. '+(view==='fnr'?'Ayuda de lectura: ante duda, rige el texto vigente en fnr.gub.uy. Fuente de esta sección: '+t.src+'.':view==='tx'?'Guía propia en borrador: no reemplaza el juicio clínico ni el ateneo multidisciplinario.':'Descripciones resumidas de las tablas oficiales; ante duda, rige la tabla original.');
}

document.addEventListener('click',e=>{
  if(e.target.closest('#pbar-switch')){leavePatient();return;}
  if(!CURRENT)return;
  const tb=e.target.closest('.tt');
  if(tb){P().tumor=tb.dataset.t;P().updatedAt=Date.now();saveStore();renderApp();return;}
  const sv=e.target.closest('#seg button');
  if(sv){P().view=sv.dataset.view;saveStore();renderApp();return;}
  const op=e.target.closest('.opt');
  if(op){const sel=tnmSel();sel[op.dataset.ax]=sel[op.dataset.ax]===op.dataset.v?undefined:op.dataset.v;P().updatedAt=Date.now();saveStore();
    const y=window.scrollY;renderApp();window.scrollTo(0,y);
    const el=document.querySelector(`.opt[data-ax="${op.dataset.ax}"][data-v="${op.dataset.v}"]`);if(el)el.focus({preventScroll:true});return;}
  if(e.target.closest('#tnm-clear')){P().tnm[P().tumor]={};saveStore();renderApp();return;}
  if(e.target.closest('#tnm-copy')){
    const t=tumorObj(),d=TNM[t.id],sel=tnmSel(),r=tnmStage(t.id,sel);
    const txt=`${d.name} · ${tnmCode(d,sel)} · Estadio ${r.stage} (${d.edition})`;
    const done=()=>toast('Resumen copiado');
    try{navigator.clipboard.writeText(txt).then(done,()=>toast(txt));}catch(err){toast(txt);}
    return;}
  const an=e.target.closest('[data-ans]');
  if(an){const ps=pathSt();ps.a[an.dataset.ans]=+an.dataset.i;P().updatedAt=Date.now();saveStore();const y=window.scrollY;renderApp();window.scrollTo(0,y);
    const cur=document.querySelector('.step.cur');if(cur)cur.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
  const un=e.target.closest('[data-undo]');
  if(un){const ps=pathSt(),res=ENG.walk(PW()[P().tumor],ps.a,null),i=res.steps.findIndex(s=>s.id===un.dataset.undo);
    res.steps.slice(Math.max(i,0)).forEach(s=>{delete ps.a[s.id];});saveStore();const y=window.scrollY;renderApp();window.scrollTo(0,y);return;}
  const opn=e.target.closest('[data-open]');
  if(opn){const ps=pathSt(),k=opn.dataset.open;ps.open[k]=!ps.open[k];saveStore();const y=window.scrollY;renderApp();window.scrollTo(0,y);return;}
  const pk=e.target.closest('[data-pick]');
  if(pk){const ps=pathSt(),k=pk.dataset.pick,[nid,i]=[k.slice(0,k.lastIndexOf(':')),+k.slice(k.lastIndexOf(':')+1)];
    const node=PW()[P().tumor].nodes[nid],it=node&&node.items[i];
    if(it){ps.plan=ps.plan&&ps.plan.k===k?null:{k,label:it.label,cov:(it.cov||{}).t,ind:(it.cov||{}).ind,phase:node.phase||node.title};P().updatedAt=Date.now();saveStore();const y=window.scrollY;renderApp();window.scrollTo(0,y);}return;}
  const fb=e.target.closest('[data-fnr]');
  if(fb){const t=tumorObj();if(t.inds.some(i=>i.id===fb.dataset.fnr))P().sel[t.id]=fb.dataset.fnr;P().view='fnr';saveStore();renderApp();window.scrollTo(0,0);return;}
  if(e.target.closest('#tx-reset')){P().path[P().tumor]={a:{},open:{}};saveStore();renderApp();return;}
  if(e.target.closest('#plan-copy')){const txt=planText();try{navigator.clipboard.writeText(txt).then(()=>toast('Plan copiado'),()=>toast(txt));}catch(err){toast(txt);}return;}
  const b=e.target.closest('.chip');
  if(b){P().sel[P().tumor]=b.dataset.id;P().updatedAt=Date.now();saveStore();renderApp();}
});
document.getElementById('cols').addEventListener('change',e=>{
  const k=e.target.dataset.k;if(!k||!CURRENT)return;const ind=curInd();
  (P().checks[ind.id]=P().checks[ind.id]||{})[k]=e.target.checked;P().updatedAt=Date.now();saveStore();
  const y=window.scrollY;renderApp();window.scrollTo(0,y);
  const el=document.getElementById(ind.id+'__'+k);if(el)el.focus({preventScroll:true});
});
document.getElementById('v-tx').addEventListener('change',e=>{
  const k=e.target.dataset.pp;if(!k||!CURRENT)return;
  const p=P();p.params=p.params||{};p.params[k]=e.target.value.trim();p.updatedAt=Date.now();saveStore();
  const y=window.scrollY;renderApp();window.scrollTo(0,y);
  const el=document.getElementById('pp-'+k);if(el)el.focus({preventScroll:true});
});
document.getElementById('reset').addEventListener('click',()=>{if(!CURRENT)return;P().checks[curInd().id]={};P().updatedAt=Date.now();saveStore();renderApp();});

/* botón / gesto "atrás" del celular: vuelve a la pantalla de pacientes en vez de cerrar la app */
window.addEventListener('popstate',e=>{
  const st=e.state;
  if(st&&st.fnrPatient&&STORE.patients[st.fnrPatient]){openPatient(st.fnrPatient,true);}
  else if(CURRENT){backToGate();}
});
try{history.replaceState({fnrGate:true},'');}catch(e){}
renderGate();
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{});}
/* pide al navegador que no borre las fichas guardadas por falta de espacio o inactividad */
if(navigator.storage&&navigator.storage.persist){navigator.storage.persist().catch(()=>{});}
})();
