export async function onRequestGet({request,env}) {
 const u=new URL(request.url), code=u.searchParams.get("code"), state=u.searchParams.get("state");
 const o=await env.DB.prepare("SELECT * FROM orders WHERE order_id=?").bind(state).first();
 if(!o||!code)return new Response("Order/OAuth invalid",{status:400});
 const f=new URLSearchParams({client_id:env.DISCORD_CLIENT_ID,client_secret:env.DISCORD_CLIENT_SECRET,
  grant_type:"authorization_code",code,redirect_uri:env.DISCORD_REDIRECT_URI});
 const tr=await fetch("https://discord.com/api/oauth2/token",{method:"POST",
  headers:{"Content-Type":"application/x-www-form-urlencoded"},body:f});
 if(!tr.ok)return new Response("Discord OAuth failed",{status:502});
 const tok=await tr.json();
 const mr=await fetch("https://discord.com/api/users/@me",{headers:{Authorization:`Bearer ${tok.access_token}`}});
 if(!mr.ok)return new Response("Discord user failed",{status:502});
 const me=await mr.json();
 await env.DB.prepare("UPDATE orders SET discord_id=?,discord_username=?,status=? WHERE order_id=?")
 .bind(me.id,me.username,"TICKET_PENDING",state).run();
 await env.DB.prepare("INSERT INTO ticket_requests (order_id,discord_id,rank,ign,status,created_at) VALUES (?,?,?,?,?,?)")
 .bind(state,me.id,o.rank,o.ign,"PENDING",new Date().toISOString()).run();
 return Response.redirect("https://discord.gg/USFDPb6WB",302);
}
