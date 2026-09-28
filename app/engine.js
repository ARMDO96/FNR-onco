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

R.engine={walk,suggest,recs,check};
})(window.FNRO=window.FNRO||{});
