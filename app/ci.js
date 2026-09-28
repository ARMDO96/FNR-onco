/* Cédula de identidad uruguaya: dígito verificador con pesos 2-9-8-7-6-3-4 sobre los 7 dígitos base
   (completados con ceros a la izquierda). Lógica pura: la usan la app y, en el servidor, la tabla de pacientes. */
(function(R){
const W=[2,9,8,7,6,3,4];
function limpiar(v){return String(v||'').replace(/[.\-\s]/g,'');}
function digito(base){
  const d=String(base).padStart(7,'0');
  if(!/^\d{7}$/.test(d))return null;
  const s=W.reduce((a,w,i)=>a+w*Number(d[i]),0);
  return (10-s%10)%10;
}
/* Acepta con o sin puntos y guion. Devuelve {ok, ci (sólo dígitos), motivo} */
function validar(v){
  const c=limpiar(v);
  if(!/^\d{7,8}$/.test(c))return {ok:false,ci:c,motivo:'La cédula tiene 7 u 8 dígitos, incluido el verificador.'};
  const base=c.slice(0,-1),dv=Number(c.slice(-1));
  if(digito(base)!==dv)return {ok:false,ci:c,motivo:'El dígito verificador no coincide: revisá el número.'};
  return {ok:true,ci:c.padStart(8,'0')};
}
function formatear(c){c=limpiar(c).padStart(8,'0');return `${Number(c.slice(0,1))?c.slice(0,1)+'.':''}${c.slice(1,4)}.${c.slice(4,7)}-${c.slice(7)}`;}
R.ci={digito,validar,formatear};
})(window.FNRO=window.FNRO||{});
