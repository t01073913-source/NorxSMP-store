const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error("DISCORD_TOKEN belum diisi di Railway!");
  process.exit(1);
}

client.once("ready", () => {
  console.log(`Bot is ready: ${client.user.tag}`);
});

client.login(TOKEN).catch((error) => {
  console.error("Gagal login:", error.message);
});
