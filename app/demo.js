/* Datos de demostración (ficticios) compartidos por el lado paciente y el lado doctor en ESTE dispositivo.
   Reemplazan al servidor hasta conectar Supabase: el lado paciente escribe eventos y el doctor los ve en su
   bandeja. Nunca cargar datos reales: la banda DEMO lo recuerda en todas las pantallas. */
(function(R){
const KEY='apc-demo-v1';
// 09:30 en Montevideo (UTC−3) = 12:30 UTC, sea cual sea la zona del dispositivo
const dia=n=>{const d=new Date();d.setUTCDate(d.getUTCDate()+n);d.setUTCHours(12,30,0,0);return d.toISOString();};
function inicial(){
  return {
    paciente:{nombre:'Ana Ficticia',ci:'12345672',medico:'Dra. Demo Ficticia'},
    sesion:null,
    plan:[
      {id:'t1',tipo:'tratamiento',nombre:'Quimioterapia, ciclo 1',estado:'coordinado',fecha:dia(3),lugar:'Hospital de día (ficticio)',quimio:true},
      {id:'e1',tipo:'estudio',nombre:'TC de tórax, abdomen y pelvis con contraste',estado:'a-coordinar',ayuno:true},
      {id:'e2',tipo:'estudio',nombre:'Hemograma y función renal',estado:'a-coordinar'},
      {id:'c1',tipo:'consulta',nombre:'Consulta con oncología',estado:'coordinado',fecha:dia(10),lugar:'Policlínica (ficticia)'}
    ],
    eventos:[]
  };
}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.plan&&s.eventos)return s;}catch(e){}return inicial();}
let S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function evento(tipo,item,texto){S.eventos.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:new Date().toISOString(),tipo,item:item||null,texto:texto||'',visto:false});save();}
R.demo={
  get:()=>S,save,evento,
  reiniciar(){S=inicial();save();}
};
})(window.FNRO=window.FNRO||{});
