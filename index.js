const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

// Map voice channel name ➜ role ID
const VOICE_TO_ROLE = {
  "Nhạc Việt": "1388456355534344312",
  "US-UK": "1388457023900750015",
  "Remix Bay Lắc": "1388457100413239306",
  "Nhạc Chill": "1388457139541905459",
};

client.on("voiceStateUpdate", async (oldState, newState) => {
  const member = newState.member;
  if (member.user.bot) return;

  // Remove all music-related roles
  const rolesToRemove = Object.values(VOICE_TO_ROLE);
  try {
    await member.roles.remove(rolesToRemove).catch(() => {});
  } catch (err) {
    console.error("❌ Error removing roles:", err);
  }

  // Add the correct role if joining a mapped voice channel
  if (newState.channel && VOICE_TO_ROLE[newState.channel.name]) {
    const roleId = VOICE_TO_ROLE[newState.channel.name];
    try {
      await member.roles.add(roleId);
      console.log(
        `✅ Gave ${member.user.tag} role for ${newState.channel.name}`,
      );
    } catch (err) {
      console.error("❌ Error assigning role:", err);
    }
  }
});

client.once("ready", () => {
  console.log(`🤖 Bot is running as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
