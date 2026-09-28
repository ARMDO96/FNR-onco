/* Ventana de riesgo de fiebre en quimioterapia: día 5 a 14 desde la fecha del ítem de quimioterapia
   (coordinado o realizado), según TRASPASO.md §3 ("mensaje fijo en la pantalla de inicio del día 5 al
   14 de cada ciclo"). Función pura (sin leer la fecha del sistema ni el estado guardado): quien la llama
   le pasa la fecha del ítem y el momento a evaluar, así se puede probar sin datos de la demo.
   Se carga antes que app/patient.js (ver index.html y tools/load.mjs) para que R.patient ya exista. */
(function(R){
function ventanaFiebre(fechaIsoCiclo,ahora){
  if(!fechaIsoCiclo)return false;
  const inicio=new Date(fechaIsoCiclo).getTime();
  const hoy=(ahora instanceof Date?ahora:new Date(ahora)).getTime();
  if(Number.isNaN(inicio)||Number.isNaN(hoy))return false;
  const dias=(hoy-inicio)/86400000;
  return dias>=5&&dias<=14;
}
R.patient=R.patient||{};
R.patient.ventanaFiebre=ventanaFiebre;
})(window.FNRO=window.FNRO||{});
