/* Motor de vías terapéuticas: recorre el flujograma según las respuestas guardadas. Sin DOM. */
(function(R){
"use strict";

/* Opción sugerida por el estadio del paciente (índice o -1) */
function suggest(node,stage){
  if(!stage||!node||node.type!=='q')return -1;
  return node.options.findIndex(o=>Array.isArray(o.stages)&&o.stages.indexOf(stage)>=0);
}

/* Recorre desde start. answers: {nodeId: índice de opción (q) o de "next" (rec)}.
   Devuelve {steps:[{id,node,chosen}], current:{id,node}|null} */
function walk(pw,answers,stage){
  const steps=[],seen={};
  let id=pw&&pw.start;
  answers=answers||{};
  while(id&&pw.nodes[id]&&!seen[id]){
    seen[id]=1;
    const node=pw.nodes[id],a=answers[id];
    const opts=node.type==='q'?node.options:(node.next||[]);
    if(node.type==='rec'&&!opts.length){steps.push({id,node,chosen:null});return {steps,current:null,end:true};}
    if(a==null||!opts[a]){return {steps,current:{id,node,suggested:suggest(node,stage)}};}
    steps.push({id,node,chosen:a});
    id=opts[a].next;
  }
  return {steps,current:null,end:true};
}

/* Todos los nodos rec visitados en el recorrido (para el resumen del plan) */
function recs(res){return res.steps.filter(s=>s.node.type==='rec').concat(res.current&&res.current.node.type==='rec'?[{id:res.current.id,node:res.current.node}]:[]);}

/* Validación estructural de una vía (lista de errores en texto) */
function check(pw,ctx){
  const e=[],N=pw.nodes||{},ids=Object.keys(N);
  ctx=ctx||{};
  if(!N[pw.start])e.push(`start "${pw.start}" no existe`);
  for(const id of ids){
    const n=N[id];
    if(n.type!=='q'&&n.type!=='rec'){e.push(`${id}: type inválido`);continue;}
    const opts=n.type==='q'?n.options:(n.next||[]);
    if(n.type==='q'&&(!opts||!opts.length))e.push(`${id}: pregunta sin opciones`);
    (opts||[]).forEach((o,i)=>{if(!N[o.next])e.push(`${id}[${i}]: next "${o.next}" no existe`);
      (o.stages||[]).forEach(s=>{if(ctx.stages&&ctx.stages.indexOf(s)<0)e.push(`${id}[${i}]: estadio "${s}" desconocido`);});});
    if(n.type==='rec'){
      if(!n.items||!n.items.length)e.push(`${id}: recomendación sin ítems`);
      (n.items||[]).forEach((it,i)=>{
        const w=`${id}.items[${i}]`;
        if(!it.label)e.push(`${w}: sin label`);
        const c=it.cov&&it.cov.t;
        if(['FNR','FTM','NC','NA','?'].indexOf(c)<0)e.push(`${w}: cov inválida`);
        if(c==='FNR'&&!(ctx.fnrInds&&ctx.fnrInds.indexOf(it.cov.ind)>=0))e.push(`${w}: indicación FNR "${it.cov&&it.cov.ind}" no existe`);
        if(c!=='NA'){
          if(['A','B','C'].indexOf(it.level)<0)e.push(`${w}: nivel de evidencia inválido`);
          if(!it.refs||!it.refs.length)e.push(`${w}: sin referencias`);
        }
        (it.refs||[]).forEach((r,j)=>{if(!r.pmid&&!r.nct&&!r.url)e.push(`${w}.refs[${j}]: sin pmid/nct/url`);});
        if(it.regimen&&!(ctx.regimens&&ctx.regimens[it.regimen]))e.push(`${w}: régimen "${it.regimen}" no existe`);
      });
    }
  }
  /* alcanzabilidad y ciclos */
  const color={};/* 1 = en curso, 2 = terminado */
  const visit=(id,from)=>{
    if(!N[id])return;
    if(color[id]===1){e.push(`ciclo: ${from} → ${id}`);return;}
    if(color[id]===2)return;
    color[id]=1;const n=N[id];
    ((n.type==='q'?n.options:n.next)||[]).forEach(o=>visit(o.next,id));
    color[id]=2;
  };
  visit(pw.start,'start');
  ids.filter(id=>!color[id]).forEach(id=>e.push(`${id}: nodo inalcanzable`));
  return e;
}

/* ---------- revisión clínica ---------- */

/* JSON con claves ordenadas: la misma estructura da siempre el mismo texto */
function stable(x){
  if(Array.isArray(x))return '['+x.map(stable).join(',')+']';
  if(x&&typeof x==='object')return '{'+Object.keys(x).sort().filter(k=>x[k]!==undefined).map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}';
  return JSON.stringify(x);
}
/* FNV-1a de 32 bits en hexadecimal: suficiente para detectar cambios, no es criptográfico */
function fnv(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return ('0000000'+h.toString(16)).slice(-8);}

/* Huella de un ítem: todo lo que un revisor aprueba (texto, cobertura, evidencia, citas y régimen con dosis) */
function fingerprint(item,regimen){
  const it={label:item.label,detail:item.detail,level:item.level,cov:item.cov,refs:item.refs,regimen:item.regimen};
  const rg=regimen?{name:regimen.name,cycle:regimen.cycle,drugs:regimen.drugs,notes:regimen.notes}:null;
  return fnv(stable({it,rg}));
}

/* Ítems revisables de una vía: [{key, nodeId, idx, node, item, hash}] */
function reviewItems(tid,pw,regimens){
  const out=[];
  Object.keys(pw.nodes).forEach(id=>{const n=pw.nodes[id];if(n.type!=='rec')return;
    n.items.forEach((it,i)=>out.push({key:`${tid}/${id}#${i}`,nodeId:id,idx:i,node:n,item:it,hash:fingerprint(it,it.regimen&&regimens?regimens[it.regimen]:null)}));});
  return out;
}

const ROLES=['editor','segundo'];
const DAY=86400000,VALID_DAYS=365;
/* Estado de un ítem según el registro de decisiones.
   decisions: [{item, hash, role, date:'AAAA-MM-DD', decision:'aprobar'|'aprobar-menor'|'objetar'|'retirar', coi:bool}]
   Devuelve {state:'pendiente'|'parcial'|'revisado'|'caducado'|'discusion'|'retirado', date, expires} */
function itemStatus(ri,decisions,today){
  const now=today?Date.parse(today):Date.now();
  const mine=(decisions||[]).filter(d=>d.item===ri.key);
  const cur=mine.filter(d=>d.hash===ri.hash);
  /* última decisión vigente de cada rol */
  const last={};
  cur.slice().sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0).forEach(d=>{if(ROLES.indexOf(d.role)>=0)last[d.role]=d;});
  const ds=ROLES.map(r=>last[r]).filter(Boolean);
  if(ds.some(d=>d.decision==='retirar'))return {state:'retirado'};
  if(ds.some(d=>d.decision==='objetar'))return {state:'discusion'};
  const ok=r=>last[r]&&(last[r].decision==='aprobar'||last[r].decision==='aprobar-menor')&&!last[r].coi;
  if(ROLES.every(ok)){
    const date=ROLES.map(r=>last[r].date).sort()[1];
    const expires=new Date(Date.parse(date)+VALID_DAYS*DAY).toISOString().slice(0,10);
    return Date.parse(expires)<now?{state:'caducado',date,expires}:{state:'revisado',date,expires};
  }
  if(ds.length)return {state:'parcial'};
  return {state:mine.length?'caducado':'pendiente'};
}

/* Resumen de un tumor: conteo por estado y si está completo */
function tumorReview(tid,pw,regimens,decisions,today){
  const items=reviewItems(tid,pw,regimens).filter(ri=>!ri.item.retirado);
  const count={};
  const st=items.map(ri=>{const s=itemStatus(ri,decisions,today);count[s.state]=(count[s.state]||0)+1;return Object.assign({ri},s);});
  return {items:st,count,total:items.length,complete:items.length>0&&(count.revisado||0)===items.length};
}

R.engine={walk,suggest,recs,check,fingerprint,reviewItems,itemStatus,tumorReview,ROLES};
})(window.FNRO=window.FNRO||{});
