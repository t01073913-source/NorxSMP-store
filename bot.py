import os,re,aiohttp,discord
from discord.ext import commands,tasks
TOKEN=os.environ["BOT_TOKEN"]; GUILD_ID=int(os.environ["GUILD_ID"])
API=os.environ["TICKET_API_URL"].rstrip("/"); SECRET=os.environ["TICKET_API_SECRET"]
intents=discord.Intents.default(); bot=commands.Bot(command_prefix="!",intents=intents)

async def make(req):
 g=bot.get_guild(GUILD_ID)
 if not g:return
 m=g.get_member(int(req["discord_id"]))
 if not m:return
 c=discord.utils.get(g.categories,name="BUY RANK") or await g.create_category("BUY RANK")
 for ch in c.text_channels:
  if ch.topic==f"order:{req['order_id']}":return
 safe=re.sub(r"[^a-z0-9-]","",m.name.lower())[:18] or "member"
 ow={g.default_role:discord.PermissionOverwrite(view_channel=False),
     m:discord.PermissionOverwrite(view_channel=True,send_messages=True,read_message_history=True),
     g.me:discord.PermissionOverwrite(view_channel=True,send_messages=True,read_message_history=True,manage_channels=True)}
 ch=await g.create_text_channel(f"buy-rank-{safe}",category=c,overwrites=ow,topic=f"order:{req['order_id']}")
 await ch.send(f"🛒 **BUY RANK**\n{m.mention}\n**Order:** `{req['order_id']}`\n**IGN:** `{req['ign']}`\n**Rank:** `{req['rank']}`\n\nKirim bukti pembayaran di sini.")

async def call(method,path,data=None):
 async with aiohttp.ClientSession() as s:
  async with s.request(method,API+path,headers={"Authorization":f"Bearer {SECRET}"},json=data) as r:
   return await r.json()

@tasks.loop(seconds=4)
async def poll():
 try:
  d=await call("GET","/pending")
  for r in d.get("requests",[]):
   await make(r); await call("POST","/pending",{"id":r["id"],"order_id":r["order_id"]})
 except Exception as e: print("poll:",e)

@bot.event
async def on_ready():
 print("NorxSMP AutoTicket:",bot.user)
 if not poll.is_running():poll.start()
bot.run(TOKEN)
