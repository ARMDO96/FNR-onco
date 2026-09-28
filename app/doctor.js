/* Área médica: panel de inicio con la bandeja de lo que reportan los pacientes (fecha coordinada, confirmación,
   comentarios, síntomas y alarmas, con fecha y hora) y el estado de la revisión clínica por tumor.
   En modo demostración lee los datos ficticios de app/demo.js; con servidor, las RPC auditadas. */
(function(){
const R=window.FNRO,D=R.demo,ENG=R.engine;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const corta=iso=>new Date(iso).toLocaleString('es-UY',{timeZone:'America/Montevideo',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const ICON={alarma:'!',sintoma:'S',comentario:'C',confirmacion:'✓',fecha:'F'};
const LABEL={alarma:'Alarma',sintoma:'Síntoma',comentario:'Comentario',confirmacion:'Confirmación',fecha:'Fecha coordinada'};
let filtro='pendientes';

function revision(){
  const rows=Object.entries(R.pathways||{}).map(([tid,pw])=>{
    const tr=ENG.tumorReview(tid,pw,R.regimens||{},(R.reviews||{})[tid]||[]);
    const n=tr.items.length,ok=tr.items.filter(s=>s.state==='revisado').length,
      part=tr.items.filter(s=>s.state==='parcial').length;
    return `<li data-c="${tid}"><span class="dot"></span><span class="rv-name">${esc(pw.title)}</span>
      <span class="rv-bar" role="img" aria-label="${ok} de ${n} ítems revisados"><i style="width:${n?Math.round(100*ok/n):0}%"></i><i class="half" style="width:${n?Math.round(100*part/n):0}%"></i></span>
      <span class="muted small">${ok}/${n}</span></li>`;
  });
  return `<section class="card dash-card"><div class="dash-h"><h2>Revisión clínica</h2><button type="button" class="linkbtn" id="dash-rv">Abrir modo revisión</button></div>
    <p class="muted small">Ítems con doble aprobación vigente por tumor (barra clara: 1 de 2). Hasta completar un tumor, sus opciones se muestran como borrador.</p>
    <ul class="rv-list">${rows.join('')}</ul></section>`;
}
function bandeja(){
  const ev=D.get().eventos,pend=ev.filter(e=>!e.visto),lista=filtro==='pendientes'?pend:ev,p=D.get().paciente;
  const alarmas=pend.filter(e=>e.tipo==='alarma').length;
  return `<section class="card dash-card"><div class="dash-h"><h2>Bandeja de pacientes</h2>
      <div class="seg mini" role="tablist">${[['pendientes',`Sin ver (${pend.length})`],['todo','Todo']].map(([k,t])=>`<button type="button" role="tab" aria-selected="${filtro===k}" data-dash-f="${k}">${t}</button>`).join('')}</div></div>
    ${alarmas?`<p class="dash-alarm" role="alert"><b>${alarmas} alarma${alarmas>1?'s':''} sin ver.</b> El paciente ya recibió la indicación de ir a emergencia; contactalo.</p>`:''}
    ${lista.length?`<ul class="inbox">${lista.map(e=>`<li class="${e.visto?'':'new'} k-${e.tipo}">
        <span class="ib-ico" aria-hidden="true">${ICON[e.tipo]||'·'}</span>
        <span class="ib-b"><span class="ib-top"><b>${esc(p.nombre)}</b><span class="muted small">${esc(LABEL[e.tipo]||e.tipo)} · ${esc(corta(e.t))}</span></span>
        <span>${esc(e.texto)}</span></span>
        ${e.visto?'':`<button type="button" class="btn" data-dash-visto="${e.id}">Visto</button>`}</li>`).join('')}</ul>`
      :`<p class="muted">${filtro==='pendientes'?'No hay nada sin ver.':'Todavía no hay reportes.'} Probá el recorrido completo: entrá como paciente, cargá una fecha o marcá un síntoma, y volvé acá.</p>`}
    <p class="muted small">Modo demostración: un paciente ficticio en este dispositivo. Con el servidor, cada paciente vinculado a vos.
      <button type="button" class="linkbtn" id="dash-reset">Reiniciar la demostración</button></p></section>`;
}
function render(){
  const el=document.getElementById('dash');if(!el)return;
  el.innerHTML=bandeja()+revision();
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#dash'))return;
  let b;
  if((b=e.target.closest('[data-dash-f]'))){filtro=b.dataset.dashF;render();return;}
  if((b=e.target.closest('[data-dash-visto]'))){const ev=D.get().eventos.find(x=>x.id===b.dataset.dashVisto);if(ev){ev.visto=true;ev.vistoEn=new Date().toISOString();D.save();}render();return;}
  if(e.target.closest('#dash-reset')){D.reiniciar();render();return;}
  if(e.target.closest('#dash-rv')){const o=document.getElementById('rv-open');if(o)o.click();}
});
R.doctor={render};
})();
