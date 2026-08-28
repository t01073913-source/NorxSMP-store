export async function onRequestGet({request,env}) {
 const u=new URL(request.url), rank=u.searchParams.get("rank"), ign=u.searchParams.get("ign");
 const prices={NORX:30000,"NORX+":50000,OVERLORD:120000,CUSTOM:250000,DONATUR:350000};
 if(!prices[rank]||!ign||ign.length>32)return new Response("Data order invalid",{status:400});
 const id="NRX-"+crypto.randomUUID().replaceAll("-","").slice(0,8).toUpperCase();
 await env.DB.prepare("INSERT INTO orders VALUES (?,?,?,?,?,?,?)")
 .bind(id,null,null,ign,rank,prices[rank],"AWAITING_DISCORD",new Date().toISOString()).run();
 const q=new URLSearchParams({client_id:env.DISCORD_CLIENT_ID,response_type:"code",
  redirect_uri:env.DISCORD_REDIRECT_URI,scope:"identify",state:id});
 return Response.redirect("https://discord.com/oauth2/authorize?"+q,302);
}
