function selectRank(r){document.querySelector("#rankSelect").value=r;document.querySelector("#order").scrollIntoView({behavior:"smooth"})}
function copyIP(){navigator.clipboard.writeText("norxsmp.play.hosting").then(()=>alert("IP copied: norxsmp.play.hosting"))}
document.querySelector("#form").addEventListener("submit",e=>{
 e.preventDefault(); const rank=document.querySelector("#rankSelect").value, ign=document.querySelector("#ign").value.trim();
 if(!rank||!ign){document.querySelector("#result").textContent="Isi IGN dan pilih rank.";return}
 location.href="/api/discord/start?rank="+encodeURIComponent(rank)+"&ign="+encodeURIComponent(ign);
});