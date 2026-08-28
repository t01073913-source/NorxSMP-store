export async function onRequestGet({request,env}) {
 if(request.headers.get("Authorization")!==`Bearer ${env.BOT_API_SECRET}`) return Response.json({error:"Unauthorized"},{status:401});
 const r=await env.DB.prepare("SELECT * FROM ticket_requests WHERE status='PENDING' ORDER BY id LIMIT 10").all();
 return Response.json({requests:r.results});
}
export async function onRequestPost({request,env}) {
 if(request.headers.get("Authorization")!==`Bearer ${env.BOT_API_SECRET}`) return Response.json({error:"Unauthorized"},{status:401});
 const b=await request.json();
 await env.DB.prepare("UPDATE ticket_requests SET status='DONE' WHERE id=?").bind(b.id).run();
 await env.DB.prepare("UPDATE orders SET status='TICKET_CREATED' WHERE order_id=?").bind(b.order_id).run();
 return Response.json({ok:true});
}
