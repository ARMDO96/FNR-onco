/* Modo revisión clínica: cada revisor aprueba u objeta cada opción terapéutica, a ciegas del otro,
   y exporta sus decisiones para incorporarlas al registro del repositorio (content/reviews/). */
(function(){
"use strict";
const R=window.FNRO,ENG=R.engine,CALC=R.calc;
const KEY='fnr-onco-review-v1';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Date().toISOString().slice(0,10);
const EXAMPLE={peso:'70',talla:'170',edad:'60',sexo:'M',creat:'1'};
const ROLE_NAME={editor:'Editor clínico responsable',segundo:'Segundo revisor'};
const DEC={aprobar:'Aprobar','aprobar-menor':'Aprobar con cambio menor',objetar:'Objetar',retirar:'Retirar'};
const COVN={FNR:'Cubierto por FNR',FTM:'Prestador (FTM)',NC:'Sin cobertura',NA:'No farmacológico','?':'Cobertura a verificar'};
const STN={pendiente:'Pendiente',parcial:'1 de 2 aprobaciones',revisado:'Revisado',caducado:'Caducado',discusion:'En discusión',retirado:'Retirado'};

let S={me:{role:'',name:'',coi:''},d:{},closed:{}};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.d)S=Object.assign(S,s);}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};
let tumor=null,filter='pend',exportText='';

const box=()=>document.getElementById('review');
const tumors=()=>Object.keys(R.pathways||{});
const registry=t=>(R.reviews&&R.reviews[t])||[];
const items=t=>ENG.reviewItems(t,R.pathways[t],R.regimens||{}).filter(ri=>!ri.item.retirado);
const mine=ri=>{const d=S.d[ri.key];return d&&d.hash===ri.hash?d:null;};
function needsDose(ri){return !!(ri.item.regimen&&R.regimens[ri.item.regimen]);}
const approves=d=>d.decision==='aprobar'||d.decision==='aprobar-menor'; // "con cambio menor" también cuenta como aprobación
const hasComment=d=>!!(d.comment&&d.comment.trim());
function checked(ri,d){const c=d.checks||{};return !!(c.ref&&c.lvl&&c.cov&&(!needsDose(ri)||c.dose));}
function complete(ri){const d=mine(ri);if(!d||!d.decision)return false;
  return (!approves(d)||checked(ri,d))&&(d.decision==='aprobar'||hasComment(d));}

function refLine(r){
  const c=R.refsCache||{},m=r.pmid?(c.pmid||{})[r.pmid]:r.nct?(c.nct||{})[String(r.nct).toUpperCase()]:null;
  const u=r.pmid?`https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(r.pmid)}/`:r.nct?`https://clinicaltrials.gov/study/${encodeURIComponent(r.nct)}`:r.url;
  const real=m?`<span class="rv-real">${esc(m.title)}${m.journal?` · ${esc(m.journal)} ${esc(m.year||'')}`:''}${m.doi?` · <a href="https://doi.org/${esc(m.doi)}" target="_blank" rel="noopener">DOI</a>`:''}</span>`
    :(r.pmid||r.nct)?'<span class="rv-real warn-t">Título real todavía no verificado: abrí el enlace</span>':'';
  return `<li><a href="${esc(u||'#')}" target="_blank" rel="noopener">${esc(r.name||r.pmid||r.nct)}${r.pmid?` · PMID ${esc(r.pmid)}`:r.nct?` · ${esc(r.nct)}`:''}</a>${real}</li>`;
}
function regimenBlock(id){
  const rg=R.regimens[id];if(!rg)return '';
  const rows=rg.drugs.map(d=>{const x=d.dose||{},r=CALC.dose(d,EXAMPLE);
    const rule=x.type==='m2'?`${x.value} ${x.unit||'mg'}/m²`:x.type==='kg'?`${x.value} ${x.unit||'mg'}/kg`:x.type==='auc'?`AUC ${x.value}`:x.type==='flat'?`${x.value} ${x.unit||'mg'}`:esc(x.value);
    return `<tr><td>${esc(d.name)}${d.day?` <small>${esc(d.day)}</small>`:''}</td><td>${rule}</td><td>${r.mg!=null?`${CALC.fmt(r.mg)} ${esc(r.unit||x.unit||'mg')}`:''}</td></tr>`;}).join('');
  return `<div class="rv-rg"><b>${esc(rg.name)}</b> · ${esc(rg.cycle||'')}
    <div class="tbl"><table><thead><tr><th>Fármaco</th><th>Dosis</th><th>Ejemplo 70 kg · 170 cm · ClCr 78</th></tr></thead><tbody>${rows}</tbody></table></div>
    ${(rg.notes||[]).length?`<ul>${rg.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}</div>`;
}
function covBlock(it){
  const c=it.cov||{};let h=`<span class="cov ${({FNR:'fnr',FTM:'ftm',NC:'nc',NA:'na'})[c.t]||'unk'}">${esc(COVN[c.t]||COVN['?'])}</span>`;
  if(c.t==='FNR'){const ind=R.fnr.TUMORS.flatMap(t=>t.inds.map(i=>Object.assign({src:t.src},i))).find(i=>i.id===c.ind);
    if(ind)h+=` <span class="muted">Normativa: ${esc(ind.title)} · ${esc(ind.setting)} · ${esc(ind.src)}</span>`;}
  return h;
}
function card(ri,st){
  const d=mine(ri)||{},c=d.checks||{},closed=!!S.closed[tumor];
  const other=closed?registry(tumor).filter(x=>x.item===ri.key&&x.hash===ri.hash&&x.role!==S.me.role).slice(-1)[0]:null;
  const chk=(k,l)=>`<label class="rv-chk"><input type="checkbox" data-rk="${esc(ri.key)}" data-ck="${k}" ${c[k]?'checked':''}> ${l}</label>`;
  return `<article class="card rv-item ${complete(ri)?'done':''}" id="rv-${esc(ri.key.replace(/[^a-z0-9]/gi,'_'))}">
    <div class="rv-path">${esc(ri.node.phase||'')} · ${esc(ri.node.title)}</div>
    <h4>${esc(ri.item.label)}</h4>
    ${ri.item.detail?`<p class="rx-d">${esc(ri.item.detail)}</p>`:''}
    <div class="rv-meta">${covBlock(ri.item)}${ri.item.level?` <span class="lv">Evidencia ${esc(ri.item.level)}</span>`:''}</div>
    ${(ri.item.refs||[]).length?`<ul class="rv-refs">${ri.item.refs.map(refLine).join('')}</ul>`:''}
    ${needsDose(ri)?regimenBlock(ri.item.regimen):''}
    <div class="rv-checks">
      ${chk('ref','Abrí la referencia: existe y respalda esta opción en esta población y línea')}
      ${chk('lvl','El nivel de evidencia cumple la escala A/B/C')}
      ${chk('cov','La cobertura coincide con la normativa FNR vigente o con el FTM')}
      ${needsDose(ri)?chk('dose','Dosis y ciclo correctos'):''}
      <label class="rv-chk coi"><input type="checkbox" data-rk="${esc(ri.key)}" data-ck="coi" ${d.coi?'checked':''}> Tengo un vínculo con la industria relacionado con esta opción (mi aprobación no cuenta)</label>
    </div>
    <div class="rv-dec" role="group" aria-label="Decisión">${Object.keys(DEC).map(k=>`<button type="button" class="btn ${d.decision===k?'primary':''}" data-rk="${esc(ri.key)}" data-dec="${k}" aria-pressed="${d.decision===k}">${DEC[k]}</button>`).join('')}</div>
    <textarea class="rv-com" data-rk="${esc(ri.key)}" placeholder="${d.decision&&d.decision!=='aprobar'?'Comentario obligatorio: qué cambiarías y por qué (con fuente)':'Comentario (opcional)'}" rows="2">${esc(d.comment||'')}</textarea>
    ${d.decision&&approves(d)&&!checked(ri,d)?'<p class="rv-miss">Para aprobar marcá todos los controles.</p>':''}
    ${d.decision&&d.decision!=='aprobar'&&!hasComment(d)?'<p class="rv-miss">Falta el comentario.</p>':''}
    <div class="rv-foot">${closed?`<span class="rv-st ${st.state}">Registro: ${esc(STN[st.state])}${st.date?` · ${esc(st.date)}`:''}</span>`:''}${other?`<span class="muted">Otro revisor: ${esc(DEC[other.decision]||other.decision)}${other.comment?` — ${esc(other.comment)}`:''}</span>`:''}</div>
  </article>`;
}
function render(){
  const el=box();
  if(!S.me.role){
    el.innerHTML=`<header class="top"><h1>Modo revisión</h1><p>Cada opción terapéutica necesita dos aprobaciones independientes antes de dejar de ser borrador. Elegí tu rol una sola vez en este dispositivo.</p></header>
    <section class="card rv-me">
      <label class="fld"><span>Rol</span><select id="rv-role"><option value="">—</option><option value="editor">${ROLE_NAME.editor}</option><option value="segundo">${ROLE_NAME.segundo}</option></select></label>
      <label class="fld"><span>Nombre (aparece en el registro)</span><input id="rv-name" type="text" autocomplete="name"></label>
      <label class="fld"><span>Declaración de conflictos de interés (honorarios, estudios, viajes financiados por la industria en los últimos 3 años; "ninguno" si no hay)</span><textarea id="rv-coi" rows="3"></textarea></label>
      <div class="rv-row"><button type="button" class="btn primary" id="rv-start">Empezar</button><button type="button" class="btn" id="rv-exit">Salir</button></div>
    </section>`;return;
  }
  if(!tumor)tumor=tumors()[0];
  const all=items(tumor),reg=registry(tumor);
  const withSt=all.map(ri=>({ri,st:ENG.itemStatus(ri,reg)}));
  const done=all.filter(complete).length;
  const shown=withSt.filter(({ri,st})=>filter==='all'||(filter==='pend'?!complete(ri):filter==='obj'?(mine(ri)||{}).decision==='objetar'||st.state==='discusion':st.state==='caducado'));
  el.innerHTML=`<header class="top"><h1>Modo revisión</h1><p>${esc(ROLE_NAME[S.me.role])}: ${esc(S.me.name||'sin nombre')} · <button type="button" class="lnk" id="rv-who">cambiar</button> · <button type="button" class="lnk" id="rv-exit">salir</button></p></header>
    <div class="tumors">${tumors().map(t=>{const n=items(t),k=n.filter(complete).length;return `<button type="button" class="tt" data-rvt="${t}" data-c="${t}" aria-pressed="${t===tumor}"><span class="dot"></span><b>${esc(R.pathways[t].title)}</b><small>${k}/${n.length}</small></button>`;}).join('')}</div>
    <div class="card rv-bar"><div><b>${done}</b> de ${all.length} ítems con tu decisión completa${S.closed[tumor]?` · pasada cerrada el ${esc(S.closed[tumor])}`:''}</div>
      <div class="bar"><i style="width:${all.length?done/all.length*100:0}%"></i></div>
      <div class="rv-row">${[['pend','Pendientes'],['obj','Objetados'],['old','Caducados'],['all','Todos']].map(([k,l])=>`<button type="button" class="btn ${filter===k?'primary':''}" data-rvf="${k}">${l}</button>`).join('')}
        <button type="button" class="btn primary" id="rv-export">${S.closed[tumor]?'Exportar de nuevo':'Cerrar pasada y exportar'}</button></div>
      <p class="muted">Revisión a ciegas: las decisiones del otro revisor se muestran recién cuando cerrás tu pasada de este tumor.</p></div>
    ${exportText?`<section class="card rv-exp"><h4>Archivo de revisión</h4><p>Enviá este archivo al mantenimiento técnico (WhatsApp, mail o pegado en el chat). Incluye las huellas del contenido que revisaste.</p>
      <textarea id="rv-json" rows="6" readonly>${esc(exportText)}</textarea>
      <div class="rv-row"><button type="button" class="btn primary" id="rv-copy">Copiar</button><button type="button" class="btn" id="rv-dl">Descargar archivo</button>${navigator.share?'<button type="button" class="btn" id="rv-share">Compartir</button>':''}</div></section>`:''}
    <div class="rv-list">${shown.length?shown.map(({ri,st})=>card(ri,st)).join(''):'<p class="gate-empty">No hay ítems en este filtro.</p>'}</div>`;
}
function exportFile(){
  const all=items(tumor),missing=all.filter(ri=>!complete(ri)).length;
  const decisions=all.filter(complete).map(ri=>{const d=mine(ri);return {item:ri.key,hash:ri.hash,decision:d.decision,checks:d.checks||{},comment:(d.comment||'').trim(),coi:!!d.coi,date:d.date};});
  const out={format:'fnr-onco-revision',version:1,tumor,role:S.me.role,name:S.me.name,coi:S.me.coi,exportedAt:new Date().toISOString(),pending:missing,decisions};
  S.closed[tumor]=today();save();
  exportText=JSON.stringify(out,null,1);
}
function upd(key,f){const all=items(tumor),ri=all.find(x=>x.key===key);if(!ri)return;
  const d=S.d[key]&&S.d[key].hash===ri.hash?S.d[key]:{hash:ri.hash,checks:{}};f(d);d.date=today();S.d[key]=d;save();}

document.addEventListener('click',e=>{
  if(e.target.closest('#rv-open')){document.getElementById('gate').hidden=true;document.getElementById('app').hidden=true;box().hidden=false;exportText='';render();window.scrollTo(0,0);return;}
  if(!box()||box().hidden)return;
  const t=e.target;
  if(t.closest('#rv-exit')){box().hidden=true;document.getElementById('gate').hidden=false;window.scrollTo(0,0);return;}
  if(t.closest('#rv-who')){S.me.role='';save();render();return;}
  if(t.closest('#rv-start')){const role=document.getElementById('rv-role').value;if(!role)return;
    S.me={role,name:document.getElementById('rv-name').value.trim(),coi:document.getElementById('rv-coi').value.trim()};save();render();return;}
  const tb=t.closest('[data-rvt]');if(tb){tumor=tb.dataset.rvt;exportText='';render();return;}
  const fb=t.closest('[data-rvf]');if(fb){filter=fb.dataset.rvf;render();return;}
  const db=t.closest('[data-dec]');if(db){const y=window.scrollY;upd(db.dataset.rk,d=>{d.decision=d.decision===db.dataset.dec?'':db.dataset.dec;});render();window.scrollTo(0,y);return;}
  if(t.closest('#rv-export')){exportFile();render();const x=document.getElementById('rv-json');if(x)x.scrollIntoView({block:'center'});return;}
  if(t.closest('#rv-copy')){const x=document.getElementById('rv-json');try{navigator.clipboard.writeText(exportText).catch(()=>{x.select();});}catch(err){x.select();}return;}
  if(t.closest('#rv-dl')){const b=new Blob([exportText],{type:'application/json'}),a=document.createElement('a');
    a.href=URL.createObjectURL(b);a.download=`revision-${tumor}-${S.me.role}-${today()}.json`;document.body.appendChild(a);a.click();a.remove();return;}
  if(t.closest('#rv-share')){try{const f=new File([exportText],`revision-${tumor}-${S.me.role}-${today()}.json`,{type:'application/json'});
    navigator.share(navigator.canShare&&navigator.canShare({files:[f]})?{files:[f],title:'Revisión FNR-onco'}:{text:exportText,title:'Revisión FNR-onco'}).catch(()=>{});}catch(err){}return;}
});
document.addEventListener('change',e=>{
  if(!box()||box().hidden)return;
  const t=e.target,k=t.dataset.rk;if(!k)return;
  const y=window.scrollY;
  if(t.dataset.ck){upd(k,d=>{if(t.dataset.ck==='coi')d.coi=t.checked;else d.checks[t.dataset.ck]=t.checked;});}
  else if(t.classList.contains('rv-com')){upd(k,d=>{d.comment=t.value;});}
  render();window.scrollTo(0,y);
});
})();
