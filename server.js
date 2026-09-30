import http from 'node:http';
const PORT=process.env.PORT||3000;
const API='https://api.systeme.io/api';
const KEY=process.env.SYSTEME_API_KEY;
function j(res,s,d){res.writeHead(s,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(d));}
async function sio(path,opts={}){const r=await fetch(API+path,{...opts,headers:{'X-API-Key':KEY,'accept':'application/json','content-type':'application/json',...(opts.headers||{})}});const t=await r.text();let d;try{d=JSON.parse(t)}catch{d=t}return {status:r.status,ok:r.ok,data:d,remaining:r.headers.get('x-ratelimit-remaining')};}
const text=(html)=>({type:'Text',textAlign:'left',html});
const h=(t,l='h2')=>({type:'Headline',text:t,level:l});
const bullets=(items)=>({type:'BulletList',items,icon:'circle-check'});
const row=(...blocks)=>({columns:[{size:12,blocks}]});
const section=(tone,...blocks)=>({tone,backgroundImageDescription:null,rows:[row(...blocks)]});
const palette={palettePreset:'navy-flare',cornerStyle:'soft',fontPair:'editorial',cardLayout:null,heroLayout:'centred',heroBackground:'solid',headingFontFamily:'Montserrat',bodyFontFamily:'Inter'};
const sections=[
 section('hero',h('Wyylde avis 2026 : notre analyse complète','h1'),text('<p><strong>Wyylde est une plateforme française de rencontres pour adultes.</strong> Notre avis se concentre sur ce qui peut être vérifié : inscription, prix, abonnement Gold, fonctionnalités, certification, sécurité et conditions de résiliation.</p><p>Dernière vérification : 30 septembre 2026.</p>')),
 section('feature',h('Comment nous évaluons Wyylde'),text('<p>Nous séparons les faits publiés par Wyylde des témoignages et opinions externes. Les tarifs, règles de renouvellement, procédures de certification et conditions d’accès sont vérifiés dans le centre d’aide et les conditions d’utilisation disponibles publiquement.</p>'),bullets(['Sources primaires privilégiées','Dates de mise à jour indiquées','Contradictions documentées au lieu d’être masquées','Aucun faux témoignage ajouté'])),
 section('feature',h('Wyylde gratuit ou Gold ?'),text('<p>L’inscription à Wyylde est gratuite, mais l’accès reste limité. D’après le centre d’aide Wyylde mis à jour en mars 2026, un abonnement Gold est nécessaire pour utiliser de manière illimitée plusieurs fonctions telles que la messagerie, le chat, les lives et l’accès aux contenus des membres.</p>'),bullets(['Inscription gratuite','Accès gratuit limité','Gold requis pour plusieurs fonctions illimitées','Réservé aux personnes majeures : 18 ans en France'])),
 section('pricing',h('Prix Wyylde Gold en France'),text('<p>Tarifs affichés par le centre d’aide Wyylde pour la plateforme française, vérifiés le 30 septembre 2026 :</p>'),bullets(['1 mois : 22,90 €','3 mois : 44,90 € au total','12 mois : 99,90 € au total','Les formules trimestrielle et annuelle sont réglées en une seule fois']),text('<p>Les prix peuvent varier selon le pays ou certains tarifs préférentiels liés au compte. Vérifiez toujours le montant affiché avant paiement.</p>')),
 section('feature',h('Profils certifiés et sécurité'),text('<p>Wyylde propose une certification de profil. Selon son centre d’aide, la procédure peut demander une photo non modifiée avec le pseudo, la mention « pour Wyylde » et la date du jour, ainsi qu’une pièce d’identité. Pour un profil couple, les deux personnes doivent apparaître sur la photo. Wyylde indique que les documents de certification ne sont pas publiés et sont supprimés après vérification.</p>'),text('<p>Le site indique également utiliser plusieurs niveaux de vérification afin de limiter notamment la création de faux profils. Cela ne signifie pas qu’aucun faux profil ne peut exister : la certification est un signal utile, pas une garantie absolue.</p>')),
 section('plain',h('Renouvellement : un point à vérifier attentivement'),text('<p>Le centre d’aide Wyylde indique en mars 2026 qu’il faut désactiver le renouvellement automatique au moins <strong>24 heures</strong> avant l’échéance. Les Conditions Générales d’Utilisation datées de juillet 2025 mentionnent toutefois un délai de <strong>48 heures</strong>. Ces deux informations officielles ne sont donc pas parfaitement alignées.</p><p>Par prudence, mieux vaut anticiper la désactivation et vérifier dans Paramètres → Abonnement que la prochaine date de prélèvement a bien été remplacée par la date de fin d’abonnement.</p>')),
 section('guarantee',h('Notre engagement éditorial'),text('<p>Nous ne prétendons pas qu’un service de rencontres convient à tout le monde. Notre objectif est de vous donner les éléments vérifiables nécessaires pour vous faire votre propre avis : prix, règles, fonctionnalités, limites et points de vigilance. Lorsqu’une information officielle se contredit, nous le signalons explicitement.</p>')),
 section('faq',h('Questions fréquentes sur Wyylde'),{type:'Faq',items:[
  {question:'Wyylde est-il gratuit ?',answer:'<p>L’inscription est gratuite, mais l’accès gratuit est limité. Plusieurs fonctions nécessitent l’abonnement Gold.</p>'},
  {question:'Combien coûte Wyylde Gold ?',answer:'<p>Le centre d’aide français affiche 22,90 € pour un mois, 44,90 € pour trois mois et 99,90 € pour un an, selon les tarifs vérifiés le 30 septembre 2026.</p>'},
  {question:'Peut-on résilier le renouvellement automatique ?',answer:'<p>Oui, depuis les paramètres du compte. Le centre d’aide indique 24 h avant l’échéance tandis que les CGU publiées mentionnent 48 h : par prudence, anticipez.</p>'},
  {question:'Wyylde vérifie-t-il les profils ?',answer:'<p>Une procédure de certification existe et Wyylde indique également appliquer plusieurs contrôles de sécurité. La certification réduit l’incertitude mais ne constitue pas une garantie absolue sur chaque interaction.</p>'},
  {question:'Quel âge faut-il avoir ?',answer:'<p>Wyylde indique que l’inscription est réservée aux personnes majeures, soit 18 ans en France.</p>'}
 ]}),
 section('footer',h('Sources et transparence'),text('<p>Sources principales consultées le 30 septembre 2026 : centre d’aide Wyylde — « Les tarifs et les formules d’abonnements », « S’inscrire sur le site Wyylde », « Certifier mon profil », « Arrêter le renouvellement de son abonnement », « Je souhaite obtenir le remboursement de mon abonnement » — ainsi que les Conditions Générales d’Utilisation Wyylde publiées en juillet 2025.</p><p>Site éditorial indépendant. Wyylde et ses marques appartiennent à leurs propriétaires respectifs.</p>'))
];
async function run(){
 try{
  let funnels=await sio('/funnels?limit=100'); if(!funnels.ok) throw new Error('list funnels '+JSON.stringify(funnels));
  let funnel=funnels.data.items.find(x=>x.name==='Wyylde Avis France — SEO 2026');
  if(!funnel){const cr=await sio('/funnels',{method:'POST',body:JSON.stringify({name:'Wyylde Avis France — SEO 2026'})});console.log('CREATE_FUNNEL '+JSON.stringify(cr));if(!cr.ok)throw new Error('create funnel');funnel=cr.data;}
  let steps=await sio('/funnels/'+funnel.id+'/steps?limit=100'); if(!steps.ok) throw new Error('list steps '+JSON.stringify(steps));
  let step=steps.data.items.find(x=>x.name==='Wyylde Avis 2026');
  if(!step){const cr=await sio('/funnels/'+funnel.id+'/steps',{method:'POST',body:JSON.stringify({name:'Wyylde Avis 2026',type:'sales_page'})});console.log('CREATE_STEP '+JSON.stringify(cr));if(!cr.ok)throw new Error('create step');step=cr.data;}
  const save=await sio('/page-editor/pages/'+step.pageId+'/save',{method:'PUT',body:JSON.stringify({aiContentSchema:{palette:JSON.stringify(palette),sections:JSON.stringify(sections)}})});
  console.log('SAVE_MAIN '+JSON.stringify(save));
  const get=await sio('/funnel-steps/'+step.id); console.log('MAIN_STEP '+JSON.stringify(get));
 }catch(e){console.error('SITE_BUILD_ERROR '+String(e?.stack||e));}
}
const app=http.createServer((req,res)=>{if(req.url==='/health')return j(res,200,{ok:true});return j(res,200,{ok:true});});
app.listen(PORT,()=>{console.log('relay ready',PORT);run();});