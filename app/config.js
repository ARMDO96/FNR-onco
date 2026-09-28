/* Entorno de la app. En 'demo' todas las pantallas muestran la banda "DEMO: no cargar datos reales".
   Falla cerrado: la banda sólo se oculta con ENTORNO 'produccion' Y un proyecto Supabase que figure en
   PROYECTOS_PRODUCCION. tools/validate.mjs rechaza las combinaciones incoherentes. */
(function(R){
R.config={
  ENTORNO:'demo',            // 'demo' | 'produccion'
  SUPABASE_URL:null,         // https://<referencia>.supabase.co del proyecto de este entorno
  PROYECTOS_PRODUCCION:[]    // referencias de proyectos habilitados para datos reales (vacío hasta tener Pro + parte legal)
};
R.esProduccion=function(){
  const c=R.config||{};
  if(c.ENTORNO!=='produccion'||!c.SUPABASE_URL)return false;
  let host='';try{host=new URL(c.SUPABASE_URL).host;}catch(e){return false;}
  return (c.PROYECTOS_PRODUCCION||[]).some(ref=>host===ref+'.supabase.co');
};
})(window.FNRO=window.FNRO||{});
