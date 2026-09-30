import http from 'node:http';
const PORT=process.env.PORT||3000;
const API='https://api.systeme.io/api';
const KEY=process.env.SYSTEME_API_KEY;
const TOKEN=process.env.RELAY_TOKEN;
function json(res,status,data){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data));}
async function sio(path,opts={}){const r=await fetch(API+path,{...opts,headers:{'X-API-Key':KEY,'accept':'application/json','content-type':'application/json',...(opts.headers||{})}});const t=await r.text();let d;try{d=JSON.parse(t)}catch{d=t}return {status:r.status,ok:r.ok,data:d,remaining:r.headers.get('x-ratelimit-remaining')};}
async function specSummary(url){const r=await fetch(url);const md=await r.text();const m=md.match(/\`\`\`\`json\n([\s\S]*?)\n\`\`\`\`/);if(!m)return {url,status:r.status,error:'no spec'};const s=JSON.parse(m[1]);const path=Object.keys(s.paths||{})[0];const op=Object.values((s.paths||{})[path]||{})[0];const ref=op?.requestBody?.content?.['application/json']?.schema?.['$ref'];const name=ref?.split('/').pop();return {url,status:r.status,path,method:Object.keys((s.paths||{})[path]||{})[0],requestRef:ref,requestSchema:name?s.components?.schemas?.[name]:null,responseSchemas:s.components?.schemas};}
async function startupProbe(){try{
 const funnels=await sio('/funnels?limit=20'); console.log('SYSTEME_PROBE '+JSON.stringify({funnels}));
 const docs=[
 'https://developer.systeme.io/reference/api_funnels_post.md',
 'https://developer.systeme.io/reference/api_funnels_funnelidsteps_post.md',
 'https://developer.systeme.io/reference/api_page-editorpages_idsave_put.md',
 'https://developer.systeme.io/reference/api_pages_pageidcontentfrom-template_put.md',
 'https://developer.systeme.io/reference/api_page-editorpage-schema_post.md',
 'https://developer.systeme.io/reference/api_page-editorpage-template_post.md'];
 for(const u of docs){const s=await specSummary(u); console.log('SYSTEME_SPEC '+JSON.stringify(s));}
 for(const type of ['info_page','sales_page']){const tpl=await sio('/page-editor/page-template',{method:'POST',body:JSON.stringify({type})}); console.log('SYSTEME_TEMPLATE '+JSON.stringify({type,tpl})); const schema=await sio('/page-editor/page-schema',{method:'POST',body:JSON.stringify({type})}); console.log('SYSTEME_SCHEMA '+JSON.stringify({type,schema}));}
}catch(e){console.error('SYSTEME_INTROSPECT_ERROR '+String(e?.stack||e));}}
const app=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(u.pathname==='/health')return json(res,200,{ok:true});if(u.searchParams.get('token')!==TOKEN)return json(res,403,{ok:false,error:'forbidden'});if(u.pathname==='/probe')return json(res,200,await sio('/funnels?limit=20'));return json(res,404,{ok:false});}catch(e){return json(res,500,{ok:false,error:String(e?.message||e)});}});
app.listen(PORT,()=>{console.log('relay ready',PORT);startupProbe();});