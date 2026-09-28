/* Pantalla inicial y perfil: "Soy doctor/a" o "Soy paciente". El perfil elegido se recuerda en este
   dispositivo (sólo una comodidad: no es autenticación). Banda DEMO según app/config.js. */
(function(){
const R=window.FNRO;
const KEY='apc-perfil';
const $=id=>document.getElementById(id);
const get=()=>{try{return localStorage.getItem(KEY);}catch(e){return null;}};
const set=v=>{try{v?localStorage.setItem(KEY,v):localStorage.removeItem(KEY);}catch(e){}};

$('demo-band').hidden=!!(R.esProduccion&&R.esProduccion());

function show(perfil){
  $('entry').hidden=!!perfil;
  $('gate').hidden=perfil!=='doctor'||!$('app').hidden;
  $('patient').hidden=perfil!=='paciente';
  if(perfil==='paciente'&&R.patient)R.patient.render();
  if(perfil==='doctor'&&R.doctor)R.doctor.render();
  document.body.dataset.perfil=perfil||'inicio';
  window.scrollTo(0,0);
}
document.addEventListener('click',e=>{
  const role=e.target.closest('[data-role]');
  if(role){set(role.dataset.role);show(role.dataset.role);return;}
  if(e.target.closest('[data-role-reset]')){
    set(null);
    $('app').hidden=true;$('review').hidden=true;
    show(null);
  }
});
R.shell={show,perfil:get};
show(get());
})();
