/* Calculadoras clínicas: funciones puras, sin DOM. */
(function(R){
"use strict";
const num=v=>{const n=parseFloat(String(v==null?'':v).replace(',','.'));return isFinite(n)&&n>0?n:null;};

/* Superficie corporal, fórmula de Mosteller: √(talla cm × peso kg / 3600) */
function bsa(p){const w=num(p.peso),h=num(p.talla);return w&&h?Math.sqrt(w*h/3600):null;}

/* Clearance de creatinina, Cockcroft-Gault (mL/min); creatinina en mg/dL; ×0,85 en mujeres */
function crcl(p){
  const w=num(p.peso),a=num(p.edad),cr=num(p.creat);
  if(!w||!a||!cr||(p.sexo!=='F'&&p.sexo!=='M'))return null;
  return (140-a)*w/(72*cr)*(p.sexo==='F'?0.85:1);
}

/* Carboplatino, fórmula de Calvert: dosis (mg) = AUC × (TFG + 25); TFG tope 125 mL/min */
function calvert(auc,p){const c=crcl(p);return c==null?null:auc*(Math.min(c,125)+25);}

/* Dosis de un fármaco de régimen para el paciente. Devuelve {mg, text, missing} */
function dose(d,p){
  const x=d.dose||{},u=x.unit||'mg';
  if(x.type==='m2'){const s=bsa(p);return s?{mg:x.value*s,text:`${x.value} ${u}/m² × ${s.toFixed(2)} m²`}:{missing:'peso y talla'};}
  if(x.type==='kg'){const w=num(p.peso);return w?{mg:x.value*w,text:`${x.value} ${u}/kg × ${w} kg`}:{missing:'peso'};}
  if(x.type==='auc'){const c=crcl(p);if(c==null)return {missing:'peso, edad, sexo y creatinina'};
    return {mg:calvert(x.value,p),text:`AUC ${x.value} × (${Math.round(Math.min(c,125))} + 25)${c>125?' · TFG topeada en 125':''}`};}
  if(x.type==='flat')return {mg:x.value,text:'dosis fija',unit:u};
  return {text:String(x.value||'')};
}
/* Redondeo práctico: < 100 mg a 1 decimal, si no a entero */
const fmt=mg=>mg==null?'':(mg<100?(Math.round(mg*10)/10):Math.round(mg)).toLocaleString('es-UY');

R.calc={bsa,crcl,calvert,dose,fmt};
})(window.FNRO=window.FNRO||{});
