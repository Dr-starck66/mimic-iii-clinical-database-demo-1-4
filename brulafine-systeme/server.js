import http from 'node:http';
const PORT=process.env.PORT||3000, API='https://api.systeme.io/api', KEY=process.env.SYSTEME_API_KEY;
let state={ready:false};
async function run(){try{
 const r=await fetch(API+'/funnel-steps/25650234',{headers:{'X-API-Key':KEY,'accept':'application/json'},signal:AbortSignal.timeout(20000)});
 const t=await r.text(); state={ready:true,status:r.status,body:t};
 console.log('BRULAFINE_STEP_GET '+JSON.stringify(state));
}catch(e){state={ready:true,error:String(e?.message||e)};console.log('BRULAFINE_STEP_GET '+JSON.stringify(state));}}
http.createServer((req,res)=>{res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(state));}).listen(PORT,'0.0.0.0',()=>{console.log('probe ready',PORT);run();});