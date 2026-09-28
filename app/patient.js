/* Lado paciente (modo demostración, sin servidor): ingreso con cédula + código, plan asignado por el médico,
   carga de la fecha coordinada, confirmación de lo realizado y aviso de síntomas. Todo lo que marca el paciente
   queda con fecha y hora en la bandeja del médico (app/doctor.js).
   Textos clínicos para pacientes: sólo los decididos en el plan (fiebre en quimioterapia = emergencia); el resto
   queda marcado "pendiente de revisión clínica" hasta pasar por GOBERNANZA.md. */
(function(){
const R=window.FNRO,D=R.demo;
const box=()=>document.getElementById('patient');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TZ='America/Montevideo';
const fecha=iso=>{const t=new Date(iso).toLocaleString('es-UY',{timeZone:TZ,weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});return t.charAt(0).toUpperCase()+t.slice(1)+' h';};
const corta=iso=>new Date(iso).toLocaleString('es-UY',{timeZone:TZ,day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const TIPO={tratamiento:'Tratamiento',estudio:'Estudio',consulta:'Consulta'};
const EST={'a-coordinar':['Falta coordinar la fecha','ind'],coordinado:['Coordinado','brand'],realizado:['Realizado','ok'],'no-realizado':['No se realizó','exc']};
const PEND='<span class="pend">Texto pendiente de revisión clínica</span>';
let view='inicio',codigoPedido=null,abierto=null;

function header(){
  const s=D.get();
  return `<header class="pt-top">
    <div class="area-row"><span class="area">Área paciente</span><button type="button" class="linkbtn" data-role-reset>Cambiar de perfil</button></div>
    <h1>${s.sesion?`Hola, ${esc(s.paciente.nombre.split(' ')[0])}`:'App para el Cáncer'}</h1>
    ${s.sesion?`<p>Tu equipo: ${esc(s.paciente.medico)}</p>`:''}
  </header>`;
}

function login(){
  return `${header()}<div class="card pt-card">
    <h2>Ingresar</h2>
    <p class="muted">Con tu cédula y un código de 6 dígitos que te llega por mail.</p>
    <label for="pt-ci">Cédula</label>
    <input id="pt-ci" inputmode="numeric" autocomplete="off" placeholder="1.234.567-2" maxlength="12">
    ${codigoPedido?`<label for="pt-cod">Código de 6 dígitos</label><input id="pt-cod" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••">
      <p class="hint">En la demostración no se manda ningún mail: el código es <b>123456</b>. La cédula de prueba es 1.234.567-2.</p>
      <button type="button" class="btn primary wide" data-pt="verificar">Entrar</button>`
    :`<button type="button" class="btn primary wide" data-pt="pedir">Recibir código</button>`}
    <p class="err" id="pt-err" role="alert"></p>
  </div>
  <p class="sos" role="note"><b>No es un servicio de emergencia.</b> Ante una urgencia llamá al 911 o a tu emergencia móvil.</p>`;
}

function proximo(){
  const s=D.get();
  return s.plan.filter(i=>i.estado==='coordinado'&&i.fecha).sort((a,b)=>a.fecha.localeCompare(b.fecha))[0];
}
function enQuimio(){return D.get().plan.some(i=>i.quimio&&i.estado!=='no-realizado');}

function inicio(){
  const s=D.get(),p=proximo(),falta=s.plan.filter(i=>i.estado==='a-coordinar');
  return `${enQuimio()?`<div class="alarm card" role="note"><b>Si tenés fiebre de 38 °C o más durante la quimioterapia, andá a emergencia ahora.</b>
      <span>No esperes a la próxima consulta ni a que baje sola.</span></div>`:''}
    ${p?`<div class="card pt-next"><span class="eyebrow">Lo próximo</span><h2>${esc(p.nombre)}</h2>
      <p class="when">${esc(fecha(p.fecha))}</p>${p.lugar?`<p class="muted">${esc(p.lugar)}</p>`:''}
      <button type="button" class="btn" data-pt-open="${p.id}">Ver detalle</button></div>`:''}
    ${falta.length?`<div class="card pt-todo"><span class="eyebrow">Para hacer</span>
      ${falta.map(i=>`<button type="button" class="todo" data-pt-open="${i.id}"><span>Coordinar la fecha: <b>${esc(i.nombre)}</b></span><span aria-hidden="true">→</span></button>`).join('')}</div>`:''}
    <div class="card pt-card"><span class="eyebrow">Tu plan</span>
      <p class="muted">${s.plan.length} indicaciones de tu médico. ${s.plan.filter(i=>i.estado==='realizado').length} realizadas.</p>
      <button type="button" class="btn" data-pt-view="plan">Ver el plan completo</button></div>`;
}

function itemCard(i){
  const [t,c]=EST[i.estado]||[i.estado,''],open=abierto===i.id;
  return `<article class="card item ${open?'open':''}" id="it-${i.id}">
    <button type="button" class="item-h" data-pt-open="${i.id}" aria-expanded="${open}">
      <span class="kind">${TIPO[i.tipo]||i.tipo}</span><span class="item-t">${esc(i.nombre)}</span>
      <span class="state ${c}">${t}</span>${i.fecha?`<span class="muted small">${esc(corta(i.fecha))}</span>`:''}
    </button>
    ${open?`<div class="item-b">
      ${i.estado==='a-coordinar'||i.estado==='coordinado'?`<label for="f-${i.id}">${i.estado==='a-coordinar'?'¿Qué día y hora coordinaste?':'Cambiar la fecha coordinada'}</label>
        <div class="row"><input type="datetime-local" id="f-${i.id}" value="${i.fecha?new Date(new Date(i.fecha).getTime()-new Date(i.fecha).getTimezoneOffset()*60000).toISOString().slice(0,16):''}">
        <button type="button" class="btn primary" data-pt-fecha="${i.id}">Guardar</button></div>`:''}
      <div class="prep"><h3>Preparación</h3>
        <p>${i.ayuno?'Este estudio puede requerir ayuno. ':''}La indicación concreta (ayuno, medicación, qué llevar) te la da tu médico. ${PEND}</p>
        <p class="muted small">No suspendas ningún medicamento sin que tu médico te lo indique.</p></div>
      ${i.estado==='coordinado'||i.estado==='realizado'||i.estado==='no-realizado'?`<div class="done"><h3>¿Se realizó?</h3>
        <div class="row"><button type="button" class="btn ${i.estado==='realizado'?'primary':''}" data-pt-hecho="${i.id}" data-v="si">Sí</button>
        <button type="button" class="btn ${i.estado==='no-realizado'?'primary':''}" data-pt-hecho="${i.id}" data-v="no">No</button></div>
        <label for="com-${i.id}">Comentario para tu médico (opcional)</label>
        <textarea id="com-${i.id}" rows="2" placeholder="Por ejemplo: me lo reprogramaron para el jueves"></textarea>
        <button type="button" class="btn" data-pt-com="${i.id}">Enviar comentario</button></div>`:''}
    </div>`:''}
  </article>`;
}
function plan(){
  const s=D.get(),order={'a-coordinar':0,coordinado:1,'no-realizado':2,realizado:3};
  return `<h2 class="sec">Tu plan</h2><p class="muted">Lo que te indicó tu médico. Cargá la fecha cuando la coordines y confirmá cuando se haga: tu médico lo ve con fecha y hora.</p>
    ${[...s.plan].sort((a,b)=>order[a.estado]-order[b.estado]||String(a.fecha||'').localeCompare(String(b.fecha||''))).map(itemCard).join('')}`;
}
function sintomas(){
  return `<h2 class="sec">Síntomas</h2>
    <button type="button" class="card sym urgent" data-pt-sym="fiebre"><b>Tengo fiebre de 38 °C o más</b><span>y estoy en quimioterapia</span></button>
    <div class="card pt-card"><h3>Otro síntoma</h3>
      <p class="muted">El catálogo de síntomas con la conducta para cada uno está en preparación y en revisión clínica. Mientras tanto podés avisarle a tu médico:</p>
      <textarea id="sym-txt" rows="3" placeholder="Qué sentís, desde cuándo y qué tan fuerte"></textarea>
      <button type="button" class="btn primary" data-pt-sym="otro">Enviar a mi médico</button>
      <p class="muted small">Tu médico lo lee cuando revisa su bandeja, que no es inmediata. Si empeorás o no podés esperar, consultá a emergencia.</p></div>`;
}
function emergencia(){
  return `<div class="card alarm big" role="alert"><h2>Andá a emergencia ahora</h2>
    <p>Con fiebre de 38 °C o más durante la quimioterapia hay que consultar enseguida, aunque te sientas bien.</p>
    <p><b>Llamá al 911 o a tu emergencia móvil</b> y decí que estás en tratamiento de quimioterapia.</p>
    <p class="muted small">Le avisamos también a tu médico.</p>
    <button type="button" class="btn" data-pt-view="inicio">Volver</button></div>`;
}
function avisos(){
  const ev=D.get().eventos;
  return `<h2 class="sec">Lo que enviaste</h2>${ev.length?`<ul class="log">${ev.map(e=>`<li><span class="muted small">${esc(corta(e.t))}</span> ${esc(e.texto)}</li>`).join('')}</ul>`:'<p class="muted">Todavía no enviaste nada.</p>'}`;
}

function render(){
  const s=D.get(),el=box();
  if(!s.sesion){el.innerHTML=login();return;}
  const V={inicio,plan,sintomas,emergencia,avisos};
  el.innerHTML=`${header()}<main class="pt-main">${(V[view]||inicio)()}</main>
    <nav class="tabbar" aria-label="Secciones">
      ${[['inicio','Inicio'],['plan','Mi plan'],['sintomas','Síntomas'],['avisos','Enviados']].map(([k,t])=>`<button type="button" data-pt-view="${k}" ${view===k?'aria-current="page"':''}>${t}</button>`).join('')}
    </nav>`;
}
const toast=m=>{const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.hidden=false;setTimeout(()=>{t.hidden=true;},2800);};

document.addEventListener('click',e=>{
  if(!e.target.closest('#patient'))return;
  const s=D.get(),q=a=>e.target.closest(`[${a}]`),err=m=>{const x=document.getElementById('pt-err');if(x)x.textContent=m;};
  let b;
  if(q('data-pt')&&q('data-pt').dataset.pt==='pedir'){
    const v=R.ci.validar(document.getElementById('pt-ci').value);
    if(!v.ok)return err(v.motivo);
    codigoPedido=v.ci;render();document.getElementById('pt-ci').value=R.ci.formatear(v.ci);return;
  }
  if(q('data-pt')&&q('data-pt').dataset.pt==='verificar'){
    const cod=document.getElementById('pt-cod').value.trim();
    // Respuesta idéntica exista o no la cédula (así será en el servidor); en la demo el código es fijo.
    if(cod!=='123456'||codigoPedido!==s.paciente.ci)return err('El código no es válido o venció. Pedí uno nuevo.');
    s.sesion={ci:codigoPedido,desde:new Date().toISOString()};D.save();view='inicio';render();return;
  }
  if((b=q('data-pt-view'))){view=b.dataset.ptView;abierto=null;render();window.scrollTo(0,0);return;}
  if((b=q('data-pt-open'))){const id=b.dataset.ptOpen;if(view!=='plan'){view='plan';}abierto=abierto===id&&b.classList.contains('item-h')?null:id;render();
    const it=document.getElementById('it-'+id);if(it)it.scrollIntoView({block:'start'});return;}
  if((b=q('data-pt-fecha'))){const i=s.plan.find(x=>x.id===b.dataset.ptFecha),v=document.getElementById('f-'+i.id).value;
    if(!v)return toast('Elegí el día y la hora.');
    i.fecha=new Date(v).toISOString();i.estado='coordinado';D.evento('fecha',i.id,`Coordinó "${i.nombre}" para el ${corta(i.fecha)}.`);render();toast('Fecha guardada: tu médico la ve.');return;}
  if((b=q('data-pt-hecho'))){const i=s.plan.find(x=>x.id===b.dataset.ptHecho),si=b.dataset.v==='si';
    i.estado=si?'realizado':'no-realizado';D.evento('confirmacion',i.id,`${si?'Confirmó que se realizó':'Indicó que NO se realizó'}: "${i.nombre}".`);render();return;}
  if((b=q('data-pt-com'))){const i=s.plan.find(x=>x.id===b.dataset.ptCom),t=document.getElementById('com-'+i.id).value.trim();
    if(!t)return;D.evento('comentario',i.id,`Comentario sobre "${i.nombre}": ${t}`);render();toast('Comentario enviado.');return;}
  if((b=q('data-pt-sym'))){
    if(b.dataset.ptSym==='fiebre'){D.evento('alarma',null,'ALARMA: fiebre ≥38 °C en quimioterapia. Se le indicó ir a emergencia.');view='emergencia';render();window.scrollTo(0,0);return;}
    const t=document.getElementById('sym-txt').value.trim();if(!t)return;
    D.evento('sintoma',null,`Síntoma: ${t}`);render();toast('Enviado a tu médico.');return;
  }
});
R.patient={render};
})();
