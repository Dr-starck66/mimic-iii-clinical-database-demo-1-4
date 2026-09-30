import http from 'node:http';
const PORT=process.env.PORT||3000, API='https://api.systeme.io/api', KEY=process.env.SYSTEME_API_KEY;
function j(res,s,d){res.writeHead(s,{'content-type':'application/json; charset=utf-8'});res.end(JSON.stringify(d));}
async function sio(path,opts={}){const r=await fetch(API+path,{...opts,headers:{'X-API-Key':KEY,'accept':'application/json','content-type':'application/json'}});const t=await r.text();let d;try{d=JSON.parse(t)}catch{d=t}return {status:r.status,ok:r.ok,data:d,remaining:r.headers.get('x-ratelimit-remaining')};}
const main={
 title:'Wyylde Avis 2026 : prix, fiabilité, sécurité et abonnement',
 intro:'Notre analyse indépendante de Wyylde se concentre sur les faits vérifiables : inscription, abonnement Gold, tarifs, certification, sécurité, renouvellement et remboursement. Dernière vérification : 30 septembre 2026.',
 paragraphs:[
 'L’inscription à Wyylde est gratuite, mais l’accès est limité. Le centre d’aide Wyylde indique qu’un abonnement Gold est nécessaire pour profiter de façon illimitée de plusieurs fonctionnalités, notamment la messagerie, le chat, les lives et l’accès aux contenus des membres.',
 'Pour la plateforme française, le centre d’aide Wyylde affiche 22,90 € pour un mois, 44,90 € pour trois mois et 99,90 € pour un an. Les formules trimestrielle et annuelle sont réglées en une seule fois. Les tarifs peuvent varier selon le pays ou certains avantages liés au compte.',
 'Wyylde propose une certification de profil. Selon son centre d’aide, elle peut nécessiter une photo non modifiée avec le pseudo, la mention « pour Wyylde » et la date, ainsi qu’une pièce d’identité. Pour un profil couple, les deux personnes doivent apparaître sur la photo.',
 'Sur la résiliation du renouvellement automatique, deux sources officielles ne sont pas parfaitement alignées : le centre d’aide indique un délai d’au moins 24 heures avant l’échéance, tandis que les CGU de juillet 2025 mentionnent 48 heures. Par prudence, mieux vaut anticiper et vérifier la confirmation dans les paramètres du compte.',
 'Concernant les remboursements, le centre d’aide indique qu’un renouvellement automatique contesté n’ouvre pas droit au remboursement selon sa procédure publiée. Pour un achat immédiat, Wyylde renvoie vers son service client afin d’évaluer les conditions d’éligibilité.',
 'Notre méthode privilégie les sources primaires, date chaque vérification et signale les contradictions au lieu de les masquer. Nous n’inventons ni témoignages, ni statistiques d’utilisateurs, ni promesse de résultat.'
 ],
 facts:['Inscription gratuite avec accès limité','Gold requis pour plusieurs fonctionnalités illimitées','22,90 € / mois','44,90 € / 3 mois','99,90 € / an','Certification de profil disponible','Réservé aux personnes majeures en France'],
 source:'Sources principales : centre d’aide Wyylde (tarifs, inscription, certification, renouvellement, remboursement) et Conditions Générales d’Utilisation Wyylde de juillet 2025. Vérifiées le 30 septembre 2026.'
};
function makeValue(p,i){const d=(p.description||'').toLowerCase(),t=p.type||'';
 if(t==='image') return 'adult dating review, privacy, smartphone, abstract editorial illustration';
 if(t==='buttonText') return 'Lire notre analyse';
 if(t==='headline'){
  if(d.includes('hero')) return main.title;
  if(d.includes('pricing')) return 'Tarifs Wyylde Gold vérifiés';
  if(d.includes('guarantee')) return 'Notre engagement éditorial';
  if(d.includes('faq')) return 'Questions fréquentes sur Wyylde';
  if(d.includes('bonus')) return ['Prix','Inscription','Certification','Sécurité','Résiliation','Remboursement'][i%6];
  return ['Notre avis sur Wyylde','Wyylde gratuit ou Gold ?','Sécurité et profils certifiés','Renouvellement : point de vigilance','Ce que disent les sources','Méthode et transparence'][i%6];
 }
 if(t==='bulletList') return main.facts.slice(0,6).join('\n');
 if(t==='text'){
  if(d.includes('built with')) return 'Construit avec © <a href="https://systeme.io" style="color: #000000;">systeme.io</a>';
  if(d.includes('price') && !d.includes('heading')) return '22,90 €';
  if(d.includes('billing')) return 'Mensuel · 3 mois · annuel';
  if(d.includes('guarantee')||d.includes('reassurance')) return 'Informations vérifiées et sourcées au 30 septembre 2026.';
  if(d.includes('testimonial')||d.includes('social proof')) return 'Analyse éditoriale fondée sur les documents officiels disponibles publiquement.';
  if(d.includes('footer')) return main.source;
  if(d.includes('hero')) return main.intro;
  return '<p>'+main.paragraphs[i%main.paragraphs.length]+'</p>';
 }
 return main.paragraphs[i%main.paragraphs.length];
}
async function run(){try{
 const fs=await sio('/funnels?limit=100');let funnel=fs.data.items.find(x=>x.name==='Wyylde Avis France — SEO 2026');if(!funnel)throw new Error('funnel missing');
 const ss=await sio('/funnels/'+funnel.id+'/steps?limit=100');let step=ss.data.items.find(x=>x.name==='Wyylde Avis 2026');if(!step)throw new Error('step missing');
 const tpl=await sio('/page-editor/page-template',{method:'POST',body:JSON.stringify({type:'sales_page'})});if(!tpl.ok)throw new Error('template '+JSON.stringify(tpl));
 const placeholders={};tpl.data.placeholders.forEach((p,i)=>placeholders[p.name]=makeValue(p,i));
 const put=await sio('/pages/'+step.pageId+'/content/from-template',{method:'PUT',body:JSON.stringify({templateId:tpl.data.templateId,placeholders})});
 console.log('TEMPLATE_APPLY '+JSON.stringify({step,pageId:step.pageId,templateId:tpl.data.templateId,placeholderCount:Object.keys(placeholders).length,result:put}));
 const get=await sio('/funnel-steps/'+step.id);console.log('VERIFY_STEP '+JSON.stringify(get));
}catch(e){console.error('BUILD_ERROR '+String(e?.stack||e));}}
const app=http.createServer((req,res)=>req.url==='/health'?j(res,200,{ok:true}):j(res,200,{ok:true}));
app.listen(PORT,()=>{console.log('ready',PORT);run();});